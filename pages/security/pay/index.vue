<template>
	<view class="page">
		<nav-bar title="设置支付密码" />
		<view class="card">
			<text class="card__title">设置支付密码</text>
			<text class="card__hint">短信验证码将发送至已绑定手机号 180****3002</text>

			<view class="field">
				<text class="field__label">验证码</text>
				<input v-model="code" class="field__input" type="number" maxlength="6" placeholder="请输入验证码" />
				<text class="field__code" :class="{ 'is-off': left > 0 }" @click="sendCode">{{ left > 0 ? left + 's' : '获取验证码' }}</text>
			</view>
			<view class="field">
				<text class="field__label">新密码</text>
				<input v-model="password" class="field__input" type="number" password maxlength="6" placeholder="请输入 6 位数字" />
			</view>
			<view class="field">
				<text class="field__label">确认密码</text>
				<input v-model="confirm" class="field__input" type="number" password maxlength="6" placeholder="请再次输入" />
			</view>

			<text class="card__note">支付密码仅用于资金、订购和卖出等敏感操作，请勿与登录密码相同。</text>
			<g-button text="确认修改" block @click="submit" />
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gButton from '@/components/g-button/index.vue'
import { setPayPassword } from '@/api/account.js'

export default {
	components: { navBar, gButton },
	data() {
		return { code: '', password: '', confirm: '', left: 0, timer: null }
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
		async submit() {
			if (this.password !== this.confirm) return uni.showToast({ title: '两次密码不一致', icon: 'none' })
			try {
				await setPayPassword({ code: this.code, password: this.password })
				uni.showToast({ title: '支付密码已设置', icon: 'success' })
				setTimeout(() => uni.navigateBack(), 600)
			} catch (error) {
				uni.showToast({ title: error.message, icon: 'none' })
			}
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

	&__hint {
		display: block;
		margin-top: 12rpx;
		font-size: 22rpx;
		line-height: 32rpx;
		color: $gold-ink-400;
	}

	&__note {
		display: block;
		margin: 24rpx 0;
		font-size: 22rpx;
		line-height: 32rpx;
		color: $gold-ink-300;
	}
}

.field {
	display: flex;
	align-items: center;
	height: 96rpx;
	margin-top: 20rpx;
	padding: 0 24rpx;
	background: $gold-cream-50;
	border-radius: $gold-radius;

	&__label {
		width: 140rpx;
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
</style>
