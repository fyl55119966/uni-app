<template>
	<view class="page">
		<nav-bar title="订单详情" />

		<view v-if="order" class="status">
			<text class="status__title">{{ statusText }}</text>
			<text class="status__desc">{{ statusDesc }}</text>
			<text v-if="order.lastPayError" class="status__error">{{ order.lastPayError }}</text>
		</view>

		<view v-if="order" class="card goods">
			<image class="goods__img" :src="order.image" mode="aspectFill" />
			<view class="goods__body">
				<text class="goods__title">{{ order.title }}</text>
				<text class="goods__spec">{{ order.gram }}g · {{ order.type === 'bar' ? '投资金条' : '黄金饰品' }}</text>
				<text class="goods__price">¥{{ money(order.total) }}</text>
			</view>
		</view>

		<view v-if="order" class="card">
			<view class="line"><text class="line__label">订单总额</text><text class="line__value">¥{{ money(order.total) }}</text></view>
			<view class="line"><text class="line__label">定金（10%）</text><text class="line__value">¥{{ money(order.deposit) }}</text></view>
			<view class="line"><text class="line__label">尾款（90%）</text><text class="line__value">¥{{ money(order.balance) }}</text></view>
			<view class="line"><text class="line__label">已支付</text><text class="line__value is-on">¥{{ money(paidTotal) }}</text></view>
		</view>

		<view v-if="order" class="card">
			<view class="line"><text class="line__label">订单号</text><text class="line__value">{{ order.orderNo }}</text></view>
			<view class="line"><text class="line__label">下单时间</text><text class="line__value">{{ formatTime(order.createdAt) }}</text></view>
			<view class="line"><text class="line__label">提货方式</text><text class="line__value">{{ order.mode === 'pickup' ? '到店自提' : '快递物流' }}</text></view>
			<view class="line"><text class="line__label">{{ order.mode === 'pickup' ? '自提门店' : '收货地址' }}</text><text class="line__value">{{ place }}</text></view>
		</view>

		<view v-if="order && order.payments && order.payments.length" class="card">
			<text class="card__title">支付记录</text>
			<view v-for="(p, i) in order.payments" :key="i" class="line">
				<text class="line__label">{{ p.stage === 'balance' ? '尾款' : '定金' }} · {{ p.method }}</text>
				<text class="line__value">¥{{ money(p.amount) }} {{ p.status === 'success' ? '成功' : '失败' }}</text>
			</view>
		</view>

		<view v-if="order && actionText" class="bar">
			<view class="bar__btn" @click="action">{{ actionText }}</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getOrder, STORES, ADDRESSES } from '@/api/order.js'
import { ORDER_STATUS_TEXT } from '@/utils/orderState.js'

export default {
	components: { navBar },
	data() {
		return { orderNo: '', order: null }
	},
	computed: {
		statusText() {
			return ORDER_STATUS_TEXT[this.order.status] || '处理中'
		},
		statusDesc() {
			if (this.order.status === 'pending_deposit') return '请尽快支付定金，超时订单将关闭'
			if (this.order.status === 'pending_pickup') return this.order.balancePaid ? '已完成，等待提货' : '定金已付，提货前补齐尾款'
			if (this.order.status === 'paid') return '交易已完成，感谢您的订购'
			return ''
		},
		paidTotal() {
			return (this.order.payments || []).filter((p) => p.status === 'success').reduce((sum, p) => sum + Number(p.amount), 0)
		},
		place() {
			if (this.order.mode === 'pickup') {
				const store = STORES.find((s) => s.id === this.order.storeId)
				return store ? store.name : '—'
			}
			const address = ADDRESSES.find((a) => a.id === this.order.addressId)
			return address ? `${address.name} ${address.region}` : '—'
		},
		actionText() {
			if (this.order.status === 'pending_deposit') return '去支付定金'
			if (this.order.status === 'pending_pickup' && !this.order.balancePaid) return '补交尾款'
			return ''
		}
	},
	onLoad(query) {
		this.orderNo = query.orderNo || ''
		this.load()
	},
	onShow() {
		if (this.orderNo) this.load()
	},
	methods: {
		async load() {
			this.order = await getOrder(this.orderNo)
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		formatTime(ts) {
			const d = new Date(ts || Date.now())
			const p = (n) => String(n).padStart(2, '0')
			return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
		},
		action() {
			const stage = this.order.status === 'pending_deposit' ? 'deposit' : 'balance'
			uni.navigateTo({ url: `/pages/cashier/index?orderNo=${this.orderNo}&stage=${stage}` })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.status {
	display: flex;
	flex-direction: column;
	padding: 48rpx 32rpx;
	background: $gold-gradient;

	&__title {
		font-size: 40rpx;
		font-weight: 700;
		color: #fff;
	}

	&__desc {
		margin-top: 12rpx;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.88);
	}

	&__error {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: #FFE6E6;
	}
}

.card {
	margin: 24rpx 24rpx 0;
	padding: 28rpx 32rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__title {
		font-size: 28rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}
}

.goods {
	display: flex;

	&__img {
		width: 150rpx;
		height: 150rpx;
		border-radius: $gold-radius;
		background: $gold-cream-200;
	}

	&__body {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 24rpx;
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

	&__price {
		margin-top: auto;
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-600;
	}
}

.line {
	display: flex;
	justify-content: space-between;
	padding: 10rpx 0;

	&__label {
		font-size: 24rpx;
		color: $gold-ink-500;
	}

	&__value {
		font-size: 24rpx;
		color: $gold-ink-900;

		&.is-on {
			color: $gold-600;
			font-weight: 600;
		}
	}
}

.bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	height: calc(120rpx + env(safe-area-inset-bottom));
	padding: 0 24rpx env(safe-area-inset-bottom);
	background: #fff;
	border-top: 1rpx solid $gold-line;

	&__btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 84rpx;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;
	}
}
</style>
