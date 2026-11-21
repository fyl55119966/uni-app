<template>
	<view class="page">
		<view class="top">
			<view class="top__chip">¥{{ gold }}<text class="top__chip-unit">/g</text></view>
			<text class="top__title">小店</text>
		</view>

		<view class="banners">
			<image class="banners__bg" src="/static/images/gold/shop-top.jpg" mode="aspectFill" />
			<swiper v-if="banners.length" :key="active" class="banners__swiper" :circular="banners.length > 1"
				previous-margin="151rpx" next-margin="151rpx" :duration="300">
				<swiper-item v-for="item in banners" :key="item.id">
					<view class="banner" @click="open(item)">
						<image class="banner__img" :src="item.image" mode="aspectFill" />
						<view class="banner__info">
							<text class="banner__title">{{ item.title }}</text>
							<view class="banner__price">
								<text class="banner__label">{{ item.labor ? '首饰价' : '售价' }}</text>
								<g-price :value="item.price" size="md" color="#F04E50" font-size="32rpx" />
							</view>
							<view v-if="item.labor" class="banner__gold">实时金价 ¥{{ item.gold }}/g + 工费</view>
						</view>
						<view class="banner__tag">{{ item.tag }}</view>
					</view>
				</swiper-item>
			</swiper>
			<view v-if="banners.length" class="banners__hint">
				<text v-for="(char, index) in hintChars" :key="index" class="banners__hint-char">{{ char }}</text>
			</view>
		</view>

		<view class="cats">
			<view v-for="(item, index) in shop.categories" :key="item" class="cats__item"
				:class="{ 'is-active': index === active }" @click="active = index">
				<text class="cats__text">{{ item }}</text>
				<view v-if="index === active" class="cats__line" />
			</view>
		</view>

		<g-empty v-if="!filtered.length" icon="/static/icons/ic-empty-box.png" text-color="#C9AD7D"
			text="该分类暂无上架商品" />
		<view v-else class="grid">
			<view v-for="item in filtered" :key="item.id" class="card" @click="open(item)">
				<view class="card__media">
					<image class="card__img" :src="item.image" mode="aspectFill" />
					<text class="card__sold">已售{{ item.sold }}件</text>
				</view>
				<text class="card__title">{{ item.title }}</text>
				<text class="card__fav"><text class="card__heart">♥</text> {{ item.fav }}人关注  已售{{ item.sold }}件</text>
				<text class="card__gram">{{ item.gram }}</text>
				<view class="card__price">
					<g-price :value="item.price" size="md" color="#EF5E4F" />
				</view>
				<text class="card__labor" v-if="item.labor">金价 + ¥{{ money(item.labor) }}/g工艺费</text>
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
import { allGoods } from '@/api/goods.js'

export default {
	components: { pageFooter, gPrice, gEmpty },
	data() {
		return {
			gold: '869.93',
			hintChars: '左右滑动查看更多'.split(''),
			active: 0,
			shop: { categories: [], banners: [], products: [] }
		}
	},
	computed: {
		banners() {
			const list = this.shop.banners || []
			if (this.active === 0) return list
			const category = this.shop.categories[this.active]
			return list.filter((item) => item.category === category)
		},
		filtered() {
			if (this.active === 0) return this.shop.products
			const category = this.shop.categories[this.active]
			return this.shop.products.filter((item) => item.category === category)
		}
	},
	onShow() {
		this.load()
	},
	methods: {
		async load() {
			const [shop, goods] = await Promise.all([getShop(), allGoods()])
			this.shop = { ...shop, products: goods.filter((item) => item.type === 'jewelry') }
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		open(item) {
			uni.navigateTo({ url: `/pages/goods_detail/index?type=jewelry&id=${item.id}` })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: calc(300rpx + env(safe-area-inset-bottom));
	background: #F5F4F1;
}

.top {
	position: sticky;
	top: 0;
	z-index: 99;
	display: flex;
	align-items: center;
	justify-content: center;
	height: calc(88rpx + var(--status-bar-height));
	padding-top: var(--status-bar-height);
	background: #fff;

	&__chip {
		position: absolute;
		left: 32rpx;
		bottom: 6rpx;
		height: 62rpx;
		padding: 0 24rpx;
		background: #F7F7F7;
		border-radius: 6rpx;
		font-size: 32rpx;
		font-weight: 700;
		line-height: 62rpx;
		color: #D74842;
		box-sizing: border-box;

		&-unit {
			font-size: 22rpx;
		}
	}

	&__title {
		margin-top: 14rpx;
		font-size: 38rpx;
		font-weight: 700;
		color: #111111;
	}
}

.banners {
	position: relative;
	height: 599rpx;
	overflow: hidden;
	background: #EFE3C8;

	&__bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	&__swiper {
		position: relative;
		z-index: 1;
		height: 424rpx;
		margin-top: 128rpx;
	}

	&__hint {
		position: absolute;
		z-index: 2;
		top: 60.5%;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 40rpx;
		padding: 16rpx 0;
		background: #FFFFFF;
		border-radius: 12rpx 0 0 12rpx;
		transform: translateY(-50%);
		pointer-events: none;

		&-char {
			font-size: 22rpx;
			line-height: 23rpx;
			color: #3B3B3B;
		}
	}
}

.banner {
	position: relative;
	width: 436rpx;
	height: 424rpx;
	margin: 0 auto;
	padding: 8rpx;
	overflow: hidden;
	border-radius: $gold-radius;
	background: #fff;
	box-sizing: border-box;

	&__img {
		display: block;
		width: 100%;
		height: 278rpx;
		border-radius: 8rpx;
		background: $gold-cream-200;
	}

	&__info {
		display: flex;
		flex-direction: column;
		padding: 8rpx 10rpx 0;
	}

	&__title {
		font-size: 28rpx;
		font-weight: 700;
		line-height: 34rpx;
		color: #30291F;
	}

	&__price {
		display: flex;
		align-items: baseline;
		margin-top: 2rpx;
	}

	&__label {
		margin-right: 4rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__gold {
		display: block;
		width: 244rpx;
		margin-top: 4rpx;
		overflow: hidden;
		font-size: 22rpx;
		line-height: 26rpx;
		color: #A3A3A3;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	&__tag {
		position: absolute;
		right: 8rpx;
		bottom: 19rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50rpx;
		padding: 0 8rpx;
		background: #49B873;
		border-radius: 6rpx;
		font-size: 24rpx;
		font-weight: 700;
		color: #fff;
	}
}

.cats {
	display: flex;
	align-items: center;
	background: #fff;

	&__item {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 24rpx 0;
	}

	&__text {
		font-size: 28rpx;
		color: $gold-ink-500;
	}

	&__item.is-active &__text {
		font-weight: 700;
		color: #C69738;
	}

	&__line {
		position: absolute;
		bottom: 8rpx;
		width: 48rpx;
		height: 4rpx;
		background: #C69738;
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
	padding: 0 24rpx 20rpx;
	overflow: hidden;
	background: #fff;
	border-radius: $gold-radius;
	box-sizing: border-box;

	&__media {
		position: relative;
		height: 282rpx;
		margin: 0 -24rpx;
		overflow: hidden;
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

	&__heart {
		color: #EF5E4F;
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
	}

	&__labor {
		display: block;
		margin-top: 2rpx;
		font-size: 18rpx;
		font-weight: 600;
		color: #756F66;
	}

	&__buy {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 64rpx;
		margin-top: 12rpx;
		background: #D6A43A;
		border-radius: 8rpx;
		font-size: 26rpx;
		font-weight: 600;
		color: #352811;
	}
}
</style>
