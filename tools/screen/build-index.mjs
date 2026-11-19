import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const SHOT_DIR = path.join(ROOT, 'images/页面')
const OCR_DIR = path.join(ROOT, 'docs/screens')

const shots = await readdir(SHOT_DIR)
const byPage = new Map()
for (const name of shots) {
  const m = name.match(/_(\d{3})_772\.png$/)
  if (m) byPage.set(m[1], name)
}

const files = (await readdir(OCR_DIR)).filter((f) => /^\d{3}\.json$/.test(f)).sort()
const index = []
for (const file of files) {
  const page = file.slice(0, 3)
  const data = JSON.parse(await readFile(path.join(OCR_DIR, file), 'utf8'))
  index.push({
    page,
    source: byPage.get(page) || '',
    width: data.width,
    height: data.height,
    lines: data.lines.length
  })
}

await writeFile(path.join(OCR_DIR, 'index.json'), JSON.stringify(index, null, 1) + '\n')
console.log(`indexed ${index.length} pages`)
