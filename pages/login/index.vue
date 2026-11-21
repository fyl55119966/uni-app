<template>
	<view class="page" :style="{ '--status-bar-height': statusBarHeight + 'px' }">
		<nav-bar title="登录" fixed bg="#FFFAEF" />

		<view class="brand">
			<view class="brand__logo">
				<image class="brand__img" src="/static/images/gold/login-logo.png" mode="aspectFit" />
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
				<input v-model="inviteCode" class="field__input" maxlength="16" placeholder="邀请码（选填）"
					placeholder-class="field__ph" />
			</view>

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

			<button class="login-submit" :loading="submitting" :disabled="submitting"
				hover-class="login-submit--hover" @click="submit">{{ mode === 'login' ? '登录' : '注册' }}</button>
		</view>

		<view class="other">
			<view class="other__divider" />
			<text class="other__text">其他登录方式</text>
			<view class="other__divider" />
		</view>
		<view class="other__icons">
			<view class="other__icon" @click="wechatLogin">
				<image class="other__img" src="/static/images/gold/login-wechat.png" mode="aspectFit" />
			</view>
			<view class="other__icon" @click="phoneLogin">
				<image class="other__img" src="/static/images/gold/login-phone.png" mode="aspectFit" />
			</view>
			<view v-if="mode === 'register'" class="other__icon" @click="forgot">
				<image class="other__img" src="/static/images/gold/login-lock.png" mode="aspectFit" />
			</view>
		</view>

		<view v-if="showWechatTip" class="tip-mask" @click="showWechatTip = false">
			<view class="tip" @click.stop>
				<text class="tip__tag">协议确认</text>
				<text class="tip__title">温馨提示</text>
				<text class="tip__body">为了向您提供账户与交易服务，请在继续前确认您已阅读并理解<text class="tip__strong">《用户协议》</text>和<text class="tip__strong">《隐私政策》</text>，并同意其中关于账户使用、个人信息处理及交易服务的约定。</text>
				<text class="tip__link" @click="showAgreement">《用户协议隐私政策》</text>
				<view class="tip__btns">
					<view class="tip__btn tip__btn--plain" @click="showWechatTip = false">暂不同意</view>
					<view class="tip__btn tip__btn--gold" @click="agreeWechat">同意并继续</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { login, register, wechatLogin as wechatApi } from '@/api/auth.js'
import { setSession } from '@/utils/token.js'

