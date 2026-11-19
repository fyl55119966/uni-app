import test from 'node:test'
import assert from 'node:assert/strict'
import { login, register, wechatLogin } from '../api/auth.js'

const phone = '13800000000'

test('登录成功返回 token 与会员号', async () => {
  const user = await login({ phone, password: 'abc123', captcha: 'AB12' })
  assert.equal(user.phone, phone)
  assert.match(user.token, /^mock-/)
  assert.equal(user.memberNo, 'M2611073017816310')
})

test('密码错误返回可读错误', async () => {
  await assert.rejects(() => login({ phone, password: 'wrong123', captcha: 'AB12' }), /手机号或密码错误/)
})

test('图形验证码错误返回可读错误', async () => {
  await assert.rejects(() => login({ phone, password: 'abc123', captcha: '0000' }), /图形验证码错误/)
})

test('短信验证码错误拒绝注册', async () => {
  await assert.rejects(
    () => register({ phone, password: 'abc123', smsCode: '111111', inviteCode: '' }),
    /短信验证码错误/
  )
})

test('邀请码选填，填了即绑定', async () => {
  const free = await register({ phone, password: 'abc123', smsCode: '123456' })
  assert.equal(free.inviteBound, false)
  const bound = await register({ phone, password: 'abc123', smsCode: '123456', inviteCode: '3osc7ysw4x5r' })
  assert.equal(bound.inviteCode, '3OSC7YSW4X5R')
  assert.equal(bound.inviteBound, true)
})

test('微信登录必须有 code', async () => {
  await assert.rejects(() => wechatLogin({}), /微信授权失败/)
  const user = await wechatLogin({ code: 'mock-code' })
  assert.equal(user.wechat, true)
})
