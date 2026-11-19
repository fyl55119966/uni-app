import test from 'node:test'
import assert from 'node:assert/strict'
import { nextOrderStatus, payMethods, ORDER_STATUS } from '../utils/orderState.js'

const order = { orderNo: 'G1', status: ORDER_STATUS.PENDING_DEPOSIT, deposit: 1551.06, balance: 13959.5 }

test('定金支付成功 → 待提货', () => {
	const next = nextOrderStatus(order, { type: 'PAY_DEPOSIT_SUCCESS' })
	assert.equal(next.status, ORDER_STATUS.PENDING_PICKUP)
	assert.equal(next.depositPaid, true)
})

test('尾款支付成功 → 已完成', () => {
	const next = nextOrderStatus({ ...order, status: ORDER_STATUS.PENDING_PICKUP }, { type: 'PAY_BALANCE_SUCCESS' })
	assert.equal(next.status, ORDER_STATUS.PAID)
	assert.equal(next.balancePaid, true)
})

test('支付失败保留原状态并记错误', () => {
	const next = nextOrderStatus(order, { type: 'PAY_FAIL', message: '余额不足' })
	assert.equal(next.status, ORDER_STATUS.PENDING_DEPOSIT)
	assert.equal(next.lastPayError, '余额不足')
})

test('支付超时记文案，状态不变', () => {
	const next = nextOrderStatus(order, { type: 'PAY_TIMEOUT' })
	assert.equal(next.status, ORDER_STATUS.PENDING_DEPOSIT)
	assert.equal(next.lastPayError, '支付超时，请重新支付')
})

test('取消订单 → 已取消', () => {
	assert.equal(nextOrderStatus(order, { type: 'CANCEL' }).status, ORDER_STATUS.CANCELLED)
})

test('微信内只给 mock 微信支付，不出现支付宝', () => {
	const list = payMethods({ amount: 1000, weixin: true })
	assert.deepEqual(list.map((m) => m.key), ['wechat'])
	assert.equal(list[0].mock, true)
})

test('H5 小额：支付宝 + 余额', () => {
	const list = payMethods({ amount: 15510.56, balance: 20000, weixin: false })
	assert.deepEqual(list.map((m) => m.key), ['alipay', 'balance'])
})

test('H5 超 5 万：只给大额转账', () => {
	const list = payMethods({ amount: 60000, balance: 0, weixin: false })
	assert.deepEqual(list.map((m) => m.key), ['transfer'])
})

test('H5 超 5 万但有余额：余额 + 大额转账', () => {
	const list = payMethods({ amount: 60000, balance: 70000, weixin: false })
	assert.deepEqual(list.map((m) => m.key), ['balance', 'transfer'])
})
