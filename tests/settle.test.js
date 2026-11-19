import test from 'node:test'
import assert from 'node:assert/strict'
import { allocate } from '../utils/settle.js'

test('无券无补贴：定金 10%，尾款 90%', () => {
	const r = allocate(15510.56)
	assert.equal(r.deposit, 1551.06)
	assert.equal(r.payNow, 1551.06)
	assert.equal(r.payLater, 13959.5)
})

test('券先抵定金，超出部分结转尾款', () => {
	const r = allocate(15510.56, { coupon: 2000 })
	assert.equal(r.couponUsed, 2000)
	assert.equal(r.payNow, 0)
	assert.equal(r.payLater, 13510.56)
	assert.equal(r.discount, 2000)
})

test('补贴只抵定金，不结转不找零', () => {
	const r = allocate(15510.56, { subsidy: 5000 })
	assert.equal(r.subsidyUsed, 5000)
	assert.equal(r.subsidyWasted, 3448.94)
	assert.equal(r.payNow, 0)
	assert.equal(r.payLater, 13959.5)
	assert.equal(r.discount, 1551.06)
})

test('券 + 补贴合计不超总额，且都先抵定金', () => {
	const r = allocate(15510.56, { coupon: 500, subsidy: 1000 })
	assert.equal(r.couponUsed, 500)
	assert.equal(r.subsidyUsed, 1000)
	assert.equal(r.payNow, 51.06)
	assert.equal(r.payLater, 13959.5)
	assert.equal(r.discount, 1500)
})

test('券 + 补贴超过总额时按总额封顶', () => {
	const r = allocate(100, { coupon: 80, subsidy: 80 })
	assert.equal(r.couponUsed, 80)
	assert.equal(r.subsidyUsed, 20)
	assert.equal(r.payNow, 0)
	assert.equal(r.payLater, 20)
	assert.equal(r.discount, 80)
})
