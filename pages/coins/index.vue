<template>
	<view class="page">
		<view class="top">
			<view class="top__price">
				<text class="top__price-sign">¥</text>
				<text class="top__price-value">{{ priceText }}</text>
				<text class="top__price-unit">/g</text>
			</view>
			<text class="top__title">金币</text>
		</view>

		<view class="specs">
			<view v-for="gram in coin.specs" :key="gram" class="specs__item"
				:class="{ 'is-active': gram === activeGram }" @click="selectGram(gram)">
				{{ gram }}g
			</view>
		</view>

		<view class="hero">
			<swiper class="hero__swiper" :current="activeIndex" :duration="320" @change="onSwiperChange">
				<swiper-item v-for="gram in coin.specs" :key="gram">
					<image class="hero__img" :src="`/static/images/gold/coin-${gram}g.png`" mode="aspectFill" />
				</swiper-item>
			</swiper>
			<view class="hero__rule">规则说明</view>
		</view>

		<text class="name">黄金首饰现货销售商城</text>

		<view class="quote">
			<view class="quote__hr quote__hr--top" />
			<view class="quote__hr quote__hr--bottom" />
			<view class="quote__cell">
				<text class="quote__label">定金</text>
				<text class="quote__sign">¥</text>
				<text class="quote__value">{{ quote.deposit }}</text>
			</view>
			<view class="quote__line" />
			<view class="quote__cell">
				<text class="quote__label">工费</text>
				<text class="quote__sign">¥</text>
				<text class="quote__value">{{ laborText }}/g</text>
			</view>
		</view>

		<view class="quote-gap" />

		<view class="periods">
			<view v-for="item in periods" :key="item" class="periods__item"
				:class="{ 'is-active': item === period }" @click="selectPeriod(item)">
				{{ item }}
			</view>
		</view>

		<view class="chart-head">
			<text class="chart-head__time">{{ chartTime }}</text>
			<text class="chart-head__price">¥{{ chartPrice }}</text>
		</view>
		<view class="chart-wrap">
			<coin-chart :points="chart.points" :x-labels="chart.xLabels" :height="500" />
		</view>

		<text class="section-title">商品详情</text>
		<view class="section-line" />
		<image v-for="(img, index) in coin.detailImages" :key="index" class="detail" :src="img" mode="widthFix" />

		<view class="hold" />

		<view class="buy">
			<view class="buy__btn" @click="buy">
				<text class="buy__main">立即购买</text>
				<text class="buy__sub">Buy Now</text>
			</view>
		</view>

		<page-footer active="coins" />
	</view>
</template>

<script>
import pageFooter from '@/components/page-footer/index.vue'
import coinChart from '@/components/coin-chart/index.vue'
import { getCoin, getCoinChart, coinQuote } from '@/api/coins.js'
import { requireLogin, canBuyNow } from '@/utils/guard.js'

