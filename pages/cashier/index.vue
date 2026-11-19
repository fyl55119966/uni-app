<template>
	<view class="page">
		<nav-bar title="收银台" />

		<view class="amount">
			<text class="amount__label">{{ stage === 'balance' ? '补尾款' : '支付定金' }}</text>
			<text class="amount__num">¥{{ amountText }}</text>
			<text class="amount__order">订单号 {{ orderNo }}</text>
			<text v-if="countdown" class="amount__time">支付剩余 {{ countdown }}</text>
		</view>

		<view class="methods">
			<view v-for="item in methods" :key="item.key" class="method" :class="{ 'is-active': methodKey === item.key }"
				@click="methodKey = item.key">
				<view class="method__body">
					<text class="method__name">{{ item.name }}</text>
					<text class="method__desc">{{ item.desc }}</text>
				</view>
				<view class="method__radio" :class="{ 'is-on': methodKey === item.key }" />
			</view>
		</view>

		<view v-if="isMockEnv" class="env">测试环境：不会发起真实扣款，结果仅写入本地 mock 订单。</view>

		<view class="debug">
			<text class="debug__label">模拟结果</text>
			<text class="debug__btn" @click="simulateFail">支付失败</text>
			<text class="debug__btn" @click="simulateTimeout">支付超时</text>
		</view>

		<view class="bar">
			<view class="bar__sum">
				<text class="bar__label">应付</text>
				<text class="bar__num">¥{{ amountText }}</text>
			</view>
			<view class="bar__btn" :class="{ 'is-disabled': loading }" @click="pay">
				{{ loading ? '处理中…' : '确认支付' }}
			</view>
		</view>

		<view v-if="showPwd" class="mask" @click="showPwd = false">
			<view class="dialog" @click.stop>
				<text class="dialog__title">输入支付密码</text>
				<input v-model="pwd" class="dialog__input" type="number" maxlength="6" password placeholder="6 位支付密码" />
				<text class="dialog__tip">演示密码 123456</text>
				<view class="dialog__actions">
					<view class="dialog__ghost" @click="showPwd = false">取消</view>
					<view class="dialog__primary" @click="payByBalance">确认</view>
				</view>
			</view>
		</view>

		<view v-if="showTransfer" class="mask" @click="showTransfer = false">
			<view class="dialog" @click.stop>
				<text class="dialog__title">大额转账</text>
				<view class="transfer">
					<view class="transfer__row"><text>收款户名</text><text>上金所有金店</text></view>
					<view class="transfer__row"><text>开户行</text><text>工商银行上海分行</text></view>
					<view class="transfer__row"><text>账号</text><text>1000 0000 0000 0000</text></view>
					<view class="transfer__row"><text>金额</text><text>¥{{ amountText }}</text></view>
					<view class="transfer__row"><text>附言</text><text>{{ orderNo }}</text></view>
				</view>
				<view class="upload" @click="uploadProof">
					<text class="upload__text">{{ proofPath ? '已选择凭证，点击重选' : '上传转账凭证' }}</text>
				</view>
				<view class="dialog__actions">
					<view class="dialog__ghost" @click="showTransfer = false">取消</view>
					<view class="dialog__primary" @click="submitTransfer">已转账，提交凭证</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getOrder, payOrder, failOrder, timeoutOrder } from '@/api/order.js'
import { getMine } from '@/api/mine.js'
import { payMethods, isWeixin } from '@/utils/orderState.js'

