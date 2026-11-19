import { withMock } from './request.js'
import { STORES, ADDRESSES } from './order.js'

const RECYCLES_KEY = 'gold_recycles'
export const GRADES = ['99.9%', '99.99%']

function read() {
	const list = uni.getStorageSync(RECYCLES_KEY)
	return Array.isArray(list) ? list : []
}

export function getRecycleForm() {
	return withMock(() => ({ stores: STORES, addresses: ADDRESSES, grades: GRADES }), {
		url: '/recycle/form',
		method: 'GET'
	})
}

export async function createRecycle(payload) {
	const recycle = {
		recycleNo: 'R' + Date.now(),
		createdAt: Date.now(),
		status: 'pending_ship',
		title: `${payload.gram}g 投资金条`,
		image: `/static/images/gold/coin-${payload.gram}.png`,
		...payload
	}
	const list = read()
	list.unshift(recycle)
	uni.setStorageSync(RECYCLES_KEY, list)
	return recycle
}

export async function getRecycles() {
	return read()
}