export default {
	components: { pageFooter, coinChart },
	data() {
		return {
			coin: { price: 0, laborFee: 0, specs: [], detailImages: [] },
			activeGram: 30,
			periods: ['今日', '近5日', '近7日', '近30日'],
			period: '今日',
			chart: { points: [], xLabels: [], latest: { time: '', price: 0 } },
			chartTime: '--',
			chartPrice: '--'
		}
	},
	computed: {
		activeIndex() {
			const index = this.coin.specs.map(Number).indexOf(Number(this.activeGram))
			return index < 0 ? 0 : index
		},
		priceText() {
			return Number(this.coin.price || 0).toFixed(2)
		},
		laborText() {
			return Number(this.coin.laborFee || 0).toFixed(2)
		},
		quote() {
			return coinQuote(this.activeGram, this.coin)
		},
		periodKey() {
			const map = { 今日: 'today', 近5日: '5d', 近7日: '7d', 近30日: '30d' }
			return map[this.period] || 'today'
		}
	},
	onShow() {
		this.load()
		this.loadChart()
		this.startClock()
		this.startChartTimer()
	},
	onHide() {
		this.stopClock()
		this.stopChartTimer()
	},
	onUnload() {
		this.stopClock()
		this.stopChartTimer()
	},
	methods: {
		async load() {
			this.coin = await getCoin()
		},
		async loadChart() {
			const period = this.periodKey
			const data = await getCoinChart({ period, gram: this.activeGram })
			if (period !== this.periodKey) return
			this.chart = data
			this.chartPrice = Number(data.latest.price).toFixed(2)
		},
		updateClock() {
			const date = new Date()
			const pad = (value) => (value < 10 ? `0${value}` : `${value}`)
			this.chartTime = `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
		},
		startClock() {
			this.stopClock()
			this.updateClock()
			this._clockTimer = setInterval(() => this.updateClock(), 1000)
		},
		stopClock() {
			if (this._clockTimer) {
				clearInterval(this._clockTimer)
				this._clockTimer = null
			}
		},
		selectPeriod(item) {
			if (item === this.period) return
			this.period = item
			this.loadChart()
		},
		startChartTimer() {
			this.stopChartTimer()
			this._chartTimer = setInterval(() => this.loadChart(), 15000)
		},
		stopChartTimer() {
			if (this._chartTimer) {
				clearInterval(this._chartTimer)
				this._chartTimer = null
			}
		},
		selectGram(gram) {
			this.activeGram = gram
		},
		onSwiperChange(e) {
			const gram = this.coin.specs[e.detail.current]
			if (gram !== undefined) this.activeGram = gram
		},
		buy() {
			if (!requireLogin('/pages/coins/index')) return
			if (!canBuyNow()) {
				uni.showToast({ title: '现在休市中', icon: 'none' })
				return
			}
			uni.navigateTo({ url: `/pages/goods_detail/index?type=bar&gram=${this.activeGram}` })
		}
	}
}
</script>

<style lang="scss" scoped>
$serif: "Songti SC", "STSong", "SimSun", serif;
$num-sans: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
$spec-serif: "Songti SC", "STSong", Georgia, serif;

.page {
	min-height: 100vh;
	padding-bottom: calc(300rpx + env(safe-area-inset-bottom));
	background: #fff;
}

.top {
	position: sticky;
	top: 0;
	z-index: 99;
	display: flex;
	align-items: center;
	justify-content: center;
	// height: calc(112rpx + var(--status-bar-height));
	height: calc(88rpx + var(--status-bar-height));
	padding-top: var(--status-bar-height);
	background: #FFD36A;

	&__price {
		position: absolute;
		left: 28rpx;
		bottom: 5rpx;
		display: flex;
		align-items: center;
		height: 62rpx;
		padding: 0 18rpx;
		background: #FFF9E9;
		border-radius: 5rpx;
	}

	&__price-sign {
		margin-right: 2rpx;
		font-family: $num-sans;
		font-size: 28rpx;
		font-weight: 400;
		line-height: 1;
		color: #D74842;
	}

	&__price-value {
		font-family: $num-sans;
		font-size: 36rpx;
		font-weight: 600;
		line-height: 1;
		color: #D74842;
	}

	&__price-unit {
		margin-left: 2rpx;
		font-family: $num-sans;
		font-size: 30rpx;
		font-weight: 400;
		line-height: 1;
		color: #D74842;
	}

	&__title {
		font-family: "PingFang SC", "Source Han Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif;
		font-size: 38rpx;
		font-weight: 700;
		color: #1A1A1A;
	}
}

.specs {
	display: flex;
	margin: 14rpx 32rpx 0;

	&__item {
		position: relative;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 70rpx;
		background: #FFF4D5;
		border-radius: 5rpx;
		font-family: $spec-serif;
		font-size: 30rpx;
		font-weight: 700;
		letter-spacing: 2rpx;
		color: #D9B763;

		& + & {
			margin-left: 10rpx;
		}

		&.is-active {
			background: #D9B33F;
			color: #fff;

			&::after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: -12rpx;
				transform: translateX(-50%);
				border-left: 12rpx solid transparent;
				border-right: 12rpx solid transparent;
				border-top: 12rpx solid #D9B33F;
			}
		}
	}
}

.hero {
	position: relative;
	margin: 20rpx 32rpx 0;
	overflow: hidden;

	&__swiper {
		width: 100%;
		height: 508rpx;
	}

	&__img {
		display: block;
		width: 100%;
		height: 100%;
	}

	&__rule {
		position: absolute;
		right: 0;
		bottom: 0;
		padding: 10rpx 8rpx;
		background: #5F5854;
		font-size: 28rpx;
		line-height: 1;
		color: #fff;
	}
}

.name {
	display: block;
	margin-top: 24rpx;
	font-family: $num-sans;
	font-size: 32rpx;
	font-weight: 700;
	text-align: center;
	color: $gold-ink-900;
}

.quote {
	position: relative;
	display: flex;
	align-items: center;
	height: 80rpx;
	margin: 24rpx 0 0;
	padding: 0 32rpx;
	background: #fff;

	&__hr {
		position: absolute;
		left: 32rpx;
		width: calc(100% - 64rpx);
		height: 1rpx;

		&--top {
			top: 0;
			background: #E8E8E8;
		}

		&--bottom {
			bottom: 0;
			background: #E8E8E8;
		}
	}

	&__cell {
		flex: 1;
		display: flex;
		align-items: baseline;
		justify-content: center;
	}

	&__label {
		margin-right: 8rpx;
		font-family: $num-sans;
		font-size: 28rpx;
		color: #555555;
	}

	&__sign {
		margin-right: 2rpx;
		font-family: $num-sans;
		font-size: 30rpx;
		color: #555555;
	}

	&__value {
		font-family: "Helvetica Neue", Arial, "PingFang SC", sans-serif;
		font-size: 36rpx;
		font-weight: 500;
		color: #555555;
	}

	&__line {
		width: 1rpx;
		height: 46rpx;
		background: #F2F2F2;
	}
}

.quote-gap {
	height: 12rpx;
	margin-top: 18rpx;
	background: #F5F5F5;
}

.periods {
	position: relative;
	display: flex;
	align-items: stretch;
	height: 88rpx;
	margin: 0;
	padding: 0 32rpx;

	&::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 2rpx;
		background: #F2F2F2;
	}

	&__item {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		color: #1A1A1A;

		&.is-active {
			font-weight: 700;
			color: #000000;

			&::after {
				content: '';
				position: absolute;
				z-index: 1;
				left: 50%;
				bottom: 0;
				width: 92%;
				height: 4rpx;
				transform: translateX(-50%);
				background: #E2CB72;
				border-radius: 2rpx;
			}
		}
	}
}

.chart-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 64rpx;
	padding: 10rpx 32rpx 0;
	margin-top: 12rpx;

	&__time {
		font-size: 26rpx;
		color: #111111;
	}

	&__price {
		font-size: 34rpx;
		font-weight: 700;
		color: #DE4842;
	}
}

.chart-wrap {
	margin: 0 32rpx;
}

.section-title {
	display: block;
	margin: 24rpx 32rpx 0;
	font-size: 36rpx;
	font-weight: 700;
	color: $gold-ink-900;
}

.section-line {
	height: 1rpx;
	margin: 20rpx 32rpx 24rpx;
	background: #F1F1F1;
}

.detail {
	display: block;
	width: calc(100% - 64rpx);
	margin: 0 32rpx 16rpx;
	border-radius: 12rpx;
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
	padding: 0 44rpx;

	&__btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 108rpx;
		background: linear-gradient(180deg, #FF7343 0%, #FF6B3D 100%);
		border: 4rpx solid rgba(255, 255, 255, 0.92);
		border-radius: 16rpx;
		box-shadow: 0 8rpx 20rpx rgba(255, 107, 61, 0.25);
		color: #fff;
	}

	&__main {
		font-size: 32rpx;
		font-weight: 700;
		line-height: 40rpx;
	}

	&__sub {
		margin-top: 2rpx;
		font-family: $serif;
		font-size: 20rpx;
		line-height: 24rpx;
	}
}
</style>
