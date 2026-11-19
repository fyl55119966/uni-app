<template>
	<view class="page">
		<nav-bar title="我的银行卡" />

		<view v-if="!cards.length" class="empty">
			<text class="empty__icon">▭</text>
			<text class="empty__title">暂无银行卡</text>
			<text class="empty__desc">添加银行卡用于接收提现资金</text>
		</view>

		<view v-for="card in cards" :key="card.id" class="card">
			<view class="card__top">
				<text class="card__bank">{{ card.bank }}</text>
				<text v-if="card.isDefault" class="card__default">默认</text>
			</view>
			<text class="card__num">**** **** **** {{ card.tail }}</text>
			<view class="card__bottom">
				<text class="card__name">{{ card.name }}</text>
				<view class="card__actions">
					<text v-if="!card.isDefault" class="card__link" @click="setDefault(card)">设为默认</text>
					<text class="card__link is-danger" @click="unbind(card)">解绑</text>
				</view>
			</view>
		</view>

		<view class="add" @click="add">
			<text class="add__plus">＋</text>
			<text class="add__text">添加银行卡</text>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getCards, removeCard, setDefaultCard } from '@/api/bank.js'

export default {
	components: { navBar },
	data() {
		return { cards: [] }
	},
	onShow() {
		this.cards = getCards()
	},
	methods: {
		add() {
			uni.navigateTo({ url: '/pages/bank/add/index' })
		},
		setDefault(card) {
			setDefaultCard(card.id)
			this.cards = getCards()
			uni.showToast({ title: '已设为默认', icon: 'none' })
		},
		unbind(card) {
			uni.showModal({
				title: '解绑银行卡',
				content: `确认解绑尾号 ${card.tail} 的银行卡？`,
				success: (res) => {
					if (!res.confirm) return
					this.cards = removeCard(card.id)
					uni.showToast({ title: '已解绑', icon: 'none' })
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding: 24rpx;
	background: $gold-cream-50;
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 0 60rpx;

	&__icon {
		font-size: 80rpx;
		color: $gold-200;
	}

	&__title {
		margin-top: 16rpx;
		font-size: 30rpx;
		color: $gold-ink-800;
	}

	&__desc {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}
}

.card {
	margin-bottom: 20rpx;
	padding: 28rpx;
	background: $gold-gradient;
	border-radius: $gold-radius-lg;
	color: #fff;

	&__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__bank {
		font-size: 30rpx;
		font-weight: 700;
	}

	&__default {
		padding: 4rpx 14rpx;
		background: rgba(255, 255, 255, 0.25);
		border-radius: $gold-radius-pill;
		font-size: 20rpx;
	}

	&__num {
		display: block;
		margin-top: 26rpx;
		font-size: 40rpx;
		letter-spacing: 4rpx;
	}

	&__bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 24rpx;
	}

	&__name {
		font-size: 22rpx;
		opacity: 0.85;
	}

	&__actions {
		display: flex;
	}

	&__link {
		margin-left: 20rpx;
		font-size: 22rpx;
		color: #fff;

		&.is-danger {
			color: #FFE6E6;
		}
	}
}

.add {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100rpx;
	border: 2rpx dashed $gold-400;
	border-radius: $gold-radius-lg;

	&__plus {
		font-size: 32rpx;
		color: $gold-600;
	}

	&__text {
		margin-left: 10rpx;
		font-size: 26rpx;
		color: $gold-600;
	}
}
</style>
