import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const SVG_DIR = path.join(ROOT, 'design/icons')
const PNG_DIR = path.join(ROOT, 'static/icons')
const GOLD = '#D9A133'
const GRAY = '#8A8A8A'

const svg = (body, color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="324" height="324" viewBox="0 0 81 81" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`

const home = `<path d="M13 38 L40.5 15 L68 38"/><path d="M20 33 V65 H61 V33"/><path d="M34 65 V48 H47 V65"/>`
const homeActive = `<path d="M20 33 H61 V65 H20 Z" fill="${GOLD}" stroke="none"/><path d="M13 38 L40.5 15 L68 38"/><path d="M34 65 V48 H47 V65" stroke="#FFF6E5"/>`
const coin = `<circle cx="40.5" cy="40.5" r="24"/><path d="M31 29 L40.5 41 L50 29"/><path d="M40.5 41 V56"/><path d="M33 45 H48"/><path d="M33 50 H48"/>`
const cart = `<path d="M12 18 H20 L27 51 H60 L66 27 H24"/><circle cx="31" cy="60" r="4"/><circle cx="55" cy="60" r="4"/>`
const user = `<circle cx="40.5" cy="29" r="10"/><path d="M20 65 C20 51 29 46 40.5 46 C52 46 61 51 61 65"/>`
const navCoin = `<ellipse cx="40.5" cy="30" rx="23" ry="10"/><path d="M17.5 30 V50 C17.5 55.5 27.8 60 40.5 60 C53.2 60 63.5 55.5 63.5 50 V30"/><path d="M30 38 L40.5 48 L51 38"/><path d="M40.5 48 V55"/>`
const navShop = `<path d="M16 33 L23 18 H58 L65 33 Z"/><path d="M20 33 V64 H61 V33"/><path d="M34 64 V48 H47 V64"/>`
const navRecycle = `<path d="M63 40 A22.5 22.5 0 0 1 24 57"/><path d="M24 57 L20 47"/><path d="M24 57 L34 56"/><path d="M18 40 A22.5 22.5 0 0 1 57 23"/><path d="M57 23 L48 20"/><path d="M57 23 L56 33"/>`
const navFans = `<circle cx="30" cy="30" r="9"/><path d="M13 62 C13 50 21 45 30 45 C39 45 47 50 47 62"/><circle cx="55" cy="37" r="7"/><path d="M49 62 C49 53 54 49 60 49 C66 49 70 53 70 60"/>`
const navBook = `<path d="M40.5 25 C33 19 22 19 15 22 V58 C22 55 33 55 40.5 61 C48 55 59 55 66 58 V22 C59 19 48 19 40.5 25 Z"/><path d="M40.5 25 V61"/>`
const back = `<path d="M50 18 L29 40.5 L50 63"/>`
const chevron = `<path d="M31 18 L52 40.5 L31 63"/>`
const search = `<circle cx="36" cy="36" r="17"/><path d="M48 48 L64 64"/>`

const icons = [
  { name: 'tab-home', color: GRAY, body: home },
  { name: 'tab-home-active', color: GOLD, body: homeActive },
  { name: 'tab-coin', color: GRAY, body: coin },
  { name: 'tab-coin-active', color: GOLD, body: coin },
  { name: 'tab-shop', color: GRAY, body: cart },
  { name: 'tab-shop-active', color: GOLD, body: cart },
  { name: 'tab-user', color: GRAY, body: user },
  { name: 'tab-user-active', color: GOLD, body: user },
  { name: 'nav-coin', color: GOLD, body: navCoin },
  { name: 'nav-shop', color: GOLD, body: navShop },
  { name: 'nav-recycle', color: GOLD, body: navRecycle },
  { name: 'nav-fans', color: GOLD, body: navFans },
  { name: 'nav-book', color: GOLD, body: navBook },
  { name: 'ic-back', color: GOLD, body: back },
  { name: 'ic-chevron', color: GOLD, body: chevron },
  { name: 'ic-search', color: GOLD, body: search }
]

await mkdir(SVG_DIR, { recursive: true })
await mkdir(PNG_DIR, { recursive: true })

for (const icon of icons) {
  const source = svg(icon.body, icon.color)
  await writeFile(path.join(SVG_DIR, `${icon.name}.svg`), source)
  await sharp(Buffer.from(source))
    .resize(81, 81)
    .png({ compressionLevel: 9 })
    .toFile(path.join(PNG_DIR, `${icon.name}.png`))
}

console.log(`built ${icons.length} icons -> static/icons`)
