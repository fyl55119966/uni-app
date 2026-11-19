import { getUser } from '../utils/token.js'

const KEY = 'gold_bank_cards'

export function getCards() {
	return uni.getStorageSync(KEY) || []
}

function save(list) {
	uni.setStorageSync(KEY, list)
	return list
}

export function addCard({ number, phone }) {
	const cardNo = String(number || '').replace(/\s/g, '')
	if (!/^\d{16,19}$/.test(cardNo)) throw new Error('请输入 16–19 位银行卡号')
	if (!/^1[3-9]\d{9}$/.test(String(phone || ''))) throw new Error('请输入正确的预留手机号')
	const cards = getCards()
	if (cards.some((c) => c.tail === cardNo.slice(-4) && c.phone === phone)) throw new Error('该银行卡已绑定')
	const user = getUser() || {}
	const card = {
		id: 'card-' + Date.now(),
		name: user.realName || user.name || '实名认证用户',
		tail: cardNo.slice(-4),
		bank: '储蓄卡',
		phone,
		isDefault: cards.length === 0,
		createdAt: Date.now()
	}
	save([card, ...cards])
	return card
}

export function removeCard(id) {
	const cards = getCards().filter((c) => c.id !== id)
	if (cards.length && !cards.some((c) => c.isDefault)) cards[0].isDefault = true
	save(cards)
	return cards
}

export function setDefaultCard(id) {
	const cards = getCards().map((c) => ({ ...c, isDefault: c.id === id }))
	save(cards)
	return cards
}
