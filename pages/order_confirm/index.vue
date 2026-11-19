<template>
	<view class="page">
		<nav-bar title="确认订单" />

		<view class="card mode">
			<view class="mode__tabs">
				<view class="mode__tab" :class="{ 'is-active': mode === 'pickup' }" @click="mode = 'pickup'">到店自提</view>
				<view class="mode__tab" :class="{ 'is-active': mode === 'express' }" @click="mode = 'express'">快递物流</view>
			</view>

			<view v-if="mode === 'pickup'" class="picked" @click="pickStore">
				<view class="picked__body">
					<text class="picked__name">{{ store.name }}</text>
					<text class="picked__line">{{ store.address }}</text>
					<text class="picked__line">{{ store.manager }} · {{ store.hours }}</text>
				</view>
				<text class="picked__more">切换 ›</text>
			</view>

			<view v-else-if="address" class="picked" @click="pickAddress">
				<view class="picked__body">
					<text class="picked__name">{{ address.name }} {{ address.phone }}</text>
					<text class="picked__line">{{ address.region }} {{ address.detail }}</text>
				</view>
				<text class="picked__more">切换 ›</text>
			</view>

			<view v-else class="picked picked--empty" @click="pickAddress">
				<text class="picked__empty">请选择收货地址</text>
				<text class="picked__more">去选择 ›</text>
			</view>
		</view>

		<view v-if="detail" class="card goods">
			<image class="goods__img" :src="detail.images[0]" mode="aspectFill" />
			<view class="goods__body">
				<text class="goods__title">{{ detail.title }}</text>
				<text class="goods__spec">{{ gram }}g · 足金9999</text>
				<text class="goods__price">¥{{ totalText }}</text>
			</view>
		</view>

		<view class="card">
			<view class="row" @click="pickCoupon">
				<text class="row__label">优惠券</text>
				<text class="row__value" :class="{ 'is-on': couponAmount > 0 }">
					{{ couponAmount > 0 ? '-¥' + couponAmount.toFixed(2) : '请选择' }}
				</text>
				<text class="row__arrow">›</text>
			</view>
			<view class="row">
				<view class="row__left">
					<text class="row__label">平台补贴</text>
					<text class="row__hint">余额 ¥{{ subsidy.amount.toFixed(2) }}，仅抵定金</text>
				</view>
				<switch :checked="useSubsidy" color="#D9A133" @change="toggleSubsidy" />
			</view>
		</view>

		<view class="card amount">
			<view class="line">
				<text class="line__label">商品款</text>
				<text class="line__value">¥{{ goodsText }}</text>
			</view>
			<view class="line">
				<text class="line__label">工费</text>
				<text class="line__value">¥{{ laborText }}/g × {{ gram }}g</text>
			</view>
			<view class="line">
				<text class="line__label">订单总额</text>
				<text class="line__value">¥{{ totalText }}</text>
			</view>
			<view class="line">
				<text class="line__label">优惠券</text>
				<text class="line__value is-cut">-¥{{ alloc.couponUsed.toFixed(2) }}</text>
			</view>
			<view class="line">
				<text class="line__label">补贴抵扣</text>
				<text class="line__value is-cut">-¥{{ alloc.subsidyUsed.toFixed(2) }}</text>
			</view>
			<view class="line line--strong">
				<text class="line__label">本次支付定金</text>
				<text class="line__value">¥{{ alloc.payNow.toFixed(2) }}</text>
			</view>
			<view class="line">
				<text class="line__label">提货前补尾款</text>
				<text class="line__value">¥{{ alloc.payLater.toFixed(2) }}</text>
			</view>
		</view>

		<view class="rule">
			定金为订单总额 10%，尾款提货前补齐；补贴仅抵定金、不结转不找零；优惠券先抵定金，超出部分结转尾款。
		</view>

		<view class="bar">
			<view class="bar__sum">
				<text class="bar__label">本次支付</text>
				<text class="bar__num">¥{{ alloc.payNow.toFixed(2) }}</text>
			</view>
			<view class="bar__btn" :class="{ 'is-disabled': submitting }" @click="submit">
				{{ submitting ? '提交中…' : '提交订单' }}
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getBar } from '@/api/coins.js'
import { getProduct } from '@/api/shop.js'
import { getCheckout, createOrder } from '@/api/order.js'
import { calcPrice, depositOf } from '@/utils/price.js'
import { allocate } from '@/utils/settle.js'
import { requireLogin } from '@/utils/guard.js'

