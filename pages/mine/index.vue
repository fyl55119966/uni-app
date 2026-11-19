<template>
	<view class="page">
		<view class="top">
			<view class="top__left">
				<text class="top__ico" @click="todo('设置')">⚙</text>
				<text class="top__ico" @click="todo('消息')">🔔</text>
			</view>
			<text class="top__title">我的</text>
			<view class="top__kf" @click="todo('客服')">联系客服</view>
		</view>

		<view class="profile">
			<image class="profile__avatar" :src="mine.user.avatar" mode="aspectFill" />
			<view class="profile__info">
				<text class="profile__name">{{ mine.user.name }}</text>
				<view class="profile__member" @click="copyMember">
					<text class="profile__member-text">会员号 {{ mine.user.member }}</text>
					<text class="profile__copy">⧉</text>
				</view>
			</view>
			<view class="profile__qr" @click="todo('邀请有礼')">
				<image class="profile__qr-img" src="/static/images/gold/qr.png" mode="aspectFit" />
				<text class="profile__qr-text">邀请有礼 ›</text>
			</view>
		</view>

		<view class="assets">
			<view class="assets__cell">
				<text class="assets__num">¥{{ money(mine.user.balance) }}</text>
				<text class="assets__label">余额</text>
			</view>
			<view class="assets__line" />
			<view class="assets__cell">
				<text class="assets__num">{{ mine.user.fans }}</text>
				<text class="assets__label">粉丝</text>
			</view>
		</view>

		<view class="subsidy">
			<view class="subsidy__body">
				<view class="subsidy__row">
					<text class="subsidy__title">补贴额度</text>
					<text class="subsidy__tag">{{ mine.user.subsidyStatus }}</text>
					<text class="subsidy__amount">¥{{ money(mine.user.subsidy) }}</text>
				</view>
				<text class="subsidy__tip">抵扣预定金10%，提货抵扣工费</text>
			</view>
			<view class="subsidy__btn" @click="todo('领取补贴')">去领取 ›</view>
		</view>

		<view class="fans-card" @click="todo('粉丝收益')">
			<image class="fans-card__icon" src="/static/images/gold/invite-coin.png" mode="aspectFit" />
			<view class="fans-card__body">
				<view class="fans-card__title-row">
					<text class="fans-card__title">粉丝收益</text>
					<text class="fans-card__tag">黄金合伙人</text>
				</view>
				<text class="fans-card__desc">粉丝下单您即享收益，不限次数！</text>
				<text class="fans-card__desc">限时福利：邀请1位好友即可加入。</text>
			</view>
			<text class="fans-card__arrow">›</text>
		</view>

		<view class="block">
			<view class="block__head">
				<text class="block__title">我的订购</text>
				<text class="block__more" @click="goOrders">全部订购 ›</text>
			</view>
			<view class="block__grid">
				<view v-for="item in mine.orders" :key="item.key" class="entry" @click="todo(item.label)">
					<image class="entry__icon" :src="item.icon" mode="aspectFit" />
					<text class="entry__label">{{ item.label }}</text>
				</view>
			</view>
		</view>

		<view class="block">
			<view class="block__head">
				<text class="block__title">我的回收</text>
				<text class="block__more" @click="todo('全部回收')">全部回收 ›</text>
			</view>
			<view class="block__grid">
				<view v-for="item in mine.recycles" :key="item.key" class="entry" @click="todo(item.label)">
					<image class="entry__icon" :src="item.icon" mode="aspectFit" />
					<text class="entry__label">{{ item.label }}</text>
				</view>
			</view>
		</view>

		<view class="menu">
			<g-cell v-for="item in mine.menus" :key="item.key" :label="item.label" :icon="item.icon"
				@click="todo(item.label)" />
		</view>

		<view class="logout" @click="logout">退出登录</view>

		<view class="fab" @click="todo('客服')">
			<image class="fab__img" src="/static/images/gold/kf.png" mode="aspectFit" />
		</view>

		<page-footer active="mine" />
	</view>
</template>

<script>
import pageFooter from '@/components/page-footer/index.vue'
import gCell from '@/components/g-cell/index.vue'
import { getMine } from '@/api/mine.js'
import { logout as logoutApi } from '@/api/auth.js'
import { requireLogin } from '@/utils/guard.js'

