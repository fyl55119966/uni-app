import { withMock } from './request.js'

export const STORES = [
	{ id: 'xian', name: '西安运营中心', manager: '王经理 151 3839 5854', address: '西安市未央区昆明路45号沣东吾悦广场', hours: '09:30–21:00' },
	{ id: 'shanghai', name: '上海总部', manager: '客服 400-006-1661', address: '上海市黄浦区河南中路99号', hours: '09:30–21:00' },
	{ id: 'zhengzhou', name: '郑州运营中心', manager: '李经理 138 0000 0000', address: '郑州市金水区花园路国贸360', hours: '09:30–21:00' }
]

export const ADDRESSES = [
	{ id: 'a1', name: '张三', phone: '138****0000', region: '陕西省 西安市 未央区', detail: '昆明路45号沣东吾悦广场 1 栋 1801', isDefault: true },
	{ id: 'a2', name: '李四', phone: '139****1111', region: '上海市 黄浦区', detail: '河南中路99号 上金所有金店', isDefault: false }
]

export const COUPONS = [
	{ id: 'c1', title: '满 1000 减 50', amount: 50, threshold: 1000 },
	{ id: 'c2', title: '满 5000 减 200', amount: 200, threshold: 5000 },
	{ id: 'c3', title: '满 10000 减 500', amount: 500, threshold: 10000 }
]

export const SUBSIDY = { amount: 1000, status: '待领取' }

export function getCheckout() {
	return withMock(() => ({ stores: STORES, addresses: ADDRESSES, coupons: COUPONS, subsidy: SUBSIDY }), {
		url: '/order/checkout'
	})
}

export function createOrder(payload) {
	return withMock(
		() => ({
			orderNo: 'G' + Date.now(),
			status: 'pending_deposit',
			createdAt: Date.now(),
			...payload
		}),
		{ url: '/order/create', method: 'POST', data: payload }
	)
}
