<template>
	<view class="page">
		<nav-bar title="平台补贴" />

		<view class="hero">
			<text class="hero__label">剩余可抵扣补贴</text>
			<view class="hero__amount">
				<text class="hero__sign">¥</text>
				<text class="hero__num">{{ money(subsidy.amount - subsidy.used) }}</text>
			</view>
			<text class="hero__status">{{ subsidy.status }}</text>
		</view>

		<view class="stats">
			<view class="stats__item">
				<text class="stats__label">已发放</text>
				<text class="stats__value">¥{{ money(subsidy.amount) }}</text>
			</view>
			<view class="stats__split" />
			<view class="stats__item">
				<text class="stats__label">已抵扣</text>
				<text class="stats__value">¥{{ money(subsidy.used) }}</text>
			</view>
		</view>

		<view class="rules">
			<text class="rules__title">使用规则</text>
			<view v-for="(rule, i) in subsidy.rules" :key="i" class="rules__item">
				<text class="rules__index">{{ i + 1 }}</text>
				<text class="rules__text">{{ rule }}</text>
			</view>
			<text class="rules__expire">有效期至 {{ subsidy.expireAt }}，过期作废</text>
		</view>

		<view class="bar">
			<view class="bar__btn" @click="use">去使用</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getSubsidy } from '@/api/promo.js'

export default {
	components: { navBar },
	data() {
		return { subsidy: { amount: 0, used: 0, status: '', expireAt: '', rules: [] } }
	},
	onShow() {
		this.subsidy = getSubsidy()
	},
	methods: {
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		use() {
			uni.reLaunch({ url: '/pages/coins/index' })
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

.hero {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 24rpx;
	padding: 44rpx 32rpx;
	background: $gold-gradient;
	border-radius: $gold-radius-lg;

	&__label {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.85);
	}

	&__amount {
		display: flex;
		align-items: baseline;
		margin-top: 10rpx;
		color: #fff;
	}

	&__sign {
		font-size: 32rpx;
	}

	&__num {
		font-size: 76rpx;
		font-weight: 800;
	}

	&__status {
		margin-top: 10rpx;
		padding: 4rpx 18rpx;
		background: rgba(255, 255, 255, 0.22);
		border-radius: $gold-radius-pill;
		font-size: 22rpx;
		color: #fff;
	}
}

.stats {
	display: flex;
	align-items: center;
	margin: 0 24rpx;
	padding: 28rpx 0;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	&__label {
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__value {
		margin-top: 8rpx;
		font-size: 32rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__split {
		width: 1rpx;
		height: 56rpx;
		background: $gold-line;
	}
}

.rules {
	margin: 24rpx;
	padding: 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__title {
		font-size: 28rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__item {
		display: flex;
		margin-top: 18rpx;
	}

	&__index {
		flex-shrink: 0;
		width: 32rpx;
		height: 32rpx;
		margin-right: 12rpx;
		border-radius: 50%;
		background: $gold-100;
		font-size: 20rpx;
		line-height: 32rpx;
		text-align: center;
		color: $gold-600;
	}

	&__text {
		flex: 1;
		font-size: 22rpx;
		line-height: 36rpx;
		color: $gold-ink-500;
	}

	&__expire {
		display: block;
		margin-top: 20rpx;
		font-size: 20rpx;
		color: $gold-ink-300;
	}
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

	&__btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 84rpx;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;
	}
}
</style>
