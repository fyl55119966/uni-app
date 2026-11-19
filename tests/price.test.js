import test from 'node:test'
import assert from 'node:assert/strict'
import { calcPrice, depositOf, recyclePrice, isTradingNow } from '../utils/price.js'

test('calcPrice 16g x (869.41 + 100) = 15510.56', () => {
  assert.equal(calcPrice(16, 869.41, 100), 15510.56)
})

test('deposit is 10% of total, rounded to cents', () => {
  assert.equal(depositOf(15510.56), 1551.06)
})

test('recycle price is gold price - 0.5', () => {
  assert.equal(recyclePrice(861.42), 860.92)
})

test('trading window 09:30-23:30 every day', () => {
  assert.equal(isTradingNow(new Date(2026, 10, 19, 10, 0)), true)
  assert.equal(isTradingNow(new Date(2026, 10, 19, 23, 30)), true)
  assert.equal(isTradingNow(new Date(2026, 10, 19, 9, 29)), false)
  assert.equal(isTradingNow(new Date(2026, 10, 19, 23, 31)), false)
  assert.equal(isTradingNow(new Date(2026, 10, 22, 12, 0)), true)
})
