# Statusline (底部状态栏) 配置详解目录

您可以根据需要定制 Codex 底部状态栏显示的信息。点击下方项目可跳转至详细解读：

### 🎨 基础展示与视觉
- [theme-colors](#item-theme-colors) — 跟随终端主题颜色
- [current-dir](#item-current-dir) — 显示当前工作目录
- [project-name](#item-project-name) — 显示当前项目名称
- [codex-version](#item-codex-version) — 显示 Codex 版本号

### 🧠 模型与运行状态
- [model-with-reasoning](#item-model-with-reasoning) — 显示模型名称及推理级别
- [model](#item-model) — 仅显示当前模型名称
- [run-state](#item-run-state) — 显示 AI 运行状态（就绪/工作中/思考中）
- [fast-mode](#item-fast-mode) — 显示快速模式开关状态
- [raw-output](#item-raw-output) — 显示纯文本模式开关状态
- [task-progress](#item-task-progress) — 显示复杂任务的执行进度条

### 🌿 Git 与协作
- [git-branch](#item-git-branch) — 显示当前 Git 分支
- [pull-request-number](#item-pull-request-number) — 显示当前分支的 PR 编号
- [branch-changes](#item-branch-changes) — 显示代码行数变更统计 (+/-)
- [thread-title](#item-thread-title) — 显示对话线程的自定义标题

### 📏 上下文与配额
- [context-remaining](#item-context-remaining) — 显示剩余上下文窗口百分比
- [context-used](#item-context-used) — 显示已用上下文窗口百分比
- [context-window-size](#item-context-window-size) — 显示总上下文 Token 容量
- [five-hour-limit](#item-five-hour-limit) — 显示 5 小时内剩余提问配额
- [weekly-limit](#item-weekly-limit) — 显示每周剩余提问配额

### 💰 Token 与会话统计
- [used-tokens](#item-used-tokens) — 显示本轮对话消耗的总 Token 数
- [total-input-tokens](#item-total-input-tokens) — 统计输入消耗的 Token 数
- [total-output-tokens](#item-total-output-tokens) — 统计输出消耗的 Token 数
- [session-id](#item-session-id) — 显示当前会话的唯一标识符 (UUID)

---

## 详细配置说明

<a id="item-theme-colors"></a>
### › [x] Use theme colors Apply colors from the active /theme

翻译: [已开启] 使用主题颜色 —— 应用当前活跃主题（/theme）的颜色配色。

大白话: 让底部状态栏的颜色跟你当前终端的整体高亮主题保持一致，看起来更和谐。

<a id="item-model-with-reasoning"></a>
### [x] model-with-reasoning Current model name with reasoning level

翻译: [已开启] 模型与推理级别 —— 显示当前的模型名称以及它的推理算力级别。

大白话: 在状态栏显示类似于 gpt-5.4 (medium) 这样的字眼。让你随时知道 AI 目前是用什么脑力在帮你干活。

<a id="item-current-dir"></a>
### [x] current-dir Current working directory

翻译: [已开启] 当前目录 —— 显示当前的工作目录路径。

大白话: 在状态栏显示你现在处于电脑里的哪个文件夹中（比如 ~/Projects/Work/codex-init-study），防止你切错项目。

<a id="item-model"></a>
### [ ] model Current model name

翻译: [未开启] 模型 —— 仅显示当前的模型名称。

大白话: 只显示 gpt-5.4，不显示推理级别。因为它和上面的 model-with-reasoning 功能重复，所以这里通常二选一即可，当前它是关闭的。

<a id="item-project-name"></a>
### [ ] project-name Project name (omitted when unavailable)

翻译: [未开启] 项目名称 —— 显示项目名（如果获取不到则省略）。

大白话: 自动读取你项目配置文件（比如 package.json）里的项目名字并显示在底部。

<a id="item-git-branch"></a>
### [ ] git-branch Current Git branch (omitted when unavailable)

翻译: [未开启] Git 分支 —— 显示当前的 Git 分支名（如果当前目录不是 Git 仓库则省略）。

大白话: 非常实用的功能！打开它后，状态栏会显示你当前在哪个代码分支上（比如 main 或 feat/login），写代码时随时瞥一眼，防止把代码提交错分支。

<a id="item-pull-request-number"></a>
### [ ] pull-request-number Open pull request number for the current branch (omitted when unavailable)

翻译: [未开启] PR 编号 —— 显示当前分支已开启的 Pull Request 编号（如果获取不到则省略）。

大白话: 如果你的当前分支已经在 GitHub/GitLab 上提了 PR，它会在底部显示这个 PR 的号码（比如 #1024）。方便你随时知道当前代码对应的是线上的哪个合并请求。

<a id="item-branch-changes"></a>
### [ ] branch-changes Committed branch changes against the default branch (omitted when unavailable)

翻译: [未开启] 分支变更 —— 当前分支相对于默认主分支已提交的差异统计（不可用时省略）。

大白话: 非常适合程序员！开启后，底部会显示你当前这个分支到底改了多少行代码（比如显示 +45 -12）。它是通过和你项目的主分支（如 main 或 master）自动对比算出来的。

<a id="item-run-state"></a>
### [ ] run-state Compact session run-state text (Ready, Working, Thinking)

翻译: [未开启] 运行状态 —— 简凑的会话运行状态文本（例如：就绪、工作中、思考中）。

大白话: 让底部显示一个简短的提示词，告诉你 AI 现在在干嘛。比如是在等你发话（Ready），正在狂敲代码（Working），还是在深度推理中（Thinking）。

<a id="item-context-remaining"></a>
### [ ] context-remaining Percentage of context window remaining (omitted when unknown)

翻译: [未开启] 剩余上下文 —— 剩余上下文窗口的百分比（未知时省略）。

大白话: AI 的“剩余电量显示”。告诉你当前这轮对话还能再聊百分之几。如果快跌到 0% 了，你就得准备用 /compact 让它压缩记忆，或者用 /clear 清屏重新开始了。

<a id="item-context-used"></a>
### [ ] context-used Percentage of context window used (omitted when unknown)

翻译: [未开启] 已用上下文 —— 已用上下文窗口的百分比（未知时省略）。

大白话: 和上一条完全相反，这是“已用电量显示”（比如显示 85%）。通常你和上面那个 context-remaining 二选一开启一个就足够了。

<a id="item-five-hour-limit"></a>
### [ ] five-hour-limit Remaining usage on 5-hour usage limit (omitted when unavailable)

翻译: [未开启] 5小时限额 —— 5小时使用限制内的剩余可用次数（不可用时省略）。

大白话: 这是账号的“限流防沉迷”提示。因为很多高级大模型（如 o1 或 gpt-4）有调用频率限制（比如每 5 小时只能问 50 次）。开启这个，你就能实时看到自己还剩几次提问机会，省着点用。

<a id="item-weekly-limit"></a>
### [ ] weekly-limit Remaining usage on weekly usage limit (omitted when unavailable)

翻译: [未开启] 每周限额 —— 每周使用限制内的剩余可用次数（不可用时省略）。

大白话: 和上一条同理，如果你用的模型有按“周”计算的额度限制，这里会提醒你这周还剩多少配额。

<a id="item-codex-version"></a>
### [ ] codex-version Codex application version

翻译: [未开启] Codex 版本 —— Codex 应用程序的版本号。

大白话: 仅仅是在角落里显示一下你当前安装的 Codex 软件版本（比如 v0.130.0）。平时写代码没啥用，强迫症建议关闭，保持界面干净。

<a id="item-context-window-size"></a>
### › [ ] context-window-size Total context window size in tokens (omitted when unknown)

翻译: [当前光标悬停 / 未开启] 上下文窗口大小 —— 总上下文窗口的大小，以 Token 为单位（未知时省略）。

大白话: 直接显示当前模型绝对的最大脑容量数字（比如显示 128k）。因为只要你不换模型，这个数字一般是死固定不变的，所以通常也没必要让它一直霸占着底部的宝贵空间。

<a id="item-used-tokens"></a>
### [ ] used-tokens Total tokens used in session (omitted when zero)

翻译: [未开启] 已用 Token —— 当前会话中使用的 Token 总数（为 0 时省略）。

大白话: 计价器！它会显示你开启这段对话以来，总共消耗了多少 Token（包括你发给它的和它回给你的）。如果你对 API 费用或套餐消耗比较敏感，打开这个能让你心里有数。

<a id="item-total-input-tokens"></a>
### [ ] total-input-tokens Total input tokens used in session

翻译: [未开启] 总输入 Token —— 当前会话中使用的输入 Token 总数。

大白话: 细分计价器之一。专门统计“你喂给 AI 的内容”花了多少 Token（包含你的提示词、发过去的代码文件等）。

<a id="item-total-output-tokens"></a>
### [ ] total-output-tokens Total output tokens used in session

翻译: [未开启] 总输出 Token —— 当前会话中使用的输出 Token 总数。

大白话: 细分计价器之二。专门统计“AI 回复给你的内容”花了多少 Token。通常来说，输出 Token 的单价会比输入 Token 贵，这个选项可以帮你监控 AI 有没有在“水字数”。

<a id="item-session-id"></a>
### [ ] session-id Current session identifier (omitted until session starts)

翻译: [未开启] 会话 ID —— 当前对话的唯一标识符（会话开始前省略）。

大白话: 一串很长的系统随机乱码（UUID）。除非你是为了排查系统 Bug 找日志，或者写自动化脚本需要精准恢复某次对话，否则平时完全没必要打开，太占屏幕空间了。

<a id="item-fast-mode"></a>
### [ ] fast-mode Whether Fast mode is currently active

翻译: [未开启] 快速模式 —— 快速模式当前是否处于激活状态。

大白话: 一个状态指示灯。如果你之前敲过 /fast 命令让 AI 进入了“不顾成本疯狂加速”的状态，底部就会显示一个标志，提醒你现在是烧钱狂飙模式。

<a id="item-raw-output"></a>
### [ ] raw-output Whether raw scrollback mode is active

翻译: [未开启] 纯文本输出 —— 纯文本回滚模式（无渲染模式）是否处于激活状态。

大白话: 另一个状态指示灯。如果你敲了 /raw 关掉了界面的华丽排版（为了方便鼠标拖拽复制代码），这里会提醒你当前处于纯文本模式。

<a id="item-thread-title"></a>
### [ ] thread-title Current thread title (omitted when unavailable)

翻译: [未开启] 线程标题 —— 当前对话线程的标题（不可用时省略）。

大白话: 忘备录功能。如果你之前用 /rename 给这次聊天起过名字（比如“重构水质净化器管理后台 UI”），它就会一直显示在底部，时刻提醒你当前的主线任务是什么，防止聊着聊着跑偏了。

<a id="item-task-progress"></a>
### › [ ] task-progress Latest task progress from update_plan (omitted until available)

翻译: [当前光标悬停 / 未开启] 任务进度 —— 来自 update_plan（更新计划）工具的最新任务进度（有数据前省略）。

大白话: 超好用的进度条！ 当你给 AI 布置了一个极其复杂的多步骤任务，AI 会自己制定一个计划。开启这个后，底部会实时显示它当前干到哪一步了（例如：“正在执行 2/5：编写测试用例”），让你在它闷头憋大招时不至于干着急。建议勾选！
