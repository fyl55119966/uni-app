import { ApiError } from './request.js'
import { getUser, setSession, getToken } from '../utils/token.js'

function ensureLogin() {
  if (!getToken()) throw new ApiError(401, '请先登录')
}

export async function getProfile() {
  ensureLogin()
  const user = getUser() || {}
  return {
    user: {
      name: user.name || '用户3002',
      avatar: user.avatar || '/static/images/gold/avatar.png',
      phone: user.phone || '180****3002',
      gender: user.gender || '保密',
      email: user.email || '',
      memberNo: user.memberNo || 'M2611073017816310',
      registerAt: user.registerAt || '2026-11-07 13:01:46',
      realname: !!user.realname,
      realnameType: user.realnameType || '',
      company: user.company || ''
    }
  }
}

export async function updateProfile(patch) {
  ensureLogin()
  const user = getUser() || {}
  const next = { ...user, ...patch }
  setSession(next)
  return { user: next, updatedAt: Date.now() }
}

export async function submitRealname(payload) {
  ensureLogin()
  if (payload.type === 'personal') {
    if (!payload.realName || payload.realName.length < 2) throw new ApiError(21001, '请输入真实姓名')
    if (!/^\d{17}[\dXx]$/.test(payload.idNo || '')) throw new ApiError(21002, '请输入正确的 18 位身份证号')
  } else {
    if (!payload.company) throw new ApiError(21003, '请输入企业名称')
    if (!payload.creditCode) throw new ApiError(21004, '请输入统一社会信用代码')
    if (!payload.legalName) throw new ApiError(21005, '请输入法人姓名')
    if (!/^1\d{10}$/.test(payload.legalPhone || '')) throw new ApiError(21006, '请输入正确的法人手机号')
    if (!/^\d{17}[\dXx]$/.test(payload.legalIdNo || '')) throw new ApiError(21007, '请输入正确的法人身份证号')
  }
  return { status: 'approved', approvedAt: Date.now() }
}
