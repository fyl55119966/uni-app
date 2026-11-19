import { BASE_URL, USE_MOCK } from './config.js'
import { clearSession, getToken } from '../utils/token.js'

const AUTH_CODES = [110002, 110003, 110004]
let redirecting = false

export class ApiError extends Error {
	constructor(message, code) {
		super(message)
		this.name = 'ApiError'
		this.code = code
	}
}

function toLogin() {
	if (redirecting) return
	redirecting = true
	clearSession()
	const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : []
	const current = pages[pages.length - 1]
	const route = current ? current.route : ''
	if (route !== 'pages/login/index') {
		uni.reLaunch({ url: '/pages/login/index' })
	}
	setTimeout(() => {
		redirecting = false
	}, 800)
}

export function request(options) {
	const { url, method = 'GET', data = {}, header = {}, timeout = 15000 } = options
	return new Promise((resolve, reject) => {
		if (!BASE_URL) {
			reject(new ApiError('BASE_URL 未配置，联调前请先设置 api/config.js'))
			return
		}
		const token = getToken()
		uni.request({
			url: BASE_URL.replace(/\/$/, '') + url,
			method,
			data,
			timeout,
			header: {
				'Content-Type': 'application/json',
				...(token ? { 'Authori-zation': `Bearer ${token}` } : {}),
				...header
			},
			success(res) {
				const body = res.data || {}
				const code = body.status
				if (res.statusCode === 401 || AUTH_CODES.includes(code)) {
					toLogin()
					reject(new ApiError(body.msg || '登录已失效，请重新登录', code))
					return
				}
				if (res.statusCode >= 200 && res.statusCode < 300 && (code === 200 || code === undefined)) {
					resolve(body.data !== undefined ? body.data : body)
					return
				}
				reject(new ApiError(body.msg || `请求失败（${res.statusCode}）`, code))
			},
			fail(err) {
				reject(new ApiError(err.errMsg || '网络异常', -1))
			}
		})
	})
}

// 唯一的 mock/真实切换点：USE_MOCK=true 只执行 mock 工厂，不发请求。
export async function withMock(mockFactory, options) {
	if (USE_MOCK) return mockFactory()
	return request(options)
}
