<template>
	<view class="page">
		<nav-bar title="投资金条回收" />

		<scroll-view class="body" scroll-y>
			<view class="paper">
				<text class="paper__title">投资金条回收电子合同</text>

				<text class="paper__p">甲方：上金（河南）科技有限公司</text>
				<text class="paper__p">统一社会信用代码：91410100MA9KQKD869</text>
				<text class="paper__p">法定代表人：李永强</text>
				<text class="paper__p">注册地址：河南省郑州市郑东新区金光路街道圃田泽路与美秀路北侧商业楼 2 层 26266 号</text>
				<text class="paper__p">乙方：已实名认证信息</text>
				<text class="paper__p">证件类型及号码：已注册会员号</text>

				<text class="paper__p">鉴于：乙方通过甲方运营的熊猫小店平台出售其持有的投资类实物金条，甲方同意按本合同约定进行回购，双方依据《中华人民共和国民法典》等相关法律，本着自愿、平等原则达成以下协议：</text>

				<text class="paper__h">第一条 回收商品与价格</text>
				<text class="paper__p">1.1 回收商品：投资类实物金条。乙方保证其向甲方出售的实物金条来源合法、符合甲方回收标准，乙方对该金条享有完整所有权，不存在任何权属争议和权利限制。</text>
				<text class="paper__p">1.2 回收价格：以乙方在平台提交“回购中心”订单时的实时回收金价为准，确定回收金价；回收总价款为回收金价 × 回收克重。</text>
				<text class="paper__p">1.3 保证金支付：本合同生效后，乙方应向甲方支付回收总价款 10% 的保证金。特别提示：若金价波动导致保证金不足以覆盖价差，甲方有权要求乙方在倒计时内交货，否则视为乙方违约，甲方有权解除合同并没收保证金。</text>

				<text class="paper__h">第二条 回收标准</text>
				<text class="paper__p">回收商品须为正规发行机构发行的实物金条，含金量不低于 99.9%。乙方提交订单时，应同步向甲方提供下列能够证明产品来源及真实性的材料之一：原始购买发票、购买记录、质量证明书、原包装，或经甲方审核确认的其他等效证明文件。</text>

				<text class="paper__h">第三条 合同生效</text>
				<text class="paper__p">本合同自乙方在甲方平台点击确认“立即预约”订单并成功支付保证金之日起正式生效，双方均受本合同条款约束。</text>

				<text class="paper__h">第四条 交货、验收与结算</text>
				<text class="paper__p">4.1 交货期限：乙方应在本合同生效之日起 7 个工作日（开市时间）内完成交货。</text>
				<text class="paper__p">4.2 交货：乙方选择快递寄货，交货以甲方在平台指定的地址签收为准；快递运输过程中实物金条灭失、毁损风险由乙方自行承担，乙方可自愿对寄送物品进行保价。</text>
				<text class="paper__p">4.3 代交货：若无法在指定时间内完成交货，可选择好友/其他用户代交货，交货人仅会向乙方收取服务费。</text>
				<text class="paper__p">4.4 验收与结算：甲方签收后及时检测，验收无误后三个工作日内完成回收结算，扣除手续费后将回收结算金额及乙方已支付的保证金一并发放至乙方平台账户余额。</text>

				<text class="paper__h">第五条 违约责任</text>
				<text class="paper__p">5.1 若乙方逾期未完成交货，甲方有权单方解除本合同，乙方已支付的保证金不予退还。</text>
				<text class="paper__p">5.2 若经检测乙方所寄送实物金条不符合约定质量标准或存在权利瑕疵，甲方有权拒绝回收并单方解除合同，保证金不予退还。</text>
				<text class="paper__p">5.3 乙方承诺所售实物金条来源合法、无权属争议和权利限制；若因不实承诺导致甲方被追究法律责任或遭受第三方索赔，乙方应全额赔偿甲方全部损失（包括直接损失、间接损失及维权支出）。</text>

				<text class="paper__h">第六条 争议解决</text>
				<text class="paper__p">因本合同引起的或与本合同有关的任何争议，双方应友好协商解决；协商不成的，任何一方均可向甲方所在地有管辖权的人民法院提起诉讼。</text>

				<text class="paper__h">第七条 其他约定</text>
				<text class="paper__p">7.1 本合同通过甲方平台电子系统订立，一式两份，双方各执一份，具有同等法律效力。</text>
				<text class="paper__p">7.2 甲方通过乙方注册时预留的联系方式发出的通知，一经发出即视为送达。</text>

				<text class="paper__end">本合同经双方确认后生效</text>
			</view>
			<view class="hold" />
		</scroll-view>

		<view class="bar">
			<view class="bar__btn" @click="agree">我已阅读并同意</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/index.vue'

export default {
	components: { navBar },
	methods: {
		agree() {
			uni.setStorageSync('gold_contract_signed', 1)
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: $gold-cream-50;
}

.body {
	flex: 1;
}

.paper {
	margin: 24rpx;
	padding: 40rpx 32rpx;
	background: #fff;
	border-radius: $gold-radius-lg;

	&__title {
		display: block;
		margin-bottom: 32rpx;
		font-size: 36rpx;
		font-weight: 700;
		color: $gold-ink-900;
		text-align: center;
	}

	&__h {
		display: block;
		margin: 32rpx 0 12rpx;
		font-size: 30rpx;
		font-weight: 700;
		color: $gold-ink-900;
	}

	&__p {
		display: block;
		margin-bottom: 12rpx;
		font-size: 26rpx;
		line-height: 44rpx;
		color: $gold-ink-800;
		text-align: justify;
	}

	&__end {
		display: block;
		margin-top: 40rpx;
		font-size: 26rpx;
		color: $gold-ink-500;
		text-align: center;
	}
}

.hold {
	height: 40rpx;
}

.bar {
	display: flex;
	align-items: center;
	height: calc(120rpx + env(safe-area-inset-bottom));
	padding: 0 24rpx env(safe-area-inset-bottom);
	background: #fff;
	border-top: 1rpx solid $gold-line;

	&__btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 84rpx;
		background: $gold-gradient;
		border-radius: $gold-radius-pill;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;
	}
}
</style>
