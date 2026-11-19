<template>
	<view class="page">
		<nav-bar title="回收申请" />

		<view class="steps">
			<view v-for="(item, i) in steps" :key="item" class="step">
				<view class="step__dot" :class="{ 'is-on': i === 0 }">{{ i + 1 }}</view>
				<text class="step__text">{{ item }}</text>
			</view>
		</view>

		<view class="chart">
			<view class="chart__tabs">
				<text v-for="(item, i) in periods" :key="item" class="chart__tab" :class="{ 'is-on': i === 0 }">{{ item }}</text>
			</view>
			<image class="chart__img" src="/static/images/gold/coin-chart.png" mode="widthFix" />
		</view>

		<view class="form">
			<view class="row">
				<text class="row__label">商品名称</text>
				<picker class="row__value" :range="products" range-key="label" @change="onProduct">
					<text>{{ products[productIndex].label }}</text>
				</picker>
			</view>
			<view class="row">
				<text class="row__label">克重（克）</text>
				<input v-model="gram" class="row__input" type="digit" placeholder="请输入克重" />
			</view>
			<view class="row">
				<text class="row__label">数量（件）</text>
				<input v-model="quantity" class="row__input" type="number" placeholder="1" />
			</view>
			<view class="row">
				<text class="row__label">成色</text>
				<picker class="row__value" :range="form.grades" @change="gradeIndex = Number($event.detail.value)">
					<text>{{ form.grades[gradeIndex] }}</text>
				</picker>
			</view>
			<view class="row">
				<text class="row__label">交货方式</text>
				<view class="segment">
					<text class="segment__item" :class="{ 'is-on': mode === 'ship' }" @click="mode = 'ship'">快递寄送</text>
					<text class="segment__item" :class="{ 'is-on': mode === 'store' }" @click="mode = 'store'">到店交货</text>
				</view>
			</view>
			<view v-if="mode === 'ship'" class="row">
				<text class="row__label">寄回地址</text>
				<picker class="row__value" :range="addressLabels" @change="addressIndex = Number($event.detail.value)">
					<text>{{ addressLabels[addressIndex] }}</text>
				</picker>
			</view>
			<view v-else class="row">
				<text class="row__label">交货门店</text>
				<picker class="row__value" :range="storeLabels" @change="storeIndex = Number($event.detail.value)">
					<text>{{ storeLabels[storeIndex] }}</text>
				</picker>
			</view>
		</view>

		<view class="quote">
			<view class="quote__row">
				<text class="quote__label">回收单价</text>
				<text class="quote__value">¥{{ quote.price.toFixed(2) }}/克</text>
			</view>
			<view class="quote__row">
				<text class="quote__label">结算总额</text>
				<text class="quote__value">¥{{ quote.total.toFixed(2) }}</text>
			</view>
			<view class="quote__row">
				<text class="quote__label">保证金（10%）</text>
				<text class="quote__value is-strong">¥{{ quote.deposit.toFixed(2) }}</text>
			</view>
			<text class="quote__note">回收价 = 实时金价 − ¥0.5/克，随金价实时变化；预约后按约定价结算。保证金寄货前缴纳，验收完成后随结算款一并退回余额。</text>
		</view>

		<view class="agree" @click="agreed = !agreed">
			<view class="agree__box" :class="{ 'is-on': agreed }" />
			<text class="agree__text">阅读并签署</text>
			<text class="agree__link" @click.stop="openContract">《投资金条回收电子合同》</text>
		</view>

		<view class="bar">
			<view class="bar__sum">
				<text class="bar__label">保证金</text>
				<text class="bar__num">¥{{ quote.deposit.toFixed(2) }}</text>
			</view>
			<view class="bar__btn" @click="submit">立即预约</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getRecycleForm, createRecycle } from '@/api/recycle.js'
import { recycleQuote } from '@/utils/recycle.js'
import { requireLogin } from '@/utils/guard.js'

