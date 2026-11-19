import { ApiError } from './request.js'
import { getToken, clearSession } from '../utils/token.js'

const SMS_CODE = '123456'

function ensureLogin() {
  if (!getToken()) throw new ApiError(401, '请先登录')
}

export async function resetPassword({ phone, code, password }) {
  ensureLogin()
  if (code !== SMS_CODE) throw new ApiError(20001, '短信验证码错误')
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/.test(password)) {
    throw new ApiError(20002, '密码需 6-16 位且包含字母和数字')
  }
  return { phone, updatedAt: Date.now() }
}

export async function setPayPassword({ code, password }) {
  ensureLogin()
  if (code !== SMS_CODE) throw new ApiError(20001, '短信验证码错误')
  if (!/^\d{6}$/.test(password)) throw new ApiError(20003, '支付密码必须为 6 位数字')
  uni.setStorageSync('gold_pay_pwd', password)
  return { updatedAt: Date.now() }
}

export async function cancelAccount({ code, reason, agreed }) {
  ensureLogin()
  if (!agreed) throw new ApiError(20004, '请先阅读并同意注销须知')
  if (code !== SMS_CODE) throw new ApiError(20001, '短信验证码错误')
  clearSession()
  return { cancelAt: Date.now(), reason: reason || '' }
}
