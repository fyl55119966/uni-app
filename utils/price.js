export const DEPOSIT_RATE = 0.1
export const RECYCLE_SPREAD = 0.5
export const LABOR_FEE_DEFAULT = 0

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

export function calcPrice(gram, goldPrice, laborFee = LABOR_FEE_DEFAULT) {
  return round2(Number(gram) * (Number(goldPrice) + Number(laborFee)))
}

export function depositOf(total) {
  return round2(Number(total) * DEPOSIT_RATE)
}

export function recyclePrice(goldPrice) {
  return round2(Number(goldPrice) - RECYCLE_SPREAD)
}

export function parseClock(value) {
  const [h, m] = String(value).split(':').map(Number)
  return h * 60 + m
}

export function isTradingNow(now = new Date(), cfg = {}) {
  const start = cfg.start || '09:30'
  const end = cfg.end || '23:30'
  const days = cfg.days || [0, 1, 2, 3, 4, 5, 6]
  if (!days.includes(now.getDay())) return false
  const minutes = now.getHours() * 60 + now.getMinutes()
  return minutes >= parseClock(start) && minutes <= parseClock(end)
}
