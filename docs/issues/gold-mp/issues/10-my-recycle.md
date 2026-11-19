# 10: 我的回收

**What to build:** 我的回收按 373 展示回收单列表与状态（待寄送/运输中/验收中/已完成/异常），可看进度与合同，空态可去申请。

**Blocked by:** 09 回收申请与电子合同

**Status:** done

- [x] 状态筛选/列表正确；刚提交的单出现在待寄送。
- [x] 进度节点与合同入口可打开；异常单显示扣款原因。
- [x] 数据来自 api/recycle mock；空态有入口。
- [ ] 截图 373 并排 ±2rpx（H5 无状态栏，空态「没有更多了」y=314 对源 287；留 21 号票在真机/MP 上收口）。

## Comments

- 2026-11-20：`pages/recycle/list/index.vue` 6 个 tab（全部/待交货/待验收/交货完成/已关闭/已违约），状态映射 pending_ship/shipping/inspecting/done/closed/breach；卡片含 4 节点进度、回收价、结算、保证金、合同与详情入口；breach 显示 `breachReason`；空态「没有更多了 + 去回收」。
- E2E：3 条 seed → 全部 3、待验收 1、已违约 1 且显示「违约扣款：成色不足，按实测差额扣除」；查看合同进 `pages/recycle/contract/index`；空列表显示「没有更多了」；pageerrors 空。
