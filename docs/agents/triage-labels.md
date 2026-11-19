# Triage Labels

技能用五个规范角色描述 triage 状态；本文件把它们映射到本仓库实际使用的标签字符串。

| 规范角色 | 本仓库标签 | 含义 |
| --- | --- | --- |
| `needs-triage` | `needs-triage` | 待维护者评估 |
| `needs-info` | `needs-info` | 等报告人补充信息 |
| `ready-for-agent` | `ready-for-agent` | 规格完整，可交给 agent 自主执行 |
| `ready-for-human` | `ready-for-human` | 需要人来实现 |
| `wontfix` | `wontfix` | 不处理 |

当技能提到某个角色（例如「打上 AFK-ready 标签」）时，使用表中对应的标签字符串。

本仓库是本地 markdown tracker，标签写在 issue 文件的 `Status:` 行，不依赖 GitHub/GitLab 标签系统。
