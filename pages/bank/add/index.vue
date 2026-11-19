<template>
	<view class="page">
		<nav-bar title="绑定银行卡" />

		<view class="form">
			<view class="row">
				<text class="row__label">户名</text>
				<text class="row__value">{{ userName }}</text>
			</view>
			<view class="row">
				<text class="row__label">银行卡号</text>
				<input v-model="form.number" class="row__input" type="number" maxlength="23" placeholder="请输入银行卡号" />
			</view>
			<view class="row">
				<text class="row__label">预留手机号</text>
				<input v-model="form.phone" class="row__input" type="number" maxlength="11" placeholder="请输入银行预留手机号" />
			</view>
		</view>

		<text class="tip">请绑定本人名下的银行卡，用于接收提现资金。我们将对信息进行加密处理，保障您的资金与信息安全。</text>

		<view class="save">
			<g-button text="确认绑定" block @click="submit" />
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gButton from '@/components/g-button/index.vue'
import { addCard } from '@/api/bank.js'
import { getUser } from '@/utils/token.js'

export default {
	components: { navBar, gButton },
	data() {
		return {
			form: { number: '', phone: '' },
			userName: '实名认证用户'
		}
	},
	onLoad() {
		const user = getUser() || {}
		this.userName = user.realName || user.name || '实名认证用户'
	},
	methods: {
		submit() {
			try {
				addCard(this.form)
				uni.showToast({ title: '绑定成功', icon: 'success' })
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
	padding: 24rpx;
	background: $gold-cream-50;
}

.form {
	padding: 0 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
}

.row {
	display: flex;
	align-items: center;
	min-height: 104rpx;
	border-bottom: 1rpx solid $gold-line;

	&:last-child {
		border-bottom: 0;
	}

	&__label {
		width: 190rpx;
		font-size: 26rpx;
		color: $gold-ink-800;
	}

	&__value {
		flex: 1;
		font-size: 26rpx;
		color: $gold-ink-500;
	}

	&__input {
		flex: 1;
		font-size: 26rpx;
		color: $gold-ink-900;
	}
}

.tip {
	display: block;
	margin: 24rpx 8rpx 0;
	font-size: 22rpx;
	line-height: 34rpx;
	color: $gold-ink-300;
}

.save {
	margin-top: 48rpx;
}
</style>
