import { withMock } from './request.js'
import { getAddresses } from './address.js'
import { nextOrderStatus, ORDER_STATUS } from '../utils/orderState.js'

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

const ORDERS_KEY = 'gold_orders'

function readOrders() {
	return uni.getStorageSync(ORDERS_KEY) || []
}

function saveOrders(list) {
	uni.setStorageSync(ORDERS_KEY, list)
}

export function getCheckout() {
	return withMock(() => ({ stores: STORES, addresses: getAddresses(), coupons: COUPONS, subsidy: SUBSIDY }), {
		url: '/order/checkout'
	})
}

export async function createOrder(payload) {
	const order = {
		orderNo: 'G' + Date.now(),
		createdAt: Date.now(),
		status: ORDER_STATUS.PENDING_DEPOSIT,
		depositPaid: false,
		balancePaid: false,
		lastPayError: '',
		payments: [],
		...payload
	}
	const list = readOrders()
	list.unshift(order)
	saveOrders(list)
	return order
}

export async function getOrders() {
	return readOrders()
}

export async function getOrder(orderNo) {
	return readOrders().find((o) => o.orderNo === orderNo) || null
}

function update(orderNo, event, payment) {
	const list = readOrders()
	const index = list.findIndex((o) => o.orderNo === orderNo)
	if (index < 0) return null
	const next = nextOrderStatus(list[index], event)
	if (payment) next.payments = [...(next.payments || []), payment]
	list[index] = next
	saveOrders(list)
	return next
}

export async function payOrder(orderNo, { method, stage }) {
	const order = await getOrder(orderNo)
	if (!order) return null
	const success = stage === 'balance' ? 'PAY_BALANCE_SUCCESS' : 'PAY_DEPOSIT_SUCCESS'
	return update(
		orderNo,
		{ type: success },
		{ method, stage, amount: stage === 'balance' ? order.balance : order.deposit, at: Date.now(), status: 'success' }
	)
}

export async function failOrder(orderNo, { method, stage, message }) {
	return update(
		orderNo,
		{ type: 'PAY_FAIL', message },
		{ method, stage, at: Date.now(), status: 'fail', message }
	)
}

export async function timeoutOrder(orderNo) {
	return update(orderNo, { type: 'PAY_TIMEOUT' })
}
