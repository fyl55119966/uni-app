# AGENTS.md

黄金现货商城前端（微信小程序 + H5，uni-app Vue2，CRMEB v5.6.2 基线）。

- 产品规格：`docs/SPEC.md`
- 需求口径：`docs/需求确认单.md`
- 页面与批次：`docs/页面清单与开发顺序.md`
- 交接说明：`docs/HANDOFF.md`

## 截图与素材

- 页面截图：`images/页面/微信图片_*_NNN_772.png`（NNN 为页号）；OCR/取色结果在 `docs/screens/NNN.json`，重跑用 `tools/screen/batch.ps1`。
- 设计素材：`images/图片/`。页面优先用这里的图，复制到 `static/images/gold/` 后引用。
- 本地预览：`E:\HBuilderX\cli.exe open`，再 `launch web --project E:\ai-workspaces\uni-app`；H5 默认 `http://localhost:8080`。

## Agent skills

### Issue tracker

本地 markdown，issue 与 spec 放在 `docs/issues/`，随代码提交。见 `docs/agents/issue-tracker.md`。

### Triage labels

使用五个规范角色，标签字符串与角色名一致。见 `docs/agents/triage-labels.md`。

### Domain docs

单上下文：根目录 `GLOSSARY.md` + `docs/adr/`。见 `docs/agents/domain.md`。