export default {
	components: { navBar },
	data() {
		return {
			type: 'bar',
			id: '',
			gram: 30,
			detail: null,
			checkout: { stores: [], addresses: [], coupons: [], subsidy: { amount: 0 } },
			mode: 'pickup',
			storeId: 'xian',
			addressId: '',
			couponId: '',
			useSubsidy: true,
			submitting: false
		}
	},
	computed: {
		store() {
			return this.checkout.stores.find((s) => s.id === this.storeId) || this.checkout.stores[0] || {}
		},
		address() {
			return this.checkout.addresses.find((a) => a.id === this.addressId) || null
		},
		subsidy() {
			return this.checkout.subsidy || { amount: 0 }
		},
		coupon() {
			return this.checkout.coupons.find((c) => c.id === this.couponId) || null
		},
		couponAmount() {
			if (!this.coupon || this.total < this.coupon.threshold) return 0
			return this.coupon.amount
		},
		subsidyAmount() {
			return this.useSubsidy ? Number(this.subsidy.amount || 0) : 0
		},
		goods() {
			if (!this.detail) return 0
			return Number(this.detail.gram) > 0 ? this.gram * Number(this.detail.price) : Number(this.detail.price)
		},
		total() {
			if (!this.detail) return 0
			return Number(this.detail.gram) > 0 ? calcPrice(this.gram, this.detail.price, this.detail.labor) : Number(this.detail.price)
		},
		goodsText() {
			return this.goods.toFixed(2)
		},
		laborText() {
			return Number(this.detail ? this.detail.labor : 0).toFixed(2)
		},
		totalText() {
			return this.total.toFixed(2)
		},
		alloc() {
			return allocate(this.total, { coupon: this.couponAmount, subsidy: this.subsidyAmount })
		}
	},
	onLoad(query) {
		if (!requireLogin('/pages/order_confirm/index?' + this.queryString(query))) return
		this.type = query.type || 'bar'
		this.id = query.id || ''
		this.gram = Number(query.gram || 30)
		this.restore()
		this.load()
	},
	methods: {
		queryString(query) {
			return Object.keys(query || {})
				.map((k) => `${k}=${encodeURIComponent(query[k])}`)
				.join('&')
		},
		draftKey() {
			return `gold_checkout_${this.type}_${this.id}_${this.gram}`
		},
		restore() {
			const draft = uni.getStorageSync(this.draftKey())
			if (!draft) return
			this.mode = draft.mode || this.mode
			this.storeId = draft.storeId || this.storeId
			this.addressId = draft.addressId || ''
			this.couponId = draft.couponId || ''
			this.useSubsidy = draft.useSubsidy !== false
		},
		save() {
			uni.setStorageSync(this.draftKey(), {
				mode: this.mode,
				storeId: this.storeId,
				addressId: this.addressId,
				couponId: this.couponId,
				useSubsidy: this.useSubsidy
			})
		},
		async load() {
			this.detail = this.type === 'bar' ? await getBar(this.gram) : await getProduct(this.id)
			this.checkout = await getCheckout()
			if (this.detail && Number(this.detail.gram) > 0) {
				this.gram = Number(String(this.detail.gram).replace('g', '')) || this.gram
			}
			if (!this.storeId) this.storeId = this.checkout.stores[0] ? this.checkout.stores[0].id : ''
			const def = this.checkout.addresses.find((a) => a.isDefault)
			if (!this.addressId && def) this.addressId = def.id
		},
		pickStore() {
			uni.showActionSheet({
				itemList: this.checkout.stores.map((s) => s.name),
				success: ({ tapIndex }) => {
					this.storeId = this.checkout.stores[tapIndex].id
					this.save()
				}
			})
		},
		pickAddress() {
			if (!this.checkout.addresses.length) {
				return uni.showToast({ title: '地址管理在票 13 实现', icon: 'none' })
			}
			uni.showActionSheet({
				itemList: this.checkout.addresses.map((a) => `${a.name} ${a.phone} ${a.detail}`),
				success: ({ tapIndex }) => {
					this.addressId = this.checkout.addresses[tapIndex].id
					this.save()
				}
			})
		},
		pickCoupon() {
			const usable = this.checkout.coupons.filter((c) => this.total >= c.threshold)
			const list = ['不使用优惠券', ...usable.map((c) => `${c.title}`)]
			uni.showActionSheet({
				itemList: list,
				success: ({ tapIndex }) => {
					this.couponId = tapIndex === 0 ? '' : usable[tapIndex - 1].id
					this.save()
				}
			})
		},
		toggleSubsidy(event) {
			this.useSubsidy = event.detail.value
			this.save()
		},
		async submit() {
			if (this.submitting) return
			if (this.mode === 'express' && !this.addressId) {
				return uni.showToast({ title: '请选择收货地址', icon: 'none' })
			}
			if (this.mode === 'pickup' && !this.storeId) {
				return uni.showToast({ title: '请选择自提门店', icon: 'none' })
			}
			this.submitting = true
			try {
				const order = await createOrder({
					type: this.type,
					goodsId: this.detail.id,
					title: this.detail.title,
					image: this.detail.images[0],
					price: this.detail.price,
					labor: this.detail.labor,
					gram: this.gram,
					mode: this.mode,
					storeId: this.mode === 'pickup' ? this.storeId : '',
					addressId: this.mode === 'express' ? this.addressId : '',
					couponId: this.couponId,
					subsidy: this.alloc.subsidyUsed,
					total: this.total,
					deposit: this.alloc.payNow,
					balance: this.alloc.payLater
				})
				this.save()
				uni.navigateTo({
					url: `/pages/cashier/index?orderNo=${order.orderNo}&amount=${this.alloc.payNow.toFixed(2)}`
				})
			} finally {
				this.submitting = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.card {
	margin: 24rpx 24rpx 0;
	padding: 28rpx 32rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
}

.mode {
	padding: 0;

	&__tabs {
		display: flex;
		padding: 18rpx 24rpx;
		border-bottom: 1rpx solid $gold-line;
	}

	&__tab {
		flex: 1;
		padding: 14rpx 0;
		border-radius: $gold-radius-pill;
		font-size: 28rpx;
		text-align: center;
		color: $gold-ink-500;

		&.is-active {
			background: $gold-100;
			color: $gold-600;
			font-weight: 600;
		}
	}
}

.picked {
	display: flex;
	align-items: center;
	padding: 26rpx 32rpx;

	&--empty {
		justify-content: space-between;
	}

	&__body {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	&__name {
		font-size: 30rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__line {
		margin-top: 8rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: $gold-ink-400;
	}

	&__empty {
		font-size: 28rpx;
		color: $gold-ink-400;
	}

	&__more {
		margin-left: 20rpx;
		font-size: 24rpx;
		color: $gold-600;
	}
}

.goods {
	display: flex;

	&__img {
		width: 160rpx;
		height: 160rpx;
		border-radius: $gold-radius;
		background: $gold-cream-200;
	}

	&__body {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 24rpx;
	}

	&__title {
		font-size: 30rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__spec {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: $gold-ink-400;
	}

	&__price {
		margin-top: auto;
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-600;
	}
}

.row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid $gold-line;

	&:last-child {
		border-bottom: 0;
	}

	&__left {
		display: flex;
		flex-direction: column;
	}

	&__label {
		font-size: 28rpx;
		color: $gold-ink-800;
	}

	&__hint {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__value {
		flex: 1;
		text-align: right;
		font-size: 26rpx;
		color: $gold-ink-400;

		&.is-on {
			color: $gold-600;
			font-weight: 600;
		}
	}

	&__arrow {
		margin-left: 10rpx;
		font-size: 30rpx;
		color: $gold-ink-300;
	}
}

.line {
	display: flex;
	justify-content: space-between;
	padding: 12rpx 0;

	&__label {
		font-size: 26rpx;
		color: $gold-ink-500;
	}

	&__value {
		font-size: 26rpx;
		color: $gold-ink-900;

		&.is-cut {
			color: $gold-600;
		}
	}

	&--strong .line__value {
		font-size: 32rpx;
		font-weight: 700;
		color: $gold-600;
	}
}

.rule {
	margin: 24rpx 32rpx 0;
	font-size: 22rpx;
	line-height: 34rpx;
	color: $gold-ink-300;
}

.bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	height: calc(120rpx + env(safe-area-inset-bottom));
	padding: 0 24rpx env(safe-area-inset-bottom);
	background: #fff;
	border-top: 1rpx solid $gold-line;

	&__sum {
		flex: 1;
		display: flex;
		align-items: baseline;
	}

	&__label {
		font-size: 24rpx;
		color: $gold-ink-500;
	}

	&__num {
		margin-left: 10rpx;
		font-size: 40rpx;
		font-weight: 800;
		color: $gold-600;
	}

	&__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 260rpx;
		height: 84rpx;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;

		&.is-disabled {
			opacity: 0.6;
		}
	}
}
</style>
