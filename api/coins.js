import { calcPrice, depositOf } from '../utils/price.js'
import { withMock } from './request.js'

const COIN = {
	price: 861.42,
	laborFee: 15,
	specs: [1, 5, 15, 30, 100],
	detailImages: [
		'/static/images/gold/coin-market.png',
		'/static/images/gold/coin-mall-1.png',
		'/static/images/gold/coin-mall-2.png'
	]
}

const CHART_COUNT = { today: 160, '5d': 60, '7d': 70, '30d': 72 }
const CHART_RANGE = { today: 0.008, '5d': 0.02, '7d': 0.03, '30d': 0.06 }
const CHART_END = { today: 0, '5d': -0.012, '7d': -0.02, '30d': -0.06 }

function pad2(value) {
	return value < 10 ? `0${value}` : `${value}`
}

function hashSeed(text) {
	let hash = 2166136261
	for (let i = 0; i < text.length; i++) {
		hash = Math.imul(hash ^ text.charCodeAt(i), 16777619)
	}
	return hash >>> 0
}

function randomOf(seed) {
	let state = seed
	return function next() {
		state |= 0
		state = (state + 0x6D2B79F5) | 0
		let t = Math.imul(state ^ (state >>> 15), 1 | state)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

function dateLabel(offset) {
	const date = new Date(Date.now() - offset * 86400000)
	return `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function buildPoints(period, base) {
	const count = CHART_COUNT[period] || CHART_COUNT.today
	const range = CHART_RANGE[period] || CHART_RANGE.today
	const end = base * (1 + (CHART_END[period] || 0))
	const start = base + (end - base) * 0.35 + base * range * 0.3
	const random = randomOf(hashSeed(period))
	const points = []
	for (let index = 0; index < count; index++) {
		const ratio = index / (count - 1)
		const envelope = Math.sin(Math.PI * ratio)
		const noise = (random() - 0.5) * base * range * 0.42 * envelope
		points.push(Number((start + (end - start) * ratio + noise).toFixed(2)))
	}
	points[count - 1] = Number(end.toFixed(2))
	return points
}

function buildChart(period) {
	const base = COIN.price
	const points = buildPoints(period, base)

	const now = new Date()
	const offsets = period === '5d'
		? [5, 4, 3, 2, 1, 0]
		: period === '7d'
			? [6, 5, 4, 3, 2, 1, 0]
			: period === '30d'
				? [30, 24, 18, 12, 6, 0]
				: []
	const xLabels = offsets.length
		? offsets.map(dateLabel)
		: ['00:00', '04:00', '08:00', '12:00', `${pad2(now.getHours())}:${pad2(now.getMinutes())}`]

	return {
		period,
		points,
		xLabels,
		latest: {
			time: `${pad2(now.getMonth() + 1)}/${pad2(now.getDate())} ${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`,
			price: points[points.length - 1]
		}
	}
}

export function getCoin() {
	return withMock(() => ({ ...COIN }), { url: '/coins' })
}

export function getCoinChart({ period = 'today', gram = 1 } = {}) {
	return withMock(() => buildChart(period), { url: '/coins/chart', data: { period, gram } })
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
