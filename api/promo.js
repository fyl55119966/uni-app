import { getOrders } from './order.js'

const INVOICE_KEY = 'gold_invoices'

const COUPONS = [
	{
		id: 'cp-1',
		title: '黄金订购券',
		amount: 200,
		threshold: 5000,
		status: 'unused',
		scope: '黄金订购 · 抵扣定金',
		validUntil: '2026-12-31'
	},
	{
		id: 'cp-2',
		title: '新人专享券',
		amount: 50,
		threshold: 1000,
		status: 'unused',
		scope: '黄金订购 · 抵扣定金',
		validUntil: '2026-12-15'
	},
	{
		id: 'cp-3',
		title: '回收服务券',
		amount: 30,
		threshold: 0,
		status: 'used',
		scope: '黄金回收 · 抵扣服务费',
		validUntil: '2026-11-30'
	},
	{
		id: 'cp-4',
		title: '双十一预热券',
		amount: 100,
		threshold: 3000,
		status: 'expired',
		scope: '黄金订购 · 抵扣定金',
		validUntil: '2026-11-11'
	}
]

export const SUBSIDY = {
	amount: 1000,
	used: 0,
	status: '进行中',
	expireAt: '2026-12-20',
	rules: [
		'补贴仅用于抵扣下单时的定金：黄金订购抵扣定金，黄金回购抵扣定金与手续费；尾款不受影响。',
		'退订或违约后，已抵扣的补贴一律作废，不予退还。',
		'新人补贴活动限发放一次。',
		'补贴不可提现、不可转让，抵扣后不找零。'
	]
}

export function getCoupons(status) {
	return COUPONS.filter((c) => c.status === status)
}

export function getSubsidy() {
	return { ...SUBSIDY }
}

export function getInvoices() {
	return uni.getStorageSync(INVOICE_KEY) || []
}

export async function applyInvoice(orderId) {
	const order = (await getOrders()).find((o) => o.orderNo === orderId)
	if (!order) throw new Error('请选择已完成订单')
	if (order.status !== 'paid') throw new Error('仅已完成订单可申请开票')
	const list = getInvoices()
	if (list.some((i) => i.orderNo === orderId)) throw new Error('该订单已提交开票')
	const invoice = {
		id: 'inv-' + Date.now(),
		orderNo: orderId,
		title: order.title,
		amount: order.total,
		status: 'submitted',
		createdAt: new Date().toISOString()
	}
	uni.setStorageSync(INVOICE_KEY, [invoice, ...list])
	return invoice
}

export function syncInvoices() {
	const next = { submitted: 'issued', issued: 'sent' }
	const list = getInvoices().map((i) => (next[i.status] ? { ...i, status: next[i.status] } : i))
	uni.setStorageSync(INVOICE_KEY, list)
	return list
}

export async function eligibleOrders() {
	const list = await getOrders()
	return list.filter((o) => o.status === 'paid')
}
