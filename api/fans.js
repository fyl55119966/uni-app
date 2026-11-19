import { withMock } from './request.js'
import { getUser } from '../utils/token.js'

const KEY = 'gold_fans'

function readFans() {
	let raw = uni.getStorageSync(KEY)
	if (typeof raw === 'string') {
		try {
			raw = JSON.parse(raw)
		} catch {
			raw = null
		}
	}
	if (raw && Array.isArray(raw.data)) return raw.data
	return Array.isArray(raw) ? raw : []
}

export function inviteCode() {
	const user = getUser() || {}
	return user.inviteCode || '3OSC7YSW4X5R'
}

export const getFans = () =>
	withMock(async () => {
		const list = readFans().map((item) => ({ level: 1, ...item }))
		const sum = (key) => list.reduce((total, item) => total + Number(item[key] || 0), 0)
		return {
			list,
			summary: {
				realname: list.filter((item) => item.realname).length,
				total: list.length,
				earning: sum('earning'),
				consumed: sum('consumed'),
				recharge: sum('recharge')
			},
			code: inviteCode()
		}
	})
