const KEY = 'gold_favorites'

export function getFavorites() {
	let raw = uni.getStorageSync(KEY)
	if (typeof raw === 'string') {
		try {
			raw = JSON.parse(raw)
		} catch {
			raw = null
		}
	}
	if (Array.isArray(raw)) return raw.map(String)
	if (raw && Array.isArray(raw.data)) return raw.data.map(String)
	return []
}

export function isFavorite(id) {
	return getFavorites().includes(String(id))
}

export function toggleFavorite(id) {
	const key = String(id)
	const list = getFavorites()
	const next = list.includes(key) ? list.filter((item) => item !== key) : [...list, key]
	uni.setStorageSync(KEY, next)
	return next
}
