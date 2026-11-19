import test from 'node:test'
import assert from 'node:assert/strict'
import { calcWithdrawFee, calcArrival, validateWithdraw } from '../utils/withdraw.js'

test('服务费 = 3 + 1%', () => {
	assert.equal(calcWithdrawFee(50), 3.5)
	assert.equal(calcWithdrawFee(1000), 13)
})

test('到账金额 = 金额 - 服务费', () => {
	assert.equal(calcArrival(50), 46.5)
	assert.equal(calcArrival(1000), 987)
})

test('最低 0.01、最高 50000、余额与次数', () => {
	assert.equal(validateWithdraw({ amount: 0, balance: 100 }).ok, false)
	assert.equal(validateWithdraw({ amount: 60000, balance: 100000 }).ok, false)
	assert.equal(validateWithdraw({ amount: 100, balance: 50 }).ok, false)
	assert.equal(validateWithdraw({ amount: 100, balance: 100, todayCount: 3 }).ok, false)
	assert.equal(validateWithdraw({ amount: 1, balance: 100 }).ok, false)
})

test('合法金额返回 fee/arrival', () => {
	const result = validateWithdraw({ amount: 100, balance: 500, todayCount: 1 })
	assert.equal(result.ok, true)
	assert.equal(result.fee, 4)
	assert.equal(result.arrival, 96)
})
