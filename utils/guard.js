import { getToken } from './token.js'

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
