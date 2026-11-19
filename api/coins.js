import { calcPrice, depositOf } from '../utils/price.js'
import { withMock } from './request.js'

const COIN = {
	price: 861.42,
	laborFee: 15,
	specs: [1, 5, 15, 30, 100],
	chart: '/static/images/gold/coin-chart.png',
	detailImages: [
		'/static/images/gold/coin-detail-1.png',
		'/static/images/gold/coin-detail-2.png',
		'/static/images/gold/coin-detail-3.png'
	]
}

export function getCoin() {
	return withMock(() => ({ ...COIN }), { url: '/coins' })
}

export function coinQuote(gram, coin) {
	const total = calcPrice(gram, coin.price, coin.laborFee)
	return { total, deposit: depositOf(total) }
}

export function getBar(gram) {
	return withMock(() => ({
		id: `bar-${gram}`,
		type: 'bar',
		title: `${gram}g 标准金条`,
		subtitle: '足金9999 · 投资金条',
		images: [`/static/images/gold/coin-${gram}.png`],
		gram: Number(gram),
		specs: COIN.specs,
		price: COIN.price,
		labor: COIN.laborFee,
		stock: 99,
		limit: 5,
		delivery: ['快递配送', '到店自提']
	}), { url: `/goods/bar/${gram}` })
}
