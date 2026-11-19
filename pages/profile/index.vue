<template>
	<view class="page">
		<nav-bar title="个人资料" />

		<view class="avatar" @click="chooseAvatar">
			<image class="avatar__img" :src="form.avatar" mode="aspectFill" />
			<text class="avatar__title">修改头像</text>
			<text class="avatar__hint">点击上传头像，支持相册或拍照</text>
		</view>

		<view class="card">
			<view class="row">
				<text class="row__label">昵称</text>
				<input v-model="form.name" class="row__input" maxlength="20" placeholder="请输入昵称" />
			</view>
			<view class="row">
				<text class="row__label">绑定手机号</text>
				<text class="row__value">{{ form.phone }}</text>
			</view>
			<view class="row" @click="openAddress">
				<text class="row__label">收货地址</text>
				<text class="row__value">{{ addressText }}</text>
				<text class="row__arrow">›</text>
			</view>
			<picker mode="selector" :range="genders" @change="onGender">
				<view class="row">
					<text class="row__label">性别</text>
					<text class="row__value">{{ form.gender }}</text>
					<text class="row__arrow">›</text>
				</view>
			</picker>
			<view class="row">
				<text class="row__label">邮箱</text>
				<input v-model="form.email" class="row__input" placeholder="请输入邮箱" />
			</view>
			<view class="row">
				<text class="row__label">会员号</text>
				<text class="row__value">{{ form.memberNo }}</text>
			</view>
			<view class="row">
				<text class="row__label">注册时间</text>
				<text class="row__value">{{ form.registerAt }}</text>
			</view>
		</view>

		<view class="save">
			<g-button text="保存资料" block @click="save" />
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gButton from '@/components/g-button/index.vue'
import { getProfile, updateProfile } from '@/api/profile.js'

export default {
	components: { navBar, gButton },
	data() {
		return {
			form: { avatar: '', name: '', phone: '', gender: '保密', email: '', memberNo: '', registerAt: '' },
			addressText: '管理收货地址',
			genders: ['保密', '女', '男']
		}
	},
	onLoad() {
		this.load()
	},
	methods: {
		async load() {
			const { user } = await getProfile()
			this.form = { ...this.form, ...user }
		},
		chooseAvatar() {
			uni.chooseImage({
				count: 1,
				success: (res) => {
					this.form.avatar = res.tempFilePaths[0]
				}
			})
		},
		onGender(event) {
			this.form.gender = this.genders[Number(event.detail.value)]
		},
		openAddress() {
			uni.navigateTo({ url: '/pages/placeholder/index?title=' + encodeURIComponent('收货地址') + '&desc=' + encodeURIComponent('地址管理在票 13 实现') })
		},
		async save() {
			if (!this.form.name) return uni.showToast({ title: '请输入昵称', icon: 'none' })
			await updateProfile({
				name: this.form.name,
				avatar: this.form.avatar,
				gender: this.form.gender,
				email: this.form.email
			})
			uni.showToast({ title: '资料已保存', icon: 'success' })
			setTimeout(() => uni.navigateBack(), 600)
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding-bottom: 60rpx;
	background: $gold-cream-50;
}

.avatar {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0 32rpx;

	&__img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		background: $gold-cream-200;
	}

	&__title {
		margin-top: 18rpx;
		font-size: 28rpx;
		color: $gold-ink-900;
	}

	&__hint {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}
}

.card {
	margin: 0 24rpx;
	padding: 0 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;
}

.row {
	display: flex;
	align-items: center;
	min-height: 96rpx;
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

	&__value {
		flex: 1;
		font-size: 26rpx;
		color: $gold-ink-500;
		text-align: right;
	}

	&__arrow {
		margin-left: 10rpx;
		font-size: 30rpx;
		color: $gold-ink-300;
	}
}

.save {
	margin: 40rpx 24rpx 0;
}
</style>
