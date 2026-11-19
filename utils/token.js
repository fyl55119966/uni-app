import { TOKEN_KEY, USER_KEY } from '../api/config.js'

export function getToken() {
	return uni.getStorageSync(TOKEN_KEY) || ''
}

export function setSession(user) {
	if (user && user.token) uni.setStorageSync(TOKEN_KEY, user.token)
	if (user) uni.setStorageSync(USER_KEY, user)
}

export function clearSession() {
	uni.removeStorageSync(TOKEN_KEY)
	uni.removeStorageSync(USER_KEY)
}
