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

export async function login({ phone }) {
	await wait()
	// 测试环境：任意合法手机号 + 6 位以上密码都通过
	return makeUser(phone)
}

export async function register({ phone, inviteCode }) {
	await wait()
	return { ...makeUser(phone), inviteCode: inviteCode || '' }
}