export default {
	components: { pageFooter, gCell },
	data() {
		return {
			mine: {
				user: { name: '', member: '', avatar: '', balance: 0, fans: 0, subsidy: 0, subsidyStatus: '' },
				orders: [],
				recycles: [],
				menus: []
			}
		}
	},
	onShow() {
		if (!requireLogin('/pages/mine/index')) return
		this.load()
	},
	methods: {
		async load() {
			this.mine = await getMine()
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		copyMember() {
			uni.setClipboardData({ data: this.mine.user.member })
		},
		logout() {
			uni.showModal({
				title: '退出登录',
				content: '确定退出当前账号？',
				success: (res) => {
					if (res.confirm) {
						logoutApi()
						uni.reLaunch({ url: '/pages/login/index' })
					}
				}
			})
		},
		goOrders() {
			uni.navigateTo({ url: '/pages/orders/index' })
		},
		todo(name) {
			uni.showToast({ title: name + '在后续票据实现', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: calc(300rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.top {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	height: calc(88rpx + var(--status-bar-height));
	padding-top: var(--status-bar-height);

	&__left {
		position: absolute;
		left: 28rpx;
		bottom: 16rpx;
		display: flex;
	}

	&__ico {
		margin-right: 28rpx;
		font-size: 32rpx;
		color: $gold-600;
	}

	&__title {
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__kf {
		position: absolute;
		right: 28rpx;
		bottom: 14rpx;
		padding: 10rpx 22rpx;
		background: #fff;
		border: 1rpx solid $gold-line;
		border-radius: $gold-radius-pill;
		font-size: 22rpx;
		color: $gold-ink-800;
	}
}

.profile {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx 0;

	&__avatar {
		width: 116rpx;
		height: 116rpx;
		border-radius: 50%;
		background: $gold-cream-200;
	}

	&__info {
		flex: 1;
		margin-left: 22rpx;
	}

	&__name {
		font-size: 38rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__member {
		display: flex;
		align-items: center;
		margin-top: 8rpx;
	}

	&__member-text {
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__copy {
		margin-left: 10rpx;
		font-size: 24rpx;
		color: $gold-ink-300;
	}

	&__qr {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	&__qr-img {
		width: 92rpx;
		height: 92rpx;
		border-radius: 12rpx;
	}

	&__qr-text {
		margin-top: 6rpx;
		font-size: 20rpx;
		color: $gold-600;
	}
}

.assets {
	display: flex;
	align-items: center;
	height: 156rpx;
	margin: 22rpx 30rpx 0;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__cell {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	&__num {
		font-size: 40rpx;
		font-weight: 800;
		color: $gold-ink-900;
	}

	&__label {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__line {
		width: 1rpx;
		height: 56rpx;
		background: $gold-line;
	}
}

.subsidy {
	display: flex;
	align-items: center;
	margin: 20rpx 30rpx 0;
	padding: 24rpx 26rpx;
	background: linear-gradient(90deg, #FFF3D6 0%, #FFE9BC 100%);
	border: 1rpx solid #F2D9A0;
	border-radius: $gold-radius-lg;

	&__body {
		flex: 1;
	}

	&__row {
		display: flex;
		align-items: baseline;
	}

	&__title {
		font-size: 28rpx;
		font-weight: 700;
		color: #6B4700;
	}

	&__tag {
		margin-left: 10rpx;
		font-size: 20rpx;
		color: #A87820;
	}

	&__amount {
		margin-left: 8rpx;
		font-size: 36rpx;
		font-weight: 800;
		color: #C0392B;
	}

	&__tip {
		display: block;
		margin-top: 6rpx;
		font-size: 22rpx;
		color: #A0763A;
	}

	&__btn {
		padding: 14rpx 24rpx;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 24rpx;
		font-weight: 600;
		color: #fff;
	}
}

.fans-card {
	display: flex;
	align-items: center;
	margin: 20rpx 30rpx 0;
	padding: 24rpx;
	background: #fff;
	border: 1rpx solid $gold-line;
	border-radius: $gold-radius-lg;

	&__icon {
		width: 96rpx;
		height: 96rpx;
		border-radius: 12rpx;
		background: $gold-100;
	}

	&__body {
		flex: 1;
		margin-left: 18rpx;
	}

	&__title-row {
		display: flex;
		align-items: center;
	}

	&__title {
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__tag {
		margin-left: 10rpx;
		padding: 2rpx 10rpx;
		background: $gold-100;
		border-radius: 6rpx;
		font-size: 20rpx;
		color: #A87820;
	}

	&__desc {
		display: block;
		margin-top: 6rpx;
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__arrow {
		font-size: 34rpx;
		color: $gold-ink-300;
	}
}

.block {
	margin: 20rpx 30rpx 0;
	padding: 26rpx;
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

	&__more {
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__grid {
		display: flex;
		margin-top: 26rpx;
	}
}

.entry {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;

	&__icon {
		width: 64rpx;
		height: 64rpx;
	}

	&__label {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: $gold-ink-500;
	}
}

.menu {
	margin-top: 20rpx;
	padding: 0 30rpx;
	background: #fff;

	&__row {
		display: flex;
		align-items: center;
		height: 104rpx;
		border-bottom: 1rpx solid $gold-line;

		&:last-child {
			border-bottom: none;
		}
	}

	&__icon {
		width: 44rpx;
		height: 44rpx;
	}

	&__label {
		flex: 1;
		margin-left: 18rpx;
		font-size: 28rpx;
		color: $gold-ink-800;
	}

	&__arrow {
		font-size: 30rpx;
		color: $gold-ink-300;
	}
}

.logout {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 96rpx;
	margin: 24rpx 30rpx 0;
	background: #FFF3D6;
	border: 1rpx solid #F2D9A0;
	border-radius: $gold-radius;
	font-size: 28rpx;
	color: #8A6A20;
}

.fab {
	position: fixed;
	right: 26rpx;
	bottom: calc(180rpx + env(safe-area-inset-bottom));
	z-index: 99;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 92rpx;
	height: 92rpx;
	background: #6B6257;
	border-radius: 50%;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.18);

	&__img {
		width: 60rpx;
		height: 60rpx;
	}
}
</style>
