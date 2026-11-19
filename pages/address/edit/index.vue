<template>
	<view class="page">
		<nav-bar :title="form.id ? '编辑收货地址' : '新增收货地址'" />

		<view class="card">
			<view class="row">
				<text class="row__label">收货人</text>
				<input v-model="form.name" class="row__input" placeholder="请输入收货人姓名" />
			</view>
			<view class="row">
				<text class="row__label">手机号</text>
				<input v-model="form.phone" class="row__input" type="number" maxlength="11" placeholder="请输入手机号" />
			</view>
			<view class="row">
				<text class="row__label">所在地区</text>
				<input v-model="form.region" class="row__input" placeholder="省 市 区" />
			</view>
			<view class="row">
				<text class="row__label">详细地址</text>
				<input v-model="form.detail" class="row__input" placeholder="街道、门牌号" />
			</view>
			<view class="row">
				<text class="row__label">设为默认</text>
				<switch :checked="form.isDefault" color="#D9A133" @change="form.isDefault = $event.detail.value" />
			</view>
		</view>

		<view class="save">
			<g-button text="保存地址" block @click="save" />
			<view v-if="form.id" class="delete" @click="remove">删除地址</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gButton from '@/components/g-button/index.vue'
import { getAddresses, saveAddress, removeAddress } from '@/api/address.js'

export default {
	components: { navBar, gButton },
	data() {
		return {
			form: { id: '', name: '', phone: '', region: '', detail: '', isDefault: false }
		}
	},
	onLoad(query) {
		if (query.id) {
			const found = getAddresses().find((item) => item.id === query.id)
			if (found) this.form = { ...found }
		}
	},
	methods: {
		save() {
			if (!this.form.name) return uni.showToast({ title: '请输入收货人', icon: 'none' })
			if (!/^1\d{10}$/.test(this.form.phone)) return uni.showToast({ title: '请输入正确手机号', icon: 'none' })
			if (!this.form.region || !this.form.detail) return uni.showToast({ title: '请填写完整地址', icon: 'none' })
			saveAddress({ ...this.form })
			uni.showToast({ title: '已保存', icon: 'success' })
			setTimeout(() => uni.navigateBack(), 500)
		},
		remove() {
			uni.showModal({
				title: '删除地址',
				content: '删除后不可恢复，确认删除？',
				success: (res) => {
					if (!res.confirm) return
					removeAddress(this.form.id)
					uni.navigateBack()
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
	padding: 0 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
}

.row {
	display: flex;
	align-items: center;
	min-height: 100rpx;
	border-bottom: 1rpx solid $gold-line;

	&:last-child {
		border-bottom: 0;
	}

	&__label {
		width: 180rpx;
		font-size: 26rpx;
		color: $gold-ink-800;
	}

	&__input {
		flex: 1;
		font-size: 26rpx;
		color: $gold-ink-900;
		text-align: right;
	}
}

.save {
	margin: 40rpx 24rpx 0;
}

.delete {
	margin-top: 28rpx;
	text-align: center;
	font-size: 26rpx;
	color: $gold-danger;
}
</style>
