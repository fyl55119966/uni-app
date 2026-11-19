<template>
	<view class="page">
		<nav-bar title="收货地址" />

		<view v-if="list.length" class="list">
			<view v-for="item in list" :key="item.id" class="card" @click="edit(item)">
				<view class="card__top">
					<text class="card__name">{{ item.name }}</text>
					<text class="card__phone">{{ item.phone }}</text>
					<text v-if="item.isDefault" class="card__tag">默认</text>
				</view>
				<text class="card__addr">{{ item.region }} {{ item.detail }}</text>
				<view class="card__actions">
					<text v-if="!item.isDefault" class="card__link" @click.stop="makeDefault(item)">设为默认</text>
					<text class="card__link" @click.stop="edit(item)">编辑</text>
				</view>
			</view>
		</view>

		<view v-else class="empty">
			<text class="empty__icon">📍</text>
			<text class="empty__title">暂无收货地址</text>
			<text class="empty__desc">添加常用地址后，下单时可快速选择</text>
		</view>

		<view class="bar">
			<view class="bar__btn" @click="add">＋ 新增收货地址</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getAddresses, setDefaultAddress } from '@/api/address.js'

export default {
	components: { navBar },
	data() {
		return { list: [] }
	},
	onShow() {
		this.list = getAddresses()
	},
	methods: {
		add() {
			uni.navigateTo({ url: '/pages/address/edit/index' })
		},
		edit(item) {
			uni.navigateTo({ url: '/pages/address/edit/index?id=' + item.id })
		},
		makeDefault(item) {
			this.list = setDefaultAddress(item.id)
			uni.showToast({ title: '已设为默认', icon: 'none' })
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

.list {
	padding: 20rpx 24rpx 0;
}

.card {
	margin-bottom: 20rpx;
	padding: 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__top {
		display: flex;
		align-items: center;
	}

	&__name {
		font-size: 30rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__phone {
		margin-left: 16rpx;
		font-size: 26rpx;
		color: $gold-ink-500;
	}

	&__tag {
		margin-left: auto;
		padding: 4rpx 12rpx;
		border: 1rpx solid $gold-600;
		border-radius: 6rpx;
		font-size: 20rpx;
		color: $gold-600;
	}

	&__addr {
		display: block;
		margin-top: 12rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: $gold-ink-500;
	}

	&__actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 16rpx;
		border-top: 1rpx solid $gold-line;
		padding-top: 16rpx;
	}

	&__link {
		margin-left: 24rpx;
		font-size: 24rpx;
		color: $gold-600;
	}
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 360rpx;

	&__icon {
		font-size: 64rpx;
	}

	&__title {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: $gold-ink-500;
	}

	&__desc {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
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
