<template>
	<view class="page">
		<nav-bar title="收银台" />
		<view class="card">
			<text class="card__label">订单号</text>
			<text class="card__no">{{ orderNo }}</text>
			<text class="card__label">本次支付</text>
			<text class="card__amount">¥{{ amount }}</text>
		</view>
		<view class="tip">支付方式与支付结果在票 06 实现；微信内为 mock，H5 走支付宝。</view>
		<view class="btn" @click="back">返回订单</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'

export default {
	components: { navBar },
	data() {
		return { orderNo: '', amount: '0.00' }
	},
	onLoad(query) {
		this.orderNo = query.orderNo || ''
		this.amount = Number(query.amount || 0).toFixed(2)
	},
	methods: {
		back() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: $gold-cream-50;
}

.card {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 40rpx 24rpx 0;
	padding: 48rpx 32rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__label {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: $gold-ink-400;
	}

	&__no {
		font-size: 28rpx;
		color: $gold-ink-900;
	}

	&__amount {
		font-size: 64rpx;
		font-weight: 800;
		color: $gold-600;
	}
}

.tip {
	margin: 24rpx 32rpx;
	font-size: 22rpx;
	line-height: 34rpx;
	color: $gold-ink-300;
}

.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 88rpx;
	margin: 40rpx 24rpx;
	background: $gold-gradient;
	border-radius: $gold-radius-pill;
	font-size: 30rpx;
	font-weight: 600;
	color: #fff;
}
</style>
