export const WITHDRAW_FEE_FIXED = 3
export const WITHDRAW_FEE_RATE = 0.01
export const WITHDRAW_MIN = 0.01
export const WITHDRAW_MAX = 50000
export const WITHDRAW_DAILY_LIMIT = 3

export function round2(value) {
	return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

export function calcWithdrawFee(amount) {
	return round2(WITHDRAW_FEE_FIXED + Number(amount || 0) * WITHDRAW_FEE_RATE)
}

export function calcArrival(amount) {
	return round2(Number(amount || 0) - calcWithdrawFee(amount))
}

export function validateWithdraw({ amount, balance, todayCount = 0 }) {
	const value = Number(amount)
	if (!(value >= WITHDRAW_MIN)) return { ok: false, message: `最低提现 ${WITHDRAW_MIN} 元` }
	if (value > WITHDRAW_MAX) return { ok: false, message: `单笔最高提现 ${WITHDRAW_MAX} 元` }
	if (value > Number(balance)) return { ok: false, message: '超出可用余额' }
	if (todayCount >= WITHDRAW_DAILY_LIMIT) return { ok: false, message: '今日提现次数已用完' }
	if (calcArrival(value) <= 0) return { ok: false, message: '提现金额需大于手续费' }
	return { ok: true, fee: calcWithdrawFee(value), arrival: calcArrival(value) }
}
