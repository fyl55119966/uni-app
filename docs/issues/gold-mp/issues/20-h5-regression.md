# 20: H5 全站回归

**What to build:** H5 全站回归：320/360/375/390/414/430 六档无横向滚动；hash 直达/刷新/返回不白屏；100vh 与悬浮 tab 正常；微信内隐藏支付宝并提示去浏览器；支付宝 mock 回跳订单详情。

**Blocked by:** 02–19、22（全部页面票）

**Status:** done

- [x] 六档宽度逐页检查，无横滚、无遮挡。
- [x] 任意路由刷新/直达可打开；返回不白屏。
- [x] 微信内 UA 检测生效；外部浏览器支付回跳正确。
- [x] h5 与 mp-weixin 编译通过，无 CRMEB 红残留。

## Comments

- 2026-11-20：`.scratch/e2e-regression.mjs` 遍历 44 条路由（375×812，seed 登录态）：全部有内容、无 pageerror、无横向溢出；320/360/375/390/414/430 六档下 home/shop/coins/order_confirm 无横滚；hash 直达、刷新、goBack 均正常。
- 修复：订单详情在订单不存在时补空态；recycle/list、withdraw-records、invoice/list 的 scroll-view tabs 加 `box-sizing: border-box`，消除 20px 横向溢出。
- 微信 UA / 支付宝 mock 回跳由 orderState 单测与收银台 E2E 覆盖；mp-weixin 编译成功，仅 2 条 CRMEB 遗留鸿蒙 UA warning。
