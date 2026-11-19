<template>
	<view class="footer">
		<view class="footer__bar">
			<view
				v-for="item in items"
				:key="item.key"
				class="footer__item"
				:class="{ 'footer__item--active': item.key === active }"
				@click="go(item)"
			>
				<image class="footer__icon" :src="item.key === active ? item.iconActive : item.icon" mode="aspectFit" />
				<text class="footer__label">{{ item.text }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'page-footer',
	props: {
		active: {
			type: String,
			default: 'home'
		}
	},
	data() {
		return {
			items: [
				{ key: 'home', text: '首页', url: '/pages/home/index', icon: '/static/icons/tab-home.png', iconActive: '/static/icons/tab-home-active.png' },
				{ key: 'coins', text: '金币', url: '/pages/coins/index', icon: '/static/icons/tab-coin.png', iconActive: '/static/icons/tab-coin-active.png' },
				{ key: 'shop', text: '小店', url: '/pages/shop/index', icon: '/static/icons/tab-shop.png', iconActive: '/static/icons/tab-shop-active.png' },
				{ key: 'mine', text: '我的', url: '/pages/mine/index', icon: '/static/icons/tab-user.png', iconActive: '/static/icons/tab-user-active.png' }
			]
		}
	},
	methods: {
		go(item) {
			if (item.key === this.active) return
			uni.reLaunch({ url: item.url })
		}
	}
}
</script>

<style lang="scss" scoped>
.footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	padding: 0 $gold-page-pad calc(12rpx + env(safe-area-inset-bottom));
	padding-bottom: calc(12rpx + constant(safe-area-inset-bottom));
}

.footer__bar {
	display: flex;
	height: 112rpx;
	background: rgba(255, 255, 255, 0.96);
	border: 1rpx solid $gold-line;
	border-radius: $gold-radius-pill;
	box-shadow: 0 8rpx 24rpx rgba(31, 31, 31, 0.08);
}

.footer__item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 8rpx;
	border: 1rpx solid transparent;
	border-radius: $gold-radius-pill;

	&--active {
		background: $gold-100;
		border-color: $gold-200;
	}
}

.footer__icon {
	width: 40rpx;
	height: 40rpx;
}

.footer__label {
	margin-top: 4rpx;
	font-size: 20rpx;
	line-height: 28rpx;
	color: $gold-ink-400;

	.footer__item--active & {
		color: $gold-600;
		font-weight: 600;
	}
}
</style>
