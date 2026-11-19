<template>
	<view class="page">
		<nav-bar title="粉丝" />

		<scroll-view class="tabs" scroll-x :show-scrollbar="false">
			<view v-for="tab in tabs" :key="tab.key" class="tabs__item" :class="{ 'is-active': active === tab.key }"
				@click="switchTab(tab)">{{ tab.label }}</view>
		</scroll-view>

		<view class="summary">
			<view class="summary__cell">
				<text class="summary__label">实名/粉丝总数</text>
				<text class="summary__value">{{ summary.realname }}/{{ summary.total }}</text>
			</view>
			<view class="summary__cell">
				<text class="summary__label">收益金额(元)</text>
				<text class="summary__value">{{ money(summary.earning) }}</text>
			</view>
			<view class="summary__cell">
				<text class="summary__label">消费金额(元)</text>
				<text class="summary__value">{{ money(summary.consumed) }}</text>
			</view>
			<view class="summary__cell">
				<text class="summary__label">充值金额(元)</text>
				<text class="summary__value">{{ money(summary.recharge) }}</text>
			</view>
		</view>

		<view class="search">
			<image class="search__icon" src="/static/icons/ic-search.png" mode="aspectFit" />
			<input v-model="keyword" class="search__input" placeholder="搜索姓名/手机号/会员号" />
			<text class="search__btn" @click="keyword = keyword.trim()">搜索</text>
		</view>

		<view class="filters">
			<text v-for="item in filters" :key="item.key" class="filters__item" :class="{ 'is-on': sort === item.key }"
				@click="sort = item.key">{{ item.label }} <text class="filters__caret">⌄</text></text>
		</view>

		<view class="list">
			<view v-for="item in filtered" :key="item.id" class="fan">
				<image class="fan__avatar" :src="item.avatar || '/static/images/gold/avatar.png'" mode="aspectFill" />
				<view class="fan__body">
					<view class="fan__top">
						<text class="fan__name">{{ item.name }}</text>
						<text class="fan__level">一级</text>
					</view>
					<text class="fan__meta">{{ item.memberNo }} · {{ item.joinedAt }}</text>
					<view class="fan__nums">
						<text>消费 ¥{{ money(item.consumed) }}</text>
						<text>充值 ¥{{ money(item.recharge) }}</text>
						<text class="is-on">收益 ¥{{ money(item.earning) }}</text>
					</view>
				</view>
			</view>
		</view>

		<view v-if="!filtered.length" class="empty">
			<image class="empty__icon" src="/static/images/gold/invite-coin.png" mode="aspectFit" />
			<text class="empty__text">暂无粉丝</text>
			<view class="empty__btn" @click="showInvite = true">去邀请</view>
		</view>

		<view v-if="showInvite" class="mask" @click="showInvite = false">
			<view class="dialog" @click.stop>
				<text class="dialog__title">邀请好友</text>
				<text class="dialog__desc">好友注册填写邀请码，首次订购后您可获得返佣</text>
				<text class="dialog__code">{{ code }}</text>
				<view class="dialog__btn" @click="copy">复制邀请码</view>
				<text class="dialog__cancel" @click="showInvite = false">暂不邀请</text>
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getFans } from '@/api/fans.js'

function dayStart(offset = 0) {
	const d = new Date()
	d.setHours(0, 0, 0, 0)
	d.setDate(d.getDate() - offset)
	return d.getTime()
}