export default {
	components: { navBar },
	data() {
		return {
			statusBarHeight: 20,
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
			redirect: '',
			showWechatTip: false
		}
	},
	onLoad(query) {
		const sysInfo = uni.getSystemInfoSync()
		if (sysInfo.statusBarHeight) this.statusBarHeight = sysInfo.statusBarHeight
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
		wechatLogin() {
			if (!this.agreed) {
				this.showWechatTip = true
				return
			}
			this.doWechatLogin()
		},
		agreeWechat() {
			this.agreed = true
			this.showWechatTip = false
			this.doWechatLogin()
		},
		async doWechatLogin() {
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
::v-deep .nav__back-icon {
	display: none;
}

::v-deep .nav__back::after {
	width: 20rpx;
	height: 20rpx;
	border-bottom: 3rpx solid #333;
	border-left: 3rpx solid #333;
	transform: rotate(45deg);
	content: '';
}

::v-deep .nav__title {
	font-size: 38rpx;
}

.page {
	min-height: 100vh;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	background: linear-gradient(180deg, #F7EBC6 0%, #FCF4DC 45%, #FFFFFF 100%);
}

.brand {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: calc(130rpx + var(--status-bar-height)) 0 0;

	&__logo {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 200rpx;
		height: 200rpx;
		background: #fff;
		border-radius: 50%;
		box-shadow: 0 12rpx 32rpx rgba(217, 161, 51, 0.18);
	}

	&__img {
		width: 168rpx;
		height: 168rpx;
	}

	&__name {
		margin-top: 30rpx;
		font-size: 56rpx;
		font-weight: 700;
		letter-spacing: 3rpx;
		color: #000;
	}

	&__en {
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #999;
	}
}

.tabs {
	display: flex;
	justify-content: center;
	margin: 40rpx 40rpx 0;
	border-bottom: 2rpx solid #EAE6DC;

	&__item {
		position: relative;
		padding: 16rpx 44rpx 24rpx;
		font-size: 36rpx;
		color: #999;

		&.is-active {
			font-weight: 700;
			color: #000;
		}

		&.is-active::after {
			position: absolute;
			left: 50%;
			bottom: -2rpx;
			width: 150rpx;
			height: 8rpx;
			margin-left: -75rpx;
			background: linear-gradient(90deg, #F5CE5E 0%, #E0AC33 100%);
			border-radius: 8rpx;
			content: '';
		}
	}
}

.form {
	padding: 40rpx 59rpx 0;
}

.field {
	display: flex;
	align-items: center;
	height: 104rpx;
	margin-bottom: 20rpx;
	padding: 0 23rpx;
	background: #fff;
	border: 1rpx solid #F0EDE6;
	border-radius: 12rpx;

	&__input {
		flex: 1;
		height: 104rpx;
		font-size: 28rpx;
		color: $gold-ink-800;
	}

	&__ph {
		color: #B3B3B3;
	}

	&__link {
		margin-left: 16rpx;
		font-size: 26rpx;
		font-weight: 350;
		color: $gold-600;

		&.is-disabled {
			color: $gold-ink-300;
		}
	}

	&__hint {
		display: block;
		margin: 16rpx 0 16rpx 4rpx;
		font-size: 22rpx;
		font-weight: 400;
		color: #AAA;
	}
}

.captcha {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 184rpx;
	height: 72rpx;
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
	margin: 16rpx 0 34rpx;

	&__box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
		border: 2rpx solid #C6C2BA;
		border-radius: 6rpx;

		&.is-checked {
			background: $gold-600;
			border-color: $gold-600;
		}
	}

	&__tick {
		font-size: 24rpx;
		line-height: 1;
		color: #fff;
	}

	&__text {
		font-size: 26rpx;
		font-weight: 350;
		color: #333;
	}

	&__link {
		margin-left: 16rpx;
		font-size: 26rpx;
		font-weight: 350;
		color: $gold-600;
	}
}

.login-submit {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 96rpx;
	margin-top: 16rpx;
	padding: 0;
	font-size: 30rpx;
	font-weight: 600;
	line-height: 1;
	background: #F0A93B;
	border: none;
	border-radius: 16rpx;
	color: #fff;

	&::after {
		border: none;
	}

	&--hover {
		opacity: 0.85;
	}

	&[disabled] {
		opacity: 0.7;
	}
}

.tip-mask {
	position: fixed;
	z-index: 99;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.55);
}

.tip {
	display: flex;
	flex-direction: column;
	width: 600rpx;
	padding: 44rpx 44rpx 40rpx;
	background: #fff;
	border-radius: 24rpx;

	&__tag {
		font-size: 24rpx;
		text-align: center;
		color: $gold-ink-300;
	}

	&__title {
		margin-top: 12rpx;
		font-size: 36rpx;
		font-weight: 700;
		text-align: center;
		color: $gold-ink-900;
	}

	&__body {
		margin-top: 28rpx;
		font-size: 26rpx;
		line-height: 1.7;
		color: $gold-ink-500;
	}

	&__strong {
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__link {
		margin-top: 20rpx;
		font-size: 26rpx;
		color: $gold-600;
	}

	&__btns {
		display: flex;
		margin-top: 40rpx;
	}

	&__btn {
		flex: 1;
		height: 80rpx;
		font-size: 28rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 12rpx;

		&--plain {
			margin-right: 24rpx;
			border: 1rpx solid $gold-line;
			color: $gold-ink-500;
		}

		&--gold {
			font-weight: 600;
			background: #F0A93B;
			color: #fff;
		}
	}
}

.other {
	display: flex;
	align-items: center;
	padding: 30rpx 60rpx 0;

	&__divider {
		flex: 1;
		height: 2rpx;
		background: #D8D4CA;
	}

	&__text {
		margin: 0 32rpx;
		font-size: 26rpx;
		color: $gold-ink-300;
	}

	&__icons {
		display: flex;
		justify-content: center;
		margin-top: 36rpx;
	}

	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 88rpx;
		height: 88rpx;
		margin: 0 32rpx;
		background: #fff;
		border: 1rpx solid #ECE9E2;
		border-radius: 50%;
	}

	&__img {
		width: 44rpx;
		height: 44rpx;
	}
}
</style>

