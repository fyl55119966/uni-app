<template>
	<view class="page">
		<nav-bar title="黄金百科" />

		<view v-if="article" class="head">
			<text class="head__title">{{ article.title }}</text>
			<view class="head__meta">
				<text class="head__author">{{ article.author }}</text>
				<text class="head__time">发布时间：{{ article.publishedAt }}</text>
			</view>
		</view>

		<view v-if="article" class="content">
			<rich-text class="content__body" :nodes="article.content" />
		</view>

		<view v-if="related.length" class="related">
			<text class="related__title">相关阅读</text>
			<view v-for="item in related" :key="item.id" class="related__row" @click="open(item)">
				<text class="related__text">{{ item.title }}</text>
				<text class="related__arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getArticle, getArticles } from '@/api/content.js'

export default {
	components: { navBar },
	data() {
		return { id: '', article: null, related: [] }
	},
	onLoad(query) {
		this.id = query.id || ''
		this.load()
	},
	methods: {
		async load() {
			this.article = await getArticle(this.id)
			const all = await getArticles()
			this.related = all.filter((item) => item.id !== this.id).slice(0, 2)
		},
		open(item) {
			uni.redirectTo({ url: `/pages/content/wiki-detail/index?id=${item.id}` })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: 60rpx;
	background: #fff;
}

.head {
	padding: 32rpx 32rpx 0;

	&__title {
		font-size: 40rpx;
		font-weight: 700;
		line-height: 56rpx;
		color: $gold-ink-900;
	}

	&__meta {
		display: flex;
		align-items: center;
		margin-top: 18rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__author {
		margin-right: 22rpx;
		color: $gold-600;
	}
}

.content {
	padding: 24rpx 32rpx 0;

	&__body {
		font-size: 28rpx;
		line-height: 48rpx;
		color: $gold-ink-800;
	}
}

.related {
	margin: 40rpx 24rpx 0;
	padding: 24rpx 28rpx;
	background: $gold-cream-50;
	border-radius: $gold-radius-lg;

	&__title {
		font-size: 28rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__row {
		display: flex;
		align-items: center;
		padding: 18rpx 0;
		border-bottom: 1rpx solid $gold-line;

		&:last-child {
			border-bottom: 0;
		}
	}

	&__text {
		flex: 1;
		font-size: 24rpx;
		color: $gold-ink-800;
	}

	&__arrow {
		color: $gold-ink-300;
	}
}
</style>
