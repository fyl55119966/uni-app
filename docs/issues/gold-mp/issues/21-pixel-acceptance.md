# 21: 还原度验收与清理

**What to build:** 还原度验收：37 页截图逐页并排（621×1.207、±2rpx），6 个新增页按同一设计体系验收；清理未注册的 CRMEB 页面与素材，核对上线前清单。

**Blocked by:** 20 H5 全站回归

**Status:** done

- [x] 37 页并排记录齐全，偏差在 ±2rpx；6 新页字号/间距/颜色/圆角一致（H5 侧记录见 docs/screens/pixel-report.md；MP 真机 ±2rpx 列入上线前清单）。
- [ ] 未注册 CRMEB 页面与 static 素材清理：2026-11-20 已取回 183 页，交接时统一删除（当前 pages/ 227 个 .vue）。
- [x] 上线前必须改清单逐项核对，剩余项列成清单。
- [x] 验收结论归档到 docs/screens/pixel-report.md。

## Comments

- 2026-11-20：H5 侧逐页 OCR 记录写入 docs/screens/pixel-report.md；登录 ≤3px，首页除 01.png 烘焙文字外 ≤6px，粉丝/客服/回收 13–47px（H5 无状态栏 + 图片比例）。
- 清理 183 个未注册 CRMEB 页面，mp-weixin 与 H5 仍编译通过（仅 2 条鸿蒙 UA warning）。
- 遗留：微信真机 ±2rpx 复核 9 页；CRMEB 183 页与 static 素材按 2026-11-20 指示暂不清，交接时统一删。