export default {
	components: { navBar },
	data() {
		return {
			orderNo: '',
			stage: 'deposit',
			order: null,
			methods: [],
			methodKey: '',
			balance: 0,
			countdown: '',
			showPwd: false,
			pwd: '',
			showTransfer: false,
			proofPath: '',
			loading: false,
			left: 15 * 60,
			timer: null
		}
	},
	computed: {
		amount() {
			if (!this.order) return 0
			return this.stage === 'balance' ? this.order.balance : this.order.deposit
		},
		amountText() {
			return Number(this.amount || 0).toFixed(2)
		},
		method() {
			return this.methods.find((m) => m.key === this.methodKey) || {}
		},
		isMockEnv() {
			return this.method.mock === true || isWeixin()
		}
	},
	onLoad(query) {
		this.orderNo = query.orderNo || ''
		this.stage = query.stage === 'balance' ? 'balance' : 'deposit'
		this.load()
	},
	onUnload() {
		if (this.timer) clearInterval(this.timer)
	},
	methods: {
		async load() {
			this.order = await getOrder(this.orderNo)
			if (!this.order) return uni.showToast({ title: '订单不存在', icon: 'none' })
			const mine = await getMine()
			this.balance = Number(mine.user.balance || 0)
			this.methods = payMethods({ amount: this.amount, balance: this.balance })
			this.methodKey = this.methods[0] ? this.methods[0].key : ''
			this.startTimer()
		},
		startTimer() {
			if (this.timer) clearInterval(this.timer)
			this.timer = setInterval(() => {
				this.left -= 1
				if (this.left <= 0) {
					clearInterval(this.timer)
					this.countdown = ''
					timeoutOrder(this.orderNo).then(() => this.done())
					return
				}
				const m = String(Math.floor(this.left / 60)).padStart(2, '0')
				const s = String(this.left % 60).padStart(2, '0')
				this.countdown = m + ':' + s
			}, 1000)
		},
		pay() {
			if (this.loading) return
			if (this.methodKey === 'balance') {
				this.pwd = ''
				this.showPwd = true
				return
			}
			if (this.methodKey === 'transfer') {
				this.showTransfer = true
				return
			}
			this.fakePay()
		},
		fakePay() {
			this.loading = true
			setTimeout(async () => {
				await payOrder(this.orderNo, { method: this.methodKey, stage: this.stage })
				this.done()
			}, 900)
		},
		async payByBalance() {
			if (!/^\d{6}$/.test(this.pwd)) {
				return uni.showToast({ title: '请输入 6 位支付密码', icon: 'none' })
			}
			this.showPwd = false
			this.loading = true
			const real = uni.getStorageSync('gold_pay_pwd') || '123456'
			if (this.pwd !== real) {
				await failOrder(this.orderNo, { method: 'balance', stage: this.stage, message: '支付密码错误' })
				this.loading = false
				return uni.showToast({ title: '支付密码错误', icon: 'none' })
			}
			await payOrder(this.orderNo, { method: 'balance', stage: this.stage })
			this.done()
		},
		uploadProof() {
			uni.chooseImage({
				count: 1,
				success: (res) => {
					this.proofPath = res.tempFilePaths[0]
				}
			})
		},
		async submitTransfer() {
			if (!this.proofPath) {
				return uni.showToast({ title: '请先上传转账凭证', icon: 'none' })
			}
			this.showTransfer = false
			this.loading = true
			await payOrder(this.orderNo, { method: 'transfer', stage: this.stage })
			this.done()
		},
		async simulateFail() {
			await failOrder(this.orderNo, { method: this.methodKey, stage: this.stage, message: '模拟支付失败' })
			this.done()
		},
		async simulateTimeout() {
			await timeoutOrder(this.orderNo)
			this.done()
		},
		done() {
			this.loading = false
			if (this.timer) clearInterval(this.timer)
			uni.redirectTo({ url: `/pages/order_detail/index?orderNo=${this.orderNo}` })
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

.amount {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 24rpx;
	padding: 48rpx 32rpx;
	background: $gold-gradient;
	border-radius: $gold-radius-lg;

	&__label {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.85);
	}

	&__num {
		margin-top: 12rpx;
		font-size: 72rpx;
		font-weight: 800;
		color: #fff;
	}

	&__order {
		margin-top: 12rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	&__time {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: #fff;
	}
}

.methods {
	margin: 0 24rpx;
	padding: 0 32rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
}

.method {
	display: flex;
	align-items: center;
	padding: 28rpx 0;
	border-bottom: 1rpx solid $gold-line;

	&:last-child {
		border-bottom: 0;
	}

	&__body {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	&__name {
		font-size: 28rpx;
		color: $gold-ink-900;
	}

	&__desc {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__radio {
		width: 36rpx;
		height: 36rpx;
		border: 2rpx solid $gold-ink-300;
		border-radius: 50%;

		&.is-on {
			border-color: $gold-600;
			background: radial-gradient(circle, $gold-600 0 45%, transparent 46%);
		}
	}
}

.env,
.debug {
	margin: 20rpx 32rpx 0;
	font-size: 22rpx;
	color: $gold-ink-300;
}

.debug {
	display: flex;
	align-items: center;

	&__label {
		margin-right: 16rpx;
	}

	&__btn {
		margin-right: 20rpx;
		color: $gold-600;
	}
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

	&__sum {
		flex: 1;
		display: flex;
		align-items: baseline;
	}

	&__label {
		font-size: 24rpx;
		color: $gold-ink-500;
	}

	&__num {
		margin-left: 10rpx;
		font-size: 38rpx;
		font-weight: 800;
		color: $gold-600;
	}

	&__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 260rpx;
		height: 84rpx;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;

		&.is-disabled {
			opacity: 0.6;
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
	width: 600rpx;
	padding: 40rpx 36rpx 32rpx;
	background: #fff;
	border-radius: 24rpx;

	&__title {
		font-size: 32rpx;
		font-weight: 700;
		color: $gold-ink-900;
		text-align: center;
	}

	&__input {
		height: 88rpx;
		margin-top: 28rpx;
		padding: 0 24rpx;
		background: $gold-cream-50;
		border-radius: $gold-radius;
		font-size: 30rpx;
		text-align: center;
	}

	&__tip {
		margin-top: 12rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
		text-align: center;
	}

	&__actions {
		display: flex;
		margin-top: 32rpx;
	}

	&__ghost,
	&__primary {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 84rpx;
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

.transfer {
	margin-top: 24rpx;

	&__row {
		display: flex;
		justify-content: space-between;
		padding: 10rpx 0;
		font-size: 24rpx;
		color: $gold-ink-500;
	}
}

.upload {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100rpx;
	margin-top: 20rpx;
	border: 2rpx dashed $gold-400;
	border-radius: $gold-radius;

	&__text {
		font-size: 24rpx;
		color: $gold-600;
	}
}
</style>
