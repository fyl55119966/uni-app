<template>
	<view class="page">
		<view class="head">
			<nav-bar title="商品详情" bg="transparent" />
		</view>

		<swiper v-if="detail" class="gallery" :indicator-dots="true" indicator-color="rgba(255,255,255,.6)"
			indicator-active-color="#D9A133" :circular="true">
			<swiper-item v-for="(img, index) in detail.images" :key="index">
				<image class="gallery__img" :src="img" mode="aspectFill" />
			</swiper-item>
		</swiper>

		<view v-if="detail" class="info">
			<view class="info__row">
				<text class="info__title">{{ detail.title }}</text>
				<text class="info__sold">已售{{ detail.sold || 0 }}件</text>
			</view>
			<text class="info__sub">{{ detail.subtitle }}</text>
			<view class="info__price">
				<text class="info__sign">¥</text>
				<text class="info__num">{{ totalText }}</text>
				<text class="info__hint">含工费 {{ laborText }} 元/g</text>
			</view>
		</view>

		<view v-if="detail" class="card">
			<view class="card__head">
				<text class="card__title">选择规格</text>
				<text class="card__stock">库存 {{ detail.stock }} 件 · 单笔限购 {{ detail.limit }} 件</text>
			</view>
			<view class="grams">
				<view v-for="g in specs" :key="g" class="grams__item" :class="{ 'is-active': g === gram }"
					@click="selectGram(g)">
					{{ g }}g
				</view>
			</view>
		</view>

		<view v-if="detail" class="card">
			<view class="line">
				<text class="line__label">当前实时金价</text>
				<text class="line__value">¥{{ priceText }} /g</text>
			</view>
			<view class="line">
				<text class="line__label">下单商品款</text>
				<text class="line__value">¥{{ goodsText }}</text>
			</view>
			<view class="line">
				<text class="line__label">提货工费</text>
				<text class="line__value">¥{{ laborText }}/g × {{ gram }}g = ¥{{ laborTotalText }}</text>
			</view>
			<view class="line line--total">
				<text class="line__label">预计订单总额</text>
				<text class="line__value">¥{{ totalText }}</text>
			</view>
			<view class="line line--pay">
				<text class="line__label">本次支付定金（10%）</text>
				<text class="line__value">¥{{ depositText }}</text>
			</view>
		</view>

		<view v-if="detail" class="card">
			<view class="card__head">
				<text class="card__title">提货方式</text>
			</view>
			<view class="delivery">
				<view v-for="item in detail.delivery" :key="item" class="delivery__item">{{ item }}</view>
			</view>
		</view>

		<view v-if="detail" class="rules">
			<view class="rules__head" @click="showRules = !showRules">
				<text class="rules__title">订购规则</text>
				<text class="rules__toggle">{{ showRules ? '收起' : '展开' }}</text>
			</view>
			<view v-if="showRules" class="rules__body">
				<text>1. 下单支付 10% 定金，提货前补齐尾款。</text>
				<text>2. 30 天内提货，逾期定金不退。</text>
				<text>3. 金价随行就市，以支付时价格为准。</text>
			</view>
		</view>

		<view class="hold" />

		<view v-if="detail" class="bar">
			<view class="bar__icon" @click="openService">
				<image class="bar__img" src="/static/icons/ic-search.png" mode="aspectFit" />
				<text class="bar__text">客服</text>
			</view>
			<view class="bar__icon" @click="toggleFav">
				<image class="bar__img" :class="{ 'is-fav': favorite }" src="/static/icons/m-star.png" mode="aspectFit" />
				<text class="bar__text">{{ favorite ? '已收藏' : '收藏' }}</text>
			</view>
			<view class="bar__buy" @click="buy">立即订购</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getBar } from '@/api/coins.js'
import { getProduct } from '@/api/shop.js'
import { calcPrice, depositOf } from '@/utils/price.js'
import { requireLogin, hasRealname, canBuyNow } from '@/utils/guard.js'

