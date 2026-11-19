<template>
	<view class="page">
		<nav-bar title="登录" />

		<view class="brand">
			<view class="brand__logo">
				<image class="brand__img" src="/static/images/gold/logo.png" mode="aspectFit" />
			</view>
			<text class="brand__name">上金所有金店</text>
			<text class="brand__en">Shangjin Gold Stores</text>
		</view>

		<view class="tabs">
			<view class="tabs__item" :class="{ 'is-active': mode === 'login' }" @click="switchMode('login')">
				<text>登录</text>
			</view>
			<view class="tabs__item" :class="{ 'is-active': mode === 'register' }" @click="switchMode('register')">
				<text>注册</text>
			</view>
		</view>

		<view class="form">
			<view class="field">
				<input v-model="phone" class="field__input" type="number" maxlength="11" placeholder="请输入手机号"
					placeholder-class="field__ph" />
			</view>

			<view v-if="mode === 'register'" class="field">
				<input v-model="inviteCode" class="field__input" maxlength="16"
					:placeholder="inviteCode ? '' : '邀请码（选填）'" placeholder-class="field__ph" />
			</view>
			<text v-if="mode === 'register' && inviteCode" class="field__hint">已通过邀请链接预填，注册后不可修改</text>

			<view class="field">
				<input v-model="password" class="field__input" :password="!showPwd" maxlength="16" placeholder="请输入密码"
					placeholder-class="field__ph" />
				<text v-if="mode === 'login'" class="field__link" @click="forgot">忘记密码?</text>
			</view>
			<text v-if="mode === 'register'" class="field__hint">6-16位密码，应包含字母、数字</text>

			<view v-if="mode === 'login'" class="field">
				<input v-model="captcha" class="field__input" maxlength="4" placeholder="请输入图形验证码"
					placeholder-class="field__ph" />
				<view class="captcha" @click="refreshCaptcha">
					<text class="captcha__text">{{ captchaCode }}</text>
					<view class="captcha__line" />
					<view class="captcha__line captcha__line--two" />
				</view>
			</view>

			<view v-else class="field">
				<input v-model="smsCode" class="field__input" type="number" maxlength="6" placeholder="请输入验证码"
					placeholder-class="field__ph" />
				<text class="field__link" :class="{ 'is-disabled': countdown > 0 }" @click="sendSms">
					{{ countdown > 0 ? countdown + 's 后重发' : '获取验证码' }}
				</text>
			</view>

			<view class="agree" @click="agreed = !agreed">
				<view class="agree__box" :class="{ 'is-checked': agreed }">
					<text v-if="agreed" class="agree__tick">✓</text>
				</view>
				<text class="agree__text">阅读并同意</text>
				<text class="agree__link" @click.stop="showAgreement">《用户协议隐私政策》</text>
			</view>

			<g-button class="login-submit" block :loading="submitting" :text="mode === 'login' ? '登录' : '注册'"
				@click="submit" />
		</view>

		<view class="other">
			<view class="other__divider" />
			<text class="other__text">其他登录方式</text>
			<view class="other__divider" />
		</view>
		<view class="other__icons">
			<view class="other__icon" @click="wechatLogin">
				<image class="other__img" src="/static/images/gold/wechat.png" mode="aspectFit" />
			</view>
			<view class="other__icon" @click="phoneLogin">
				<image class="other__img" src="/static/images/gold/phone.png" mode="aspectFit" />
			</view>
			<view class="other__icon" @click="forgot">
				<image class="other__img" src="/static/images/gold/lock.png" mode="aspectFit" />
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gButton from '@/components/g-button/index.vue'
import { login, register, wechatLogin as wechatApi } from '@/api/auth.js'
import { setSession } from '@/utils/token.js'

