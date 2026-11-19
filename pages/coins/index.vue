<template>
	<view class="page">
		<view class="top">
			<view class="top__price">
				<g-price :value="coin.price" unit="/g" size="sm" />
			</view>
			<text class="top__title">金币</text>
		</view>

		<view class="specs">
			<view v-for="gram in coin.specs" :key="gram" class="specs__item"
				:class="{ 'is-active': gram === activeGram }" @click="activeGram = gram">
				{{ gram }}g
			</view>
		</view>

		<view class="hero">
			<image class="hero__img" :src="heroImage" mode="aspectFill" />
			<view class="hero__rule">规则说明</view>
		</view>

		<text class="name">黄金首饰现货销售商城</text>

		<view class="quote">
			<view class="quote__cell">
				<text class="quote__label">定金</text>
				<text class="quote__value">¥{{ quote.deposit }}</text>
			</view>
			<view class="quote__line" />
			<view class="quote__cell">
				<text class="quote__label">工费</text>
				<text class="quote__value">¥{{ laborText }}/g</text>
			</view>
		</view>

		<view class="periods">
			<view v-for="item in periods" :key="item" class="periods__item"
				:class="{ 'is-active': item === period }" @click="period = item">
				{{ item }}
			</view>
		</view>

		<image class="chart" :src="coin.chart" mode="widthFix" />

		<text class="section-title">商品详情</text>
		<image v-for="(img, index) in coin.detailImages" :key="index" class="detail" :src="img" mode="widthFix" />

		<view class="hold" />

		<view class="buy">
			<view class="buy__btn" @click="buy">立即购买</view>
		</view>

		<page-footer active="coins" />
	</view>
</template>

<script>
import pageFooter from '@/components/page-footer/index.vue'
import gPrice from '@/components/g-price/index.vue'
import { getCoin, coinQuote } from '@/api/coins.js'

export default {
	components: { pageFooter, gPrice },
	data() {
		return {
			coin: { price: 0, laborFee: 0, specs: [], chart: '', detailImages: [] },
			activeGram: 30,
			periods: ['今日', '近5日', '近7日', '近30日'],
			period: '今日'
		}
	},
	computed: {
		heroImage() {
			return `/static/images/gold/coin-${this.activeGram}.png`
		},
		priceText() {
			return Number(this.coin.price || 0).toFixed(2)
		},
		laborText() {
			return Number(this.coin.laborFee || 0).toFixed(2)
		},
		quote() {
			return coinQuote(this.activeGram, this.coin)
		}
	},
	onShow() {
		this.load()
	},
	methods: {
		async load() {
			this.coin = await getCoin()
		},
		buy() {
			uni.showToast({ title: '确认订单在票 05 实现', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: calc(300rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.top {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	height: calc(88rpx + var(--status-bar-height));
	padding-top: var(--status-bar-height);

	&__price {
		position: absolute;
		left: 24rpx;
		bottom: 18rpx;
		display: flex;
		align-items: baseline;
		height: 56rpx;
		padding: 0 18rpx;
		background: #fff;
		border-radius: $gold-radius-pill;
		box-shadow: 0 2rpx 8rpx rgba(217, 161, 51, 0.16);
	}

	&__sign {
		font-size: 22rpx;
		color: $gold-600;
	}

	&__num {
		font-size: 28rpx;
		font-weight: 700;
		color: $gold-600;
	}

	&__unit {
		font-size: 20rpx;
		color: $gold-600;
	}

	&__title {
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}
}

.specs {
	display: flex;
	height: 96rpx;
	margin: 12rpx 24rpx 0;
	background: #fff;
	border-radius: $gold-radius;

	&__item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: $gold-ink-500;

		&.is-active {
			background: $gold-gradient;
			border-radius: $gold-radius;
			font-weight: 700;
			color: #fff;
		}
	}
}

.hero {
	position: relative;
	margin: 20rpx 24rpx 0;
	overflow: hidden;
	border-radius: $gold-radius-lg;

	&__img {
		display: block;
		width: 100%;
		height: 700rpx;
	}

	&__rule {
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		padding: 8rpx 18rpx;
		background: rgba(90, 53, 8, 0.55);
		border-radius: 6rpx;
		font-size: 22rpx;
		color: #fff;
	}
}

.name {
	display: block;
	margin-top: 22rpx;
	font-size: 30rpx;
	font-weight: 600;
	text-align: center;
	color: $gold-ink-900;
}

.quote {
	display: flex;
	align-items: center;
	height: 116rpx;
	margin: 18rpx 24rpx 0;
	background: #fff;
	border-radius: $gold-radius;

	&__cell {
		flex: 1;
		display: flex;
		align-items: baseline;
		justify-content: center;
	}

	&__label {
		margin-right: 12rpx;
		font-size: 24rpx;
		color: $gold-ink-500;
	}

	&__value {
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__line {
		width: 1rpx;
		height: 44rpx;
		background: $gold-line;
	}
}

.periods {
	display: flex;
	align-items: center;
	height: 96rpx;
	margin: 16rpx 24rpx 0;

	&__item {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: $gold-ink-500;

		&.is-active {
			font-weight: 700;
			color: $gold-ink-900;

			&::after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 8rpx;
				width: 40rpx;
				height: 4rpx;
				transform: translateX(-50%);
				background: $gold-600;
				border-radius: 2rpx;
			}
		}
	}
}

.chart {
	display: block;
	width: 100%;
}

.section-title {
	display: block;
	margin: 28rpx 24rpx 16rpx;
	font-size: 32rpx;
	font-weight: 700;
	color: $gold-ink-900;
}

.detail {
	display: block;
	width: 100%;
}

.hold {
	height: 20rpx;
}

.buy {
	position: fixed;
	left: 0;
	right: 0;
	bottom: calc(136rpx + env(safe-area-inset-bottom));
	z-index: 98;
	padding: 0 24rpx;

	&__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 92rpx;
		background: #E93323;
		border-radius: $gold-radius;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;
	}
}
</style>
