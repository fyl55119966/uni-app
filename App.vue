<script>
	export default {
		globalData: {
			statusBarHeight: 0,
			windowHeight: 0
		},
		onLaunch() {
			const info = uni.getSystemInfoSync()
			this.globalData.statusBarHeight = info.statusBarHeight || 0
			this.globalData.windowHeight = info.windowHeight || 0
		}
	}
</script>

<style lang="scss">
	page {
		background: $gold-cream-50;
		font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, sans-serif;
		color: $gold-ink-800;
	}

	view,
	text,
	image {
		box-sizing: border-box;
	}
</style>
