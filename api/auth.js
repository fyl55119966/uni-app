import { withMock, ApiError } from './request.js'
import { clearSession } from '../utils/token.js'

const wait = (ms = 320) => new Promise((resolve) => setTimeout(resolve, ms))

function makeUser(phone, extra = {}) {
	return {
		token: 'mock-' + Date.now(),
		phone,
		nickname: '用户3002',
		memberNo: 'M2611073017816310',
		avatar: '/static/images/gold/avatar.png',
		...extra
	}
}

// 测试环境的固定失败口令：wrong123 → 密码错；图形验证码 0000 → 验证码错。
export function login(payload) {
	return withMock(async () => {
		await wait()
		if (payload.password === 'wrong123') throw new ApiError('手机号或密码错误', 10001)
		if (payload.captcha && String(payload.captcha).toUpperCase() === '0000') {
			throw new ApiError('图形验证码错误', 10002)
		}
		return makeUser(payload.phone)
	}, { url: '/auth/login', method: 'POST', data: payload })
}

export function register(payload) {
	return withMock(async () => {
		await wait()
		if (String(payload.smsCode) !== '123456') throw new ApiError('短信验证码错误', 10003)
		const inviteCode = String(payload.inviteCode || '').trim().toUpperCase()
		return makeUser(payload.phone, { inviteCode, inviteBound: Boolean(inviteCode) })
	}, { url: '/auth/register', method: 'POST', data: payload })
}

export function wechatLogin(payload = {}) {
	return withMock(async () => {
		await wait()
		if (!payload.code) throw new ApiError('微信授权失败', 10004)
		return makeUser('13800000000', { wechat: true, needBindPhone: false })
	}, { url: '/auth/wechat', method: 'POST', data: payload })
}

export function logout() {
	clearSession()
}
