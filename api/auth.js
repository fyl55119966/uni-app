import { withMock } from './request.js'
import { clearSession } from '@/utils/token.js'

const wait = (ms = 320) => new Promise((resolve) => setTimeout(resolve, ms))

function makeUser(phone) {
	return {
		token: 'mock-' + Date.now(),
		phone,
		nickname: '用户3002',
		memberNo: 'M2611073017816310',
		avatar: '/static/images/gold/avatar.png'
	}
}

export function login(payload) {
	return withMock(async () => {
		await wait()
		// 测试环境：任意合法手机号 + 6 位以上密码都通过
		return makeUser(payload.phone)
	}, { url: '/auth/login', method: 'POST', data: payload })
}

export function register(payload) {
	return withMock(async () => {
		await wait()
		return { ...makeUser(payload.phone), inviteCode: payload.inviteCode || '' }
	}, { url: '/auth/register', method: 'POST', data: payload })
}

export function logout() {
	clearSession()
}
