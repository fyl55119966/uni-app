import test from 'node:test'
import assert from 'node:assert/strict'
import { recycleQuote } from '../utils/recycle.js'

test('回收价 = 金价 - 0.5', () => {
  assert.equal(recycleQuote(10, 1, 861.42).price, 860.92)
})

test('结算总额 = 回收价 × 克重 × 数量', () => {
  assert.equal(recycleQuote(10, 2, 861.42).total, 17218.4)
})

test('保证金 = 结算总额 × 10%', () => {
  assert.equal(recycleQuote(10, 2, 861.42).deposit, 1721.84)
})

test('克重变化金额跟着变', () => {
  assert.notEqual(recycleQuote(10, 1).total, recycleQuote(20, 1).total)
})
