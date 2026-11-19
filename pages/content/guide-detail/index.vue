<template>
	<view class="page">
		<nav-bar title="教程详情" />

		<view v-if="guide" class="head">
			<text class="head__title">{{ guide.title }}</text>
			<view class="head__meta">
				<text class="head__source">{{ guide.source }}</text>
				<text class="head__reads">{{ guide.reads }}阅读</text>
			</view>
		</view>

		<view v-if="guide" class="content">
			<rich-text class="content__body" :nodes="guide.content" />
		</view>

		<view class="contact" @click="service">
			<text class="contact__text">还有问题？联系在线客服</text>
			<text class="contact__arrow">›</text>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getGuide } from '@/api/content.js'

export default {
	components: { navBar },
	data() {
		return { guide: null }
	},
	async onLoad(query) {
		this.guide = await getGuide(query.id || '')
	},
	methods: {
		service() {
			uni.navigateTo({ url: '/pages/service/index' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: 60rpx;
	background: #fff;
}

.head {
	padding: 32rpx 32rpx 0;

	&__title {
		font-size: 40rpx;
		font-weight: 700;
		line-height: 56rpx;
		color: $gold-ink-900;
	}

	&__meta {
		display: flex;
		margin-top: 16rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__source {
		margin-right: 18rpx;
		color: $gold-600;
	}
}

.content {
	padding: 24rpx 32rpx 0;

	&__body {
		font-size: 28rpx;
		line-height: 50rpx;
		color: $gold-ink-800;
	}
}

.contact {
	display: flex;
	align-items: center;
	margin: 40rpx 24rpx 0;
	padding: 28rpx;
	background: $gold-cream-50;
	border-radius: $gold-radius-lg;

	&__text {
		flex: 1;
		font-size: 26rpx;
		color: $gold-ink-800;
	}

	&__arrow {
		color: $gold-ink-300;
	}
}
</style>
