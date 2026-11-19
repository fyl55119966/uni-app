<template>
	<view class="page">
		<nav-bar title="设置" />

		<view class="group">
			<text class="group__title">账户资料</text>
			<view class="row" @click="go('/pages/profile/index')">
				<text class="row__label">个人资料</text>
				<text class="row__desc">头像、昵称与联系方式</text>
				<text class="row__arrow">›</text>
			</view>
			<view class="row" @click="go('/pages/realname/index')">
				<text class="row__label">实名认证</text>
				<text class="row__desc">{{ realnameText }}</text>
				<text class="row__arrow">›</text>
			</view>
			<view class="row" @click="go('/pages/address/list/index')">
				<text class="row__label">收货地址</text>
				<text class="row__desc">管理常用收货信息</text>
				<text class="row__arrow">›</text>
			</view>
		</view>

		<view class="group">
			<text class="group__title">账户安全</text>
			<view class="row" @click="go('/pages/security/reset/index')">
				<text class="row__label">登录密码</text>
				<text class="row__desc">短信验证码校验</text>
				<text class="row__arrow">›</text>
			</view>
			<view class="row" @click="go('/pages/security/pay/index')">
				<text class="row__label">支付密码</text>
				<text class="row__desc">6 位数字密码</text>
				<text class="row__arrow">›</text>
			</view>
			<view class="row" @click="go('/pages/security/cancel/index')">
				<text class="row__label">注销账号</text>
				<text class="row__desc">短信验证码校验</text>
				<text class="row__arrow">›</text>
			</view>
		</view>

		<view class="group">
			<text class="group__title">服务与绑定</text>
			<view class="row" @click="placeholder('邀请码', '邀请码与邀请奖励在票 19 实现')">
				<text class="row__label">邀请码</text>
				<text class="row__desc">查看邀请码与邀请奖励</text>
				<text class="row__arrow">›</text>
			</view>
			<view class="row" @click="bindWechat">
				<text class="row__label">微信绑定</text>
				<text class="row__desc">{{ wechatBound ? '已绑定' : '未绑定' }}</text>
				<text class="row__arrow">›</text>
			</view>
		</view>

		<view class="logout" @click="logout">退出登录</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getUser, clearSession } from '@/utils/token.js'
import { logout } from '@/api/auth.js'

export default {
	components: { navBar },
	data() {
		return { realname: false, wechatBound: false }
	},
	computed: {
		realnameText() {
			return this.realname ? '已认证' : '上传证件完成实名'
		}
	},
	onShow() {
		const user = getUser() || {}
		this.realname = !!user.realname
		this.wechatBound = !!user.wechatBound
	},
	methods: {
		go(url) {
			uni.navigateTo({ url })
		},
		placeholder(title, desc) {
			uni.navigateTo({ url: '/pages/placeholder/index?title=' + encodeURIComponent(title) + '&desc=' + encodeURIComponent(desc) })
		},
		bindWechat() {
			uni.showToast({ title: '微信绑定为 mock，待资质', icon: 'none' })
		},
		logout() {
			uni.showModal({
				title: '退出登录',
				content: '退出后需重新登录，确认退出？',
				success: async (res) => {
					if (!res.confirm) return
					await logout()
					clearSession()
					uni.reLaunch({ url: '/pages/login/index' })
				}
			})
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

.group {
	margin: 24rpx 24rpx 0;
	padding: 8rpx 28rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__title {
		display: block;
		padding: 20rpx 0 8rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}
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
		width: 160rpx;
		font-size: 28rpx;
		color: $gold-ink-900;
	}

	&__desc {
		flex: 1;
		font-size: 22rpx;
		color: $gold-ink-300;
		text-align: right;
	}

	&__arrow {
		margin-left: 10rpx;
		font-size: 30rpx;
		color: $gold-ink-300;
	}
}

.logout {
	margin: 48rpx 24rpx 0;
	padding: 28rpx;
	border-radius: $gold-radius-lg;
	background: #fff;
	text-align: center;
	font-size: 28rpx;
	color: $gold-danger;
}
</style>
