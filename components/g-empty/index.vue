<template>
	<view class="empty">
		<view class="empty__ring">
			<text class="empty__mark">空</text>
		</view>
		<text class="empty__text">{{ text }}</text>
		<text v-if="desc" class="empty__desc">{{ desc }}</text>
		<view v-if="actionText" class="empty__action" @click="$emit('action')">{{ actionText }}</view>
	</view>
</template>

<script>
export default {
	name: 'g-empty',
	props: {
		text: { type: String, default: '暂无数据' },
		desc: { type: String, default: '' },
		actionText: { type: String, default: '' }
	}
}
</script>

<style lang="scss" scoped>
.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 0;

	&__ring {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 160rpx;
		height: 160rpx;
		border: 2rpx dashed $gold-200;
		border-radius: 50%;
		background: $gold-100;
	}

	&__mark {
		font-size: 40rpx;
		color: $gold-400;
	}

	&__text {
		margin-top: 24rpx;
		font-size: 28rpx;
		color: $gold-ink-400;
	}

	&__desc {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&__action {
		margin-top: 28rpx;
		padding: 14rpx 44rpx;
		border: 2rpx solid $gold-400;
		border-radius: $gold-radius-pill;
		font-size: 26rpx;
		color: $gold-600;
	}
}
</style>
