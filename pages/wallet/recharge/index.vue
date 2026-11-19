<template>
	<view class="page">
		<nav-bar title="充值" />

		<view class="record" @click="records">
			<text class="record__text">转账记录</text>
			<text class="record__arrow">›</text>
		</view>

		<view class="card">
			<text class="card__label">金额</text>
			<view class="amount">
				<text class="amount__sign">¥</text>
				<input v-model="amount" class="amount__input" type="digit" placeholder="请输入金额" />
			</view>
		</view>

		<view class="card">
			<text class="card__label">选择支付方式</text>
			<view v-for="item in methods" :key="item.key" class="method" @click="method = item.key">
				<view class="method__icon" :class="'is-' + item.key">{{ item.key === 'alipay' ? '支' : '汇' }}</view>
				<text class="method__name">{{ item.name }}</text>
				<text v-if="item.tag" class="method__tag">{{ item.tag }}</text>
				<view class="method__radio" :class="{ 'is-on': method === item.key }" />
			</view>
			<text class="card__note">单笔 50,000 元以内请使用支付宝支付</text>
		</view>

		<view class="tips">资金安全有保障，充值过程中如有问题，可联系客服协助处理。</view>

		<view class="bar">
			<view class="bar__btn" :class="{ 'is-disabled': !canSubmit }" @click="submit">确认充值</view>
		</view>

		<view v-if="showGuide" class="mask" @click="showGuide = false">
			<view class="dialog" @click.stop>
				<text class="dialog__title">使用说明</text>
				<scroll-view class="dialog__body" scroll-y>
					<text class="dialog__h">余额提交说明</text>
					<text class="dialog__p">1. 请确认数额及账户信息，确保正确无误！</text>
					<text class="dialog__p">2. 提交完成后操作无法撤销，请确认无误后再执行，以免发生不必要的损失。</text>
					<text class="dialog__p">3. 支付宝充值提交成功后余额实时到账；如遇特殊情况未到账，请及时联系客服处理。</text>
					<text class="dialog__p">4. 大额转账（单笔超过 5 万元）为线下汇款，非实时到账；请按页面展示的收款信息完成转账，并填写订单专属附言，财务核对银行流水后（通常为工作日）余额才会更新。</text>
					<text class="dialog__h">提现说明</text>
					<text class="dialog__p">提现需支付 3 + 1% 的手续费，请结合自身实际情况按需使用。</text>
				</scroll-view>
				<view class="dialog__agree" @click="agreed = !agreed">
					<view class="dialog__box" :class="{ 'is-on': agreed }" />
					<text class="dialog__agree-text">我已知晓并接受上述说明</text>
				</view>
				<view class="dialog__actions">
					<view class="dialog__ghost" @click="showGuide = false">取消</view>
					<view class="dialog__primary" @click="confirmPay">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { recharge } from '@/api/wallet.js'

