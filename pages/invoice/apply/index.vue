<template>
	<view class="page">
		<nav-bar title="申请开票" />

		<view class="card">
			<view class="row" @click="pick">
				<text class="row__label">选择已完成订单</text>
				<text class="row__value" :class="{ 'is-empty': !selected }">{{ selected ? selected.title : '未选择' }}</text>
				<text class="row__arrow">›</text>
			</view>
			<text class="note">这里只提交订单信息，发票内容由客服在管理台核对，页面不展示抬头、税号、邮箱或发票号码。</text>
		</view>

		<view v-if="orders.length" class="orders">
			<view v-for="item in orders" :key="item.orderNo" class="order-row" :class="{ 'is-on': selected && selected.orderNo === item.orderNo }"
				@click="selected = item">
				<view class="order-row__body">
					<text class="order-row__title">{{ item.title }}</text>
					<text class="order-row__no">{{ item.orderNo }} · {{ formatTime(item.createdAt) }}</text>
				</view>
				<text class="order-row__amount">¥{{ money(item.total) }}</text>
				<view class="order-row__radio" :class="{ 'is-on': selected && selected.orderNo === item.orderNo }" />
			</view>
		</view>

		<view v-if="!orders.length" class="empty">
			<text class="empty__text">暂无可申请开票的已完成订单</text>
		</view>

		<view v-if="selected" class="summary">
			<view class="line"><text class="line__label">订单号</text><text class="line__value">{{ selected.orderNo }}</text></view>
			<view class="line"><text class="line__label">商品</text><text class="line__value">{{ selected.title }}</text></view>
			<view class="line"><text class="line__label">开票金额</text><text class="line__value is-on">¥{{ money(selected.total) }}</text></view>
		</view>

		<view class="bar">
			<view class="bar__btn" :class="{ 'is-disabled': !selected }" @click="submit">提交开票申请</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { applyInvoice, eligibleOrders } from '@/api/promo.js'

export default {
	components: { navBar },
	data() {
		return { orders: [], selected: null }
	},
	onShow() {
		this.load()
	},
	methods: {
		async load() {
			this.orders = await eligibleOrders()
		},
		pick() {
			if (!this.orders.length) return uni.showToast({ title: '暂无可开票订单', icon: 'none' })
			uni.showActionSheet({
				itemList: this.orders.map((o) => `${o.title} ¥${this.money(o.total)}`),
				success: (res) => {
					this.selected = this.orders[res.tapIndex]
				}
			})
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		formatTime(ts) {
			const d = new Date(ts || Date.now())
			const p = (n) => String(n).padStart(2, '0')
			return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
		},
		async submit() {
			if (!this.selected) return uni.showToast({ title: '请选择订单', icon: 'none' })
			try {
				await applyInvoice(this.selected.orderNo)
				uni.showToast({ title: '已提交开票申请', icon: 'success' })
				setTimeout(() => uni.navigateBack(), 700)
			} catch (error) {
				uni.showToast({ title: error.message, icon: 'none' })
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.orders {
	margin-top: 24rpx;
	padding: 0 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
}

.order-row {
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

	&__no {
		margin-top: 6rpx;
		font-size: 20rpx;
		color: $gold-ink-300;
	}

	&__amount {
		margin: 0 18rpx;
		font-size: 26rpx;
		color: $gold-600;
	}

	&__radio {
		width: 32rpx;
		height: 32rpx;
		border: 2rpx solid $gold-ink-300;
		border-radius: 50%;

		&.is-on {
			border-color: $gold-600;
			background: radial-gradient(circle, $gold-600 0 45%, transparent 46%);
		}
	}
}

.page {
	min-height: 100vh;
	padding: 24rpx 24rpx calc(180rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.card {
	padding: 0 28rpx 24rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
}

.row {
	display: flex;
	align-items: center;
	min-height: 100rpx;
	border-bottom: 1rpx solid $gold-line;

	&__label {
		font-size: 26rpx;
		color: $gold-ink-800;
	}

	&__value {
		flex: 1;
		font-size: 26rpx;
		color: $gold-ink-900;
		text-align: right;

		&.is-empty {
			color: $gold-ink-300;
		}
	}

	&__arrow {
		margin-left: 10rpx;
		color: $gold-ink-300;
	}
}

.note {
	display: block;
	margin-top: 18rpx;
	font-size: 22rpx;
	line-height: 34rpx;
	color: $gold-ink-400;
}

.empty {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 160rpx;
	margin-top: 24rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__text {
		font-size: 24rpx;
		color: $gold-ink-300;
	}
}

.summary {
	margin-top: 24rpx;
	padding: 20rpx 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
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

		&.is-disabled {
			opacity: 0.5;
		}
	}
}
</style>
