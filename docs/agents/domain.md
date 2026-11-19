# Domain Docs

工程技能在探索代码库前，按本文件读取本仓库的领域文档。

## 探索前先读

- 根目录 **`GLOSSARY.md`**；或
- 根目录 **`GLOSSARY-MAP.md`**（如果存在）：它指向各上下文的 `GLOSSARY.md`，读与当前任务相关的那些。
- **`docs/adr/`**：读与即将改动的领域相关的 ADR。多上下文仓库还要看 `src/<context>/docs/adr/`。

如果这些文件不存在，**静默继续**。不要提示缺失，也不要主动建议提前创建；`/domain-modeling`（经 `/grill-with-docs`、`/improve-codebase-architecture` 触达）会在术语或决策真正落地时按需创建。

## 文件结构

本仓库是单上下文：

```
/
├── GLOSSARY.md
├── docs/adr/
│   └── 0001-....md
├── docs/SPEC.md
└── pages/ ...
```

## 使用术语表词汇

输出中出现领域概念时（issue 标题、重构提案、假设、测试名），使用 `GLOSSARY.md` 定义的说法，不要漂移到术语表明确避免的同义词。

如果需要的概念还不在术语表中，这是一个信号：要么在发明项目不用的词（重新考虑），要么是真实缺口（记下来交给 `/domain-modeling`）。

## 标出 ADR 冲突

如果输出与既有 ADR 矛盾，显式提出来，不要静默覆盖：

> _与 ADR-0007（event-sourced orders）冲突，但值得重开，因为……_
