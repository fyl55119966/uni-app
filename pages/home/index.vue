<template>
	<view class="page">
		<view class="top">
			<view class="top__brand">
				<text class="top__name">上金所有金店</text>
				<text class="top__en">Shangjin Gold Stores</text>
			</view>
			<view class="top__chip">
				<text class="top__chip-num">¥{{ priceText }}</text>
				<text class="top__chip-unit">/g</text>
			</view>
		</view>

		<view class="hero">
			<text class="hero__label">今日金价</text>
			<view class="hero__price">
				<text class="hero__num">{{ priceText }}</text>
				<text class="hero__unit">元/克</text>
			</view>
			<view class="hero__meta">
				<text class="hero__status" :class="{ 'is-closed': !trading }">{{ trading ? '交易中' : closedTip }}</text>
				<text class="hero__time">周一至周日 09:30–23:30</text>
			</view>
		</view>

		<view class="grid">
			<view v-for="item in navs" :key="item.key" class="grid__item" @click="go(item)">
				<view class="grid__icon">
					<image class="grid__img" :src="item.icon" mode="aspectFit" />
				</view>
				<text class="grid__text">{{ item.title }}</text>
			</view>
		</view>

		<view class="note">
			<text class="note__title">B0 外壳</text>
			<text class="note__desc">4 个 tab 与金价已通；首页内容在 B1 按截图 329/330/331 逐块实现。</text>
		</view>

		<page-footer active="home" />
	</view>
</template>

<script>
import { getGoldSnapshot } from '@/api/gold.js'
import pageFooter from '@/components/page-footer/index.vue'

export default {
	components: { pageFooter },
	data() {
		return {
			price: 861.42,
			trading: true,
			closedTip: '现在休市中',
			navs: []
		}
	},
	computed: {
		priceText() {
			return Number(this.price).toFixed(2)
		}
	},
	onShow() {
		this.load()
	},
	methods: {
		async load() {
			const data = await getGoldSnapshot()
			this.price = data.price
			this.trading = data.trading
			this.closedTip = data.closedTip
			this.navs = data.navs
		},
		go(item) {
			if (item.url.indexOf('/sub/') === 0) {
				uni.showToast({ title: '该页面在后续批次实现', icon: 'none' })
				return
			}
			uni.reLaunch({ url: item.url })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: 180rpx;
	background: $gold-cream-50;
}

.top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: calc(20rpx + var(--status-bar-height)) $gold-page-pad 20rpx;

	&__brand {
		display: flex;
		flex-direction: column;
	}

	&__name {
		font-size: 34rpx;
		font-weight: 700;
		letter-spacing: 2rpx;
		color: $gold-ink-900;
	}

	&__en {
		font-size: 20rpx;
		letter-spacing: 1rpx;
		color: $gold-ink-300;
	}

	&__chip {
		display: flex;
		align-items: baseline;
		padding: 10rpx 20rpx;
		background: $gold-100;
		border: 2rpx solid $gold-200;
		border-radius: $gold-radius-pill;
	}

	&__chip-num {
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-600;
	}

	&__chip-unit {
		margin-left: 2rpx;
		font-size: 20rpx;
		color: $gold-600;
	}
}

.hero {
	margin: 10rpx $gold-page-pad 0;
	padding: 36rpx;
	border-radius: $gold-radius-lg;
	background: $gold-gradient;
	box-shadow: 0 12rpx 32rpx rgba(217, 161, 51, 0.28);

	&__label {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.86);
	}

	&__price {
		display: flex;
		align-items: baseline;
		margin: 8rpx 0 16rpx;
	}

	&__num {
		font-size: 76rpx;
		font-weight: 700;
		letter-spacing: 2rpx;
		color: #fff;
	}

	&__unit {
		margin-left: 8rpx;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.9);
	}

	&__meta {
		display: flex;
		align-items: center;
	}

	&__status {
		padding: 4rpx 16rpx;
		border-radius: $gold-radius-pill;
		background: rgba(255, 255, 255, 0.24);
		font-size: 22rpx;
		color: #fff;

		&.is-closed {
			background: rgba(0, 0, 0, 0.18);
		}
	}

	&__time {
		margin-left: 16rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.86);
	}
}

.grid {
	display: flex;
	justify-content: space-between;
	margin: 28rpx $gold-page-pad 0;
	padding: 28rpx 20rpx;
	background: $gold-white;
	border: 1rpx solid $gold-line;
	border-radius: $gold-radius-lg;

	&__item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 76rpx;
		height: 76rpx;
		margin-bottom: 10rpx;
		background: $gold-100;
		border: 2rpx solid $gold-200;
		border-radius: 50%;
	}

	&__img {
		width: 44rpx;
		height: 44rpx;
	}

	&__text {
		font-size: 22rpx;
		color: $gold-ink-800;
	}
}

.note {
	display: flex;
	flex-direction: column;
	margin: 28rpx $gold-page-pad 0;
	padding: 28rpx;
	background: $gold-cream-100;
	border: 1rpx solid $gold-line;
	border-radius: $gold-radius-lg;

	&__title {
		font-size: 26rpx;
		font-weight: 600;
		color: $gold-600;
	}

	&__desc {
		margin-top: 8rpx;
		font-size: 24rpx;
		line-height: 36rpx;
		color: $gold-ink-500;
	}
}
</style>
