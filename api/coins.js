import { calcPrice, depositOf } from '@/utils/price.js'

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
	return Promise.resolve({ ...COIN })
}

export function coinQuote(gram, coin) {
	const total = calcPrice(gram, coin.price, coin.laborFee)
	return { total, deposit: depositOf(total) }
}
