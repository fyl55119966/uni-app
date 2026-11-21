import { PRODUCTS } from './shop.js'
import { getBar } from './coins.js'

export const BAR_GRAMS = [1, 5, 15, 30, 100]

const JEWELRY_CATEGORY = {
	1: '黄金饰品',
	2: '黄金饰品',
	3: '黄金饰品',
	4: '黄金饰品',
	11: '黄金饰品',
	12: '黄金饰品',
	13: '黄金饰品',
	14: '黄金饰品',
	5: '白银饰品',
	6: '白银饰品',
	7: '白银饰品',
	8: '白银饰品',
	9: '白银饰品',
	10: '白银饰品'
}

export const CATEGORIES = ['投资金条', '黄金饰品', '白银饰品', '翡翠饰品']

export async function allGoods() {
	const bars = await Promise.all(BAR_GRAMS.map((gram) => getBar(gram)))
	const jewelry = PRODUCTS.map((item) => ({
		...item,
		type: 'jewelry',
		category: JEWELRY_CATEGORY[item.id] || '黄金饰品'
	}))
	return [
		...bars.map((bar) => ({ ...bar, category: '投资金条' })),
		...jewelry
	]
}

export async function searchGoods(keyword) {
	const text = String(keyword || '').trim()
	if (!text) return []
	const list = await allGoods()
	return list.filter((item) => item.title.includes(text) || item.category.includes(text))
}

export async function goodsByCategory(category) {
	const list = await allGoods()
	if (category === '全部') return list
	return list.filter((item) => item.category === category)
}

export async function getGoodsById(id) {
	if (String(id).startsWith('bar-')) {
		return getBar(Number(String(id).split('-')[1]))
	}
	const { getProduct } = await import('./shop.js')
	const item = await getProduct(id)
	return item ? { ...item, category: JEWELRY_CATEGORY[item.id] || '黄金饰品' } : null
}
