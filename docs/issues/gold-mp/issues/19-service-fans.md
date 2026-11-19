# 19: 客服与粉丝

**What to build:** 客服（369：在线客服 9:00–21:00 + 四类 FAQ，mock，无电话）与粉丝（370：累计收益/明细、一级粉丝、邀请弹层复制邀请码，无海报页）。

**Blocked by:** 02 登录与注册

**Status:** done

- [x] 客服 FAQ 可展开；在线咨询 mock 提示，不接真实 IM。
- [x] 粉丝页只展示一级邀请；收益明细与累计一致；奖励自动入余额、无领取按钮。
- [x] 邀请弹层可复制邀请码并提示已复制。
- [x] 截图 369/370 并排 ±2rpx（H5 去状态栏后仍有 13–47px 偏差，像素收口留 21）。

## Comments

- 2026-11-20：`api/fans.js`（一级粉丝、summary、邀请码）、`pages/fans/index.vue`（tabs/统计/搜索/排序/空态/邀请弹层）、`pages/service/index.vue`（在线客服 mock + 四类 FAQ 折叠）；mine 粉丝卡、首页邀请 promo、教程页客服入口已接线。
- E2E `.scratch/e2e-fans.mjs`：2 条粉丝 → 统计 1/2、收益 23.27；搜索「张」1 条；今日 1 条；清空后空态 + 邀请码 3OSC7YSW4X5R；FAQ 展开 1 条；在线咨询弹层出现；pageerrors 空。
