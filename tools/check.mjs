import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SKIP_DIRS = new Set(['node_modules', 'unpackage', 'static', 'docs', 'images', '.git', '.scratch', '.hbuilderx'])
const SCAN_DIRS = ['pages', 'components', 'api', 'utils']

const errors = []
const rel = (p) => path.relative(ROOT, p).replaceAll('\\', '/')

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      out.push(...(await walk(path.join(dir, entry.name))))
    } else if (/\.(vue|js)$/.test(entry.name)) {
      out.push(path.join(dir, entry.name))
    }
  }
  return out
}

// 1. pages.json 路由 ↔ 页面文件
let pages
try {
  pages = JSON.parse(await readFile(path.join(ROOT, 'pages.json'), 'utf8'))
} catch (error) {
  errors.push(`pages.json 解析失败: ${error.message}`)
  pages = { pages: [], subPackages: [] }
}

const routes = [...(pages.pages || [])]
for (const sub of pages.subPackages || []) {
  for (const page of sub.pages || []) {
    routes.push({ path: `${sub.root}/${page.path}`, _sub: true })
  }
}

for (const route of routes) {
  if (!existsSync(path.join(ROOT, `${route.path}.vue`))) {
    errors.push(`路由缺页面文件: ${route.path}.vue`)
  }
}

// 2. /static 引用 ↔ 文件存在（只查已注册路由 + 公共目录，CRMEB 遗留页不在范围）
const files = []
for (const route of routes) {
  const abs = path.join(ROOT, `${route.path}.vue`)
  if (existsSync(abs)) files.push(abs)
}
for (const dir of SCAN_DIRS.filter((d) => d !== 'pages')) {
  const abs = path.join(ROOT, dir)
  if (existsSync(abs)) files.push(...(await walk(abs)))
}
for (const name of ['App.vue', 'main.js']) {
  const abs = path.join(ROOT, name)
  if (existsSync(abs)) files.push(abs)
}

let staticRefs = 0
for (const file of files) {
  const text = await readFile(file, 'utf8')
  for (const match of text.matchAll(/['"`](\/static\/[^'"`\s]+?\.(?:png|jpe?g|webp|gif|svg))['"`]/g)) {
    const ref = match[1]
    if (ref.includes('${')) continue
    staticRefs++
    if (!existsSync(path.join(ROOT, ref.slice(1)))) {
      errors.push(`${rel(file)}: 静态资源不存在 ${ref}`)
    }
  }
}

// 3. pages 不允许直接 import mock（票 03 的 api 边界）
for (const file of files.filter((f) => rel(f).startsWith('pages/'))) {
  const text = await readFile(file, 'utf8')
  if (/from\s+['"][^'"]*mock[^'"]*['"]/.test(text)) {
    errors.push(`${rel(file)}: 页面直接 import mock，应走 api/`)
  }
}

console.log(`routes ${routes.length}, files ${files.length}, static refs ${staticRefs}`)
if (errors.length) {
  console.error(`\n发现 ${errors.length} 个问题:`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log('check ok')
