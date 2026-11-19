<template>
	<view class="page">
		<nav-bar title="联系客服" />

		<view class="hero">
			<image class="hero__logo" src="/static/images/gold/logo.png" mode="aspectFit" />
			<text class="hero__name">上金所有金店</text>
			<text class="hero__sub">官方客服中心</text>
		</view>

		<view class="online">
			<view class="online__head">
				<view class="online__dot" />
				<text class="online__title">在线客服</text>
				<text class="online__time">工作时间 9:00–21:00</text>
			</view>
			<view class="online__btn" @click="consult">立即咨询</view>
		</view>

		<view class="card">
			<text class="card__title">常见问题</text>
			<view v-for="(item, index) in faqs" :key="item.q" class="faq">
				<view class="faq__head" @click="toggle(index)">
					<view class="faq__icon" :class="'is-' + item.type">{{ item.icon }}</view>
					<text class="faq__q">{{ item.q }}</text>
					<text class="faq__arrow" :class="{ 'is-open': open === index }">›</text>
				</view>
				<text v-if="open === index" class="faq__a">{{ item.a }}</text>
			</view>
		</view>

		<text class="back" @click="back">返回上一页</text>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'

export default {
	components: { navBar },
	data() {
		return {
			open: 0,
			faqs: [
				{ icon: '单', type: 'order', q: '订单/物流问题', a: '支付定金后 30 天内补尾款并提货；选择快递物流的订单，可在「我的订购 → 订单详情」查看物流单号与进度。' },
				{ icon: '¥', type: 'pay', q: '支付/退款问题', a: '支持支付宝与余额支付；未发货订单可申请退定金，原路退回；已发货未签收需扣除运费与保价费。' },
				{ icon: '实', type: 'account', q: '账户/实名问题', a: '未实名可以浏览，但下单、回收、提现都需要先完成实名认证；个人与企业认证均支持。' },
				{ icon: '?', type: 'other', q: '其他问题', a: '工作时间 9:00–21:00 可点「立即咨询」；非工作时间留言，客服会在次日回复。' }
			]
		}
	},
	methods: {
		toggle(index) {
			this.open = this.open === index ? -1 : index
		},
		consult() {
			uni.showModal({
				title: '在线客服',
				content: '当前为 mock 客服，不会连接真实 IM。上线前接入客服系统后，这里会打开会话窗口。',
				showCancel: false
			})
		},
		back() {
			uni.navigateBack({ fail: () => uni.reLaunch({ url: '/pages/home/index' }) })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: 60rpx;
	background: $gold-cream-50;
}

.hero {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 48rpx 0 72rpx;
	background: $gold-gradient;

	&__logo {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.92);
	}

	&__name {
		margin-top: 18rpx;
		font-size: 38rpx;
		font-weight: 700;
		color: #fff;
	}

	&__sub {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.85);
	}
}

.online {
	margin: -40rpx 24rpx 0;
	padding: 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
	box-shadow: 0 12rpx 32rpx rgba(217, 161, 51, 0.12);

	&__head {
		display: flex;
		align-items: center;
	}

	&__dot {
		width: 14rpx;
		height: 14rpx;
		margin-right: 10rpx;
		border-radius: 50%;
		background: $gold-success;
	}

	&__title {
		font-size: 28rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__time {
		margin-left: 16rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 84rpx;
		margin-top: 20rpx;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;
	}
}

.card {
	margin: 24rpx;
	padding: 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__title {
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}
}

.faq {
	border-bottom: 1rpx solid $gold-line;

	&:last-child {
		border-bottom: 0;
	}

	&__head {
		display: flex;
		align-items: center;
		padding: 26rpx 0;
	}

	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48rpx;
		height: 48rpx;
		margin-right: 16rpx;
		border-radius: 10rpx;
		font-size: 22rpx;
		color: #fff;

		&.is-order { background: #6C8BFF; }
		&.is-pay { background: #2FA36B; }
		&.is-account { background: #8A7BFF; }
		&.is-other { background: $gold-400; }
	}

	&__q {
		flex: 1;
		font-size: 26rpx;
		color: $gold-ink-800;
	}

	&__arrow {
		color: $gold-ink-300;
		transition: transform 0.2s;

		&.is-open {
			transform: rotate(90deg);
		}
	}

	&__a {
		display: block;
		padding: 0 0 26rpx 64rpx;
		font-size: 24rpx;
		line-height: 38rpx;
		color: $gold-ink-500;
	}
}

.back {
	display: block;
	margin-top: 20rpx;
	font-size: 24rpx;
	color: $gold-ink-300;
	text-align: center;
}
</style>