export default {
	components: { navBar, gButton },
	data() {
		return {
			mode: 'login',
			phone: '',
			password: '',
			inviteCode: '',
			captcha: '',
			smsCode: '',
			captchaCode: '',
			agreed: false,
			showPwd: false,
			countdown: 0,
			timer: null,
			submitting: false,
			redirect: ''
		}
	},
	onLoad(query) {
		if (query && query.mode === 'register') this.mode = 'register'
		if (query && query.invite) this.inviteCode = String(query.invite).toUpperCase()
		if (query && query.redirect) {
			try {
				this.redirect = decodeURIComponent(query.redirect)
			} catch (e) {
				this.redirect = query.redirect
			}
		}
		this.refreshCaptcha()
	},
	onUnload() {
		if (this.timer) clearInterval(this.timer)
	},
	methods: {
		switchMode(mode) {
			if (this.mode === mode) return
			this.mode = mode
			this.captcha = ''
			this.smsCode = ''
		},
		refreshCaptcha() {
			const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
			let code = ''
			for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
			this.captchaCode = code
			this.captcha = ''
		},
		sendSms() {
			if (this.countdown > 0) return
			if (!/^1\d{10}$/.test(this.phone)) {
				uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
				return
			}
			uni.showToast({ title: '测试环境验证码 123456', icon: 'none' })
			this.countdown = 60
			this.timer = setInterval(() => {
				this.countdown--
				if (this.countdown <= 0) clearInterval(this.timer)
			}, 1000)
		},
		forgot() {
			uni.showToast({ title: '找回密码在账户安全页实现', icon: 'none' })
		},
		showAgreement() {
			uni.showModal({
				title: '用户协议与隐私政策',
				content: '正式协议由客户提供，当前为测试环境占位文本。',
				showCancel: false
			})
		},
		async wechatLogin() {
			// #ifdef MP-WEIXIN
			try {
				const res = await new Promise((resolve, reject) => {
					uni.login({ provider: 'weixin', success: resolve, fail: reject })
				})
				const user = await wechatApi({ code: res.code })
				setSession(user)
				uni.showToast({ title: '微信登录成功', icon: 'success' })
				setTimeout(() => uni.reLaunch({ url: this.redirect || '/pages/home/index' }), 600)
			} catch (e) {
				uni.showToast({ title: e.message || '微信登录失败', icon: 'none' })
			}
			// #endif
			// #ifndef MP-WEIXIN
			uni.showToast({ title: '请在微信小程序内使用', icon: 'none' })
			// #endif
		},
		phoneLogin() {
			uni.showToast({ title: '手机号快捷登录待接入', icon: 'none' })
		},
		validate() {
			if (!/^1\d{10}$/.test(this.phone)) return '请输入正确的手机号'
			if (this.mode === 'login') {
				if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/.test(this.password)) {
					return '密码需 6-16 位且含字母和数字'
				}
				if (this.captcha.toUpperCase() !== this.captchaCode) return '图形验证码不正确'
			} else {
				if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/.test(this.password)) return '密码需 6-16 位且含字母和数字'
				if (this.smsCode !== '123456') return '短信验证码错误（测试环境 123456）'
			}
			if (!this.agreed) return '请先阅读并同意用户协议'
			return ''
		},
		async submit() {
			if (this.submitting) return
			const err = this.validate()
			if (err) {
				uni.showToast({ title: err, icon: 'none' })
				return
			}
			this.submitting = true
			try {
				const payload = { phone: this.phone, password: this.password }
				if (this.mode === 'register') {
					payload.inviteCode = this.inviteCode
					payload.smsCode = this.smsCode
				}
				const user = this.mode === 'login' ? await login(payload) : await register(payload)
				setSession(user)
				uni.showToast({ title: this.mode === 'login' ? '登录成功' : '注册成功', icon: 'success' })
				const target = this.redirect || '/pages/home/index'
				setTimeout(() => uni.reLaunch({ url: target }), 600)
			} catch (e) {
				const message = e.message || '请稍后再试'
				if (message.indexOf('图形验证码') > -1) this.refreshCaptcha()
				uni.showToast({ title: message, icon: 'none' })
			} finally {
				this.submitting = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	background: linear-gradient(180deg, #FFF6E5 0%, #FAF7F0 420rpx);
}

.brand {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0 0;

	&__logo {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 209rpx;
		height: 209rpx;
		background: #fff;
		border-radius: 50%;
		box-shadow: 0 12rpx 32rpx rgba(217, 161, 51, 0.18);
	}

	&__img {
		width: 120rpx;
		height: 120rpx;
	}

	&__name {
		margin-top: 34rpx;
		font-size: 48rpx;
		font-weight: 700;
		letter-spacing: 3rpx;
		color: $gold-ink-900;
	}

	&__en {
		margin-top: 30rpx;
		font-size: 24rpx;
		color: $gold-ink-300;
	}
}

.tabs {
	display: flex;
	justify-content: center;
	margin-top: 78rpx;

	&__item {
		position: relative;
		padding: 16rpx 44rpx 22rpx;
		font-size: 30rpx;
		color: $gold-ink-400;

		&.is-active {
			font-weight: 700;
			color: $gold-ink-900;
		}

		&.is-active::after {
			position: absolute;
			left: 50%;
			bottom: 0;
			width: 56rpx;
			height: 6rpx;
			margin-left: -28rpx;
			background: $gold-600;
			border-radius: 6rpx;
			content: '';
		}
	}
}

.form {
	padding: 71rpx 48rpx 0;
}

.field {
	display: flex;
	align-items: center;
	height: 96rpx;
	margin-bottom: 26rpx;
	padding: 0 28rpx;
	background: #fff;
	border: 1rpx solid $gold-line;
	border-radius: $gold-radius;

	&__input {
		flex: 1;
		height: 96rpx;
		font-size: 28rpx;
		color: $gold-ink-800;
	}

	&__ph {
		color: $gold-ink-300;
	}

	&__link {
		margin-left: 16rpx;
		font-size: 24rpx;
		color: $gold-600;

		&.is-disabled {
			color: $gold-ink-300;
		}
	}

	&__hint {
		display: block;
		margin: -14rpx 0 24rpx 4rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}
}

.captcha {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 176rpx;
	height: 64rpx;
	overflow: hidden;
	background: #F5F0E4;
	border-radius: 8rpx;

	&__text {
		font-family: Georgia, serif;
		font-size: 34rpx;
		font-style: italic;
		letter-spacing: 8rpx;
		color: #4B3B8F;
	}

	&__line {
		position: absolute;
		left: -10rpx;
		top: 22rpx;
		width: 200rpx;
		height: 2rpx;
		transform: rotate(-12deg);
		background: rgba(180, 120, 90, 0.45);
	}

	&__line--two {
		top: 42rpx;
		transform: rotate(8deg);
		background: rgba(120, 90, 180, 0.35);
	}
}

.agree {
	display: flex;
	align-items: center;
	margin: 6rpx 0 50rpx;

	&__box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28rpx;
		height: 28rpx;
		margin-right: 10rpx;
		border: 2rpx solid $gold-line;
		border-radius: 6rpx;

		&.is-checked {
			background: $gold-600;
			border-color: $gold-600;
		}
	}

	&__tick {
		font-size: 20rpx;
		line-height: 1;
		color: #fff;
	}

	&__text {
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__link {
		font-size: 22rpx;
		color: $gold-600;
	}
}

.login-submit {
	margin-top: 36rpx;
}

.submit {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 96rpx;
	background: $gold-gradient;
	border-radius: $gold-radius;
	font-size: 30rpx;
	font-weight: 600;
	color: #fff;

	&.is-disabled {
		opacity: 0.7;
	}
}

.other {
	display: flex;
	align-items: center;
	padding: 61rpx 84rpx 0;

	&__divider {
		flex: 1;
		height: 1rpx;
		background: $gold-line;
	}

	&__text {
		margin: 0 20rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__icons {
		display: flex;
		justify-content: center;
		margin-top: 52rpx;
	}

	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 88rpx;
		height: 88rpx;
		margin: 0 24rpx;
		background: #fff;
		border: 1rpx solid $gold-line;
		border-radius: 50%;
	}

	&__img {
		width: 44rpx;
		height: 44rpx;
	}
}
</style>

