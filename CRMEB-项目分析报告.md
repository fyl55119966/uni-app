# CRMEB 项目识别分析报告

- **分析对象**：`E:\ai-workspaces\uni-app`（uni-app 前端工程）
- **分析时间**：2026-11-19
- **分析人**：DSH 编码助手（lead）
- **结论摘要**：该工程是 **CRMEB 标准版（单店 / PHP 版）v5.6.2 的 uni-app 前端源码**，为商城用户端（C 端）+ 移动端管理，不包含后端与数据库。

---

## 一、结论

是 CRMEB，且可以确定具体产品线与版本：

| 项目 | 判定 |
|---|---|
| 是否 CRMEB | **是** |
| 产品线 | CRMEB 标准版（单店，PHP / ThinkPHP） |
| 前端版本 | **v5.6.2**（versionCode 562） |
| 工程角色 | 商城前端（H5 / 微信小程序 / App），不含后端 |
| 是否二开 | 未发现明显二开痕迹，倾向官方原版（无 git，无法逐版本比对） |

---

## 二、判定依据（可复核）

| # | 证据 | 位置 | 内容 |
|---|---|---|---|
| 1 | 应用声明 | `manifest.json` 第 2-6 行 | `name` / `description` = **"CRMEB标准版"**，`versionName` = **5.6.2**，`versionCode` = 562 |
| 2 | 官方标识 | `manifest.json` 第 3 行 | `appid` = `__UNI__A3F1ED4` |
| 3 | 官方域名 | `manifest.json` 第 103/109/124 行 | UniversalLinks 指向 `https://bzapp.crmeb.net/uni-universallinks/__UNI__A3F1ED4/` |
| 4 | 版权头 | `main.js` 第 1-9 行；`utils/request.js`、`config/cache.js`、`config/socket.js`、`api/*.js` 等 40+ 文件 | `CRMEB [ CRMEB赋能开发者，助力企业发展 ]`、`Copyright (c) 2016~2024 https://www.crmeb.com`、`Author: CRMEB Team <admin@crmeb.com>` |
| 5 | 默认接口地址 | `config/app.js` 第 5 行 | `HTTP_REQUEST_URL: \`https://demo.crmeb.com\``（官方演示站默认值） |
| 6 | 鉴权特征 | `config/app.js` 第 28 行；`utils/request.js` 第 43 行 | `TOKENNAME: 'Authori-zation'`，请求头写入 `'Bearer ' + token` |
| 7 | 请求约定 | `utils/request.js` 第 50、58、60 行 | 路径统一 `HTTP_REQUEST_URL + '/api/' + url`；成功码 `status == 200`；登录失效码 `110002 / 110003 / 110004` |
| 8 | 接口版本 | `api/api.js`、`api/user.js` 等 | 大量 `v2/...` 端点，如 `v2/diy/get_diy/default`、`v2/lottery`、`v2/invoice`、`v2/new_coupon`，对应 CRMEB v5 后端 |
| 9 | DIY 首页 | `pages/index/index.vue` 第 1-45 行 | `styleConfig` + `userInfor / newVip / articleList / bargain / combination / coupon / goodList / liveBroadcast ...` 组件化装修布局（CRMEB v5 DIY 3.0） |
| 10 | 页面架构 | `pages.json` | 5 个 tab 页 + 9 个分包（`pages/extension`、`pages/goods`、`pages/users`、`pages/goods_details`、`pages/activity`、`pages/admin`、`pages/columnGoods`、`pages/annex`、`pages/points_mall`），约 297 个页面 |
| 11 | 主题色 | `uni.scss` 第 5 行 | `$theme-color:#E93323`，CRMEB 标志性红 |
| 12 | 工程构成 | 全目录 | 486 个文件：233 个 `.vue`、67 个 `.js`、0 个 `.php`、无 `node_modules`；`package.json` 依赖为空（HBuilderX 工程） |

官方文档中「CRMEB 标准版 5.6.2 移动端前端目录结构」与本工程逐项吻合（api / components / config / libs / mixins / pages / plugin / static / store / utils + App.vue / main.js / manifest.json / pages.json），可交叉印证。

---

## 三、项目构成

### 3.1 目录结构

```
uni-app/
├── api/          # 接口层：activity / admin / api / kefu / lottery / order / points_mall / public / store / user
├── components/   # 60+ 业务组件（goodList、couponWindow、jyf-parser、payment、tabNav 等）
├── config/       # app.js（接口域名/请求头）、cache.js、socket.js
├── libs/         # login、wechat、routine、new_chat（WebSocket 客服）、permission、order
├── mixins/       # 全局混入
├── pages/        # 页面（分包）
│   ├── index/ goods_cate/ order_addcart/ user/ goods_details/ guide/ ...
│   ├── activity/ # 秒杀、砍价、拼团、预售、抽奖、海报
│   ├── users/    # 会员、积分、佣金、分销、地址、发票、签到
│   ├── admin/    # 移动端管理：订单、发货、统计、改价
│   ├── annex/    # 协议、入驻申请、付费会员、离线支付、webview
│   ├── points_mall/ columnGoods/ promotional_items/ extension/（客服/资讯）
├── plugin/       # animate、clipboard、dayjs、emoji、image-tools、jweixin
├── static/       # 图片等静态资源（约 0.4 MB，多数素材走远程）
├── store/        # Vuex
├── utils/        # request、cache、util、theme、validate、i18n、SubscribeMessage
├── App.vue / main.js / manifest.json / pages.json / uni.scss / vue.config.js
└── package.json / package-lock.json
```

