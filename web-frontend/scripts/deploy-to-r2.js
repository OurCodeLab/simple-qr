import fs from 'fs'
import path from 'path'
import { spawn, execSync } from 'child_process'
import config from '../app-config.js'

const DIST_DIR = process.env.DIST_DIR || 'dist'
// select deploy environment (explicit DEPLOY_ENV > NODE_ENV > production)
const DEPLOY_ENV = (process.env.DEPLOY_ENV || process.env.NODE_ENV || 'production').toLowerCase()
// resolve bucket precedence: R2_BUCKET env -> app-config.buckets -> hardcoded production
const bucketFromConfig = config && config.buckets ? (DEPLOY_ENV === 'staging' ? config.buckets.staging : config.buckets.production) : null
const BUCKET = process.env.R2_BUCKET || bucketFromConfig || 'simpleqr-production-website'
// default concurrency (can be overridden with R2_UPLOAD_CONCURRENCY)
const CONCURRENCY = Number(process.env.R2_UPLOAD_CONCURRENCY) || 16
// number of retry attempts for transient failures (env: R2_UPLOAD_RETRIES)
const RETRIES = Number(process.env.R2_UPLOAD_RETRIES) || 2

function getContentType(file) {
  const ext = path.extname(file).toLowerCase()
  return {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.map': 'application/octet-stream',
    '.wasm': 'application/wasm',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.webmanifest': 'application/manifest+json',
    // glTF support
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
  }[ext] || 'application/octet-stream'
}

function walk(dir) {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walk(full))
    } else if (entry.isFile()) {
      files.push(full)
    }
  }
  return files
}

function runWranglerPut(bucket, key, filePath, contentType) {
  return new Promise((resolve, reject) => {
    const objectPath = `${bucket}/${key}`
    const args = ['wrangler', 'r2', 'object', 'put', objectPath, '--file', filePath, '--content-type', contentType, '--remote']
    const proc = spawn('npx', args, { stdio: ['ignore', 'pipe', 'pipe'] })

    let out = ''
    let err = ''
    proc.stdout.on('data', (d) => (out += d.toString()))
    proc.stderr.on('data', (d) => (err += d.toString()))

    proc.on('close', (code) => {
      if (code === 0) return resolve({ key })
      reject(new Error(`wrangler failed for ${key}: ${err || out}`))
    })
  })
}

// Wrapper that retries transient failures with exponential backoff
async function putWithRetry(bucket, key, filePath, contentType) {
  let lastErr = null
  const attempts = RETRIES + 1
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await runWranglerPut(bucket, key, filePath, contentType)
    } catch (err) {
      lastErr = err
      if (attempt < attempts) {
        const backoff = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
        console.warn(`Upload failed (${attempt}/${attempts}) for ${key}, retrying in ${backoff}ms...`)
        await new Promise((r) => setTimeout(r, backoff))
      }
    }
  }
  throw lastErr
}

// ===== R2 full-sync helpers (list + delete via Cloudflare API) =====
const CF_API_TOKEN = process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_API_KEY
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || null
const DELETE_CONCURRENCY = Number(process.env.R2_DELETE_CONCURRENCY) || 8
const DELETE_RETRIES = Number(process.env.R2_DELETE_RETRIES) || 2

function getAccountIdFromWrangler() {
  try {
    const out = execSync('npx wrangler whoami', { encoding: 'utf8' })
    const m = out.match(/Account ID\s*\|\s*([0-9a-f]{32})/i)
    if (m) return m[1]
  } catch (err) {
    // ignore
  }
  return null
}

