<template>
	<view class="page">
		<view class="brand">
			<view class="brand__logo">
				<text class="brand__mark">金</text>
			</view>
			<text class="brand__name">上金所有金店</text>
			<text class="brand__en">Shangjin Gold Stores</text>
		</view>

		<view class="tabs">
			<text class="tabs__item tabs__item--active">登录</text>
			<text class="tabs__item">注册</text>
		</view>

		<view class="form">
			<view class="field"><text class="field__text">请输入手机号</text></view>
			<view class="field"><text class="field__text">请输入密码</text></view>
			<view class="field">
				<text class="field__text">请输入图形验证码</text>
			</view>
			<view class="agree">
				<view class="agree__box" />
				<text class="agree__text">阅读并同意《用户协议隐私政策》</text>
			</view>
			<view class="submit">登录</view>
		</view>

		<view class="tip">B1 按截图 327 / 328 实现登录与注册；本期 mock 登录。</view>
	</view>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	padding: calc(20rpx + var(--status-bar-height)) 40rpx calc(40rpx + env(safe-area-inset-bottom));
	background: $gold-cream-50;
}

.brand {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0 40rpx;

	&__logo {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 160rpx;
		height: 160rpx;
		background: #fff;
		border-radius: 50%;
		box-shadow: 0 12rpx 32rpx rgba(217, 161, 51, 0.18);
	}

	&__mark {
		font-size: 64rpx;
		font-weight: 700;
		color: $gold-600;
	}

	&__name {
		margin-top: 28rpx;
		font-size: 44rpx;
		font-weight: 700;
		letter-spacing: 4rpx;
		color: $gold-ink-900;
	}

	&__en {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: $gold-ink-300;
	}
}

.tabs {
	display: flex;
	justify-content: center;
	margin-top: 20rpx;

	&__item {
		position: relative;
		padding: 16rpx 40rpx;
		font-size: 30rpx;
		color: $gold-ink-400;

		&--active {
			font-weight: 700;
			color: $gold-ink-900;
		}

		&--active::after {
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
	margin-top: 28rpx;
}

.field {
	display: flex;
	align-items: center;
	height: 96rpx;
	margin-bottom: 24rpx;
	padding: 0 28rpx;
	background: #fff;
	border: 1rpx solid $gold-line;
	border-radius: $gold-radius;

	&__text {
		font-size: 28rpx;
		color: $gold-ink-300;
	}
}

.agree {
	display: flex;
	align-items: center;
	margin: 8rpx 0 32rpx;

	&__box {
		width: 28rpx;
		height: 28rpx;
		margin-right: 12rpx;
		border: 2rpx solid $gold-line;
		border-radius: 6rpx;
	}

	&__text {
		font-size: 22rpx;
		color: $gold-ink-400;
	}
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
}

.tip {
	margin-top: 32rpx;
	font-size: 22rpx;
	line-height: 34rpx;
	text-align: center;
	color: $gold-ink-300;
}
</style>
