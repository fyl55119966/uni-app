<template>
	<view class="page">
		<nav-bar title="余额" />

		<view class="hero">
			<text class="hero__label">账户余额（元）</text>
			<text class="hero__num">{{ money(wallet.balance) }}</text>
			<view class="hero__meta">
				<text class="hero__meta-item">总金额 ¥{{ money(wallet.total) }}</text>
				<text class="hero__meta-item">已提现 ¥{{ money(wallet.withdrawn) }}</text>
			</view>
			<view class="hero__actions">
				<view class="hero__btn is-primary" @click="recharge">充值</view>
				<view class="hero__btn" @click="withdraw">提现</view>
			</view>
		</view>

		<view class="panel">
			<view class="panel__head">
				<text class="panel__title">交易明细</text>
				<picker mode="date" :value="date" @change="onDate">
					<text class="panel__date">{{ date }} ›</text>
				</picker>
			</view>

			<view class="filter">
				<text class="filter__label">类型</text>
				<view class="filter__chips">
					<text v-for="item in types" :key="item.key" class="filter__chip" :class="{ 'is-active': type === item.key }"
						@click="type = item.key">{{ item.label }}</text>
				</view>
			</view>

			<view class="sum">
				<text class="sum__item">收入 ¥{{ money(income) }}</text>
				<text class="sum__item">支出 ¥{{ money(outcome) }}</text>
			</view>

			<view v-for="item in filtered" :key="item.id" class="tx">
				<view class="tx__body">
					<text class="tx__title">{{ item.title }}</text>
					<text class="tx__time">{{ item.createdAt }}</text>
				</view>
				<text class="tx__amount" :class="item.direction === 'out' ? 'is-out' : ''">
					{{ item.direction === 'out' ? '-' : '+' }}¥{{ money(item.amount) }}
				</text>
			</view>

			<text v-if="!filtered.length" class="empty">暂无交易明细</text>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getWallet } from '@/api/wallet.js'

export default {
	components: { navBar },
	data() {
		return {
			wallet: { balance: 0, total: 0, withdrawn: 0, transactions: [] },
			date: '2026-11-11',
			type: 'all',
			types: [
				{ key: 'all', label: '全部' },
				{ key: 'in', label: '收入' },
				{ key: 'out', label: '支出' }
			]
		}
	},
	computed: {
		filtered() {
			if (this.type === 'all') return this.wallet.transactions
			return this.wallet.transactions.filter((t) => t.direction === this.type)
		},
		income() {
			return this.filtered.filter((t) => t.direction === 'in' && t.status === 'success').reduce((s, t) => s + Number(t.amount), 0)
		},
		outcome() {
			return this.filtered.filter((t) => t.direction === 'out' && t.status === 'success').reduce((s, t) => s + Number(t.amount), 0)
		}
	},
	onShow() {
		this.wallet = getWallet()
	},
	methods: {
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		onDate(event) {
			this.date = event.detail.value
		},
		recharge() {
			uni.navigateTo({ url: '/pages/wallet/recharge/index' })
		},
		withdraw() {
			uni.navigateTo({ url: '/pages/wallet/withdraw/index' })
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

.hero {
	margin: 24rpx;
	padding: 40rpx 32rpx;
	background: $gold-gradient;
	border-radius: $gold-radius-lg;

	&__label {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.85);
	}

	&__num {
		display: block;
		margin-top: 10rpx;
		font-size: 72rpx;
		font-weight: 800;
		color: #fff;
	}

	&__meta {
		display: flex;
		margin-top: 12rpx;
	}

	&__meta-item {
		margin-right: 28rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.85);
	}

	&__actions {
		display: flex;
		margin-top: 32rpx;
	}

	&__btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 76rpx;
		margin-right: 20rpx;
		border: 2rpx solid rgba(255, 255, 255, 0.8);
		border-radius: $gold-radius-pill;
		font-size: 28rpx;
		color: #fff;

		&.is-primary {
			background: #fff;
			color: $gold-600;
			font-weight: 600;
		}

		&:last-child {
			margin-right: 0;
		}
	}
}

.panel {
	margin: 0 24rpx;
	padding: 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__title {
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__date {
		font-size: 24rpx;
		color: $gold-ink-400;
	}
}

.filter {
	display: flex;
	align-items: center;
	margin-top: 20rpx;

	&__label {
		font-size: 24rpx;
		color: $gold-ink-400;
	}

	&__chips {
		display: flex;
		margin-left: 20rpx;
	}

	&__chip {
		margin-right: 14rpx;
		padding: 6rpx 20rpx;
		border-radius: $gold-radius-pill;
		background: $gold-cream-50;
		font-size: 22rpx;
		color: $gold-ink-500;

		&.is-active {
			background: $gold-100;
			color: $gold-600;
		}
	}
}

.sum {
	display: flex;
	margin-top: 20rpx;
	padding: 16rpx 0;
	border-top: 1rpx solid $gold-line;
	border-bottom: 1rpx solid $gold-line;

	&__item {
		margin-right: 32rpx;
		font-size: 22rpx;
		color: $gold-ink-400;
	}
}

.tx {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid $gold-line;

	&:last-child {
		border-bottom: 0;
	}

	&__body {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	&__title {
		font-size: 26rpx;
		color: $gold-ink-900;
	}

	&__time {
		margin-top: 6rpx;
		font-size: 20rpx;
		color: $gold-ink-300;
	}

	&__amount {
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-600;

		&.is-out {
			color: $gold-ink-900;
		}
	}
}

.empty {
	display: block;
	padding: 80rpx 0;
	text-align: center;
	font-size: 24rpx;
	color: $gold-ink-300;
}
</style>
