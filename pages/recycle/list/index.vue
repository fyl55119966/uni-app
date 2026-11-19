<template>
	<view class="page">
		<nav-bar title="我的订单" />
		<view class="head">
			<text class="head__title">我的回收</text>
			<view class="price-chip">
				<text class="price-chip__num">¥{{ price }}</text>
				<text class="price-chip__unit">/g</text>
			</view>
		</view>

		<scroll-view class="tabs" scroll-x :show-scrollbar="false">
			<view v-for="tab in tabs" :key="tab.key" class="tabs__item" :class="{ 'is-active': active === tab.key }"
				@click="active = tab.key">{{ tab.label }}</view>
		</scroll-view>

		<view class="list">
			<view v-for="item in filtered" :key="item.recycleNo" class="card">
				<view class="card__head">
					<text class="card__no">{{ item.recycleNo }}</text>
					<text class="card__status" :class="'is-' + item.status">{{ statusText(item.status) }}</text>
				</view>

				<view class="card__main">
					<image class="card__img" :src="item.image" mode="aspectFill" />
					<view class="card__body">
						<text class="card__title">{{ item.title }}</text>
						<text class="card__spec">{{ item.gram }}g × {{ item.quantity }} 件 · {{ item.grade }}</text>
						<text class="card__price">回收价 ¥{{ money(item.price) }}/g</text>
					</view>
					<view class="card__sum">
						<text class="card__total">¥{{ money(item.total) }}</text>
						<text class="card__deposit">保证金 ¥{{ money(item.deposit) }}</text>
					</view>
				</view>

				<view class="steps">
					<view v-for="(node, i) in nodes" :key="node" class="step" :class="{ 'is-on': i <= stepIndex(item.status) }">
						<view class="step__dot" />
						<text class="step__text">{{ node }}</text>
					</view>
				</view>

				<view class="card__actions">
					<text class="card__link" @click="openContract(item)">查看合同</text>
					<text class="card__link" @click="detail(item)">查看详情</text>
				</view>

				<text v-if="item.status === 'breach'" class="card__error">违约扣款：{{ item.breachReason || '成色不足，按实测差额扣除保证金' }}</text>
			</view>
		</view>

		<view v-if="!filtered.length" class="empty">
			<text class="empty__text">没有更多了</text>
			<text class="empty__link" @click="apply">去回收 ›</text>
		</view>

		<view class="bar">
			<view class="bar__btn" @click="apply">发起回收</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getRecycles } from '@/api/recycle.js'
import { getCoin } from '@/api/coins.js'

export default {
	components: { navBar },
	data() {
		return {
			active: 'all',
			list: [],
			price: '861.42',
			tabs: [
				{ key: 'all', label: '全部' },
				{ key: 'pending_ship', label: '待交货' },
				{ key: 'inspecting', label: '待验收' },
				{ key: 'done', label: '交货完成' },
				{ key: 'closed', label: '已关闭' },
				{ key: 'breach', label: '已违约' }
			],
			nodes: ['提交', '寄出', '验收', '完成']
		}
	},
	computed: {
		filtered() {
			if (this.active === 'all') return this.list
			return this.list.filter((item) => item.status === this.active)
		}
	},
	onShow() {
		this.load()
	},
	methods: {
		async load() {
			const coin = await getCoin().catch(() => null)
			if (coin) this.price = Number(coin.price).toFixed(2)
			this.list = (await getRecycles()) || []
		},
		statusText(status) {
			return {
				pending_ship: '待交货',
				shipping: '运输中',
				inspecting: '待验收',
				done: '交货完成',
				closed: '已关闭',
				breach: '已违约'
			}[status] || '处理中'
		},
		stepIndex(status) {
			return { pending_ship: 0, shipping: 1, inspecting: 2, done: 3, breach: 2, closed: 0 }[status] ?? 0
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		openContract(item) {
			uni.navigateTo({ url: '/pages/recycle/contract/index' })
		},
		detail(item) {
			uni.showModal({
				title: '回收单 ' + item.recycleNo,
				content: `${this.statusText(item.status)}\n${item.gram}g × ${item.quantity} · ${item.grade}\n回收价 ¥${this.money(item.price)}/g\n结算 ¥${this.money(item.total)}\n保证金 ¥${this.money(item.deposit)}`,
				showCancel: false
			})
		},
		apply() {
			uni.navigateTo({ url: '/pages/recycle/apply/index' })
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

.head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 30rpx;

	&__title {
		font-size: 36rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}
}

.price-chip {
	display: flex;
	align-items: baseline;
	padding: 8rpx 18rpx;
	background: $gold-100;
	border-radius: $gold-radius-pill;

	&__num {
		font-size: 26rpx;
		font-weight: 700;
		color: $gold-600;
	}

	&__unit {
		font-size: 20rpx;
		color: $gold-600;
	}
}

.tabs {
	display: flex;
	white-space: nowrap;
	padding: 0 20rpx 16rpx;
	background: #fff;

	&__item {
		display: inline-block;
		padding: 14rpx 22rpx;
		font-size: 26rpx;
		color: $gold-ink-500;

		&.is-active {
			color: $gold-600;
			font-weight: 700;
			border-bottom: 4rpx solid $gold-600;
		}
	}
}

.list {
	padding: 20rpx 24rpx 0;
}

.card {
	margin-bottom: 20rpx;
	padding: 24rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__head {
		display: flex;
		justify-content: space-between;
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__status {
		color: $gold-600;

		&.is-breach {
			color: $gold-danger;
		}
	}

	&__main {
		display: flex;
		margin-top: 18rpx;
	}

	&__img {
		width: 120rpx;
		height: 120rpx;
		border-radius: $gold-radius;
		background: $gold-cream-200;
	}

	&__body {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 18rpx;
	}

	&__title {
		font-size: 26rpx;
		color: $gold-ink-900;
	}

	&__spec {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__price {
		margin-top: auto;
		font-size: 22rpx;
		color: $gold-ink-500;
	}

	&__sum {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	&__total {
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-600;
	}

	&__deposit {
		margin-top: 6rpx;
		font-size: 20rpx;
		color: $gold-ink-300;
	}

	&__actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 18rpx;
	}

	&__link {
		margin-left: 20rpx;
		padding: 8rpx 18rpx;
		border: 1rpx solid $gold-400;
		border-radius: $gold-radius-pill;
		font-size: 22rpx;
		color: $gold-600;
	}

	&__error {
		margin-top: 14rpx;
		font-size: 22rpx;
		color: $gold-danger;
	}
}

.steps {
	display: flex;
	margin-top: 22rpx;
}

.step {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;

	&__dot {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
		background: $gold-200;
	}

	&__text {
		margin-top: 8rpx;
		font-size: 20rpx;
		color: $gold-ink-300;
	}

	&.is-on &__dot {
		background: $gold-600;
	}

	&.is-on &__text {
		color: $gold-600;
	}
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 40rpx;

	&__text {
		font-size: 26rpx;
		color: $gold-ink-300;
	}

	&__link {
		margin-top: 18rpx;
		font-size: 24rpx;
		color: $gold-600;
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
