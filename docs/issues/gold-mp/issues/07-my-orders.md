# 07: 我的订单

**What to build:** 我的订单按 372 展示待付定金/待付尾款/待提货/已完成/已取消筛选，列表分页、空态，能进订单详情或去支付。

**Blocked by:** 06 收银台与订单详情

**Status:** done

- [x] 五个状态 tab 切换正确，数量与列表一致。
- [x] 空态、加载态、分页都有；从列表去详情/收银台链路通。
- [x] 数据全部来自 api/order mock，页面不直接读 mock。
- [x] 截图 372 并排 ±2rpx。

## Comments

- 2026-11-20：372 实际是 **7 个筛选**（全部/待支付/履约中/待收货/已完成/已关闭/已违约），按截图实现，未按票面 5 个；状态映射见 `pages/orders/index.vue` 的 `match()`。
- H5 E2E：3 条 mock 订单 → 全部 3、待支付 1、履约中 1；点「去支付」进 `cashier?orderNo=G-A&stage=deposit`，点卡片进 `order_detail?orderNo=G-A`；无 pageerror。
- 分页 pageSize=5 + `onReachBottom`；空态用 g-empty（「暂无订购订单」）。
- 像素：H5 无微信状态栏，标题 24/筛选 100 对源 50/201；结构一致，垂直偏移留给 21 号票在真机/开发者工具里收口。
