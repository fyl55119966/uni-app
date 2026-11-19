<template>
	<view class="page">
		<nav-bar title="分类" />

		<view class="body">
			<view class="side">
				<view v-for="item in categories" :key="item" class="side__item" :class="{ 'is-active': active === item }"
					@click="switchCategory(item)">{{ item }}</view>
			</view>

			<scroll-view class="main" scroll-y :show-scrollbar="false">
				<view class="main__head">
					<text class="main__title">{{ active }}</text>
					<text class="main__count">{{ list.length }} 件</text>
				</view>

				<view v-for="item in list" :key="item.id" class="row" @click="open(item)">
					<image class="row__img" :src="item.images ? item.images[0] : item.image" mode="aspectFill" />
					<view class="row__body">
						<text class="row__title">{{ item.title }}</text>
						<text class="row__meta">{{ item.gram ? item.gram + 'g' : item.subtitle || '' }}</text>
						<text class="row__price">¥{{ money(item.price) }}</text>
					</view>
				</view>

				<g-empty v-if="!list.length" text="该分类暂无商品" desc="看看投资金条或其他饰品" />
				<view class="hold" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gEmpty from '@/components/g-empty/index.vue'
import { CATEGORIES, goodsByCategory } from '@/api/goods.js'

export default {
	components: { navBar, gEmpty },
	data() {
		return { categories: CATEGORIES, active: CATEGORIES[0], list: [], loading: false }
	},
	onLoad(query) {
		if (query && query.category && CATEGORIES.includes(query.category)) this.active = query.category
		this.load()
	},
	methods: {
		async load() {
			this.loading = true
			this.list = await goodsByCategory(this.active)
			this.loading = false
		},
		switchCategory(item) {
			if (this.active === item) return
			this.active = item
			this.load()
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		open(item) {
			const query = item.type === 'bar' ? `type=bar&gram=${item.gram}` : `type=jewelry&id=${item.id}`
			uni.navigateTo({ url: `/pages/goods_detail/index?${query}` })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: $gold-cream-50;
}

.body {
	flex: 1;
	display: flex;
	min-height: 0;
}

.side {
	width: 190rpx;
	background: $gold-cream-100;

	&__item {
		padding: 30rpx 20rpx;
		font-size: 26rpx;
		color: $gold-ink-500;
		text-align: center;

		&.is-active {
			background: $gold-cream-50;
			color: $gold-600;
			font-weight: 700;
			border-left: 6rpx solid $gold-600;
		}
	}
}

.main {
	flex: 1;
	padding: 24rpx;

	&__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 18rpx;
	}

	&__title {
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__count {
		font-size: 22rpx;
		color: $gold-ink-300;
	}
}

.row {
	display: flex;
	margin-bottom: 18rpx;
	padding: 18rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__img {
		width: 140rpx;
		height: 140rpx;
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

	&__meta {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__price {
		margin-top: auto;
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-600;
	}
}

.hold {
	height: 40rpx;
}
</style>
