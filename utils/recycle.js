import { round2, recyclePrice } from './price.js'

export const RECYCLE_DEPOSIT_RATE = 0.1

export function recycleQuote(gram, quantity = 1, goldPrice = 861.42) {
  const price = recyclePrice(goldPrice)
  const total = round2(price * Number(gram || 0) * Number(quantity || 0))
  return {
    price,
    total,
    deposit: round2(total * RECYCLE_DEPOSIT_RATE)
  }
}