export default {
	components: { navBar },
	data() {
		return {
			active: 'all',
			customDate: '',
			keyword: '',
			sort: 'time',
			list: [],
			summary: { realname: 0, total: 0, earning: 0, consumed: 0, recharge: 0 },
			code: '',
			showInvite: false,
			tabs: [
				{ key: 'all', label: '全部' },
				{ key: 'today', label: '今日' },
				{ key: 'yesterday', label: '昨日' },
				{ key: 'week', label: '近七天' },
				{ key: 'custom', label: '时间筛选' }
			],
			filters: [
				{ key: 'time', label: '时间' },
				{ key: 'consumed', label: '消费金额' },
				{ key: 'earning', label: '收益' }
			]
		}
	},
	computed: {
		filtered() {
			const keyword = this.keyword.trim()
			let list = this.list.slice()
			const now = new Date()
			if (this.active === 'today') list = list.filter((item) => (item.ts || 0) >= dayStart(0))
			if (this.active === 'yesterday') list = list.filter((item) => (item.ts || 0) >= dayStart(1) && (item.ts || 0) < dayStart(0))
			if (this.active === 'week') list = list.filter((item) => (item.ts || 0) >= dayStart(6))
			if (this.active === 'custom' && this.customDate) {
				const start = new Date(this.customDate + 'T00:00:00').getTime()
				list = list.filter((item) => (item.ts || 0) >= start && (item.ts || 0) < start + 86400000)
			}
			if (keyword) {
				list = list.filter((item) => [item.name, item.phone, item.memberNo].some((value) => String(value || '').includes(keyword)))
			}
			if (this.sort === 'consumed') list.sort((a, b) => Number(b.consumed || 0) - Number(a.consumed || 0))
			else if (this.sort === 'earning') list.sort((a, b) => Number(b.earning || 0) - Number(a.earning || 0))
			else list.sort((a, b) => Number(b.ts || 0) - Number(a.ts || 0))
			return list
		}
	},
	onShow() {
		this.load()
	},
	methods: {
		async load() {
			const data = await getFans()
			this.list = data.list
			this.summary = data.summary
			this.code = data.code
		},
		switchTab(tab) {
			if (tab.key === 'custom') {
				uni.showModal({
					title: '按日期筛选',
					editable: true,
					placeholderText: 'YYYY-MM-DD',
					success: (res) => {
						if (res.confirm && /^\d{4}-\d{2}-\d{2}$/.test(res.content || '')) {
							this.customDate = res.content
							this.active = 'custom'
						}
					}
				})
				return
			}
			this.active = tab.key
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		copy() {
			uni.setClipboardData({
				data: this.code,
				success: () => uni.showToast({ title: '邀请码已复制', icon: 'none' })
			})
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

.tabs {
	display: flex;
	white-space: nowrap;
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

.summary {
	display: flex;
	flex-wrap: wrap;
	margin: 20rpx 24rpx 0;
	padding: 12rpx 0;
	background: $gold-cream-100;
	border-radius: $gold-radius-lg;

	&__cell {
		width: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 14rpx 0;
	}

	&__label {
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__value {
		margin-top: 8rpx;
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}
}

.search {
	display: flex;
	align-items: center;
	height: 72rpx;
	margin: 20rpx 24rpx 0;
	padding: 0 20rpx;
	background: #fff;
	border-radius: $gold-radius-pill;

	&__icon {
		width: 28rpx;
		height: 28rpx;
		margin-right: 10rpx;
	}

	&__input {
		flex: 1;
		font-size: 24rpx;
	}

	&__btn {
		font-size: 24rpx;
		color: $gold-600;
	}
}

.filters {
	display: flex;
	justify-content: space-around;
	margin: 18rpx 24rpx 0;
	padding: 18rpx 0;
	background: #fff;
	border-radius: $gold-radius;

	&__item {
		font-size: 24rpx;
		color: $gold-ink-500;

		&.is-on {
			color: $gold-600;
			font-weight: 600;
		}
	}

	&__caret {
		font-size: 20rpx;
	}
}

.list {
	padding: 20rpx 24rpx 0;
}

.fan {
	display: flex;
	margin-bottom: 16rpx;
	padding: 24rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__avatar {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		background: $gold-cream-200;
	}

	&__body {
		flex: 1;
		margin-left: 18rpx;
	}

	&__top {
		display: flex;
		align-items: center;
	}

	&__name {
		font-size: 28rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__level {
		margin-left: 10rpx;
		padding: 2rpx 10rpx;
		background: $gold-100;
		border-radius: 6rpx;
		font-size: 18rpx;
		color: $gold-600;
	}

	&__meta {
		display: block;
		margin-top: 6rpx;
		font-size: 20rpx;
		color: $gold-ink-300;
	}

	&__nums {
		display: flex;
		margin-top: 10rpx;
		font-size: 20rpx;
		color: $gold-ink-400;

		text {
			margin-right: 18rpx;
		}

		.is-on {
			color: $gold-600;
		}
	}
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80rpx 0;

	&__icon {
		width: 160rpx;
		height: 160rpx;
		opacity: 0.7;
	}

	&__text {
		margin-top: 18rpx;
		font-size: 26rpx;
		color: $gold-ink-400;
	}

	&__btn {
		margin-top: 24rpx;
		padding: 16rpx 70rpx;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 28rpx;
		font-weight: 600;
		color: #fff;
	}
}

.mask {
	position: fixed;
	inset: 0;
	z-index: 300;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.5);
}

.dialog {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 580rpx;
	padding: 40rpx 36rpx 28rpx;
	background: #fff;
	border-radius: 24rpx;

	&__title {
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__desc {
		margin-top: 12rpx;
		font-size: 22rpx;
		line-height: 32rpx;
		color: $gold-ink-400;
		text-align: center;
	}

	&__code {
		margin-top: 28rpx;
		font-size: 44rpx;
		font-weight: 700;
		letter-spacing: 4rpx;
		color: $gold-600;
	}

	&__btn {
		width: 100%;
		margin-top: 30rpx;
		padding: 20rpx 0;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 28rpx;
		font-weight: 600;
		color: #fff;
		text-align: center;
	}

	&__cancel {
		margin-top: 18rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}
}
</style>
