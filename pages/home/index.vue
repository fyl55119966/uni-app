<template>
	<view class="page">
		<view class="hero">
			<image class="hero__bg" :src="home.banner" mode="aspectFill" />
			<view class="hero__shade" />

			<view class="hero__brand">
				<image class="hero__logo" :src="home.brand.logo" mode="aspectFit" />
				<text class="hero__name">{{ home.brand.name }}</text>
			</view>
		</view>

		<swiper class="promos" :indicator-dots="true" indicator-color="rgba(90,53,8,.28)"
			indicator-active-color="#D9A133" :autoplay="true" :interval="4000" :circular="true">
			<swiper-item v-for="item in home.promos" :key="item.key">
				<view class="promo" @click="openPromo(item)">
					<image class="promo__img" :src="item.image" mode="aspectFill" />
					<view v-if="item.overlay" class="promo__text">
						<text class="promo__title">{{ item.title }}</text>
						<text class="promo__sub">{{ item.subtitle }}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>

		<view class="section">
			<view class="section__head">
				<text class="section__title">全国运营中心</text>
				<text class="section__more" @click="openCenterList">查看全部 ›</text>
			</view>
			<swiper class="centers" :autoplay="true" :interval="5000" :circular="true">
				<swiper-item v-for="item in home.centers" :key="item.name">
					<view class="center" @click="openCenter(item)">
						<view class="center__logo">
							<view class="center__logo-inner">
								<image class="center__img" :src="home.brand.logo" mode="aspectFit" />
							</view>
						</view>
						<view class="center__body">
							<text class="center__name">{{ item.name }}</text>
							<text class="center__manager">{{ item.manager }}</text>
							<text class="center__addr">{{ item.address }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="section section--wiki">
			<view class="section__head">
				<text class="section__title">百科知识</text>
				<text class="section__more" @click="openWikiList">查看全部 ›</text>
			</view>

			<view v-for="item in home.articles" :key="item.id" class="article" @click="openArticle(item)">
				<view class="article__title-row">
					<text class="badge badge--q">问</text>
					<text class="article__title">{{ item.title }}</text>
				</view>
				<view class="article__excerpt-row">
					<text class="badge badge--a">答</text>
					<text class="article__excerpt">{{ item.excerpt }}</text>
				</view>
				<view class="article__meta">
					<text class="article__source">{{ item.source }}</text>
					<text class="article__date">{{ item.date }}</text>
					<view class="article__views"><text class="iconfont icon-liulan article__eye" /><text>{{ item.views }}人浏览</text></view>
				</view>
			</view>
		</view>

		<view class="hold" />

		<view v-if="showRealname" class="realname">
			<text class="realname__text">完成实名认证或企业认证后才可进行交易</text>
			<view class="realname__btn" @click="openRealname">去实名</view>
		</view>

		<page-footer active="home" />

		<view v-if="showSubsidy" class="modal">
			<view class="modal__card">
				<text class="modal__title">新人补贴</text>
				<text class="modal__amount">¥{{ subsidyText }}</text>
				<text class="modal__tip">{{ home.subsidy.tip }}</text>
				<view class="modal__actions">
					<view class="modal__ghost" @click="closeSubsidy">稍后再说</view>
					<view class="modal__primary" @click="useSubsidy">去使用</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import pageFooter from '@/components/page-footer/index.vue'
import { getHome } from '@/api/home.js'
import { getToken, getUser } from '@/utils/token.js'

const EMPTY = {
	brand: { name: '上金所有金店', en: 'Shangjin Gold Stores', logo: '/static/images/gold/logo.png' },
	banner: '/static/images/gold/home-banner.jpg',
	ticker: [],
	promos: [],
	centers: [],
	articles: [],
	subsidy: { amount: 0, tip: '' }
}

export default {
	components: { pageFooter },
	data() {
		return {
			home: EMPTY,
			showSubsidy: false,
			showRealname: false
		}
	},
	computed: {
		subsidyText() {
			return Number(this.home.subsidy.amount || 0).toFixed(2)
		}
	},
	onLoad(options) {
		if (!getToken()) {
			uni.reLaunch({ url: '/pages/login/index?redirect=' + encodeURIComponent('/pages/home/index') })
			return
		}
		if (options && options.nosubsidy) return
		if (!uni.getStorageSync('gold_subsidy_seen')) this.showSubsidy = true
	},
	onShow() {
		this.load()
	},
	async onPullDownRefresh() {
		try {
			await this.load()
		} finally {
			uni.stopPullDownRefresh()
		}
	},
	methods: {
		async load() {
			this.home = await getHome()
			const user = getUser()
			this.showRealname = Boolean(getToken() && user && !user.realname)
		},
		openPromo(item) {
			if (item.target === 'coins') return uni.reLaunch({ url: '/pages/coins/index' })
			if (item.target === 'fans') return uni.navigateTo({ url: '/pages/fans/index' })
		},
		openCenter(item) {
			uni.navigateTo({ url: '/pages/content/centers/index' })
		},
		openCenterList() {
			uni.navigateTo({ url: '/pages/content/centers/index' })
		},
		openWikiList() {
			uni.navigateTo({ url: '/pages/content/wiki/index' })
		},
		openArticle(item) {
			uni.navigateTo({ url: `/pages/content/wiki-detail/index?id=${item.id}` })
		},
		openRealname() {
			uni.navigateTo({ url: '/pages/realname/index' })
		},
		placeholder(title, desc = '') {
			uni.navigateTo({ url: `/pages/placeholder/index?title=${encodeURIComponent(title)}&desc=${encodeURIComponent(desc)}` })
		},
		closeSubsidy() {
			this.showSubsidy = false
			uni.setStorageSync('gold_subsidy_seen', 1)
		},
		useSubsidy() {
			this.closeSubsidy()
			uni.reLaunch({ url: '/pages/coins/index' })
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
	padding-bottom: calc(10px + 200rpx);
	background: $gold-cream-50;
}

.hero {
	position: relative;
	height: 750rpx;
	overflow: hidden;

	&__bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	&__shade {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(255, 246, 229, 0.1) 0%, rgba(0, 0, 0, 0) 45%, rgba(90, 53, 8, 0.35) 100%);
	}

	&__brand {
		position: relative;
		display: flex;
		align-items: center;
		padding: calc(30rpx + var(--status-bar-height)) $gold-page-pad 0;
	}

	&__logo {
		width: 64rpx;
		height: 64rpx;
		border-radius: 12rpx;
		background: rgba(255, 255, 255, 0.85);
	}

	&__name {
		margin-left: 16rpx;
		font-size: 34rpx;
		font-weight: 700;
		letter-spacing: 2rpx;
		color: #3B2408;
	}

	&__titles {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 85rpx;
	}

	&__kicker {
		display: flex;
		align-items: center;
	}

	&__line {
		width: 48rpx;
		height: 2rpx;
		background: rgba(90, 53, 8, 0.55);
	}

	&__kicker-text {
		margin: 0 18rpx;
		font-size: 24rpx;
		letter-spacing: 6rpx;
		color: #5A3508;
	}

	&__title {
		margin-top: 18rpx;
		font-size: 72rpx;
		font-weight: 800;
		letter-spacing: 2rpx;
		color: #4A2A06;
		text-shadow: 0 2rpx 0 rgba(255, 246, 229, 0.45);
	}

	&__sub {
		margin-top: 34rpx;
		font-size: 26rpx;
		letter-spacing: 2rpx;
		color: #5A3508;
	}

	&__ticker {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 72rpx;
		background: rgba(90, 53, 8, 0.42);
	}

	&__ticker-item {
		font-size: 22rpx;
		color: #FFF6E5;
	}

	&__sep {
		margin: 0 24rpx;
		font-size: 20rpx;
		color: rgba(255, 246, 229, 0.55);
	}
}

.promos {
	height: 220rpx;
	margin: 20rpx $gold-page-pad 0;
}

.promo {
	position: relative;
	height: 220rpx;
	overflow: hidden;
	background: $gold-cream-100;
	border: 1rpx solid $gold-line;
	border-radius: $gold-radius-lg;

	&__text {
		position: absolute;
		left: 40rpx;
		top: 40rpx;
		display: flex;
		flex-direction: column;
	}

	&__title {
		font-size: 34rpx;
		font-weight: 700;
		color: #4A2A06;
	}

	&__sub {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: #6B4A1C;
	}

	&__img {
		width: 100%;
		height: 100%;
	}
}

/* #ifdef H5 */
.promos,
.promo {
	height: auto;
	aspect-ratio: 3 / 1;
}

.promo {
	container-type: inline-size;

	&__text {
		left: 5.8cqw;
		top: 50%;
		transform: translateY(-50%);
	}

	&__title {
		font-size: 4.93cqw;
	}

	&__sub {
		margin-top: 1.45cqw;
		font-size: 3.19cqw;
	}
}
/* #endif */

.section {
	margin: 24rpx $gold-page-pad 0;

	&--wiki {
		margin-top: 68rpx;
	}

	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	&__title {
		font-size: 36rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__more {
		font-size: 28rpx;
		color: $gold-ink-400;
	}
}

.centers {
	height: 250rpx;
}

.center {
	display: flex;
	align-items: center;
	height: 250rpx;
	padding: 0 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__logo {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 140rpx;
		height: 140rpx;
		margin-right: 24rpx;
		background: #fff;
		border: 2rpx solid $gold-600;
		border-radius: 50%;
	}

	&__logo-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 134rpx;
		height: 134rpx;
		overflow: hidden;
		border-radius: 50%;
	}

	&__img {
		width: 140rpx;
		height: 140rpx;
	}

	&__body {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	&__name {
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__manager {
		margin-top: 8rpx;
		font-size: 28rpx;
		color: $gold-ink-500;
	}

	&__addr {
		margin-top: 6rpx;
		font-size: 26rpx;
		line-height: 36rpx;
		color: $gold-ink-400;
	}
}

.article {
	margin-bottom: 20rpx;
	padding: 28rpx;
	background: #fff;
	border-radius: 0;

	&__title-row,
	&__excerpt-row {
		display: flex;
	}

	&__excerpt-row {
		margin-top: 12rpx;
	}

	&__title {
		flex: 1;
		display: block;
		min-width: 0;
		overflow: hidden;
		font-size: 30rpx;
		font-weight: 700;
		line-height: 42rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: $gold-ink-900;
	}

	&__excerpt {
		flex: 1;
		display: -webkit-box;
		min-width: 0;
		height: 76rpx;
		overflow: hidden;
		font-size: 26rpx;
		line-height: 38rpx;
		color: $gold-ink-500;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	&__meta {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30rpx;
		padding-top: 30rpx;
		border-top: 1rpx solid $gold-line;
		font-size: 26rpx;
		line-height: 36rpx;
		color: $gold-ink-300;
	}

	&__source {
		white-space: nowrap;
	}

	&__date {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
	}

	&__views {
		display: flex;
		align-items: center;
		margin-left: auto;
		white-space: nowrap;
	}

	&__eye {
		margin-right: 6rpx;
		font-size: 26rpx;
		line-height: 1;
		color: $gold-ink-300;
	}
}

.badge {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 36rpx;
	height: 36rpx;
	margin: 2rpx 10rpx 0 0;
	border-radius: 8rpx;
	font-size: 22rpx;
	color: #fff;

	&--q {
		background: #FFCC38;
	}

	&--a {
		background: #58D4B2;
	}
}

.hold {
	height: 20rpx;
}

.realname {
	position: fixed;
	left: 0;
	right: 0;
	bottom: calc(10px + 108rpx);
	z-index: 98;
	display: flex;
	align-items: center;
	height: 80rpx;
	padding: 0 $gold-page-pad;
	background: #FFEBA8;

	&__text {
		flex: 1;
		font-size: 24rpx;
		color: #745300;
	}

	&__btn {
		padding: 10rpx 22rpx;
		background: #8A5A00;
		border-radius: 8rpx;
		font-size: 22rpx;
		color: #FFEBA8;
	}
}

.modal {
	position: fixed;
	inset: 0;
	z-index: 300;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.55);

	&__card {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 600rpx;
		padding: 48rpx 40rpx 36rpx;
		background: #FFF9EA;
		border-radius: 28rpx;
	}

	&__title {
		font-size: 32rpx;
		font-weight: 700;
		color: #A87820;
	}

	&__amount {
		margin-top: 18rpx;
		font-size: 76rpx;
		font-weight: 800;
		color: #C4933F;
	}

	&__tip {
		margin-top: 14rpx;
		font-size: 22rpx;
		color: #A08D6F;
	}

	&__actions {
		display: flex;
		width: 100%;
		margin-top: 40rpx;
	}

	&__ghost,
	&__primary {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 88rpx;
		border-radius: 999rpx;
		font-size: 28rpx;
	}

	&__ghost {
		margin-right: 20rpx;
		border: 2rpx solid #E7D3A8;
		color: #A87820;
	}

	&__primary {
		background: $gold-gradient;
		color: #fff;
		font-weight: 600;
	}
}
</style>
