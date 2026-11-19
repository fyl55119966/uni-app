<template>
	<view class="page">
		<nav-bar title="新手教程" />

		<view class="contact" @click="service">
			<image class="contact__img" src="/static/images/gold/kf.png" mode="aspectFit" />
			<view class="contact__body">
				<text class="contact__title">联系客服</text>
				<text class="contact__desc">工作日 9:00–21:00，真人客服在线</text>
			</view>
			<text class="contact__arrow">›</text>
		</view>

		<view class="list">
			<view v-for="item in guides" :key="item.id" class="guide" @click="open(item)">
				<text class="guide__title">{{ item.title }}</text>
				<view class="guide__meta">
					<text class="guide__source">{{ item.source }}</text>
					<text class="guide__reads">{{ item.reads }}阅读</text>
				</view>
				<text class="guide__arrow">›</text>
			</view>
		</view>

		<text class="more" @click="wiki">查看黄金百科 ›</text>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getGuides } from '@/api/content.js'

export default {
	components: { navBar },
	data() {
		return { guides: [] }
	},
	async onLoad() {
		this.guides = await getGuides()
	},
	methods: {
		open(item) {
			uni.navigateTo({ url: `/pages/content/guide-detail/index?id=${item.id}` })
		},
		service() {
			uni.navigateTo({ url: '/pages/service/index' })
		},
		wiki() {
			uni.navigateTo({ url: '/pages/content/wiki/index' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: 60rpx;
	background: $gold-cream-50;
}

.contact {
	display: flex;
	align-items: center;
	margin: 24rpx;
	padding: 28rpx;
	background: $gold-gradient;
	border-radius: $gold-radius-lg;

	&__img {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.9);
	}

	&__body {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 18rpx;
	}

	&__title {
		font-size: 30rpx;
		font-weight: 700;
		color: #fff;
	}

	&__desc {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.85);
	}

	&__arrow {
		font-size: 34rpx;
		color: rgba(255, 255, 255, 0.8);
	}
}

.list {
	margin: 0 24rpx;
	padding: 0 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
}

.guide {
	position: relative;
	padding: 28rpx 0;
	border-bottom: 1rpx solid $gold-line;

	&:last-child {
		border-bottom: 0;
	}

	&__title {
		font-size: 30rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__meta {
		display: flex;
		margin-top: 10rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__source {
		margin-right: 18rpx;
	}

	&__arrow {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		font-size: 32rpx;
		color: $gold-ink-300;
	}
}

.more {
	display: block;
	margin-top: 30rpx;
	font-size: 24rpx;
	color: $gold-600;
	text-align: center;
}
</style>
