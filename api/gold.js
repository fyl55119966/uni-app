import { GOLD_PRICE, TRADING, HOME_NAV } from '@/mock/data.js'
import { isTradingNow } from '@/utils/price.js'

export function getGoldSnapshot() {
  return Promise.resolve({
    price: GOLD_PRICE,
    trading: isTradingNow(new Date(), TRADING),
    closedTip: TRADING.closedTip,
    navs: HOME_NAV
  })
}
