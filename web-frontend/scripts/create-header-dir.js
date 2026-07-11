import fs from 'fs'
import path from 'path'

const outDir = process.env.OUT_DIR || 'dist'
const headerPath = path.join(process.cwd(), outDir, '_header')

try {
  fs.mkdirSync(headerPath, { recursive: true })
  console.log(`Created folder: ${headerPath}`)
} catch (err) {
  console.error('Failed to create header folder', err)
  process.exit(1)
}
