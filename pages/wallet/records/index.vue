<template>
	<view class="page">
		<nav-bar title="充值记录" />

		<view class="tabs">
			<view v-for="tab in tabs" :key="tab.key" class="tabs__item" :class="{ 'is-active': active === tab.key }"
				@click="active = tab.key">{{ tab.label }}</view>
		</view>

		<view class="sync" @click="sync">同步支付状态</view>

		<view class="list">
			<view v-for="item in filtered" :key="item.id" class="card">
				<view class="card__body">
					<text class="card__title">{{ item.title }}</text>
					<text class="card__time">{{ item.createdAt }}</text>
				</view>
				<view class="card__right">
					<text class="card__amount">+¥{{ money(item.amount) }}</text>
					<text class="card__status" :class="'is-' + item.status">{{ statusText(item.status) }}</text>
				</view>
			</view>
		</view>

		<text v-if="!filtered.length" class="empty">暂无充值记录</text>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getTransactions, syncRechargeStatus } from '@/api/wallet.js'

export default {
	components: { navBar },
	data() {
		return {
			active: 'all',
			list: [],
			tabs: [
				{ key: 'all', label: '全部' },
				{ key: 'pending', label: '处理中' },
				{ key: 'success', label: '成功' },
				{ key: 'rejected', label: '交易拒绝' },
				{ key: 'closed', label: '已关闭' }
			]
		}
	},
	computed: {
		filtered() {
			const list = this.list.filter((t) => t.type === 'recharge')
			if (this.active === 'all') return list
			return list.filter((t) => t.status === this.active)
		}
	},
	onShow() {
		this.load()
	},
	methods: {
		load() {
			this.list = getTransactions()
		},
		statusText(status) {
			return { pending: '处理中', success: '成功', rejected: '交易拒绝', closed: '已关闭' }[status] || '处理中'
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		sync() {
			const pending = this.list.filter((t) => t.type === 'recharge' && t.status === 'pending')
			if (!pending.length) return uni.showToast({ title: '没有处理中的充值', icon: 'none' })
			pending.forEach((t) => syncRechargeStatus(t.id))
			this.load()
			uni.showToast({ title: '已同步到账', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: $gold-cream-50;
}

.tabs {
	display: flex;
	white-space: nowrap;
	overflow-x: auto;
	padding: 12rpx 20rpx;
	background: #fff;

	&__item {
		display: inline-block;
		padding: 12rpx 22rpx;
		font-size: 26rpx;
		color: $gold-ink-500;

		&.is-active {
			color: $gold-600;
			font-weight: 700;
			border-bottom: 4rpx solid $gold-600;
		}
	}
}

.sync {
	margin: 20rpx 24rpx 0;
	padding: 20rpx;
	border: 1rpx solid $gold-400;
	border-radius: $gold-radius;
	text-align: center;
	font-size: 24rpx;
	color: $gold-600;
}

.list {
	padding: 20rpx 24rpx 0;
}

.card {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
	padding: 26rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

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

	&__right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	&__amount {
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-600;
	}

	&__status {
		margin-top: 6rpx;
		font-size: 20rpx;
		color: $gold-ink-300;

		&.is-success {
			color: $gold-success;
		}

		&.is-rejected {
			color: $gold-danger;
		}
	}
}

.empty {
	display: block;
	padding: 120rpx 0;
	text-align: center;
	font-size: 24rpx;
	color: $gold-ink-300;
}
</style>
