# 03: 首页

**What to build:** 首页按 329/330/331 还原：品牌与 hero（01.png）、promo 轮播（实物黄金/邀请好友）、全国运营中心、百科知识 3 条、新人补贴弹窗、实名提示条、下拉刷新；各入口可跳，未实现页给明确占位。

**Blocked by:** 01 数据缝与公共外壳

**Status:** done

- [x] 首页数据全部走 `api/home`；下拉刷新重新拉取并 `stopPullDownRefresh`。
- [x] 补贴弹窗「去使用」进金币、「稍后再说」写 storage 不重复弹；实名条样式按截图。
- [x] 入口：金 promo→金币；邀请 promo→粉丝占位；运营中心→占位；百科→占位；文章→百科详情占位；实名→实名占位；占位页显示标题与回首页。
- [x] 329/330/331 截图并排；交易状态文案单测保持绿。

## Comments

- 2026-11-20：原票写的「金价卡 / 五项金刚区」与 329/330/331 的 OCR 结果不符——截图里是 hero + ticker + promo 轮播 + 运营中心 + 百科，B0 时期的金价卡与五宫格是臆造，已删除。金价展示与休市买入拦截归票 04（金币/详情）。本票按截图改为 banner/promo/centers/wiki/realname + 下拉刷新。
- 2026-11-20：promo 高度 230→170rpx 后，首页顶部 OCR `brand 38 / promo 705 / centers 847`，对源 330 的 `38 / 699 / 845`，最大差 6px；hero 内的 kicker/title/sub 是 01.png 烘焙文字，与 330 的字体行高差约 15px，属素材差异。
- E2E：补贴弹窗首次出现，点「去使用」进金币；二次进入不再弹（`gold_subsidy_seen`）。金 promo→金币，实名/运营中心/文章/查看全部→占位页，无 pageerror。
- 新增 [pages/placeholder/index.vue](pages/placeholder/index.vue) 承载未实现页，显示标题、说明与回首页。
