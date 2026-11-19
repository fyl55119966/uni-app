import { getUser, setSession } from '../utils/token.js'
import { calcArrival, calcWithdrawFee, round2, validateWithdraw } from '../utils/withdraw.js'
import { getCards } from './bank.js'
import { appendTransaction, setTransactionStatus } from './wallet.js'

const KEY = 'gold_withdrawals'

export function getWithdrawals() {
	return uni.getStorageSync(KEY) || []
}

function save(list) {
	uni.setStorageSync(KEY, list)
	return list
}

function todayCount(list) {
	const now = new Date()
	const isSameDay = (ts) => {
		const d = new Date(ts)
		return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
	}
	return list.filter((w) => isSameDay(w.createdAt)).length
}

export function applyWithdraw({ amount, cardId, password }) {
	const cards = getCards()
	const card = cards.find((c) => c.id === cardId) || cards.find((c) => c.isDefault)
	if (!card) throw new Error('请先添加银行卡')
	const user = getUser() || {}
	const balance = Number(user.balance || 0)
	const list = getWithdrawals()
	const check = validateWithdraw({ amount: Number(amount), balance, todayCount: todayCount(list) })
	if (!check.ok) throw new Error(check.message)
	const pwd = uni.getStorageSync('gold_pay_pwd') || '123456'
	if (String(password || '') !== pwd) throw new Error('支付密码错误')

	const value = round2(amount)
	const tx = appendTransaction({
		id: 'tx-w-' + Date.now(),
		type: 'withdraw',
		title: `提现到银行卡（${card.tail}）`,
		amount: value,
		direction: 'out',
		status: 'pending',
		method: '银行卡',
		createdAt: new Date().toISOString()
	})
	const record = {
		id: 'W' + Date.now(),
		amount: value,
		fee: calcWithdrawFee(value),
		arrival: calcArrival(value),
		cardId: card.id,
		cardTail: card.tail,
		txId: tx.id,
		status: 'reviewing',
		createdAt: new Date().toISOString()
	}
	save([record, ...list])
	setSession({ ...user, balance: round2(balance - value) })
	return record
}

export function syncWithdrawals() {
	const list = getWithdrawals().map((w) => {
		if (w.status !== 'reviewing') return w
		setTransactionStatus(w.txId, 'success')
		return { ...w, status: 'paid' }
	})
	save(list)
	return list
}
