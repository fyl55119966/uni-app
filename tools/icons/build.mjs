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
const ordPay = `<rect x="14" y="24" width="52" height="36" rx="6"/><path d="M14 34 H66"/><circle cx="56" cy="48" r="3"/>`
const ordPickup = `<path d="M40.5 14 L66 26 V55 L40.5 67 L15 55 V26 Z"/><path d="M15 26 L40.5 38 L66 26"/><path d="M40.5 38 V67"/>`
const ordShip = `<path d="M10 28 H46 V55 H10 Z"/><path d="M46 36 H60 L70 46 V55 H46"/><circle cx="24" cy="58" r="5"/><circle cx="58" cy="58" r="5"/>`
const ordReceive = `<rect x="16" y="18" width="49" height="50" rx="5"/><path d="M30 32 H51"/><path d="M30 44 H51"/><path d="M30 56 H42"/>`
const recDeliver = `<rect x="16" y="20" width="49" height="46" rx="5"/><path d="M16 32 H65"/><path d="M28 14 V26"/><path d="M53 14 V26"/>`
const recAccept = `<path d="M12 44 H50"/><path d="M40 34 L50 44 L40 54"/><path d="M56 24 H66 V64 H56"/>`
const recDone = `<rect x="16" y="18" width="49" height="50" rx="5"/><path d="M28 44 L37 53 L54 34"/>`
const recBreach = `<rect x="16" y="18" width="49" height="50" rx="5"/><path d="M30 34 L51 55"/><path d="M51 34 L30 55"/>`
const mCamera = `<rect x="12" y="24" width="57" height="40" rx="8"/><circle cx="40.5" cy="44" r="11"/><path d="M28 24 L33 16 H48 L53 24"/>`
const mStar = `<path d="M40.5 12 L49 31 L70 33 L54 47 L59 67 L40.5 56 L22 67 L27 47 L11 33 L32 31 Z"/>`
const mTicket = `<path d="M12 26 H69 V38 A6 6 0 0 0 69 50 V62 H12 V50 A6 6 0 0 0 12 38 Z"/><path d="M30 26 V62" stroke-dasharray="4 6"/>`
const mCard = `<rect x="10" y="22" width="61" height="40" rx="6"/><path d="M10 34 H71"/><path d="M20 50 H36"/>`
const mInvoice = `<path d="M18 12 H63 V69 L56 63 L49 69 L42 63 L35 69 L28 63 L21 69 L18 66 Z"/><path d="M28 28 H53"/><path d="M28 40 H53"/><path d="M28 52 H44"/>`

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
  { name: 'ic-search', color: GOLD, body: search },
  { name: 'ord-pay', color: GOLD, body: ordPay },
  { name: 'ord-pickup', color: GOLD, body: ordPickup },
  { name: 'ord-ship', color: GOLD, body: ordShip },
  { name: 'ord-receive', color: GOLD, body: ordReceive },
  { name: 'rec-deliver', color: GOLD, body: recDeliver },
  { name: 'rec-accept', color: GOLD, body: recAccept },
  { name: 'rec-done', color: GOLD, body: recDone },
  { name: 'rec-breach', color: GOLD, body: recBreach },
  { name: 'm-camera', color: GOLD, body: mCamera },
  { name: 'm-star', color: GOLD, body: mStar },
  { name: 'm-ticket', color: GOLD, body: mTicket },
  { name: 'm-card', color: GOLD, body: mCard },
  { name: 'm-invoice', color: GOLD, body: mInvoice }
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
