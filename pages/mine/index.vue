<template>
	<view class="page">
		<view class="head">
			<text class="head__title">我的</text>
			<text class="head__desc">会员号 M2611073017816310</text>
		</view>
		<view class="card">
			<text class="card__tag">B1</text>
			<text class="card__title">按截图 398 / 385 / 338 / 371 实现</text>
			<text class="card__desc">订单、回收、余额、卡券、实名入口在 B1 接入。</text>
		</view>
		<page-footer active="mine" />
	</view>
</template>

<script>
import pageFooter from '@/components/page-footer/index.vue'

export default {
	components: { pageFooter }
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding: calc(20rpx + var(--status-bar-height)) $gold-page-pad 180rpx;
	background: $gold-cream-50;
}

.head {
	&__title {
		font-size: 40rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__desc {
		display: block;
		margin-top: 8rpx;
		font-size: 24rpx;
		color: $gold-ink-400;
	}
}

.card {
	display: flex;
	flex-direction: column;
	margin-top: 28rpx;
	padding: 32rpx;
	background: $gold-white;
	border: 1rpx solid $gold-line;
	border-radius: $gold-radius-lg;

	&__tag {
		width: 64rpx;
		padding: 4rpx 0;
		background: $gold-100;
		border-radius: $gold-radius-pill;
		font-size: 20rpx;
		text-align: center;
		color: $gold-600;
	}

	&__title {
		margin-top: 16rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: $gold-ink-800;
	}

	&__desc {
		margin-top: 10rpx;
		font-size: 24rpx;
		line-height: 36rpx;
		color: $gold-ink-500;
	}
}
</style>
