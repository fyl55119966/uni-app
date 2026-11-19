<template>
	<view class="page">
		<nav-bar title="发票管理" />

		<scroll-view class="tabs" scroll-x :show-scrollbar="false">
			<view v-for="tab in tabs" :key="tab.key" class="tabs__item" :class="{ 'is-active': active === tab.key }"
				@click="active = tab.key">{{ tab.label }}</view>
		</scroll-view>

		<view class="sync" @click="sync">同步发票状态</view>

		<view v-for="item in filtered" :key="item.id" class="card">
			<view class="card__top">
				<text class="card__title">{{ item.title }}</text>
				<text class="card__status" :class="'is-' + item.status">{{ statusText(item.status) }}</text>
			</view>
			<view class="line"><text class="line__label">订单号</text><text class="line__value">{{ item.orderNo }}</text></view>
			<view class="line"><text class="line__label">开票金额</text><text class="line__value">¥{{ money(item.amount) }}</text></view>
			<view class="line"><text class="line__label">申请时间</text><text class="line__value">{{ formatTime(item.createdAt) }}</text></view>
			<text v-if="item.status === 'sent'" class="card__hint">发票已由客服发送至预留邮箱，请注意查收</text>
		</view>

		<g-empty v-if="!filtered.length" text="暂无发票记录" desc="仅已完成订单可申请开票，抬头与税号由客服后台核对" action-text="申请开票" @action="apply" />

		<view class="bar">
			<view class="bar__btn" @click="apply">申请开票</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gEmpty from '@/components/g-empty/index.vue'
import { getInvoices, syncInvoices } from '@/api/promo.js'

export default {
	components: { navBar, gEmpty },
	data() {
		return {
			active: 'all',
			list: [],
			tabs: [
				{ key: 'all', label: '全部' },
				{ key: 'submitted', label: '已提交' },
				{ key: 'issued', label: '发票已开' },
				{ key: 'sent', label: '客服已发送' }
			]
		}
	},
	computed: {
		filtered() {
			if (this.active === 'all') return this.list
			return this.list.filter((i) => i.status === this.active)
		}
	},
	onShow() {
		this.list = getInvoices()
	},
	methods: {
		statusText(status) {
			return { submitted: '已提交', issued: '发票已开', sent: '客服已发送' }[status] || '处理中'
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
			const before = this.list.filter((i) => i.status !== 'sent').length
			this.list = syncInvoices()
			uni.showToast({ title: before ? '发票状态已更新' : '没有需要同步的发票', icon: 'none' })
		},
		apply() {
			uni.navigateTo({ url: '/pages/invoice/apply/index' })
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

.tabs {
	display: flex;
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
		padding-bottom: 12rpx;
	}

	&__title {
		flex: 1;
		font-size: 28rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__status {
		margin-left: 16rpx;
		font-size: 24rpx;
		color: $gold-600;
	}

	&__hint {
		display: block;
		margin-top: 12rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
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
