<template>
	<view class="page">
		<nav-bar title="实名认证" />

		<view class="tabs">
			<view class="tabs__item" :class="{ 'is-active': tab === 'personal' }" @click="switchTab('personal')">个人认证</view>
			<view class="tabs__item" :class="{ 'is-active': tab === 'company' }" @click="switchTab('company')">企业认证</view>
		</view>

		<view v-if="status === 'approved'" class="result">
			<text class="result__icon">✓</text>
			<text class="result__title">{{ tab === 'personal' ? '个人实名已通过' : '企业认证已通过' }}</text>
			<text class="result__desc">现在可以正常下单、回收与提现</text>
			<g-button text="返回" block @click="back" />
		</view>

		<view v-else-if="status === 'reviewing'" class="result">
			<text class="result__icon is-loading">…</text>
			<text class="result__title">审核中</text>
			<text class="result__desc">预计 2 秒内完成，请稍候</text>
		</view>

		<template v-else>
			<view class="steps">
				<view v-for="(node, i) in steps" :key="node" class="step" :class="{ 'is-on': step >= i + 1 }">
					<view class="step__dot">{{ i + 1 }}</view>
					<text class="step__text">{{ node }}</text>
				</view>
			</view>

			<view v-if="tab === 'personal' && step === 1" class="card">
				<text class="card__title">上传身份证照片</text>
				<text class="card__hint">请上传本人有效身份证原件，确保证件完整、文字清晰。</text>
				<view class="uploads">
					<view class="upload" @click="pick('front')">
						<image v-if="form.front" class="upload__img" :src="form.front" mode="aspectFill" />
						<text v-else class="upload__plus">＋</text>
						<text class="upload__label">身份证人像面</text>
					</view>
					<view class="upload" @click="pick('back')">
						<image v-if="form.back" class="upload__img" :src="form.back" mode="aspectFill" />
						<text v-else class="upload__plus">＋</text>
						<text class="upload__label">身份证国徽面</text>
					</view>
				</view>
				<text class="card__safe">信息安全保障中，仅用于实名审核</text>
				<g-button text="下一步" block @click="next" />
			</view>

			<view v-if="tab === 'personal' && step === 2" class="card">
				<text class="card__title">确认身份信息</text>
				<text class="card__hint">请核对证件信息，提交后将进入实名审核。</text>
				<view class="field"><text class="field__label">真实姓名</text><input v-model="form.realName" class="field__input" placeholder="请输入真实姓名" /></view>
				<view class="field"><text class="field__label">身份证号</text><input v-model="form.idNo" class="field__input" maxlength="18" placeholder="请输入身份证号" /></view>
				<view class="agree" @click="agreed = !agreed">
					<view class="agree__box" :class="{ 'is-on': agreed }" />
					<text class="agree__text">本人确认以上资料真实有效，并授权用于实名认证</text>
				</view>
				<g-button text="提交认证" block @click="submit" />
			</view>

			<view v-if="tab === 'company' && step === 1" class="card">
				<text class="card__title">上传营业执照</text>
				<text class="card__hint">请上传加盖公章的营业执照原件照片，确保文字清晰可辨。</text>
				<view class="upload is-wide" @click="pick('license')">
					<image v-if="form.license" class="upload__img" :src="form.license" mode="aspectFit" />
					<text v-else class="upload__plus">＋</text>
					<text class="upload__label">营业执照照片</text>
				</view>
				<g-button text="下一步" block @click="next" />
			</view>

			<view v-if="tab === 'company' && step === 2" class="card">
				<text class="card__title">基本信息</text>
				<view class="field"><text class="field__label">企业名称</text><input v-model="form.company" class="field__input" placeholder="请输入企业名称" /></view>
				<view class="field"><text class="field__label">社会信用代码</text><input v-model="form.creditCode" class="field__input" maxlength="18" placeholder="请输入统一社会信用代码" /></view>
				<view class="field"><text class="field__label">法人姓名</text><input v-model="form.legalName" class="field__input" placeholder="请输入法人姓名" /></view>
				<view class="field"><text class="field__label">法人手机号</text><input v-model="form.legalPhone" class="field__input" type="number" maxlength="11" placeholder="请输入法人手机号" /></view>
				<view class="field"><text class="field__label">法人身份证号</text><input v-model="form.legalIdNo" class="field__input" maxlength="18" placeholder="请输入法人身份证号" /></view>
				<view class="agree" @click="agreed = !agreed">
					<view class="agree__box" :class="{ 'is-on': agreed }" />
					<text class="agree__text">本人确认以上企业资料真实有效，并授权用于企业认证</text>
				</view>
				<g-button text="提交认证" block @click="submit" />
			</view>
		</template>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'
import gButton from '@/components/g-button/index.vue'
import { getProfile, submitRealname, updateProfile } from '@/api/profile.js'

