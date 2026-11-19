import { withMock } from './request.js'

const CATEGORIES = ['全部', '黄金饰品', '白银饰品', '翡翠饰品']

const BANNERS = [
	{ id: 1, image: '/static/images/gold/promo-gold.jpg', title: '实物黄金安心订购', price: 15518.88, gold: 869.93, tag: '马上换' },
	{ id: 2, image: '/static/images/gold/promo-invite.png', title: '邀请好友共享好礼', price: 17458.74, gold: 869.93, tag: '马上换' }
]

const PRODUCTS = [
	{ id: 1, image: '/static/images/gold/products/p1.jpg', title: '福禄足金套链吊坠', sold: 12, fav: 0, gram: '16g', price: 15518.88, labor: 100 },
	{ id: 2, image: '/static/images/gold/products/p2.jpg', title: '古法平安扣吊坠', sold: 12, fav: 0, gram: '18g', price: 17458.74, labor: 100 },
	{ id: 3, image: '/static/images/gold/products/p3.jpg', title: '吉祥如意金锁吊坠', sold: 7, fav: 0, gram: '20g', price: 19398.4, labor: 100 },
	{ id: 4, image: '/static/images/gold/products/p4.jpg', title: '福禄葫芦金饰', sold: 6, fav: 0, gram: '30g', price: 29097.6, labor: 100 },
	{ id: 5, image: '/static/images/gold/products/p5.png', title: 'Love手镯10g', sold: 0, fav: 0, gram: '0g', price: 888, labor: 0 },
	{ id: 6, image: '/static/images/gold/products/p6.png', title: 'Love手镯10g', sold: 0, fav: 0, gram: '0g', price: 668, labor: 0 },
	{ id: 7, image: '/static/images/gold/products/p2.jpg', title: '传统古法银镯', sold: 0, fav: 0, gram: '0g', price: 699, labor: 0 },
	{ id: 8, image: '/static/images/gold/products/p3.jpg', title: '传统古法银镯', sold: 0, fav: 0, gram: '0g', price: 599, labor: 0 },
	{ id: 9, image: '/static/images/gold/products/p2.jpg', title: '恋心四叶草', sold: 0, fav: 0, gram: '0g', price: 599, labor: 0 },
	{ id: 10, image: '/static/images/gold/products/p2.jpg', title: '恋心四叶草', sold: 0, fav: 0, gram: '0g', price: 399, labor: 0 },
	{ id: 11, image: '/static/images/gold/products/p3.jpg', title: '四叶草手镯20g', sold: 0, fav: 0, gram: '20g', price: 19399.2, labor: 100 },
	{ id: 12, image: '/static/images/gold/products/p3.jpg', title: '花纹手镯10g', sold: 0, fav: 0, gram: '10g', price: 9699.6, labor: 100 }
]

export function getShop() {
	return withMock(() => ({ categories: CATEGORIES, banners: BANNERS, products: PRODUCTS }), { url: '/shop' })
}