export default {
	components: { navBar },
	data() {
		return {
			type: 'bar',
			id: '',
			detail: null,
			gram: 30,
			favorites: [],
			showRules: false
		}
	},
	computed: {
		specs() {
			return this.detail ? this.detail.specs || [this.detail.gram] : []
		},
		priceText() {
			return Number(this.detail ? this.detail.price : 0).toFixed(2)
		},
		laborText() {
			return Number(this.detail ? this.detail.labor : 0).toFixed(2)
		},
		goods() {
			if (!this.detail) return 0
			return Number(this.detail.gram) > 0 ? Number(this.gram) * Number(this.detail.price) : Number(this.detail.price)
		},
		laborTotal() {
			if (!this.detail || Number(this.detail.gram) <= 0) return 0
			return Number(this.gram) * Number(this.detail.labor)
		},
		total() {
			if (!this.detail) return 0
			if (Number(this.detail.gram) > 0) return calcPrice(this.gram, this.detail.price, this.detail.labor)
			return Number(this.detail.price)
		},
		deposit() {
			return depositOf(this.total)
		},
		goodsText() {
			return this.goods.toFixed(2)
		},
		laborTotalText() {
			return this.laborTotal.toFixed(2)
		},
		totalText() {
			return this.total.toFixed(2)
		},
		depositText() {
			return this.deposit.toFixed(2)
		},
		favorite() {
			return this.favorites.includes(String(this.detail && this.detail.id))
		}
	},
	onLoad(query) {
		this.type = query.type || 'bar'
		this.id = query.id || ''
		this.gram = Number(query.gram || 30)
		this.favorites = uni.getStorageSync('gold_favorites') || []
		this.load()
	},
	methods: {
		async load() {
			this.detail = this.type === 'bar' ? await getBar(this.gram) : await getProduct(this.id)
			if (!this.detail) {
				uni.showToast({ title: '商品不存在', icon: 'none' })
				return
			}
			if (this.detail.gram) this.gram = Number(String(this.detail.gram).replace('g', '')) || 0
		},
		selectGram(gram) {
			this.gram = gram
			if (this.type === 'bar') {
				this.detail = { ...this.detail, title: `${gram}g 标准金条`, images: [`/static/images/gold/coin-${gram}.png`] }
			}
		},
		toggleFav() {
			const key = String(this.detail.id)
			this.favorites = this.favorites.includes(key)
				? this.favorites.filter((id) => id !== key)
				: [...this.favorites, key]
			uni.setStorageSync('gold_favorites', this.favorites)
		},
		openService() {
			uni.navigateTo({ url: '/pages/placeholder/index?title=' + encodeURIComponent('联系客服') })
		},
		buy() {
			if (!requireLogin(`/pages/goods_detail/index?type=${this.type}&id=${this.id}&gram=${this.gram}`)) return
			if (!hasRealname()) {
				uni.showModal({
					title: '需要实名认证',
					content: '完成实名认证后才可下单',
					confirmText: '去实名',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({ url: '/pages/realname/index' })
						}
					}
				})
				return
			}
			if (!canBuyNow()) {
				uni.showToast({ title: '现在休市中', icon: 'none' })
				return
			}
			uni.navigateTo({
				url: `/pages/order_confirm/index?type=${this.type}&id=${this.detail.id}&gram=${this.gram}`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.head {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	z-index: 10;
}

.gallery {
	height: 750rpx;
	background: $gold-cream-200;

	&__img {
		width: 100%;
		height: 100%;
	}
}

.info {
	margin: -40rpx 24rpx 0;
	position: relative;
	padding: 32rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__row {
		display: flex;
		align-items: flex-start;
	}

	&__title {
		flex: 1;
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__sold {
		margin-left: 20rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__sub {
		display: block;
		margin-top: 10rpx;
		font-size: 24rpx;
		color: $gold-ink-400;
	}

	&__price {
		display: flex;
		align-items: baseline;
		margin-top: 22rpx;
	}

	&__sign {
		font-size: 26rpx;
		color: $gold-600;
	}

	&__num {
		font-size: 52rpx;
		font-weight: 800;
		color: $gold-600;
	}

	&__hint {
		margin-left: 16rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}
}

.card {
	margin: 24rpx 24rpx 0;
	padding: 28rpx 32rpx;
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

	&__stock {
		font-size: 22rpx;
		color: $gold-ink-300;
	}
}

.grams {
	display: flex;
	margin-top: 22rpx;

	&__item {
		flex: 1;
		min-width: 0;
		height: 64rpx;
		margin-right: 12rpx;
		padding: 0 8rpx;
		border: 2rpx solid $gold-line;
		border-radius: 10rpx;
		font-size: 26rpx;
		line-height: 60rpx;
		text-align: center;
		color: $gold-ink-500;

		&:last-child {
			margin-right: 0;
		}

		&.is-active {
			border-color: $gold-500;
			background: $gold-100;
			color: $gold-600;
			font-weight: 600;
		}
	}
}

.line {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 14rpx 0;

	&__label {
		font-size: 26rpx;
		color: $gold-ink-500;
	}

	&__value {
		max-width: 460rpx;
		text-align: right;
		font-size: 26rpx;
		color: $gold-ink-900;
	}

	&--total {
		border-top: 1rpx solid $gold-line;

		.line__label,
		.line__value {
			padding-top: 14rpx;
			font-weight: 700;
		}
	}

	&--pay .line__value {
		color: $gold-600;
		font-weight: 700;
	}
}

.delivery {
	display: flex;
	margin-top: 20rpx;

	&__item {
		margin-right: 18rpx;
		padding: 12rpx 26rpx;
		background: $gold-100;
		border-radius: 10rpx;
		font-size: 24rpx;
		color: $gold-600;
	}
}

.rules {
	margin: 24rpx 24rpx 0;
	padding: 26rpx 32rpx;
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

	&__toggle {
		font-size: 24rpx;
		color: $gold-ink-400;
	}

	&__body {
		display: flex;
		flex-direction: column;
		margin-top: 16rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		color: $gold-ink-500;
	}
}

.hold {
	height: 40rpx;
}

.bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 20;
	display: flex;
	align-items: center;
	height: calc(120rpx + env(safe-area-inset-bottom));
	padding: 0 24rpx env(safe-area-inset-bottom);
	background: #fff;
	border-top: 1rpx solid $gold-line;

	&__icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 96rpx;
	}

	&__img {
		width: 40rpx;
		height: 40rpx;
	}

	&__text {
		margin-top: 4rpx;
		font-size: 20rpx;
		color: $gold-ink-400;
	}

	&__buy {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 84rpx;
		margin-left: 20rpx;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;
	}
}

.is-fav {
	opacity: 1;
}
</style>
