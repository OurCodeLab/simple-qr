/**
 * Pre-build sitemap generator for nutribeauty.sg.
 * The app currently exposes a single indexable route, so the sitemap should
 * only publish the canonical home URL and avoid stale pages from the old site.
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SITE = (process.env.SITE_URL || 'https://www.nutribeauty.sg').replace(/\/$/, '')
const TODAY = new Date().toISOString().split('T')[0]

const pages = [
  {
    loc: '/',
    changefreq: 'weekly',
    priority: '1.0',
  },
]

const urlEntries = pages
  .map((page) => {
    return `  <url>
    <loc>${SITE}${page.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  })
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

const outPath = resolve(ROOT, 'public/sitemap.xml')
writeFileSync(outPath, sitemap, 'utf-8')

console.log(`✓ sitemap.xml generated with ${pages.length} URL → ${outPath}`)
