import { getUser, setSession } from '../utils/token.js'

const TX_KEY = 'gold_transactions'
const SEEDED = 'gold_transactions_seeded'

const SEED = [
	{
		id: 'tx-seed-1',
		type: 'reward',
		title: '填写邀请码注册绑定奖励',
		amount: 5,
		direction: 'in',
		status: 'success',
		method: '奖励',
		createdAt: '2026-11-07T13:01:46+08:00'
	}
]

export function getTransactions() {
	if (!uni.getStorageSync(SEEDED)) {
		uni.setStorageSync(TX_KEY, SEED)
		uni.setStorageSync(SEEDED, 1)
		return SEED
	}
	return uni.getStorageSync(TX_KEY) || []
}

function save(list) {
	uni.setStorageSync(TX_KEY, list)
	return list
}

export function getWallet() {
	const list = getTransactions()
	const income = list.filter((t) => t.direction === 'in' && t.status === 'success').reduce((s, t) => s + Number(t.amount), 0)
	const outcome = list.filter((t) => t.direction === 'out' && t.status === 'success').reduce((s, t) => s + Number(t.amount), 0)
	const user = getUser() || {}
	return {
		balance: Number(user.balance || 0),
		total: income,
		withdrawn: outcome,
		transactions: list
	}
}

export function recharge(amount, method = 'alipay') {
	const value = Number(amount)
	if (!(value > 0)) throw new Error('请输入充值金额')
	const list = getTransactions()
	const tx = {
		id: 'tx-' + Date.now(),
		type: 'recharge',
		title: method === 'transfer' ? '大额转账充值' : '支付宝充值',
		amount: value,
		direction: 'in',
		status: method === 'transfer' ? 'pending' : 'success',
		method,
		createdAt: new Date().toISOString()
	}
	save([tx, ...list])
	if (tx.status === 'success') {
		const user = getUser() || {}
		uni.setStorageSync('gold_user', { ...user, balance: Number(user.balance || 0) + value })
	}
	return tx
}

export function syncRechargeStatus(id) {
	let gained = 0
	const list = getTransactions().map((t) => {
		if (t.id !== id || t.status !== 'pending') return t
		gained += Number(t.amount)
		return { ...t, status: 'success' }
	})
	save(list)
	if (gained) {
		const user = getUser() || {}
		setSession({ ...user, balance: Number(user.balance || 0) + gained })
	}
	return list
}
