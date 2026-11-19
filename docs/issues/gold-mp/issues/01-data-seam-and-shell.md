# 01: 数据缝与公共外壳

**What to build:** 建立全站唯一的数据缝与共享外壳：USE_MOCK 总开关、统一请求/token/401 处理、api 领域模块骨架，以及 nav-bar / price / empty / button / cell 五个公共组件；现有 4 个 tab 改用新组件后行为不变。

**Blocked by:** None（可立即开始）

**Status:** ready-for-agent

- [ ] USE_MOCK=true 时 api 返回 mock，false 时走统一请求封装；token 失效清本地并跳登录。
- [ ] 五个公共组件可复用，视觉与现有金色 token 一致；page-footer 不被破坏。
- [ ] 页面不直接 import mock；新增 grep 检查并纳入验收。
- [ ] node --test 现有 4 个用例保持绿；h5 与 mp-weixin 编译通过。
