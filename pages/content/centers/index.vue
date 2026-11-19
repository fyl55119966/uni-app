<template>
	<view class="page">
		<nav-bar title="全国运营中心" />
		<view class="hero">
			<text class="hero__title">全国运营中心</text>
			<text class="hero__sub">到店自提、回收交货与线下服务</text>
		</view>

		<view class="list">
			<view v-for="item in centers" :key="item.id" class="card">
				<view class="card__head">
					<image class="card__logo" src="/static/images/gold/logo.png" mode="aspectFit" />
					<view class="card__title-box">
						<text class="card__name">{{ item.name }}</text>
						<text class="card__manager">{{ item.manager }}</text>
					</view>
					<view class="card__call" @click="call(item)">打电话</view>
				</view>
				<text class="card__phone">{{ item.phone }}</text>
				<text class="card__addr">{{ item.address }}</text>
			</view>
		</view>

		<view class="tip">以上为 mock 门店信息，上线前替换为真实运营中心。</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getCenters } from '@/api/content.js'

export default {
	components: { navBar },
	data() {
		return { centers: [] }
	},
	async onLoad() {
		this.centers = await getCenters()
	},
	methods: {
		call(item) {
			uni.makePhoneCall({
				phoneNumber: item.phone.replace(/\s/g, ''),
				fail: () => uni.showToast({ title: item.phone, icon: 'none' })
			})
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

.hero {
	display: flex;
	flex-direction: column;
	padding: 36rpx 32rpx;
	background: $gold-gradient;

	&__title {
		font-size: 40rpx;
		font-weight: 700;
		color: #fff;
	}

	&__sub {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.85);
	}
}

.list {
	padding: 24rpx;
}

.card {
	margin-bottom: 20rpx;
	padding: 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__head {
		display: flex;
		align-items: center;
	}

	&__logo {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		background: $gold-100;
	}

	&__title-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 18rpx;
	}

	&__name {
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__manager {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__call {
		padding: 10rpx 24rpx;
		border: 1rpx solid $gold-400;
		border-radius: $gold-radius-pill;
		font-size: 22rpx;
		color: $gold-600;
	}

	&__phone {
		display: block;
		margin-top: 18rpx;
		font-size: 32rpx;
		font-weight: 700;
		color: $gold-600;
	}

	&__addr {
		display: block;
		margin-top: 8rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: $gold-ink-500;
	}
}

.tip {
	padding: 0 32rpx;
	font-size: 20rpx;
	color: $gold-ink-300;
}
</style>
