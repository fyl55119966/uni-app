import { GOLD_PRICE, TRADING, HOME_NAV } from '../mock/data.js'
import { isTradingNow } from '../utils/price.js'
import { withMock } from './request.js'

export function getGoldSnapshot() {
	return withMock(() => ({
		price: GOLD_PRICE,
		trading: isTradingNow(new Date(), TRADING),
		closedTip: TRADING.closedTip,
		navs: HOME_NAV
	}), { url: '/gold/snapshot' })
}
