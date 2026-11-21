<template>
	<text class="price" :class="[`price--${size}`, { 'price--bold': bold }]" :style="{ color, fontSize }">
		<text class="price__sign">¥</text>
		<text class="price__int">{{ parts.int }}</text>
		<text class="price__dec">.{{ parts.dec }}</text>
		<text v-if="unit" class="price__unit">{{ unit }}</text>
	</text>
</template>

<script>
export default {
	name: 'g-price',
	props: {
		value: { type: [Number, String], default: 0 },
		size: { type: String, default: 'md' },
		color: { type: String, default: '#D9A133' },
		fontSize: { type: String, default: '' },
		unit: { type: String, default: '' },
		bold: { type: Boolean, default: true }
	},
	computed: {
		parts() {
			const [int, dec] = Number(this.value || 0).toFixed(2).split('.')
			return { int, dec }
		}
	}
}
</script>

<style lang="scss" scoped>
.price {
	display: inline-flex;
	align-items: baseline;
	font-variant-numeric: tabular-nums;

	&__sign {
		font-size: 0.62em;
		margin-right: 2rpx;
	}

	&__int {
		font-size: 1em;
		line-height: 1;
	}

	&__dec {
		font-size: 0.72em;
	}

	&__unit {
		margin-left: 4rpx;
		font-size: 0.5em;
		color: $gold-ink-400;
	}

	&--bold {
		font-weight: 700;
	}

	&--sm {
		font-size: 28rpx;
	}

	&--md {
		font-size: 40rpx;
	}

	&--lg {
		font-size: 64rpx;
	}
}
</style>
