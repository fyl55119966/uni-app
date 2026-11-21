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
- 2026-11-22：分类挪进 mock——`api/shop.PRODUCTS` 每条加 `category`（黄金 8 条 id 1-4/11-14，白银 6 条 id 5-10，翡翠 0 条），`api/goods.js` 删掉 `JEWELRY_CATEGORY` 映射直接用 `item.category`；顶部横滑也按分类过滤，切分类后把该分类第 1 个商品滚到视口正中（`buildBannerLoop()`，`bannerScrollLeft = 24rpx + 452rpx×n + 218rpx - 375rpx`，走 3 份副本循环）；空分类只留背景图 + `g-empty` 空态（新增 `icon`/`textColor` prop，用 `static/icons/ic-empty-box.png` 礼盒线框图标 + 「该分类暂无上架商品」）。
- 验证 2026-11-22：H5（524×1125，rpx 按 750 换算）全部 14 卡 / 黄金 8 / 白银 6 / 翡翠 0；三个分类首个 banner 中心 x 均为 262=视口一半；横滑三份副本的循环跳转（±setWidth）正常；`npm run check` 与 32 项测试通过；mp-weixin 未再编译（`cli.exe publish` 需登录）。
- 2026-11-22（banner 滑动修复）：顶部横滑从 `scroll-view` + 受控 `:scroll-left`（3 份副本循环）改为原生 `swiper`——`previous-margin/next-margin = 157rpx`（即 (750-436)/2，卡片天然居中，两侧露出相邻卡）、`:circular="banners.length > 1"` 接管循环、`:key="active"` 切分类时重建回到第 1 张；删除 `loopBanners`/`bannerScrollLeft`/`bannerSetWidth`/`bannerResetting`/`buildBannerLoop`/`onBannerScroll`/`jumpBanner`。原因：H5 拖拽实测正常，小程序里受控 `scroll-left` 与原生滑动互相抢位置；`swiper` 的滑动由组件原生实现，不受受控属性影响。
- 验证 2026-11-22（swiper）：H5 375×812 触摸左滑后当前卡变为第 2 张且中心 x=188=375/2，切「黄金/白银/翡翠」后首张均居中（8/6/0 张）、翡翠空态文案色 `rgb(201,173,125)`；mp-weixin 模拟器 `.banners__swiper` 212px 高、卡片 14/8/6/0、hint 在有卡时显示、`node tools/check.mjs` 与 32 项测试通过。
- 2026-11-22（白屏排查）：微信开发者工具里点「金币」「小店」白屏，根因是 `unpackage/dist/dev/mp-weixin` 上一次编译中断留下的半成品（页面 chunk 没注册进运行时，devtools 报 Page has not been registered yet）；清空该目录后重新 `cli.exe launch mp-weixin` 全量编译即恢复。重编后模拟器实测：金币页正常渲染；小店页 4 个分类卡片数 14/8/6/0，翡翠空态（背景图 + 礼盒图标 + 该分类暂无上架商品）正常。
