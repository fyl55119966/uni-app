<template>
	<view class="page">
		<nav-bar title="百科知识" />
		<view class="head">
			<text class="head__title">百科知识</text>
			<text class="head__sub">黄金投资、金币收藏与行业动态</text>
		</view>

		<view class="list">
			<view v-for="item in articles" :key="item.id" class="article" @click="open(item)">
				<view class="article__row">
					<text class="badge is-q">问</text>
					<text class="article__title">{{ item.title }}</text>
				</view>
				<view class="article__row">
					<text class="badge is-a">答</text>
					<text class="article__excerpt">{{ item.excerpt }}</text>
				</view>
				<view class="article__meta">
					<text class="article__source">{{ item.source }}</text>
					<text class="article__date">{{ item.date }}</text>
					<text class="article__views">◎ {{ item.views }}人浏览</text>
				</view>
			</view>
		</view>

		<g-empty v-if="!articles.length" text="暂无百科内容" desc="稍后再来看看" />
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gEmpty from '@/components/g-empty/index.vue'
import { getArticles } from '@/api/content.js'

export default {
	components: { navBar, gEmpty },
	data() {
		return { articles: [] }
	},
	async onLoad() {
		this.articles = await getArticles()
	},
	methods: {
		open(item) {
			uni.navigateTo({ url: `/pages/content/wiki-detail/index?id=${item.id}` })
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

.head {
	padding: 28rpx 32rpx 8rpx;

	&__title {
		font-size: 40rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__sub {
		display: block;
		margin-top: 8rpx;
		font-size: 22rpx;
		color: $gold-ink-400;
	}
}

.list {
	padding: 16rpx 24rpx 0;
}

.article {
	margin-bottom: 20rpx;
	padding: 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__row {
		display: flex;
	}

	&__row + &__row {
		margin-top: 12rpx;
	}

	&__title {
		flex: 1;
		font-size: 30rpx;
		font-weight: 600;
		line-height: 42rpx;
		color: $gold-ink-900;
	}

	&__excerpt {
		flex: 1;
		font-size: 24rpx;
		line-height: 36rpx;
		color: $gold-ink-500;
	}

	&__meta {
		display: flex;
		align-items: center;
		margin-top: 18rpx;
		font-size: 20rpx;
		color: $gold-ink-300;
	}

	&__source {
		margin-right: 22rpx;
	}

	&__date {
		margin-right: 22rpx;
	}

	&__views {
		margin-left: auto;
	}
}

.badge {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 34rpx;
	height: 34rpx;
	margin: 6rpx 10rpx 0 0;
	border-radius: 6rpx;
	font-size: 20rpx;
	color: #fff;

	&.is-q {
		background: $gold-600;
	}

	&.is-a {
		background: #2FA36B;
	}
}
</style>
