<template>
	<view class="page">
		<nav-bar title="提现" />

		<view class="card">
			<view class="to" @click="openCards">
				<text class="to__label">提现到</text>
				<text class="to__value" :class="{ 'is-empty': !card }">{{ card ? `${card.bank}（${card.tail}）` : '请设置默认银行卡' }}</text>
				<text class="to__arrow">›</text>
			</view>

			<view class="amount">
				<text class="amount__label">提现金额</text>
				<view class="amount__row">
					<text class="amount__sign">¥</text>
					<input v-model="amount" class="amount__input" type="digit" placeholder="请输入提现金额" />
				</view>
				<view class="amount__meta">
					<text class="amount__balance">可用余额 ¥{{ money(balance) }}</text>
					<text class="amount__all" @click="amount = String(balance)">全部提现</text>
				</view>
			</view>
		</view>

		<view class="card info">
			<view class="line"><text class="line__label">单日最高提现金额</text><text class="line__value">¥50000.00</text></view>
			<view class="line"><text class="line__label">每日最多提现</text><text class="line__value">3 次（今日剩余 {{ Math.max(0, 3 - todayCount) }} 次）</text></view>
			<view class="line"><text class="line__label">到账金额</text><text class="line__value is-on">¥{{ money(arrival) }}</text></view>
			<view class="line"><text class="line__label">到账时间</text><text class="line__value">T+1（节假日除外）</text></view>
			<view class="line"><text class="line__label">受理时间</text><text class="line__value">每日 9:00–22:00（法定节假日顺延）</text></view>
			<view class="line"><text class="line__label">服务费</text><text class="line__value">¥{{ money(fee) }}（¥3.00 + 1%）</text></view>
		</view>

		<view class="card notice">
			<view class="notice__head" @click="showNotice = !showNotice">
				<text class="notice__title">提现须知</text>
				<text class="notice__toggle">{{ showNotice ? '收起' : '展开' }}</text>
			</view>
			<view v-if="showNotice" class="notice__body">
				<text>1. 提现金额：最低 0.01 元，单笔最高 50000 元；每日累计提现上限 50000 元。</text>
				<text>2. 提现次数：每日最多 3 次，被驳回的申请不占次数。</text>
				<text>3. 提现时间：可全天提交，平台受理打款时间为每日 9:00–22:00。</text>
				<text>4. 手续费：每笔收取固定服务费 3 元 + 提现金额 1%。</text>
				<text>5. 到账时效：T+1 到账，实际到账时间以银行为准。</text>
				<text>6. 提现账户：仅可提现至本人实名绑定的银行卡。</text>
				<text>7. 提交后对应金额暂时冻结，打款完成即解冻。</text>
			</view>
		</view>

		<view class="records" @click="openRecords">查看提现记录 ›</view>

		<view class="bar">
			<view class="bar__btn" @click="submit">提现</view>
		</view>

		<view v-if="showPwd" class="mask" @click="showPwd = false">
			<view class="dialog" @click.stop>
				<text class="dialog__title">输入支付密码</text>
				<input v-model="password" class="dialog__input" type="number" maxlength="6" password placeholder="6 位支付密码" />
				<text class="dialog__tip">演示密码 123456</text>
				<view class="dialog__actions">
					<view class="dialog__ghost" @click="showPwd = false">取消</view>
					<view class="dialog__primary" @click="confirm">确认提现</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getCards } from '@/api/bank.js'
import { applyWithdraw, getWithdrawals } from '@/api/withdraw.js'
import { getWallet } from '@/api/wallet.js'
import { calcArrival, calcWithdrawFee, validateWithdraw } from '@/utils/withdraw.js'

export default {
	components: { navBar },
	data() {
		return {
			amount: '',
			balance: 0,
			card: null,
			todayCount: 0,
			showNotice: true,
			showPwd: false,
			password: ''
		}
	},
	computed: {
		fee() {
			return calcWithdrawFee(this.amount || 0)
		},
		arrival() {
			return Math.max(0, calcArrival(this.amount || 0))
		}
	},
	onShow() {
		this.load()
	},
	methods: {
		async load() {
			const wallet = await getWallet()
			this.balance = wallet.balance
			const cards = getCards()
			this.card = cards.find((c) => c.isDefault) || cards[0] || null
			const list = getWithdrawals()
			const now = new Date()
			this.todayCount = list.filter((w) => {
				const d = new Date(w.createdAt)
				return d.toDateString() === now.toDateString()
			}).length
		},
		openCards() {
			uni.navigateTo({ url: '/pages/bank/list/index' })
		},
		openRecords() {
			uni.navigateTo({ url: '/pages/wallet/withdraw-records/index' })
		},
		money(value) {
			return Number(value || 0).toFixed(2)
		},
		submit() {
			if (!this.card) {
				uni.showToast({ title: '请先添加银行卡', icon: 'none' })
				return this.openCards()
			}
			const check = validateWithdraw({ amount: Number(this.amount), balance: this.balance, todayCount: this.todayCount })
			if (!check.ok) return uni.showToast({ title: check.message, icon: 'none' })
			this.password = ''
			this.showPwd = true
		},
		confirm() {
			try {
				applyWithdraw({ amount: Number(this.amount), cardId: this.card.id, password: this.password })
				this.showPwd = false
				uni.showToast({ title: '提现申请已提交', icon: 'success' })
				setTimeout(() => this.openRecords(), 700)
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
	padding: 24rpx 24rpx calc(180rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.card {
	margin-bottom: 20rpx;
	padding: 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
}

.to {
	display: flex;
	align-items: center;
	padding-bottom: 24rpx;
	border-bottom: 1rpx solid $gold-line;

	&__label {
		font-size: 26rpx;
		color: $gold-ink-800;
	}

	&__value {
		flex: 1;
		margin-left: 20rpx;
		font-size: 26rpx;
		color: $gold-ink-900;
		text-align: right;

		&.is-empty {
			color: $gold-600;
		}
	}

	&__arrow {
		margin-left: 10rpx;
		color: $gold-ink-300;
	}
}

.amount {
	margin-top: 24rpx;

	&__label {
		font-size: 26rpx;
		color: $gold-ink-800;
	}

	&__row {
		display: flex;
		align-items: center;
		margin-top: 16rpx;
	}

	&__sign {
		font-size: 40rpx;
		color: $gold-ink-900;
	}

	&__input {
		flex: 1;
		height: 80rpx;
		margin-left: 12rpx;
		font-size: 44rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__meta {
		display: flex;
		justify-content: space-between;
		margin-top: 10rpx;
		font-size: 22rpx;
		color: $gold-ink-400;
	}

	&__all {
		color: $gold-600;
	}
}

.line {
	display: flex;
	justify-content: space-between;
	padding: 10rpx 0;

	&__label {
		font-size: 24rpx;
		color: $gold-ink-500;
	}

	&__value {
		font-size: 24rpx;
		color: $gold-ink-900;

		&.is-on {
			color: $gold-600;
			font-weight: 600;
		}
	}
}

.notice {
	&__head {
		display: flex;
		justify-content: space-between;
	}

	&__title {
		font-size: 26rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__toggle {
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__body {
		display: flex;
		flex-direction: column;
		margin-top: 16rpx;
		font-size: 22rpx;
		line-height: 36rpx;
		color: $gold-ink-400;
	}
}

.records {
	margin-top: 24rpx;
	font-size: 24rpx;
	color: $gold-600;
	text-align: center;
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
</style>
