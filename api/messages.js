const KEY = 'gold_messages'
const SEEDED = 'gold_messages_seeded'

const SEED = [
	{
		id: 'msg-1',
		title: '上金所有金店正式上线',
		body: '黄金现货商城已上线，支持 1g / 5g / 15g / 30g / 100g 投资金条在线订购，支持到店自提与快递物流。',
		time: '2026-11-19 10:00',
		read: false
	},
	{
		id: 'msg-2',
		title: '交易时段调整通知',
		body: '交易时段为周一至周日 09:30–23:30，休市期间可浏览商品，买入类操作将在开市后恢复。',
		time: '2026-11-18 18:00',
		read: true
	}
]

export function getMessages() {
	if (!uni.getStorageSync(SEEDED)) {
		uni.setStorageSync(KEY, SEED)
		uni.setStorageSync(SEEDED, 1)
		return SEED
	}
	return uni.getStorageSync(KEY) || []
}

export function markRead(id) {
	const next = getMessages().map((item) => (item.id === id ? { ...item, read: true } : item))
	uni.setStorageSync(KEY, next)
	return next
}

export function unreadCount() {
	return getMessages().filter((item) => !item.read).length
}
