<template>
	<view class="page">
		<view class="head">
			<text class="head__back" @click="back">‹</text>
			<view class="head__box">
				<image class="head__icon" src="/static/icons/ic-search.png" mode="aspectFit" />
				<input v-model="keyword" class="head__input" confirm-type="search" placeholder="搜索金条、饰品、银饰"
					@confirm="search" />
			</view>
			<text class="head__action" @click="search">搜索</text>
		</view>

		<view v-if="!searched" class="panels">
			<view class="panel">
				<view class="panel__head">
					<text class="panel__title">搜索历史</text>
					<text v-if="history.length" class="panel__clear" @click="clearHistory">清空</text>
				</view>
				<view class="chips">
					<text v-for="item in history" :key="item" class="chip" @click="useKeyword(item)">{{ item }}</text>
					<text v-if="!history.length" class="panel__empty">还没有搜索记录</text>
				</view>
			</view>

			<view class="panel">
				<text class="panel__title">热门搜索</text>
				<view class="chips">
					<text v-for="item in hot" :key="item" class="chip is-hot" @click="useKeyword(item)">{{ item }}</text>
				</view>
			</view>

			<view class="links">
				<text class="links__item" @click="go('/pages/category/index')">按分类浏览 ›</text>
				<text class="links__item" @click="go('/pages/favorite/index')">我的收藏 ›</text>
			</view>
		</view>

		<view v-else class="results">
			<view v-if="loading" class="loading">搜索中…</view>
			<view v-for="item in results" :key="item.id" class="row" @click="open(item)">
				<image class="row__img" :src="item.images ? item.images[0] : item.image" mode="aspectFill" />
				<view class="row__body">
					<text class="row__title">{{ item.title }}</text>
					<text class="row__meta">{{ item.category }}{{ item.gram ? ' · ' + item.gram + 'g' : '' }}</text>
					<text class="row__price">¥{{ money(item.price) }}</text>
				</view>
			</view>
			<g-empty v-if="!loading && !results.length" text="没有找到相关商品" desc="换个关键词试试，例如「金条」「手镯」" />
		</view>
	</view>
</template>

<script>
import gEmpty from '@/components/g-empty/index.vue'
import { searchGoods } from '@/api/goods.js'

const HISTORY_KEY = 'gold_search_history'

function readHistory() {
	const raw = uni.getStorageSync(HISTORY_KEY)
	if (Array.isArray(raw)) return raw
	if (raw && Array.isArray(raw.data)) return raw.data
	return []
}

export default {
	components: { gEmpty },
	data() {
		return {
			keyword: '',
			history: [],
			hot: ['金条', '手镯', '吊坠', '银镯', '四叶草'],
			results: [],
			loading: false,
			searched: false
		}
	},
	onLoad() {
		this.history = readHistory()
	},
	methods: {
		back() {
			uni.navigateBack()
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		useKeyword(word) {
			this.keyword = word
			this.search()
		},
		async search() {
			const text = this.keyword.trim()
			if (!text) return uni.showToast({ title: '请输入关键词', icon: 'none' })
			this.loading = true
			this.searched = true
			this.results = await searchGoods(text)
			this.loading = false
			const list = [text, ...readHistory().filter((item) => item !== text)].slice(0, 10)
			uni.setStorageSync(HISTORY_KEY, list)
			this.history = list
		},
		clearHistory() {
			uni.setStorageSync(HISTORY_KEY, [])
			this.history = []
		},
		open(item) {
			const type = item.type === 'bar' ? 'bar' : 'jewelry'
			const query = type === 'bar' ? `type=bar&gram=${item.gram}` : `type=jewelry&id=${item.id}`
			uni.navigateTo({ url: `/pages/goods_detail/index?${query}` })
		},
		go(url) {
			uni.navigateTo({ url })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: $gold-cream-50;
}

.head {
	display: flex;
	align-items: center;
	padding: calc(16rpx + var(--status-bar-height)) 24rpx 16rpx;
	background: #fff;

	&__back {
		width: 56rpx;
		font-size: 44rpx;
		color: $gold-ink-900;
	}

	&__box {
		flex: 1;
		display: flex;
		align-items: center;
		height: 72rpx;
		padding: 0 20rpx;
		background: $gold-cream-50;
		border-radius: $gold-radius-pill;
	}

	&__icon {
		width: 30rpx;
		height: 30rpx;
		margin-right: 12rpx;
	}

	&__input {
		flex: 1;
		font-size: 26rpx;
	}

	&__action {
		margin-left: 20rpx;
		font-size: 28rpx;
		color: $gold-600;
	}
}

.panels {
	padding: 24rpx;
}

.panel {
	margin-bottom: 24rpx;
	padding: 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__head {
		display: flex;
		justify-content: space-between;
	}

	&__title {
		font-size: 28rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__clear {
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__empty {
		font-size: 22rpx;
		color: $gold-ink-300;
	}
}

.chips {
	display: flex;
	flex-wrap: wrap;
	margin-top: 18rpx;
}

.chip {
	margin: 0 16rpx 16rpx 0;
	padding: 10rpx 24rpx;
	background: $gold-cream-50;
	border: 1rpx solid $gold-line;
	border-radius: $gold-radius-pill;
	font-size: 24rpx;
	color: $gold-ink-500;

	&.is-hot {
		color: $gold-600;
		border-color: $gold-200;
		background: $gold-100;
	}
}

.links {
	display: flex;
	justify-content: space-between;
	padding: 0 12rpx;

	&__item {
		font-size: 24rpx;
		color: $gold-600;
	}
}

.results {
	padding: 24rpx;
}

.loading {
	padding: 40rpx 0;
	font-size: 24rpx;
	color: $gold-ink-300;
	text-align: center;
}

.row {
	display: flex;
	margin-bottom: 20rpx;
	padding: 20rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__img {
		width: 160rpx;
		height: 160rpx;
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
}
</style>
