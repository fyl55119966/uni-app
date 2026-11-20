<template>
	<button class="btn" :class="[`btn--${type}`, `btn--${size}`, { 'btn--block': block }]"
		:disabled="disabled || loading" hover-class="btn--hover" @click="onClick">
		<text class="btn__text">{{ loading ? loadingText : text }}</text>
		<slot />
	</button>
</template>

<script>
export default {
	name: 'g-button',
	props: {
		text: { type: String, default: '' },
		type: { type: String, default: 'primary' },
		size: { type: String, default: 'md' },
		block: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		loading: { type: Boolean, default: false },
		loadingText: { type: String, default: '处理中…' }
	},
	methods: {
		onClick() {
			if (this.disabled || this.loading) return
			this.$emit('click')
		}
	}
}
</script>

<style lang="scss" scoped>
.btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	margin: 0;
	padding: 0 40rpx;
	border: none;
	border-radius: $gold-radius-pill;
	font-size: 28rpx;
	font-weight: 600;
	line-height: 1;
	color: #fff;
	background: $gold-gradient;

	&::after {
		border: none;
	}

	&--block {
		display: flex;
		width: 100%;
	}

	&--md {
		height: 88rpx;
	}

	&--sm {
		height: 64rpx;
		font-size: 24rpx;
	}

	&--lg {
		height: 96rpx;
		font-size: 30rpx;
	}

	&--ghost {
		background: transparent;
		border: 2rpx solid $gold-400;
		color: $gold-600;
	}

	&--danger {
		background: $gold-danger;
	}

	&--hover {
		opacity: 0.85;
	}

	&[disabled] {
		opacity: 0.5;
	}
}

.btn__text {
	font-size: inherit;
	color: inherit;
}
</style>