### 3.2 技术栈

- **uni-app + Vue 2**（`new Vue({...App})`，Vuex、vue-i18n）
- **HBuilderX 工程**：无 `node_modules`，`package.json` 依赖为空；`package-lock.json` 内 `name = H5`、lockfileVersion 1
- **多端**：H5（history 路由、同域接口）、微信小程序、App（App-Plus 已启用 Payment / Share / OAuth / VideoPlayer / Camera 模块）
- **样式**：SCSS，主题变量集中在 `uni.scss`
- **打包**：`vue.config.js` 仅在生产环境关闭 sourcemap、去除 console/debugger

### 3.3 功能范围

| 域 | 内容 |
|---|---|
| 商城 | 商品列表/详情/多规格、分类、购物车、下单、支付、订单、物流、退款退货、评价 |
| 营销 | 秒杀、砍价、拼团、预售、抽奖（大转盘/九宫格）、积分商城、优惠券、新人礼、送礼 |
| 会员 | 付费会员（SVIP）、积分、签到、等级/经验、余额充值、账单 |
| 分销 | 推广人、佣金、提现、事业部/代理商、排行榜 |
| 门店 | 门店列表、到店自提、核销 |
| 服务 | 客服 IM（WebSocket 长连接 `libs/new_chat.js`）、资讯、发票、消息中心、多语言 |
| 管理 | `pages/admin`：移动端订单管理、发货、经营统计、改价 |

---

## 四、是否二次开发

**倾向官方原版，未做二开**，依据：

1. 接口域名仍为官方默认 `https://demo.crmeb.com`；
2. `appid`（`__UNI__A3F1ED4`）、腾讯地图 key、客服主题色均为官方默认值；
3. 全项目检索未发现自定义域名、品牌文案或商户信息；
4. 未发现 `TODO / FIXME / 待开发 / 定制` 等二次开发残留标记。

**限制**：工程目录没有 `.git`，无法做逐版本 diff。若要 100% 确认未被改动，需与官方 v5.6.2 安装包做文件哈希/内容比对。

---

## 五、使用注意

1. **本工程只是前端**：必须配套 CRMEB 标准版 v5.6.2 的 PHP（ThinkPHP）后端，接口前缀 `/api`、需同域部署；后端版本不一致易出现接口不匹配。
2. **改接口域名**：上线前修改 `config/app.js` 第 5 行 `HTTP_REQUEST_URL`；H5 使用 `history` 路由，打包产物（`index.html` + `static/`）需放入后端 `public/` 目录。
3. **版权与授权**：源码头部明确声明「CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权」；`App.vue` 中保留 `getCrmebCopyRight()` 版权校验与 `/api/get_script` 统计脚本。商用/去版权需遵循 CRMEB 授权。
4. **版本较旧**：5.6.2 之后官方已发布 5.6.3、5.6.4，长期使用建议评估升级（升级通常需同步更新小程序、重启长连接/定时任务/消息队列）。

---

## 六、复核方法

```powershell
# 1. 查看版本与应用名
Select-String -Path manifest.json -Pattern '"name"|"versionName"|"versionCode"|"appid"'

# 2. 统计版权头文件数
Select-String -Path (Get-ChildItem -Recurse -File -Include *.js,*.vue).FullName -Pattern 'crmeb.com' -List |
  Measure-Object

# 3. 确认是纯前端（应输出 0）
(Get-ChildItem -Recurse -File -Filter *.php | Measure-Object).Count

# 4. 查看默认接口地址
Select-String -Path config\app.js -Pattern 'HTTP_REQUEST_URL'
```

---

## 附录：外部参考

- CRMEB 官方文档 · 标准版 v5 目录结构：<https://doc.crmeb.com/single/v5/8058>
- CRMEB 移动端前端目录结构说明（官方仓库，标注版本 "CRMEB标准版 5.6.2"）：<https://github.com/crmeb/crmeb/blob/da8d3b93400f3c660aa54d38b54ada387c963cd9/help/dev-docs/uniapp/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%89%8D%E7%AB%AF%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84%E8%AF%A6%E7%BB%86%E8%AF%B4%E6%98%8E.md>
- 标准版 v5.6.1 发布说明：<https://www.crmeb.com/ask/thread/65156>
- 标准版 v5.6.3 发布说明：<https://www.crmeb.com/ask/thread/67246>
