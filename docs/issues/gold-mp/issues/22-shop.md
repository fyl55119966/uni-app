# 22: 小店

**What to build:** 小店 tab 页按截图 333 复刻：顶部轮播 banner、分类 tab（全部/黄金/白银/翡翠）、双列商品卡（图片、标题、已售、关注、克重、价格、购买按钮），点卡片进商品详情；数据走 api 层 mock。

**Blocked by:** 01 数据缝与公共外壳

**Status:** done

- [x] 轮播、分类 tab、双列商品卡与截图 333 并排（像素细节留 21）。
- [x] 分类切换即时过滤；卡片点击带 id 进商品详情。
- [x] 数据来自 api/goods mock（banners 仍走 api/shop），页面不直接 import mock。
- [x] h5 与 mp-weixin 编译通过，悬浮 tab 正常。

## Comments

- 2026-11-20：商品数据改由 `api/goods.allGoods()` 过滤 `type === 'jewelry'`，banners/分类仍取 `api/shop`。
- E2E `.scratch/e2e-shop.mjs`：2 张轮播、12 张商品卡；切「白银饰品」4 张；点首卡进 `goods_detail?type=jewelry&id=5`；pageerrors 空。
