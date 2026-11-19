<template>
	<view class="nav" :style="{ background: bg }">
		<view v-if="back" class="nav__back" @click="goBack">
			<image class="nav__back-icon" src="/static/icons/ic-back.png" mode="aspectFit" />
		</view>
		<text class="nav__title">{{ title }}</text>
		<view class="nav__right">
			<slot name="right" />
		</view>
	</view>
</template>

<script>
export default {
	name: 'nav-bar',
	props: {
		title: { type: String, default: '' },
		back: { type: Boolean, default: true },
		bg: { type: String, default: 'transparent' }
	},
	methods: {
		goBack() {
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.reLaunch({ url: '/pages/home/index' })
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.nav {
	position: relative;
	display: flex;
	align-items: center;
	height: 88rpx;
	padding-top: var(--status-bar-height);
	box-sizing: content-box;

	&__back {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 88rpx;
		height: 88rpx;
	}

	&__back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	&__title {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__right {
		position: relative;
		z-index: 2;
		margin-left: auto;
		margin-right: 24rpx;
	}
}
</style>
