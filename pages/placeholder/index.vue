<template>
	<view class="page">
		<nav-bar :title="title" />
		<view class="body">
			<g-empty :text="title" :desc="desc" action-text="回首页" @action="home" />
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gEmpty from '@/components/g-empty/index.vue'

export default {
	components: { navBar, gEmpty },
	data() {
		return {
			title: '建设中',
			desc: '该页面在后续票据实现'
		}
	},
	onLoad(options = {}) {
		if (options.title) this.title = decodeURIComponent(options.title)
		if (options.desc) this.desc = decodeURIComponent(options.desc)
	},
	methods: {
		home() {
			uni.reLaunch({ url: '/pages/home/index' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: $gold-cream-50;
}

.body {
	padding: 120rpx 60rpx 0;
}
</style>
