export const ORDER_STATUS = {
	PENDING_DEPOSIT: 'pending_deposit',
	PENDING_PICKUP: 'pending_pickup',
	PAID: 'paid',
	CANCELLED: 'cancelled'
}

export const ORDER_STATUS_TEXT = {
	pending_deposit: '待付定金',
	pending_pickup: '待提货',
	paid: '已完成',
	cancelled: '已取消'
}

export function nextOrderStatus(order, event) {
	switch (event.type) {
		case 'PAY_DEPOSIT_SUCCESS':
			return { ...order, status: ORDER_STATUS.PENDING_PICKUP, depositPaid: true, lastPayError: '' }
		case 'PAY_BALANCE_SUCCESS':
			return { ...order, status: ORDER_STATUS.PAID, balancePaid: true, lastPayError: '' }
		case 'PAY_FAIL':
			return { ...order, lastPayError: event.message || '支付失败' }
		case 'PAY_TIMEOUT':
			return { ...order, lastPayError: '支付超时，请重新支付' }
		case 'CANCEL':
			return { ...order, status: ORDER_STATUS.CANCELLED }
		default:
			return order
	}
}

export function isWeixin() {
	if (typeof navigator === 'undefined' || !navigator.userAgent) return false
	return /MicroMessenger/i.test(navigator.userAgent)
}

export function payMethods({ amount = 0, balance = 0, weixin = isWeixin() } = {}) {
	if (weixin) {
		return [{ key: 'wechat', name: '微信支付（测试环境）', desc: '小程序内 mock，不发起真实扣款', mock: true }]
	}
	const list = []
	if (amount <= 50000) {
		list.push({ key: 'alipay', name: '支付宝支付', desc: '单笔 5 万元以内，跳转支付宝 H5' })
	}
	if (balance >= amount) {
		list.push({ key: 'balance', name: '余额支付', desc: '可用余额 ¥' + Number(balance).toFixed(2) })
	}
	if (amount > 50000) {
		list.push({ key: 'transfer', name: '大额转账', desc: '单笔超 5 万元，对公账户 + 上传凭证', transfer: true })
	}
	if (!list.length) {
		list.push({ key: 'transfer', name: '大额转账', desc: '对公账户 + 上传凭证', transfer: true })
	}
	return list
}
