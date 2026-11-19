<template>
	<view class="page">
		<view class="head">
			<image class="head__back" src="/static/icons/ic-back.png" mode="aspectFit" @click="back" />
			<text class="head__title">我的订购</text>
			<view class="head__price">
				<text class="head__price-num">¥{{ price }}</text>
				<text class="head__price-unit">/g</text>
			</view>
		</view>

		<scroll-view class="tabs" scroll-x :show-scrollbar="false">
			<view class="tabs__inner">
				<view v-for="tab in tabs" :key="tab.key" class="tabs__item" :class="{ 'is-active': active === tab.key }"
					@click="switchTab(tab.key)">
					{{ tab.label }}
					<text v-if="tab.count" class="tabs__count">{{ tab.count }}</text>
				</view>
			</view>
		</scroll-view>

		<view class="summary">
			<text class="summary__count">共{{ filtered.length }}条订单</text>
			<text class="summary__sort">最新下单在前</text>
		</view>

		<g-empty v-if="!loading && !filtered.length" text="暂无订购订单" desc="去金币页挑一根金条，或到小店看看饰品" />

		<view v-for="order in visible" :key="order.orderNo" class="card" @click="openDetail(order)">
			<view class="card__head">
				<text class="card__no">{{ order.orderNo }}</text>
				<text class="card__status">{{ statusText(order) }}</text>
			</view>
			<view class="card__body">
				<image class="card__img" :src="order.image" mode="aspectFill" />
				<view class="card__info">
					<text class="card__title">{{ order.title }}</text>
					<text class="card__spec">{{ order.gram }}g · {{ order.mode === 'pickup' ? '到店自提' : '快递物流' }}</text>
					<text class="card__amount">¥{{ money(order.total) }}</text>
				</view>
			</view>
			<view class="card__foot">
				<text class="card__deposit">定金 ¥{{ money(order.deposit) }}</text>
				<view v-if="actionText(order)" class="card__btn" @click.stop="action(order)">{{ actionText(order) }}</view>
			</view>
		</view>

		<view v-if="loading" class="loading">加载中…</view>
		<view v-else-if="filtered.length && !hasMore" class="end">没有更多了</view>
	</view>
</template>

<script>
import gEmpty from '@/components/g-empty/index.vue'
import { getOrders } from '@/api/order.js'
import { getCoin } from '@/api/coins.js'

const TABS = [
	{ key: 'all', label: '全部' },
	{ key: 'pending_deposit', label: '待支付' },
	{ key: 'performing', label: '履约中' },
	{ key: 'receiving', label: '待收货' },
	{ key: 'paid', label: '已完成' },
	{ key: 'cancelled', label: '已关闭' },
	{ key: 'breach', label: '已违约' }
]

export default {
	components: { gEmpty },
	data() {
		return {
			price: '861.42',
			active: 'all',
			orders: [],
			loading: true,
			page: 1,
			pageSize: 5,
			clock: Date.now()
		}
	},
	computed: {
		tabs() {
			return TABS.map((tab) => ({ ...tab, count: this.orders.filter((o) => this.match(o, tab.key)).length }))
		},
		filtered() {
			return this.orders.filter((o) => this.match(o, this.active))
		},
		visible() {
			return this.filtered.slice(0, this.page * this.pageSize)
		},
		hasMore() {
			return this.visible.length < this.filtered.length
		}
	},
	onLoad() {
		this.load()
	},
	onShow() {
		this.load()
	},
	onReachBottom() {
		if (this.hasMore) this.page += 1
	},
	methods: {
		async load() {
			this.loading = true
			const [orders, coin] = await Promise.all([getOrders(), getCoin()])
			this.orders = orders
			this.price = Number(coin.price).toFixed(2)
			this.loading = false
		},
		match(order, key) {
			if (key === 'all') return true
			if (key === 'performing') return order.status === 'pending_pickup' && !order.balancePaid
			if (key === 'receiving') return order.status === 'pending_pickup' && order.balancePaid && order.mode === 'logistics'
			return order.status === key
		},
		statusText(order) {
			if (order.status === 'pending_deposit') return '待支付定金'
			if (order.status === 'pending_pickup') return order.balancePaid ? '待收货' : '履约中'
			if (order.status === 'paid') return '已完成'
			if (order.status === 'breach') return '已违约'
			return '已关闭'
		},
		actionText(order) {
			if (order.status === 'pending_deposit') return '去支付'
			if (order.status === 'pending_pickup' && !order.balancePaid) return '补尾款'
			return ''
		},
		action(order) {
			const stage = order.status === 'pending_deposit' ? 'deposit' : 'balance'
			uni.navigateTo({ url: `/pages/cashier/index?orderNo=${order.orderNo}&stage=${stage}` })
		},
		openDetail(order) {
			uni.navigateTo({ url: `/pages/order_detail/index?orderNo=${order.orderNo}` })
		},
		switchTab(key) {
			this.active = key
			this.page = 1
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		back() {
			const pages = getCurrentPages()
			if (pages.length > 1) uni.navigateBack()
			else uni.reLaunch({ url: '/pages/mine/index' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.head {
	display: flex;
	align-items: center;
	height: calc(88rpx + var(--status-bar-height));
	padding: var(--status-bar-height) 24rpx 0;

	&__back {
		width: 44rpx;
		height: 44rpx;
	}

	&__title {
		flex: 1;
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
		text-align: center;
	}

	&__price {
		display: flex;
		align-items: baseline;
		padding: 8rpx 18rpx;
		background: $gold-100;
		border: 2rpx solid $gold-200;
		border-radius: $gold-radius-pill;
	}

	&__price-num {
		font-size: 24rpx;
		font-weight: 700;
		color: $gold-600;
	}

	&__price-unit {
		font-size: 18rpx;
		color: $gold-600;
	}
}

.tabs {
	white-space: nowrap;
	margin-top: 16rpx;

	&__inner {
		display: flex;
		padding: 0 24rpx;
	}

	&__item {
		position: relative;
		flex-shrink: 0;
		padding: 16rpx 20rpx;
		font-size: 26rpx;
		color: $gold-ink-500;

		&.is-active {
			font-weight: 700;
			color: $gold-ink-900;

			&::after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 4rpx;
				width: 36rpx;
				height: 6rpx;
				margin-left: -18rpx;
				background: $gold-600;
				border-radius: 3rpx;
			}
		}
	}

	&__count {
		margin-left: 6rpx;
		font-size: 20rpx;
		color: $gold-600;
	}
}

.summary {
	display: flex;
	justify-content: space-between;
	padding: 20rpx 32rpx 8rpx;
	font-size: 22rpx;
	color: $gold-ink-300;
}

.card {
	margin: 16rpx 24rpx 0;
	padding: 24rpx 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__head {
		display: flex;
		justify-content: space-between;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__status {
		color: $gold-600;
	}

	&__body {
		display: flex;
		margin-top: 18rpx;
	}

	&__img {
		width: 140rpx;
		height: 140rpx;
		border-radius: $gold-radius;
		background: $gold-cream-200;
	}

	&__info {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
	}

	&__title {
		font-size: 28rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__spec {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__amount {
		margin-top: auto;
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-600;
	}

	&__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	&__deposit {
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__btn {
		padding: 12rpx 32rpx;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 24rpx;
		color: #fff;
	}
}

.loading,
.end {
	padding: 32rpx;
	font-size: 22rpx;
	color: $gold-ink-300;
	text-align: center;
}
</style>