export default {
	components: { navBar },
	data() {
		return {
			amount: '',
			method: 'alipay',
			methods: [
				{ key: 'alipay', name: '支付宝支付' },
				{ key: 'transfer', name: '大额转账', tag: '大额' }
			],
			showGuide: false,
			agreed: false
		}
	},
	computed: {
		canSubmit() {
			return Number(this.amount) > 0
		}
	},
	methods: {
		records() {
			uni.navigateTo({ url: '/pages/wallet/records/index' })
		},
		submit() {
			if (!this.canSubmit) return uni.showToast({ title: '请输入充值金额', icon: 'none' })
			if (this.method === 'alipay' && Number(this.amount) > 50000) {
				this.method = 'transfer'
				return uni.showToast({ title: '超过 5 万元请使用大额转账', icon: 'none' })
			}
			this.agreed = false
			this.showGuide = true
		},
		confirmPay() {
			if (!this.agreed) return uni.showToast({ title: '请先勾选知晓说明', icon: 'none' })
			const tx = recharge(this.amount, this.method)
			this.showGuide = false
			uni.showToast({ title: tx.status === 'success' ? '充值成功' : '已提交，等待财务确认', icon: 'none' })
			setTimeout(() => {
				uni.redirectTo({ url: '/pages/wallet/records/index' })
			}, 600)
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.record {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 20rpx 24rpx 0;
	padding: 26rpx 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__text {
		font-size: 28rpx;
		color: $gold-ink-900;
	}

	&__arrow {
		font-size: 30rpx;
		color: $gold-ink-300;
	}
}

.card {
	margin: 20rpx 24rpx 0;
	padding: 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__label {
		font-size: 26rpx;
		color: $gold-ink-800;
	}

	&__note {
		display: block;
		margin-top: 18rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}
}

.amount {
	display: flex;
	align-items: center;
	margin-top: 24rpx;
	padding-bottom: 16rpx;
	border-bottom: 1rpx solid $gold-line;

	&__sign {
		font-size: 44rpx;
		font-weight: 700;
		color: $gold-600;
	}

	&__input {
		flex: 1;
		margin-left: 16rpx;
		font-size: 44rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}
}

.method {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid $gold-line;

	&:last-of-type {
		border-bottom: 0;
	}

	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48rpx;
		height: 48rpx;
		border-radius: 10rpx;
		font-size: 24rpx;
		color: #fff;

		&.is-alipay {
			background: #1677FF;
		}

		&.is-transfer {
			background: $gold-600;
		}
	}

	&__name {
		margin-left: 16rpx;
		font-size: 28rpx;
		color: $gold-ink-900;
	}

	&__tag {
		margin-left: 12rpx;
		padding: 2rpx 10rpx;
		border: 1rpx solid $gold-400;
		border-radius: 6rpx;
		font-size: 20rpx;
		color: $gold-600;
	}

	&__radio {
		width: 36rpx;
		height: 36rpx;
		margin-left: auto;
		border: 2rpx solid $gold-ink-300;
		border-radius: 50%;

		&.is-on {
			border-color: $gold-600;
			background: radial-gradient(circle, $gold-600 0 45%, transparent 46%);
		}
	}
}

.tips {
	margin: 20rpx 32rpx 0;
	font-size: 22rpx;
	line-height: 32rpx;
	color: $gold-ink-300;
}

.bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	height: calc(120rpx + env(safe-area-inset-bottom));
	padding: 0 24rpx env(safe-area-inset-bottom);
	background: #fff;
	border-top: 1rpx solid $gold-line;

	&__btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 84rpx;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;

		&.is-disabled {
			opacity: 0.5;
		}
	}
}

.mask {
	position: fixed;
	inset: 0;
	z-index: 300;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.5);
}

.dialog {
	display: flex;
	flex-direction: column;
	width: 620rpx;
	max-height: 80vh;
	padding: 36rpx;
	background: #fff;
	border-radius: 24rpx;

	&__title {
		font-size: 32rpx;
		font-weight: 700;
		color: $gold-ink-900;
		text-align: center;
	}

	&__body {
		max-height: 50vh;
		margin-top: 20rpx;
	}

	&__h {
		display: block;
		margin: 16rpx 0 8rpx;
		font-size: 26rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__p {
		display: block;
		margin-top: 8rpx;
		font-size: 22rpx;
		line-height: 34rpx;
		color: $gold-ink-500;
	}

	&__agree {
		display: flex;
		align-items: center;
		margin-top: 20rpx;
	}

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

	&__agree-text {
		font-size: 22rpx;
		color: $gold-ink-500;
	}

	&__actions {
		display: flex;
		margin-top: 24rpx;
	}

	&__ghost,
	&__primary {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		border-radius: $gold-radius-pill;
		font-size: 28rpx;
	}

	&__ghost {
		margin-right: 20rpx;
		border: 2rpx solid $gold-line;
		color: $gold-ink-500;
	}

	&__primary {
		background: $gold-gradient;
		color: #fff;
		font-weight: 600;
	}
}
</style>