async function listRemoteObjects(accountId, bucket) {
  if (!CF_API_TOKEN) throw new Error('CF_API_TOKEN (or CLOUDFLARE_API_TOKEN) is required to list R2 objects')
  let objects = []
  let cursor = undefined
  while (true) {
    const url = new URL(`https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${encodeURIComponent(bucket)}/objects`)
    url.searchParams.set('limit', '1000')
    if (cursor) url.searchParams.set('cursor', cursor)

    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${CF_API_TOKEN}` } })
    const json = await res.json()
    if (!json.success) throw new Error(`Failed to list R2 objects: ${JSON.stringify(json.errors || json)}`)

    // handle different possible shapes
    const page = (json.result && Array.isArray(json.result.objects)) ? json.result.objects : (Array.isArray(json.result) ? json.result : [])
    for (const obj of page) {
      if (!obj) continue
      if (typeof obj === 'string') objects.push(obj)
      else if (obj.key) objects.push(obj.key)
    }

    // determine cursor for next page
    cursor = (json.result && (json.result.cursor || json.result.next_cursor)) || (json.result_info && json.result_info.cursor) || null
    if (!cursor || page.length === 0) break
  }
  return objects
}

async function deleteRemoteObject(accountId, bucket, key) {
  if (!CF_API_TOKEN) throw new Error('CF_API_TOKEN (or CLOUDFLARE_API_TOKEN) is required to delete R2 objects')
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${encodeURIComponent(bucket)}/objects/${encodeURIComponent(key)}`
  const res = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${CF_API_TOKEN}` } })
  const json = await res.json()
  if (!json.success) throw new Error(`Failed to delete ${key}: ${JSON.stringify(json.errors || json)}`)
  return true
}

async function deleteWithRetry(accountId, bucket, key) {
  let lastErr = null
  const attempts = DELETE_RETRIES + 1
  for (let i = 1; i <= attempts; i++) {
    try {
      return await deleteRemoteObject(accountId, bucket, key)
    } catch (err) {
      lastErr = err
      if (i < attempts) await new Promise((r) => setTimeout(r, 200 * i))
    }
  }
  throw lastErr
}

// ===================================================================
 

async function main() {
  const distPath = path.join(process.cwd(), DIST_DIR)
  if (!fs.existsSync(distPath)) {
    console.error(`dist directory not found at ${distPath}. Run build first.`)
    process.exit(1)
  }

  const files = walk(distPath)
  if (files.length === 0) {
    console.log('No files found in dist — nothing to upload.')
    return
  }

  console.log(`Uploading ${files.length} files to R2 bucket: ${BUCKET}`)
  console.log('Existing objects with the same keys in the bucket will be overwritten.')

  let concurrency = Math.min(CONCURRENCY, files.length)
  let index = 0
  let success = 0
  let failed = 0
  let uploadedCount = 0
  const total = files.length
  const errors = []

  async function worker() {
    while (index < files.length) {
      const i = index++
      const filePath = files[i]
      const relative = path.relative(distPath, filePath).split(path.sep).join('/')
      const contentType = getContentType(filePath)
      try {
        await putWithRetry(BUCKET, relative, filePath, contentType)
        success++
        uploadedCount++
        // show compact progress + occasional detailed status
        if (uploadedCount % 20 === 0 || uploadedCount === total) {
          process.stdout.write(`\rUploaded ${uploadedCount}/${total} — ${success} succeeded, ${failed} failed`)
        } else {
          process.stdout.write('.')
        }
      } catch (err) {
        failed++
        errors.push({ file: relative, error: err.message })
        process.stdout.write('F')
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker())
  await Promise.all(workers)

  console.log('\nUpload complete —', `${success} succeeded, ${failed} failed`)
  console.log(`[${DEPLOY_ENV.toUpperCase()}] ${success} files uploaded to bucket "${BUCKET}" — ${new Date().toLocaleString()}`)
  if (failed > 0) {
    console.error('Errors:\n', errors.map((e) => `${e.file}: ${e.error}`).join('\n'))
    process.exit(2)
  }

  // Full-sync: delete remote objects not present in local dist
  const FULL_SYNC = (process.env.R2_FULL_SYNC === 'true' || process.env.R2_FULL_SYNC === '1')
  const FULL_SYNC_DRY_RUN = (process.env.R2_FULL_SYNC_DRY_RUN === 'true' || process.env.R2_FULL_SYNC_DRY_RUN === '1')
  if (FULL_SYNC) {
    const accountId = CF_ACCOUNT_ID || getAccountIdFromWrangler()
    if (!accountId) {
      console.error('CF account id not found. Set CF_ACCOUNT_ID env or ensure `wrangler whoami` is available.')
      process.exit(3)
    }

    console.log(`\nFull-sync enabled — listing objects in R2 bucket: ${BUCKET}`)
    let remoteObjects
    try {
      remoteObjects = await listRemoteObjects(accountId, BUCKET)
    } catch (err) {
      console.error('Failed to list remote objects:', err.message || err)
      process.exit(3)
    }

    const localKeys = new Set(files.map((f) => path.relative(distPath, f).split(path.sep).join('/')))
    const stale = remoteObjects.filter((k) => !localKeys.has(k))

    if (stale.length === 0) {
      console.log('No stale objects to delete — bucket is in sync.')
      return
    }

    console.log(`Found ${stale.length} stale object(s) to ${FULL_SYNC_DRY_RUN ? 'preview (dry-run)' : 'delete'}`)
    if (FULL_SYNC_DRY_RUN) {
      for (const k of stale) console.log('- ' + k)
      return
    }

    // perform deletions in parallel
    let di = 0
    let delSuccess = 0
    let delFailed = 0
    const delErrors = []

    async function delWorker() {
      while (di < stale.length) {
        const i = di++
        const key = stale[i]
        try {
          await deleteWithRetry(accountId, BUCKET, key)
          process.stdout.write('.')
          delSuccess++
        } catch (err) {
          process.stdout.write('F')
          delFailed++
          delErrors.push({ key, error: err.message })
        }
      }
    }

    const delWorkers = Array.from({ length: Math.min(DELETE_CONCURRENCY, stale.length) }, () => delWorker())
    await Promise.all(delWorkers)

    console.log(`\nDeletion complete — ${delSuccess} deleted, ${delFailed} failed`)
    if (delFailed > 0) {
      console.error('Deletion errors:\n', delErrors.map((e) => `${e.key}: ${e.error}`).join('\n'))
      process.exit(4)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
