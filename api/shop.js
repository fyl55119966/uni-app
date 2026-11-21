import { withMock } from './request.js'

const CATEGORIES = ['全部', '黄金饰品', '白银饰品', '翡翠饰品']

export const PRODUCTS = [
	{ id: 1, image: '/static/images/gold/products/shop1.jpg', title: '福禄足金套链吊坠', sold: 12, fav: 0, gram: '16g', price: 15518.88, labor: 100 },
	{ id: 2, image: '/static/images/gold/products/shop2.jpg', title: '古法平安扣吊坠', sold: 12, fav: 0, gram: '18g', price: 17458.74, labor: 100 },
	{ id: 3, image: '/static/images/gold/products/shop3.jpg', title: '吉祥如意金锁吊坠', sold: 7, fav: 0, gram: '20g', price: 19398.4, labor: 100 },
	{ id: 4, image: '/static/images/gold/products/shop4.jpg', title: '福禄葫芦金饰', sold: 6, fav: 0, gram: '30g', price: 29097.6, labor: 100 },
	{ id: 5, image: '/static/images/gold/products/shop5.png', title: 'Love手镯10g', sold: 0, fav: 0, gram: '0g', price: 888, labor: 0 },
	{ id: 6, image: '/static/images/gold/products/shop6.png', title: 'Love手镯10g', sold: 0, fav: 0, gram: '0g', price: 668, labor: 0 },
	{ id: 7, image: '/static/images/gold/products/shop7.png', title: '传统古法银镯', sold: 0, fav: 0, gram: '0g', price: 699, labor: 0 },
	{ id: 8, image: '/static/images/gold/products/shop8.png', title: '传统古法银镯', sold: 0, fav: 0, gram: '0g', price: 599, labor: 0 },
	{ id: 9, image: '/static/images/gold/products/shop9.png', title: '恋心四叶草', sold: 0, fav: 0, gram: '0g', price: 599, labor: 0 },
	{ id: 10, image: '/static/images/gold/products/shop10.png', title: '恋心四叶草', sold: 0, fav: 0, gram: '0g', price: 399, labor: 0 },
	{ id: 11, image: '/static/images/gold/products/shop11.png', title: '四叶草手镯20g', sold: 0, fav: 0, gram: '20g', price: 19399.2, labor: 100 },
	{ id: 12, image: '/static/images/gold/products/shop12.png', title: '花纹手镯10g', sold: 0, fav: 0, gram: '10g', price: 9699.6, labor: 100 },
	{ id: 13, image: '/static/images/gold/products/shop13.png', title: '福禄金条30g', sold: 0, fav: 0, gram: '30g', price: 29098.8, labor: 100 },
	{ id: 14, image: '/static/images/gold/products/shop14.png', title: '鸳鸯心型金章20g', sold: 0, fav: 0, gram: '20g', price: 19399.2, labor: 100 }
]

const BANNERS = PRODUCTS.map((item) => ({
	id: item.id,
	image: item.image,
	title: item.title,
	price: item.price,
	labor: item.labor,
	gold: 869.93,
	tag: '马上换'
}))

export function getShop() {
	return withMock(() => ({ categories: CATEGORIES, banners: BANNERS, products: PRODUCTS }), { url: '/shop' })
}

export function getProduct(id) {
	return withMock(() => {
		const item = PRODUCTS.find((p) => String(p.id) === String(id))
		if (!item) return null
		return {
			...item,
			type: 'jewelry',
			images: [item.image, '/static/images/gold/promo-jewelry.jpg'],
			stock: 9,
			limit: 1,
			delivery: ['快递配送', '到店自提']
		}
	}, { url: `/goods/${id}` })
}
