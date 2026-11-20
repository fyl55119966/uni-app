# 交接说明（给下一个模型 / 下一位开发者）

最后更新：2026-11-20

## 一句话

`E:\ai-workspaces\uni-app` 是「上金所有金店 · 黄金现货商城」前端：uni-app Vue2 + CRMEB v5.6.2 基线，微信小程序 + 全站 H5，数据全部 mock，等客户后端与支付资质。

## 先读什么

按顺序：

1. 本文件
2. `AGENTS.md`（仓库约定、issue tracker、截图/素材/预览入口）
3. `docs/SPEC.md`（整站规格与 106 条用户故事）
4. `docs/需求确认单.md`（A1–A10、B1–B7 已确认口径）
5. `docs/上线前必须改.md`（18 条临时方案，交付前逐项处理）
6. `docs/真机像素测试单.md`（43 页 5 批，当前进行到这里）

票据：`docs/issues/gold-mp/issues/01-22`，全部 `Status: done`。

## 当前状态（2026-11-20）

- 22/22 票据完成；43 个业务页 + 183 个 CRMEB 遗留页（保留，交接时统一删）。
- `npm test` 32/32；`npm run check` 通过（路由、静态资源大小写、页面禁止 import mock、JSON BOM）。
- H5 与 mp-weixin 均可编译；CI 绿（`.github/workflows/check.yml`，Node 22）。
- 注册页刚按 621×1368 截图修完，H5 折算误差 ≤5px（提交 `8dbddc3`）。
- 工作区干净，分支 `main`，远端 `git@github.com:fyl55119966/uni-app.git`。

## 怎么跑

```powershell
# H5（先开 HBuilderX，再 launch；dev server 常自己退出，见下）
& "E:\HBuilderX\cli.exe" open
& "E:\HBuilderX\cli.exe" launch web --project "E:\ai-workspaces\uni-app"

# 微信小程序编译
& "E:\HBuilderX\cli.exe" launch mp-weixin --project "E:\ai-workspaces\uni-app" --compile true

# 自检与测试
npm run check
npm test

# 截图 OCR（69 张设计图 → docs/screens/NNN.json）
powershell -NoProfile -File tools/screen/batch.ps1
```

H5 默认 `http://localhost:8080`。如果 `cli launch web` 启动后立刻退出，用后台方式：

```powershell
Start-Process -FilePath "E:\HBuilderX\cli.exe" -ArgumentList 'launch','web','--project','E:\ai-workspaces\uni-app' -WindowStyle Hidden
```

## 架构速查

- `api/config.js`：`USE_MOCK=true`、`BASE_URL=''`、token/user storage key。
- `api/request.js`：`withMock()` 是 mock/真实唯一开关；401/110002 清 session 跳登录。
- `api/*.js`：auth、home、coins、shop、goods、order、recycle、wallet、bank、withdraw、promo、profile、account、content、fans、mine。
- `utils/`：`token.js`、`guard.js`、`price.js`、`settle.js`、`orderState.js`、`recycle.js`、`withdraw.js`、`favorite.js`。
- `components/`：`nav-bar`、`g-price`、`g-button`、`g-cell`、`g-empty`、`page-footer`。
- 页面数据只走 `api/`，**页面不允许直接 import mock**（check.mjs 会拦）。

## 已锁定的业务口径（别擅自改）

- 金价固定 861.42 元/g；金条工费 15 元/g；饰品工费 100 元/g；定金 10%；回收价 = 金价 − 0.5；回收保证金 10%。
- 交易时段周一至周日 09:30–23:30（暂定，后台可配）；测试时可用 `gold_force_trading` 强制放行。
- 券先抵定金、超出结转尾款；补贴只抵定金、不结转不找零；两者封顶订单总额。
- 提现：服务费 3 元 + 1%，最低 0.01，单日最高 50000，每日最多 3 次，T+1。
- 微信小程序 + 全站 H5；支付宝只在外部浏览器 H5；微信内支付一律 mock 并标「测试环境」。
- 一级邀请；返佣实付 0.15%，完成 T+1 入余额，退款撤销/扣回；粉丝页只展示一级。

## 关键文件

| 文件 | 用途 |
|---|---|
| `docs/SPEC.md` | 整站规格、状态机、支付矩阵、测试缝 |
| `docs/需求确认单.md` | 与客户确认过的全部口径 |
| `docs/页面清单与开发顺序.md` | 43 页与 B0–B7 批次 |
| `docs/真机像素测试单.md` | 当前要逐页自测的 43 页清单 |
| `docs/上线前必须改.md` | 18 条上线前临时方案 |
| `docs/screens/` | 69 张设计图 OCR + 取色 + `pixel-report.md` |
| `docs/screens/327-register-1368.png` | 最新注册页参考图 |

## 现在只剩这些

1. **真机像素批次 1**（用户在逐页自测）：登录、首页、金币、小店、我的、商品详情、粉丝、客服、回收申请。按测试单回填「过/观察/修」，9 页测完再做批次 2。
2. **待用户确认**：注册页是否默认预填演示邀请码 `3OSC7YSW4X5R`（目前只有 `?invite=` 才预填）。
3. 微信真机 ±2rpx 收口（H5 已 ≤5px，MP 需按机型状态栏高度复核）。
4. 接真实后端/支付/IM/实名/发票（等客户接口与资质，`USE_MOCK=false` 后走 `api/request.js`）。
5. 交接时统一清理 183 个 CRMEB 页面与 `static/` 素材（命令见 `docs/上线前必须改.md` #18）。

## 坑（已经踩过）

- **不要用 PowerShell `Set-Content -Encoding utf8` 写 `package.json`/`pages.json`/`manifest.json`**：会带 UTF-8 BOM，HBuilderX 报 `Unexpected token '﻿'`，H5 还会误报成 `main.js` 找不到。用 Python `encoding='utf-8'` 或 Node 写。check.mjs 已加 BOM 守卫。
- H5 的 `--status-bar-height` 是 0，MP 是 44–50px，像素比对要按状态栏折算。
- H5 dev server 会因 HMR 崩溃退出；页面突然「连接服务器超时」先看 8080 是否还活着。
- CI 用 Node 22，`node --test tests` 不接受目录，测试脚本要显式列文件。
- `uni.getStorageSync` 对 seed 的 `{type,data}` / JSON 字符串形态不一致，读写 storage 的模块都做了兼容（token、favorite、order）。

## 给新模型的启动话术

> 接手 `E:\ai-workspaces\uni-app`（上金所有金店黄金商城前端，uni-app Vue2 + CRMEB 基线）。先读 `docs/HANDOFF.md`、`AGENTS.md`、`docs/SPEC.md`、`docs/需求确认单.md`、`docs/上线前必须改.md`。22 张票已全部 done，32 个测试绿，H5/mp-weixin 可编译。当前下一步是真机像素批次 1，按 `docs/真机像素测试单.md` 逐页对；不要改已确认口径，页面数据只走 `api/`。每次改完跑 `npm run check` 和 `npm test`，保持工作区干净再提交。
