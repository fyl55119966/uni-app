<template>
	<view class="page">
		<nav-bar title="我的收藏" />

		<view class="summary">共 {{ list.length }} 件收藏</view>

		<view v-for="item in list" :key="item.id" class="row">
			<image class="row__img" :src="item.images ? item.images[0] : item.image" mode="aspectFill" @click="open(item)" />
			<view class="row__body" @click="open(item)">
				<text class="row__title">{{ item.title }}</text>
				<text class="row__meta">{{ item.type === 'bar' ? '投资金条' : item.category || '黄金饰品' }}{{ item.gram ? ' · ' + item.gram + 'g' : '' }}</text>
				<text class="row__price">¥{{ money(item.price) }}</text>
			</view>
			<text class="row__remove" @click="remove(item)">取消收藏</text>
		</view>

		<g-empty v-if="!list.length" text="还没有收藏" desc="在商品详情点「收藏」，方便下次找到" action-text="去逛逛" @action="go" />
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gEmpty from '@/components/g-empty/index.vue'
import { getFavorites, toggleFavorite } from '@/utils/favorite.js'
import { getGoodsById } from '@/api/goods.js'
import { requireLogin } from '@/utils/guard.js'

export default {
	components: { navBar, gEmpty },
	data() {
		return { list: [] }
	},
	onShow() {
		if (!requireLogin('/pages/favorite/index')) return
		this.load()
	},
	methods: {
		async load() {
			const ids = getFavorites()
			const items = await Promise.all(ids.map((id) => getGoodsById(id)))
			this.list = items.filter(Boolean)
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		open(item) {
			const query = item.type === 'bar' ? `type=bar&gram=${item.gram}` : `type=jewelry&id=${item.id}`
			uni.navigateTo({ url: `/pages/goods_detail/index?${query}` })
		},
		remove(item) {
			toggleFavorite(item.id)
			this.list = this.list.filter((row) => String(row.id) !== String(item.id))
			uni.showToast({ title: '已取消收藏', icon: 'none' })
		},
		go() {
			uni.reLaunch({ url: '/pages/shop/index' })
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

.summary {
	padding: 20rpx 30rpx;
	font-size: 22rpx;
	color: $gold-ink-400;
}

.row {
	display: flex;
	align-items: center;
	margin: 0 24rpx 20rpx;
	padding: 20rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

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
		margin-left: 20rpx;
	}

	&__title {
		font-size: 28rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__meta {
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

	&__remove {
		margin-left: 16rpx;
		padding: 10rpx 18rpx;
		border: 1rpx solid $gold-line;
		border-radius: $gold-radius-pill;
		font-size: 22rpx;
		color: $gold-ink-400;
	}
}
</style>
