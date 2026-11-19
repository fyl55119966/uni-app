import { existsSync, readdirSync, statSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SKIP_DIRS = new Set(['node_modules', 'unpackage', 'static', 'docs', 'images', '.git', '.scratch', '.hbuilderx'])
const SCAN_DIRS = ['components', 'api', 'utils']

const errors = []
const rel = (p) => path.relative(ROOT, p).replaceAll('\\', '/')

// Windows 大小写不敏感、CI 是 Linux：逐段比对真实文件名
function existsExact(relPath) {
  const parts = relPath.split('/').filter(Boolean)
  let cur = ROOT
  for (const part of parts) {
    let entries
    try {
      entries = readdirSync(cur)
    } catch {
      return false
    }
    if (!entries.includes(part)) return false
    cur = path.join(cur, part)
  }
  try {
    return statSync(cur).isFile()
  } catch {
    return false
  }
}

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

// 0. JSON 入口文件不能带 UTF-8 BOM：HBuilderX 的 webpack 会报 Unexpected token
for (const name of ['package.json', 'pages.json', 'manifest.json']) {
  const raw = await readFile(path.join(ROOT, name))
  if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) {
    errors.push(`${name}: 带 UTF-8 BOM，HBuilderX 编译会失败，需存为 UTF-8 无 BOM`)
  }
}

const routes = [...(pages.pages || [])]
for (const sub of pages.subPackages || []) {
  for (const page of sub.pages || []) {
    routes.push({ path: `${sub.root}/${page.path}` })
  }
}

for (const route of routes) {
  if (!existsExact(`${route.path}.vue`)) {
    errors.push(`路由缺页面文件: ${route.path}.vue`)
  }
}

// 2. /static 引用 ↔ 文件存在（只查已注册路由 + 公共目录，CRMEB 遗留页不在范围）
const files = []
for (const route of routes) {
  const abs = path.join(ROOT, `${route.path}.vue`)
  if (existsExact(`${route.path}.vue`)) files.push(abs)
}
for (const dir of SCAN_DIRS) {
  const abs = path.join(ROOT, dir)
  if (existsSync(abs)) files.push(...(await walk(abs)))
}
for (const name of ['App.vue', 'main.js']) {
  if (existsExact(name)) files.push(path.join(ROOT, name))
}

let staticRefs = 0
for (const file of files) {
  const text = await readFile(file, 'utf8')
  for (const match of text.matchAll(/['"`](\/static\/[^'"`\s]+?\.(?:png|jpe?g|webp|gif|svg))['"`]/g)) {
    const ref = match[1]
    if (ref.includes('${')) continue
    staticRefs++
    if (!existsExact(ref.slice(1))) {
      errors.push(`${rel(file)}: 静态资源不存在或大小写不一致 ${ref}`)
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
  for (const error of errors) { console.error(`- ${error}`); if (process.env.GITHUB_ACTIONS) console.error(`::error::${error}`) }
  process.exit(1)
}
console.log('check ok')


