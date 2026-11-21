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
	bottom: 10px;
	z-index: 99;
	background: #fff;
	border-radius: $gold-radius-pill;
}

.footer__bar {
	display: flex;
	height: 100rpx;
}

.footer__item {
	position: relative;
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 0rpx 12rpx 12rpx 0rpx;
	border: 1rpx solid transparent;
	border-radius: $gold-radius-pill;

	&--active {
		border-color: #f8e2a4;
		background: #fff9e4;
	}
}

.footer__icon {
	position: relative;
	width: 34rpx;
	height: 34rpx;
}

.footer__label {
	position: relative;
	margin-top: 6rpx;
	font-size: 28rpx;
	font-weight: 400;
	line-height: 30rpx;
	color: #303030;

	.footer__item--active & {
		color: #8e641b;
		font-weight: 600;
	}
}
</style>