export default {
	components: { navBar },
	data() {
		return {
			steps: ['选择商品', '缴纳保证金', '寄货验货', '交收结算'],
			periods: ['今日', '近5日', '近7日', '近30日'],
			products: [
				{ label: '1g 投资金条', gram: 1 },
				{ label: '5g 投资金条', gram: 5 },
				{ label: '15g 投资金条', gram: 15 },
				{ label: '30g 投资金条', gram: 30 },
				{ label: '100g 投资金条', gram: 100 }
			],
			productIndex: 3,
			gram: 30,
			quantity: 1,
			gradeIndex: 0,
			mode: 'ship',
			addressIndex: 0,
			storeIndex: 0,
			agreed: false,
			form: { stores: [], addresses: [], grades: ['99.9%', '99.99%'] }
		}
	},
	computed: {
		quote() {
			return recycleQuote(this.gram, this.quantity)
		},
		addressLabels() {
			return (this.form.addresses || []).map((a) => `${a.name} ${a.region}`)
		},
		storeLabels() {
			return (this.form.stores || []).map((s) => s.name)
		}
	},
	onShow() {
		if (!requireLogin('/pages/recycle/apply/index')) return
		this.load()
		if (uni.getStorageSync('gold_contract_signed')) this.agreed = true
	},
	methods: {
		async load() {
			this.form = await getRecycleForm()
		},
		onProduct(e) {
			this.productIndex = Number(e.detail.value)
			this.gram = this.products[this.productIndex].gram
		},
		openContract() {
			uni.navigateTo({ url: '/pages/recycle/contract/index' })
		},
		async submit() {
			if (!this.agreed) return uni.showToast({ title: '请先阅读并签署回收合同', icon: 'none' })
			if (!(Number(this.gram) > 0)) return uni.showToast({ title: '请输入克重', icon: 'none' })
			if (!(Number(this.quantity) > 0)) return uni.showToast({ title: '请输入数量', icon: 'none' })
			if (this.mode === 'ship' && !this.form.addresses.length) {
				return uni.showToast({ title: '请先添加寄回地址', icon: 'none' })
			}
			if (this.mode === 'store' && !this.form.stores.length) {
				return uni.showToast({ title: '暂无可用门店', icon: 'none' })
			}
			const address = this.form.addresses[this.addressIndex] || {}
			const store = this.form.stores[this.storeIndex] || {}
			const recycle = await createRecycle({
				type: 'bar',
				gram: Number(this.gram),
				quantity: Number(this.quantity),
				grade: this.form.grades[this.gradeIndex],
				mode: this.mode,
				addressId: this.mode === 'ship' ? address.id : '',
				storeId: this.mode === 'store' ? store.id : '',
				price: this.quote.price,
				total: this.quote.total,
				deposit: this.quote.deposit
			})
			uni.showToast({ title: '预约成功', icon: 'success' })
			setTimeout(() => {
				uni.navigateTo({
					url: `/pages/placeholder/index?title=${encodeURIComponent('预约成功')}&desc=${encodeURIComponent('回收单 ' + recycle.recycleNo + ' 已生成，请在「我的回收」查看')}`
				})
			}, 700)
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: calc(200rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.steps {
	display: flex;
	justify-content: space-between;
	padding: 24rpx 32rpx;

	&__dot {
		width: 36rpx;
		height: 36rpx;
		margin: 0 auto 8rpx;
		border-radius: 50%;
		background: $gold-200;
		font-size: 20rpx;
		line-height: 36rpx;
		color: #fff;
		text-align: center;

		&.is-on {
			background: $gold-600;
		}
	}

	&__text {
		font-size: 20rpx;
		color: $gold-ink-400;
	}
}

.chart {
	margin: 0 24rpx;
	padding: 20rpx 24rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__tabs {
		display: flex;
	}

	&__tab {
		margin-right: 36rpx;
		font-size: 24rpx;
		color: $gold-ink-400;

		&.is-on {
			color: $gold-ink-900;
			font-weight: 700;
		}
	}

	&__img {
		width: 100%;
		margin-top: 12rpx;
	}
}

.form {
	margin: 24rpx;
	padding: 0 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
}

.row {
	display: flex;
	align-items: center;
	min-height: 92rpx;
	border-bottom: 1rpx solid $gold-line;

	&:last-child {
		border-bottom: 0;
	}

	&__label {
		width: 190rpx;
		font-size: 26rpx;
		color: $gold-ink-500;
	}

	&__value {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		font-size: 26rpx;
		color: $gold-ink-900;
	}

	&__input {
		flex: 1;
		font-size: 26rpx;
		text-align: right;
	}
}

.segment {
	display: flex;

	&__item {
		margin-left: 16rpx;
		padding: 8rpx 20rpx;
		border: 2rpx solid $gold-line;
		border-radius: $gold-radius-pill;
		font-size: 22rpx;
		color: $gold-ink-500;

		&.is-on {
			border-color: $gold-600;
			background: $gold-100;
			color: $gold-600;
		}
	}
}

.quote {
	margin: 24rpx;
	padding: 24rpx 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__row {
		display: flex;
		justify-content: space-between;
		padding: 8rpx 0;
	}

	&__label {
		font-size: 24rpx;
		color: $gold-ink-500;
	}

	&__value {
		font-size: 24rpx;
		color: $gold-ink-900;

		&.is-strong {
			font-size: 28rpx;
			font-weight: 700;
			color: $gold-600;
		}
	}

	&__note {
		display: block;
		margin-top: 14rpx;
		font-size: 20rpx;
		line-height: 30rpx;
		color: $gold-ink-300;
	}
}

.agree {
	display: flex;
	align-items: center;
	margin: 24rpx 32rpx 0;

	&__box {
		width: 32rpx;
		height: 32rpx;
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

	&__link {
		font-size: 24rpx;
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
		font-size: 36rpx;
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
	}
}
</style>
