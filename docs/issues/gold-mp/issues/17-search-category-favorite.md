# 17: 搜索、分类与收藏

**What to build:** 新增搜索、分类、收藏三页：关键词搜索商品、按分类浏览、收藏列表与取消收藏，结果都能进商品详情。

**Blocked by:** 04 金币与商品详情

**Status:** done

- [x] 搜索有历史/空结果/加载态；分类切换正确。
- [x] 收藏可取消并即时移除；未登录点收藏跳登录。
- [x] 三页结果进详情带商品 id；数据走 api/goods mock。
- [x] 新页按设计体系验收，无截图页不要求并排。

## Comments

- 2026-11-20：`api/goods.js` 聚合 5 个金条与 12 个饰品；搜索按标题/分类匹配，历史存 `gold_search_history`；分类左侧四类、右侧列表；收藏统一走 `utils/favorite.js`，未登录点收藏跳登录并带 redirect。
- E2E：热词「金条」5 条 → `goods_detail?type=bar&gram=1`；分类投资金条 5 条、黄金饰品 6 条；seed 收藏 1 条，取消后 0 条并出现空态；pageerrors 空。
- 收藏 seed 兼容 `{type,data}`、数组与 JSON 字符串三种存储形态。
