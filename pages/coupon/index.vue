<template>
	<view class="page">
		<nav-bar title="优惠券" />

		<view class="tabs">
			<view v-for="tab in tabs" :key="tab.key" class="tabs__item" :class="{ 'is-active': active === tab.key }"
				@click="active = tab.key">{{ tab.label }}</view>
		</view>

		<view v-for="item in list" :key="item.id" class="coupon" :class="{ 'is-off': active !== 'unused' }">
			<view class="coupon__left">
				<view class="coupon__amount">
					<text class="coupon__sign">¥</text>
					<text class="coupon__num">{{ item.amount }}</text>
				</view>
				<text class="coupon__threshold">满 {{ item.threshold }} 元可用</text>
			</view>
			<view class="coupon__divider">
				<view class="coupon__notch is-top" />
				<view class="coupon__line" />
				<view class="coupon__notch is-bottom" />
			</view>
			<view class="coupon__right">
				<text class="coupon__title">{{ item.title }}</text>
				<text class="coupon__scope">{{ item.scope }}</text>
				<text class="coupon__valid">有效期至 {{ item.validUntil }}</text>
			</view>
			<text v-if="active === 'used'" class="coupon__stamp">已使用</text>
			<text v-if="active === 'expired'" class="coupon__stamp">已过期</text>
		</view>

		<g-empty v-if="!list.length" :text="emptyText" desc="下单时可在确认订单页选择可用优惠券" action-text="去逛逛" @action="go" />
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gEmpty from '@/components/g-empty/index.vue'
import { getCoupons } from '@/api/promo.js'

export default {
	components: { navBar, gEmpty },
	data() {
		return {
			active: 'unused',
			list: [],
			tabs: [
				{ key: 'unused', label: '未使用' },
				{ key: 'used', label: '已使用' },
				{ key: 'expired', label: '已过期' }
			]
		}
	},
	computed: {
		emptyText() {
			return { unused: '暂无未使用优惠券', used: '暂无已使用优惠券', expired: '暂无已过期优惠券' }[this.active]
		}
	},
	watch: {
		active: 'load'
	},
	onShow() {
		this.load()
	},
	methods: {
		load() {
			this.list = getCoupons(this.active)
		},
		go() {
			uni.reLaunch({ url: '/pages/coins/index' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: 40rpx;
	background: $gold-cream-50;
}

.tabs {
	display: flex;
	justify-content: space-around;
	background: #fff;

	&__item {
		padding: 22rpx 0;
		font-size: 26rpx;
		color: $gold-ink-500;

		&.is-active {
			color: $gold-600;
			font-weight: 700;
			border-bottom: 4rpx solid $gold-600;
		}
	}
}

.coupon {
	position: relative;
	display: flex;
	height: 190rpx;
	margin: 24rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
	overflow: hidden;

	&.is-off {
		opacity: 0.55;

		.coupon__left {
			background: #C9C4B8;
		}
	}

	&__left {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 220rpx;
		background: $gold-gradient;
		color: #fff;
	}

	&__amount {
		display: flex;
		align-items: baseline;
	}

	&__sign {
		font-size: 26rpx;
	}

	&__num {
		font-size: 64rpx;
		font-weight: 800;
	}

	&__threshold {
		margin-top: 6rpx;
		font-size: 20rpx;
		opacity: 0.9;
	}

	&__divider {
		position: relative;
		width: 2rpx;
		background: $gold-line;
	}

	&__notch {
		position: absolute;
		left: -10rpx;
		width: 20rpx;
		height: 20rpx;
		background: $gold-cream-50;
		border-radius: 50%;

		&.is-top {
			top: -12rpx;
		}

		&.is-bottom {
			bottom: -12rpx;
		}
	}

	&__line {
		position: absolute;
		left: 0;
		top: 16rpx;
		bottom: 16rpx;
		border-left: 2rpx dashed $gold-line;
	}

	&__right {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 24rpx;
	}

	&__title {
		font-size: 28rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__scope {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__valid {
		margin-top: 8rpx;
		font-size: 20rpx;
		color: $gold-ink-300;
	}

	&__stamp {
		position: absolute;
		right: 24rpx;
		bottom: 20rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}
}
</style>