export default {
	components: { navBar, gButton },
	data() {
		return {
			tab: 'personal',
			step: 1,
			agreed: false,
			status: '',
			steps: ['上传证件', '确认信息', '提交审核'],
			form: {
				front: '',
				back: '',
				license: '',
				realName: '',
				idNo: '',
				company: '',
				creditCode: '',
				legalName: '',
				legalPhone: '',
				legalIdNo: ''
			}
		}
	},
	onLoad() {
		getProfile().then(({ user }) => {
			if (user.realname) this.status = 'approved'
			this.tab = user.realnameType === 'company' ? 'company' : 'personal'
		})
	},
	methods: {
		switchTab(tab) {
			if (this.status) return
			this.tab = tab
			this.step = 1
			this.agreed = false
		},
		pick(key) {
			uni.chooseImage({
				count: 1,
				success: (res) => {
					this.form[key] = res.tempFilePaths[0]
				}
			})
		},
		next() {
			if (this.tab === 'personal' && (!this.form.front || !this.form.back)) {
				return uni.showToast({ title: '请上传身份证正反面', icon: 'none' })
			}
			if (this.tab === 'company' && !this.form.license) {
				return uni.showToast({ title: '请上传营业执照', icon: 'none' })
			}
			this.step = 2
		},
		async submit() {
			if (!this.agreed) return uni.showToast({ title: '请先勾选确认', icon: 'none' })
			const payload = this.tab === 'personal'
				? { type: 'personal', realName: this.form.realName, idNo: this.form.idNo }
				: {
					type: 'company',
					company: this.form.company,
					creditCode: this.form.creditCode,
					legalName: this.form.legalName,
					legalPhone: this.form.legalPhone,
					legalIdNo: this.form.legalIdNo
				}
			try {
				await submitRealname(payload)
			} catch (error) {
				return uni.showToast({ title: error.message, icon: 'none' })
			}
			this.status = 'reviewing'
			setTimeout(async () => {
				await updateProfile({
					realname: true,
					realnameType: this.tab,
					realName: this.form.realName || this.form.legalName,
					company: this.form.company
				})
				this.status = 'approved'
			}, 2000)
		},
		back() {
			uni.navigateBack()
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

.tabs {
	display: flex;
	justify-content: center;
	background: #fff;

	&__item {
		padding: 24rpx 40rpx;
		font-size: 28rpx;
		color: $gold-ink-500;

		&.is-active {
			color: $gold-600;
			font-weight: 700;
			border-bottom: 4rpx solid $gold-600;
		}
	}
}

.steps {
	display: flex;
	padding: 32rpx 24rpx 8rpx;
}

.step {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;

	&__dot {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		background: $gold-200;
		font-size: 22rpx;
		color: #fff;
	}

	&__text {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: $gold-ink-300;
	}

	&.is-on &__dot {
		background: $gold-600;
	}

	&.is-on &__text {
		color: $gold-600;
	}
}

.card {
	margin: 20rpx 24rpx 0;
	padding: 32rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__title {
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__hint {
		display: block;
		margin-top: 10rpx;
		font-size: 22rpx;
		line-height: 32rpx;
		color: $gold-ink-400;
	}

	&__safe {
		display: block;
		margin: 20rpx 0;
		font-size: 22rpx;
		color: $gold-ink-300;
	}
}

.uploads {
	display: flex;
	margin-top: 24rpx;
}

.upload {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 300rpx;
	height: 200rpx;
	margin-right: 20rpx;
	background: $gold-cream-50;
	border: 2rpx dashed $gold-400;
	border-radius: $gold-radius;
	overflow: hidden;

	&.is-wide {
		width: 100%;
		height: 260rpx;
		margin: 24rpx 0;
	}

	&__img {
		width: 100%;
		height: 100%;
	}

	&__plus {
		font-size: 48rpx;
		color: $gold-400;
	}

	&__label {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: $gold-ink-400;
	}
}

.field {
	display: flex;
	align-items: center;
	height: 96rpx;
	margin-top: 18rpx;
	padding: 0 24rpx;
	background: $gold-cream-50;
	border-radius: $gold-radius;

	&__label {
		width: 180rpx;
		font-size: 26rpx;
		color: $gold-ink-800;
	}

	&__input {
		flex: 1;
		font-size: 26rpx;
		color: $gold-ink-900;
	}
}

.agree {
	display: flex;
	align-items: flex-start;
	margin: 28rpx 0;

	&__box {
		flex-shrink: 0;
		width: 30rpx;
		height: 30rpx;
		margin: 4rpx 12rpx 0 0;
		border: 2rpx solid $gold-ink-300;
		border-radius: 6rpx;

		&.is-on {
			border-color: $gold-600;
			background: $gold-600;
		}
	}

	&__text {
		font-size: 22rpx;
		line-height: 32rpx;
		color: $gold-ink-500;
	}
}

.result {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80rpx 48rpx;

	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background: $gold-100;
		font-size: 56rpx;
		color: $gold-600;

		&.is-loading {
			animation: pulse 1s infinite;
		}
	}

	&__title {
		margin-top: 24rpx;
		font-size: 34rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__desc {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: $gold-ink-400;
	}
}

@keyframes pulse {
	50% {
		opacity: 0.4;
	}
}
</style>
