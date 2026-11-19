<template>
	<view class="page">
		<nav-bar title="提现记录" />

		<scroll-view class="tabs" scroll-x :show-scrollbar="false">
			<view v-for="tab in tabs" :key="tab.key" class="tabs__item" :class="{ 'is-active': active === tab.key }"
				@click="active = tab.key">{{ tab.label }}</view>
		</scroll-view>

		<view class="sync" @click="sync">同步提现状态</view>

		<view v-for="item in filtered" :key="item.id" class="card">
			<view class="card__top">
				<text class="card__amount">¥{{ money(item.amount) }}</text>
				<text class="card__status" :class="'is-' + item.status">{{ statusText(item.status) }}</text>
			</view>
			<view class="line"><text class="line__label">提现银行卡</text><text class="line__value">尾号 {{ item.cardTail }}</text></view>
			<view class="line"><text class="line__label">服务费</text><text class="line__value">¥{{ money(item.fee) }}</text></view>
			<view class="line"><text class="line__label">到账金额</text><text class="line__value">¥{{ money(item.arrival) }}</text></view>
			<view class="line"><text class="line__label">申请时间</text><text class="line__value">{{ formatTime(item.createdAt) }}</text></view>
		</view>

		<g-empty v-if="!filtered.length" text="暂无提现记录" desc="提现后可在这里查看审核与到账进度" />
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gEmpty from '@/components/g-empty/index.vue'
import { getWithdrawals, syncWithdrawals } from '@/api/withdraw.js'

export default {
	components: { navBar, gEmpty },
	data() {
		return {
			active: 'all',
			list: [],
			tabs: [
				{ key: 'all', label: '全部' },
				{ key: 'reviewing', label: '审核中' },
				{ key: 'paid', label: '已到账' },
				{ key: 'failed', label: '失败' }
			]
		}
	},
	computed: {
		filtered() {
			if (this.active === 'all') return this.list
			return this.list.filter((item) => item.status === this.active)
		}
	},
	onShow() {
		this.list = getWithdrawals()
	},
	methods: {
		statusText(status) {
			return { reviewing: '审核中', paid: '已到账', failed: '失败' }[status] || '处理中'
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		formatTime(ts) {
			const d = new Date(ts)
			const p = (n) => String(n).padStart(2, '0')
			return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
		},
		sync() {
			const before = this.list.filter((w) => w.status === 'reviewing').length
			this.list = syncWithdrawals()
			uni.showToast({ title: before ? `已同步 ${before} 笔` : '没有需要同步的订单', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: 40rpx;
	background: $gold-cream-50;
}

.tabs {
	display: flex;
	box-sizing: border-box;
	white-space: nowrap;
	padding: 0 20rpx;
	background: #fff;

	&__item {
		display: inline-block;
		padding: 22rpx 26rpx;
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
	padding: 20rpx 30rpx;
	font-size: 24rpx;
	color: $gold-600;
	text-align: right;
}

.card {
	margin: 0 24rpx 20rpx;
	padding: 24rpx 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 14rpx;
	}

	&__amount {
		font-size: 36rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__status {
		font-size: 24rpx;
		color: $gold-600;

		&.is-failed {
			color: $gold-danger;
		}
	}
}

.line {
	display: flex;
	justify-content: space-between;
	padding: 8rpx 0;

	&__label {
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__value {
		font-size: 22rpx;
		color: $gold-ink-800;
	}
}
</style>
