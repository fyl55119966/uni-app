const KEY = 'gold_addresses'
const SEEDED = 'gold_addresses_seeded'

export const DEFAULT_ADDRESSES = [
	{
		id: 'addr-1',
		name: '张先生',
		phone: '13800000000',
		region: '上海市 黄浦区',
		detail: '河南中路 99 号 上金所有金店',
		isDefault: true
	}
]

export function getAddresses() {
	if (!uni.getStorageSync(SEEDED)) {
		uni.setStorageSync(KEY, DEFAULT_ADDRESSES)
		uni.setStorageSync(SEEDED, 1)
		return DEFAULT_ADDRESSES
	}
	return uni.getStorageSync(KEY) || []
}

export function saveAddress(payload) {
	const list = getAddresses()
	const id = payload.id || 'addr-' + Date.now()
	const next = payload.id
		? list.map((item) => (item.id === id ? { ...item, ...payload, id } : item))
		: [...list, { ...payload, id }]
	if (payload.isDefault) {
		next.forEach((item) => { item.isDefault = item.id === id })
	}
	if (!next.some((item) => item.isDefault) && next.length) next[0].isDefault = true
	uni.setStorageSync(KEY, next)
	return next
}

export function removeAddress(id) {
	const next = getAddresses().filter((item) => item.id !== id)
	if (next.length && !next.some((item) => item.isDefault)) next[0].isDefault = true
	uni.setStorageSync(KEY, next)
	return next
}

export function setDefaultAddress(id) {
	const next = getAddresses().map((item) => ({ ...item, isDefault: item.id === id }))
	uni.setStorageSync(KEY, next)
	return next
}
