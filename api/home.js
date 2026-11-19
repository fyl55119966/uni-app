import { withMock } from './request.js'

const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

const HOME = {
	brand: { name: '上金所有金店', en: 'Shangjin Gold Stores', logo: '/static/images/gold/logo.png' },
	banner: '/static/images/gold/home-hero.png',
	ticker: ['足金9999', '造币工艺', '实时金价', '溢价回购'],
	promos: [
		{
			key: 'goods',
			title: '实物黄金安心订购',
			subtitle: '实时金价 · 多规格可选',
			image: '/static/images/gold/promo-gold.jpg',
			overlay: true,
			target: 'coins'
		},
		{
			key: 'invite',
			title: '邀请好友共享好礼',
			subtitle: '好友完成注册，双方均享好礼',
			image: '/static/images/gold/promo-invite.png',
			overlay: false,
			target: 'fans'
		}
	],
	centers: [
		{ name: '上海总部', manager: '全国加盟热线 400-006-1661', address: '上海市黄浦区河南中路99号' },
		{ name: '西安运营中心', manager: '王经理 151 3839 5854', address: '西安市未央区昆明路45号沣东吾悦广场' },
		{ name: '郑州运营中心', manager: '李经理 138 0000 0000', address: '郑州市金水区花园路国贸中心' }
	],
	articles: [
		{
			id: 1,
			title: '老一辈攒金条，新中产囤熊猫币，熊猫金币值…',
			excerpt: '最近和几位朋友聊起家庭资产配置，发现一个有趣的现象：父母那辈人总爱把金条压在床底，逢年过节还要…',
			source: '财经晚8点',
			date: '2026-04-21',
			views: 424
		},
		{
			id: 2,
			title: '黄金投资热潮下的理性选择：熊猫金币的独特…',
			excerpt: '2025年9月中上旬，黄金价格再度高歌猛进，国际金价突破每盎司3700美元关口，再创历史新高。',
			source: '中国金币微信',
			date: '2026-04-21',
			views: 156
		},
		{
			id: 3,
			title: '“熊猫金币与货币文化成都首展”开展',
			excerpt: '11月21日，2025全球熊猫伙伴大会在成都开幕，作为大会系列配套活动之一，熊猫金币与货币文化成都首…',
			source: '新华网',
			date: '2026-04-21',
			views: 146
		}
	],
	subsidy: { amount: 1000, tip: '剩余可抵扣补贴 · 下单自动抵扣定金' }
}

export async function getHome() {
	return withMock(async () => {
		await wait()
		return HOME
	}, { url: '/home' })
}
