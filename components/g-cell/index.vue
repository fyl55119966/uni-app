<template>
	<view class="cell" :class="{ 'cell--border': border }" hover-class="cell--hover" @click="$emit('click')">
		<image v-if="icon" class="cell__icon" :src="icon" mode="aspectFit" />
		<slot name="icon" />
		<text class="cell__label">{{ label }}</text>
		<text v-if="value" class="cell__value">{{ value }}</text>
		<slot />
		<image v-if="arrow" class="cell__arrow" src="/static/icons/ic-chevron.png" mode="aspectFit" />
	</view>
</template>

<script>
export default {
	name: 'g-cell',
	props: {
		label: { type: String, default: '' },
		value: { type: String, default: '' },
		icon: { type: String, default: '' },
		arrow: { type: Boolean, default: true },
		border: { type: Boolean, default: true }
	}
}
</script>

<style lang="scss" scoped>
.cell {
	display: flex;
	align-items: center;
	min-height: 100rpx;
	padding: 0 28rpx;
	background: #fff;

	&--border {
		border-bottom: 1rpx solid $gold-line;
	}

	&--hover {
		background: $gold-cream-50;
	}

	&__icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}

	&__label {
		flex: 1;
		font-size: 28rpx;
		color: $gold-ink-800;
	}

	&__value {
		margin-right: 12rpx;
		font-size: 26rpx;
		color: $gold-ink-400;
	}

	&__arrow {
		width: 28rpx;
		height: 28rpx;
		opacity: 0.5;
	}
}
</style>
