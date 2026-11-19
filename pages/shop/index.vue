<template>
	<view class="page">
		<view class="top">
			<view class="top__chip">¥{{ gold }}/g</view>
			<text class="top__title">小店</text>
		</view>

		<scroll-view class="banners" scroll-x :show-scrollbar="false">
			<view class="banners__inner">
				<view v-for="item in shop.banners" :key="item.id" class="banner" @click="open(item)">
					<image class="banner__img" :src="item.image" mode="aspectFill" />
					<view class="banner__shade" />
					<view class="banner__info">
						<text class="banner__title">{{ item.title }}</text>
						<text class="banner__price">首饰价 ¥{{ money(item.price) }}</text>
						<text class="banner__gold">实时金价 {{ item.gold }}/g + 工费</text>
					</view>
					<view class="banner__tag">{{ item.tag }}</view>
				</view>
			</view>
		</scroll-view>

		<view class="cats">
			<view v-for="(item, index) in shop.categories" :key="item" class="cats__item"
				:class="{ 'is-active': index === active }" @click="active = index">
				<text class="cats__text">{{ item }}</text>
				<view v-if="index === active" class="cats__line" />
			</view>
		</view>

		<g-empty v-if="!filtered.length" text="暂无商品" desc="换个分类看看" />
		<view v-else class="grid">
			<view v-for="item in filtered" :key="item.id" class="card" @click="open(item)">
				<view class="card__media">
					<image class="card__img" :src="item.image" mode="aspectFill" />
					<text class="card__sold">已售{{ item.sold }}件</text>
				</view>
				<text class="card__title">{{ item.title }}</text>
				<text class="card__fav">♡ {{ item.fav }}人关注  已售{{ item.sold }}件</text>
				<text class="card__gram">{{ item.gram }}</text>
				<view class="card__price">
					<g-price :value="item.price" size="md" />
				</view>
				<text class="card__labor">金价 + ¥{{ money(item.labor) }}/g工艺费</text>
				<view class="card__buy" @click.stop="open(item)">购买</view>
			</view>
		</view>

		<page-footer active="shop" />
	</view>
</template>

<script>
import pageFooter from '@/components/page-footer/index.vue'
import gPrice from '@/components/g-price/index.vue'
import gEmpty from '@/components/g-empty/index.vue'
import { getShop } from '@/api/shop.js'
import { requireLogin } from '@/utils/guard.js'

export default {
	components: { pageFooter, gPrice, gEmpty },
	data() {
		return {
			gold: '861.42',
			active: 0,
			shop: { categories: [], banners: [], products: [] }
		}
	},
	computed: {
		filtered() {
			if (this.active === 0) return this.shop.products
			const ranges = [[0, 4], [4, 8], [8, 12]]
			const [start, end] = ranges[this.active - 1] || [0, 4]
			return this.shop.products.slice(start, end)
		}
	},
	onShow() {
		this.load()
	},
	methods: {
		async load() {
			this.shop = await getShop()
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		open(item) {
			if (!requireLogin('/pages/shop/index')) return
			uni.showToast({ title: item.title + '：详情在 04 票实现', icon: 'none' })
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

	&__chip {
		position: absolute;
		left: 24rpx;
		bottom: 18rpx;
		padding: 6rpx 18rpx;
		background: $gold-100;
		border: 1rpx solid $gold-200;
		border-radius: $gold-radius-pill;
		font-size: 24rpx;
		font-weight: 700;
		color: $gold-600;
	}

	&__title {
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}
}

.banners {
	white-space: nowrap;

	&__inner {
		display: flex;
		padding: 10rpx 24rpx 0;
	}
}

.banner {
	position: relative;
	flex: none;
	width: 520rpx;
	height: 460rpx;
	margin-right: 20rpx;
	overflow: hidden;
	border-radius: $gold-radius-lg;
	background: $gold-cream-200;

	&__img {
		width: 100%;
		height: 100%;
	}

	&__shade {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.55) 100%);
	}

	&__info {
		position: absolute;
		left: 24rpx;
		bottom: 20rpx;
		display: flex;
		flex-direction: column;
	}

	&__title {
		font-size: 30rpx;
		font-weight: 700;
		color: #fff;
	}

	&__price {
		margin-top: 8rpx;
		font-size: 26rpx;
		color: #FFE9BC;
	}

	&__gold {
		margin-top: 4rpx;
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	&__tag {
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		padding: 8rpx 16rpx;
		background: #2FA36B;
		border-radius: 8rpx;
		font-size: 22rpx;
		color: #fff;
	}
}

.cats {
	display: flex;
	align-items: center;
	margin-top: 24rpx;
	padding: 0 24rpx;
	background: #fff;

	&__item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 24rpx 0;
		margin-right: 48rpx;
	}

	&__text {
		font-size: 28rpx;
		color: $gold-ink-500;
	}

	&__item.is-active &__text {
		font-weight: 700;
		color: $gold-600;
	}

	&__line {
		position: absolute;
		bottom: 8rpx;
		width: 48rpx;
		height: 4rpx;
		background: $gold-600;
		border-radius: 2rpx;
	}
}

.grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 20rpx 24rpx 0;
}

.card {
	width: 342rpx;
	margin-bottom: 20rpx;
	padding: 16rpx 16rpx 20rpx;
	background: #fff;
	border-radius: $gold-radius;
	border: 1rpx solid $gold-line;
	box-sizing: border-box;

	&__media {
		position: relative;
		width: 100%;
		height: 320rpx;
		overflow: hidden;
		border-radius: $gold-radius-sm;
		background: $gold-cream-200;
	}

	&__img {
		width: 100%;
		height: 100%;
	}

	&__sold {
		position: absolute;
		left: 10rpx;
		bottom: 10rpx;
		padding: 4rpx 10rpx;
		background: rgba(0, 0, 0, 0.55);
		border-radius: 6rpx;
		font-size: 18rpx;
		color: #fff;
	}

	&__title {
		display: block;
		margin-top: 12rpx;
		font-size: 26rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__fav {
		display: block;
		margin-top: 8rpx;
		font-size: 20rpx;
		color: $gold-ink-300;
	}

	&__gram {
		display: inline-block;
		margin-top: 8rpx;
		padding: 2rpx 10rpx;
		border: 1rpx solid $gold-200;
		border-radius: 6rpx;
		font-size: 18rpx;
		color: #A87820;
	}

	&__price {
		display: block;
		margin-top: 8rpx;
		font-size: 32rpx;
		font-weight: 800;
		color: #E93323;
	}

	&__labor {
		display: block;
		margin-top: 2rpx;
		font-size: 18rpx;
		color: $gold-ink-400;
	}

	&__buy {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 64rpx;
		margin-top: 12rpx;
		background: $gold-gradient;
		border-radius: 8rpx;
		font-size: 26rpx;
		font-weight: 600;
		color: #fff;
	}
}
</style>
