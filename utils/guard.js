import { getToken, getUser } from './token.js'
import { isTradingNow } from './price.js'

export function isLoggedIn() {
	return Boolean(getToken())
}

// 未登录直接 reLaunch 登录页，并把当前页作为登录后的回跳地址。
export function requireLogin(redirect = '/pages/home/index') {
	if (isLoggedIn()) return true
	const query = redirect ? `?redirect=${redirect}` : ''
	uni.reLaunch({ url: `/pages/login/index${query}` })
	return false
}

export function hasRealname() {
	const user = getUser()
	return Boolean(user && user.realname)
}

export function canBuyNow(now = new Date()) {
	if (uni.getStorageSync('gold_force_trading')) return true
	return isTradingNow(now)
}
