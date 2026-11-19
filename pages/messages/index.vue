<template>
	<view class="page">
		<nav-bar title="消息中心" />

		<view v-if="list.length" class="list">
			<view v-for="item in list" :key="item.id" class="card" @click="open(item)">
				<view class="card__head">
					<view class="card__dot" :class="{ 'is-unread': !item.read }" />
					<text class="card__title">{{ item.title }}</text>
					<text class="card__time">{{ item.time }}</text>
				</view>
				<text class="card__body">{{ item.body }}</text>
			</view>
		</view>

		<view v-else class="empty">
			<text class="empty__icon">🔔</text>
			<text class="empty__title">暂无消息</text>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import { getMessages, markRead } from '@/api/messages.js'

export default {
	components: { navBar },
	data() {
		return { list: [] }
	},
	onShow() {
		this.list = getMessages()
	},
	methods: {
		open(item) {
			uni.showModal({
				title: item.title,
				content: item.body,
				showCancel: false
			})
			if (!item.read) this.list = markRead(item.id)
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: $gold-cream-50;
}

.list {
	padding: 20rpx 24rpx;
}

.card {
	margin-bottom: 18rpx;
	padding: 26rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__head {
		display: flex;
		align-items: center;
	}

	&__dot {
		width: 12rpx;
		height: 12rpx;
		margin-right: 12rpx;
		border-radius: 50%;
		background: transparent;

		&.is-unread {
			background: $gold-danger;
		}
	}

	&__title {
		flex: 1;
		font-size: 28rpx;
		font-weight: 600;
		color: $gold-ink-900;
	}

	&__time {
		font-size: 20rpx;
		color: $gold-ink-300;
	}

	&__body {
		display: block;
		margin-top: 12rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: $gold-ink-500;
	}
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 420rpx;

	&__icon {
		font-size: 64rpx;
	}

	&__title {
		margin-top: 20rpx;
		font-size: 26rpx;
		color: $gold-ink-300;
	}
}
</style>
