import { withMock } from './request.js'

const USER = {
	name: '用户3002',
	member: 'M2611073017816310',
	avatar: '/static/images/gold/avatar.png',
	balance: 5.0,
	fans: 0,
	subsidy: 1000.0,
	subsidyStatus: '待领取'
}

const ORDERS = [
	{ key: 'pay', label: '待付款', icon: '/static/icons/ord-pay.png' },
	{ key: 'pickup', label: '待提货', icon: '/static/icons/ord-pickup.png' },
	{ key: 'ship', label: '待发货', icon: '/static/icons/ord-ship.png' },
	{ key: 'receive', label: '待收货', icon: '/static/icons/ord-receive.png' }
]

const RECYCLES = [
	{ key: 'deliver', label: '待交货', icon: '/static/icons/rec-deliver.png' },
	{ key: 'accept', label: '待验收', icon: '/static/icons/rec-accept.png' },
	{ key: 'done', label: '交货完成', icon: '/static/icons/rec-done.png' },
	{ key: 'breach', label: '已违约', icon: '/static/icons/rec-breach.png' }
]

const MENUS = [
	{ key: 'sell', label: '立即出售', icon: '/static/icons/m-camera.png' },
	{ key: 'subsidy', label: '平台补贴', icon: '/static/icons/m-star.png' },
	{ key: 'coupon', label: '优惠券', icon: '/static/icons/m-ticket.png' },
	{ key: 'bank', label: '银行卡', icon: '/static/icons/m-card.png' },
	{ key: 'invoice', label: '发票管理', icon: '/static/icons/m-invoice.png' },
	{ key: 'guide', label: '新手教程', icon: '/static/icons/nav-book.png' }
]

export function getMine() {
	return withMock(() => ({ user: USER, orders: ORDERS, recycles: RECYCLES, menus: MENUS }), { url: '/mine' })
}
