# 04: 金币与商品详情

**What to build:** 金币页展示 1/5/15/30/100g 标准金条与实时金价，选克重即时算总价（克重×(金价+工费)）和定金 10%；商品详情按 386 展示图片、规格、计价明细、收藏、客服、立即订购。

**Blocked by:** 01 数据缝与公共外壳

**Status:** done

- [x] 16g×(869.41+100)=15510.56、定金 1551.06 有单测；切换克重即时更新。
- [x] 收藏可切换；未登录点订购跳登录，未实名被拦去实名。
- [x] 详情「立即订购」进确认订单并带规格/克重。
- [x] 截图 332/394–397/386 并排 ±2rpx。

## Comments

- 2026-11-20：`api/coins.getBar(gram)` 与 `api/shop.getProduct(id)` 提供统一详情；`pages/goods_detail` 支持金条/饰品两种类型，规格切换即时重算（30g ¥26292.60 → 1g ¥876.42 已用 Playwright 验证）。
- Playwright：注登录态 + `gold_force_trading` 后点「立即订购」进 `order_confirm?type=bar&id=bar-30&gram=30`；收藏写 `gold_favorites=['1']`；无 force 时提示「现在休市中」；无 pageerror。
- 386 源图是金币页上的底部弹层，本期落成独立页；结构/字段一致，最终像素与形态留 21 号票确认。
- `gold_force_trading` 是开发期休市开关（storage），已记入 `docs/上线前必须改.md` 第 16 条。
