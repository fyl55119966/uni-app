import { round2, depositOf } from './price.js'

/**
 * 券先抵定金，超出部分结转尾款；补贴只抵定金，不结转、不找零；
 * 券 + 补贴合计不超过订单总额。
 */
export function allocate(total, { coupon = 0, subsidy = 0 } = {}) {
	const orderTotal = round2(total)
	const deposit = depositOf(orderTotal)
	let balance = round2(orderTotal - deposit)

	const couponUsed = Math.min(round2(coupon), orderTotal)
	const remainingAfterCoupon = round2(orderTotal - couponUsed)
	const subsidyUsed = Math.min(round2(subsidy), remainingAfterCoupon)

	const couponToDeposit = Math.min(couponUsed, deposit)
	const couponToBalance = round2(couponUsed - couponToDeposit)

	let payNow = round2(deposit - couponToDeposit)
	const subsidyToDeposit = Math.min(subsidyUsed, payNow)
	payNow = round2(payNow - subsidyToDeposit)

	balance = round2(balance - couponToBalance)

	return {
		total: orderTotal,
		deposit,
		balance,
		couponUsed,
		subsidyUsed,
		subsidyWasted: round2(subsidyUsed - subsidyToDeposit),
		payNow,
		payLater: balance,
		discount: round2(couponUsed + subsidyToDeposit)
	}
}
