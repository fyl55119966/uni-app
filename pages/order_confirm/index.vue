<template>
	<view class="page">
		<nav-bar title="确认订单" />

		<view v-if="detail" class="card goods">
			<image class="goods__img" :src="detail.images[0]" mode="aspectFill" />
			<view class="goods__body">
				<text class="goods__title">{{ detail.title }}</text>
				<text class="goods__spec">{{ gram }}g · {{ detail.type === 'bar' ? '投资金条' : '黄金饰品' }}</text>
				<text class="goods__price">¥{{ totalText }}</text>
			</view>
		</view>

		<view v-if="detail" class="card">
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
			<view class="line line--pay">
				<text class="line__label">本次支付定金（10%）</text>
				<text class="line__value">¥{{ depositText }}</text>
			</view>
		</view>

		<view class="tip">收货地址、优惠券、发票与提交订单在票 05 实现。</view>

		<view class="bar">
			<view class="bar__sum">
				<text class="bar__label">应付定金</text>
				<text class="bar__num">¥{{ depositText }}</text>
			</view>
			<view class="bar__btn" @click="submit">提交订单</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getBar } from '@/api/coins.js'
import { getProduct } from '@/api/shop.js'
import { calcPrice, depositOf } from '@/utils/price.js'

export default {
	components: { navBar },
	data() {
		return { type: 'bar', id: '', gram: 30, detail: null }
	},
	computed: {
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
		depositText() {
			return depositOf(this.total).toFixed(2)
		}
	},
	onLoad(query) {
		this.type = query.type || 'bar'
		this.id = query.id || ''
		this.gram = Number(query.gram || 30)
		this.load()
	},
	methods: {
		async load() {
			this.detail = this.type === 'bar' ? await getBar(this.gram) : await getProduct(this.id)
			if (this.detail && Number(this.detail.gram) > 0) this.gram = Number(String(this.detail.gram).replace('g', '')) || this.gram
		},
		submit() {
			uni.showToast({ title: '提交订单在票 05 实现', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.card {
	margin: 24rpx 24rpx 0;
	padding: 28rpx 32rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
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
	}

	&--pay .line__value {
		color: $gold-600;
		font-weight: 700;
	}
}

.tip {
	margin: 24rpx 32rpx;
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
	}
}
</style>
