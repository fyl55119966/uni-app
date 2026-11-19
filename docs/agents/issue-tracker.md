# Issue tracker: Local Markdown

本仓库的 issue 与 spec 以 markdown 文件存放在 `docs/issues/`，随代码一起提交。

> `.scratch/` 已被 `.gitignore` 忽略，只放截图和临时产物，不放 issue。

## 目录约定

- 一个 feature 一个目录：`docs/issues/<feature-slug>/`
- 该 feature 的规格：`docs/issues/<feature-slug>/spec.md`
  - 当前整站规格在 `docs/SPEC.md`；后续按 feature 拆分时，再在 `docs/issues/<feature-slug>/spec.md` 写增量规格。
- 实现票据：`docs/issues/<feature-slug>/issues/NN-<slug>.md`，从 `01` 编号，一票一文件，不要合并成一个 tickets 文件。
- 每个 issue 文件顶部附近写 `Status:` 行记录 triage 状态，取值见 `triage-labels.md`。
- 评论与对话历史追加到文件末尾的 `## Comments` 标题下。

## 当 skill 说「发布到 issue tracker」

在 `docs/issues/<feature-slug>/` 下新建文件（目录不存在就创建）。整站级规格写 `docs/SPEC.md`，feature 级规格写 `docs/issues/<feature-slug>/spec.md`。

## 当 skill 说「读取相关票据」

直接读引用路径的文件。用户通常会传路径或 issue 编号。

## Wayfinding 操作

供 `/wayfinder` 使用。**map** 是一个文件，每个 ticket 一个 **child** 文件。

- **Map**：`docs/issues/<effort>/map.md`（Notes / Decisions-so-far / Fog 正文）。
- **Child ticket**：`docs/issues/<effort>/issues/NN-<slug>.md`，从 `01` 编号，正文写问题。`Type:` 行记录类型（`research`/`prototype`/`grilling`/`task`）；`Status:` 行记录 `claimed`/`resolved`。
- **Blocking**：顶部附近写 `Blocked by: NN, NN`。列出的文件全部 `resolved` 时，该 ticket 才算 unblocked。
- **Frontier**：扫描 `docs/issues/<effort>/issues/`，取 open、unblocked、unclaimed 的文件；编号小的优先。
- **Claim**：动手前把 `Status:` 设为 `claimed` 并保存。
- **Resolve**：在 `## Answer` 标题下写答案，`Status:` 设为 `resolved`，再把上下文指针（要点 + 链接）追加到 `map.md` 的 Decisions-so-far。
