<template>
	<view class="page">
		<nav-bar title="注销账号" />
		<view class="card">
			<text class="card__title">注销前请确认</text>
			<text class="card__warn">账号不能存在未支付订单、处理中提现、可用余额、金币克重或未完成发票申请。注销申请提交后需要等待系统检查。</text>
			<text class="card__warn">短信验证码安全校验接入前，当前不提交注销请求。</text>

			<view class="field">
				<text class="field__label">短信验证码</text>
				<input v-model="code" class="field__input" type="number" maxlength="6" placeholder="请输入验证码" />
				<text class="field__code" :class="{ 'is-off': left > 0 }" @click="sendCode">{{ left > 0 ? left + 's' : '获取验证码' }}</text>
			</view>

			<view class="reason">
				<text class="reason__label">注销原因</text>
				<textarea v-model="reason" class="reason__input" maxlength="120" placeholder="选填" />
			</view>

			<view class="agree" @click="agreed = !agreed">
				<view class="agree__box" :class="{ 'is-on': agreed }" />
				<text class="agree__text">我已阅读并理解账号注销须知</text>
			</view>

			<g-button text="申请注销账号" block @click="submit" />
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gButton from '@/components/g-button/index.vue'
import { cancelAccount } from '@/api/account.js'

export default {
	components: { navBar, gButton },
	data() {
		return { code: '', reason: '', agreed: false, left: 0, timer: null }
	},
	onUnload() {
		if (this.timer) clearInterval(this.timer)
	},
	methods: {
		sendCode() {
			if (this.left > 0) return
			this.left = 60
			uni.showToast({ title: '验证码已发送（演示 123456）', icon: 'none' })
			this.timer = setInterval(() => {
				this.left -= 1
				if (this.left <= 0) clearInterval(this.timer)
			}, 1000)
		},
		submit() {
			if (!this.agreed) return uni.showToast({ title: '请先阅读并同意注销须知', icon: 'none' })
			uni.showModal({
				title: '确认注销账号',
				content: '注销后将退出登录，历史订单仍保留 30 天。确定继续？',
				success: async (res) => {
					if (!res.confirm) return
					try {
						await cancelAccount({ code: this.code, reason: this.reason, agreed: this.agreed })
						uni.showToast({ title: '注销申请已提交', icon: 'success' })
						setTimeout(() => uni.reLaunch({ url: '/pages/login/index' }), 600)
					} catch (error) {
						uni.showToast({ title: error.message, icon: 'none' })
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: $gold-cream-50;
}

.card {
	margin: 24rpx;
	padding: 32rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__title {
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__warn {
		display: block;
		margin-top: 14rpx;
		font-size: 22rpx;
		line-height: 34rpx;
		color: $gold-ink-500;
	}
}

.field {
	display: flex;
	align-items: center;
	height: 96rpx;
	margin-top: 24rpx;
	padding: 0 24rpx;
	background: $gold-cream-50;
	border-radius: $gold-radius;

	&__label {
		width: 160rpx;
		font-size: 26rpx;
		color: $gold-ink-800;
	}

	&__input {
		flex: 1;
		font-size: 26rpx;
		color: $gold-ink-900;
	}

	&__code {
		font-size: 24rpx;
		color: $gold-600;

		&.is-off {
			color: $gold-ink-300;
		}
	}
}

.reason {
	margin-top: 24rpx;
	padding: 20rpx 24rpx;
	background: $gold-cream-50;
	border-radius: $gold-radius;

	&__label {
		font-size: 26rpx;
		color: $gold-ink-800;
	}

	&__input {
		width: 100%;
		height: 120rpx;
		margin-top: 10rpx;
		font-size: 24rpx;
		color: $gold-ink-900;
	}
}

.agree {
	display: flex;
	align-items: center;
	margin: 28rpx 0;

	&__box {
		width: 30rpx;
		height: 30rpx;
		margin-right: 12rpx;
		border: 2rpx solid $gold-ink-300;
		border-radius: 6rpx;

		&.is-on {
			border-color: $gold-600;
			background: $gold-600;
		}
	}

	&__text {
		font-size: 24rpx;
		color: $gold-ink-500;
	}
}
</style>
