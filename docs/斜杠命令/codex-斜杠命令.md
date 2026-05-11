# Codex 斜杠命令速查目录

以下是按照功能分类的命令概览，点击命令即可跳转至下方的详细解读注释：

### 🔄 会话与状态管理
- [`/new`](#cmd-new) - 开启新对话
- [`/resume`](#cmd-resume) - 恢复历史对话
- [`/rename`](#cmd-rename) - 重命名对话
- [`/fork`](#cmd-fork) - 复刻/分叉对话
- [`/clear`](#cmd-clear) - 清屏并开启新对话
- [`/compact`](#cmd-compact) - 精简/压缩对话记录
- [`/status`](#cmd-status) - 查看会话状态与 Token 消耗

### 🤖 模型与行为控制
- [`/model`](#cmd-model) - 选择模型与推理算力
- [`/fast`](#cmd-fast) - 切换快速模式
- [`/plan`](#cmd-plan) - 切换到计划模式
- [`/personality`](#cmd-personality) - 选择沟通风格
- [`/permissions`](#cmd-permissions) - 权限控制
- [`/approve`](#cmd-approve) - 破例批准操作

### 💻 工作区与上下文
- [`/ide`](#cmd-ide) - 同步 IDE 上下文
- [`/mention`](#cmd-mention) - 引用/提及文件
- [`/diff`](#cmd-diff) - 查看代码差异
- [`/review`](#cmd-review) - 本地代码审查
- [`/init`](#cmd-init) - 初始化项目指令

### 🚀 代理与多任务协作
- [`/agent`](#cmd-agent) - 切换子特工线程
- [`/subagents`](#cmd-subagents) - 切换子特工线程
- [`/collab`](#cmd-collab) - 切换协作模式
- [`/ps`](#cmd-ps) - 查看后台终端进程
- [`/stop`](#cmd-stop) - 停止所有后台终端
- [`/side`](#cmd-side) - 开启侧边/临时对话

### ⚙️ 界面与个性化配置
- [`/theme`](#cmd-theme) - 切换语法高亮主题
- [`/keymap`](#cmd-keymap) - 自定义快捷键
- [`/vim`](#cmd-vim) - Vim 键位模式
- [`/raw`](#cmd-raw) - 切换纯文本排版模式
- [`/title`](#cmd-title) - 自定义终端标题
- [`/statusline`](#cmd-statusline) - 自定义底部状态栏
- [`/copy`](#cmd-copy) - 一键复制回复

### 🔌 扩展与高级功能
- [`/skills`](#cmd-skills) - 技能调用
- [`/mcp`](#cmd-mcp) - 查看 MCP 工具列表
- [`/plugins`](#cmd-plugins) - 浏览插件管理
- [`/hooks`](#cmd-hooks) - 生命周期钩子管理
- [`/memories`](#cmd-memories) - 记忆管理
- [`/experimental`](#cmd-experimental) - 实验性功能开关

### 🚪 系统操作
- [`/feedback`](#cmd-feedback) - 发送反馈与日志
- [`/logout`](#cmd-logout) - 退出登录
- [`/exit`](#cmd-exit) - 退出程序

---

## 详细命令注释

<a id="cmd-model"></a>
### /model (选择模型与推理算力)

原文: choose what model and reasoning effort to use

解读: 允许你在对话中途随时切换底层 AI 模型（比如从 gpt-5.4 切换到更强大的 gpt-5.5），并调整它的“思考深度”（低、中、高）。当你觉得当前任务太难，AI 变笨了时，敲这个命令给它“换个脑子”。

<a id="cmd-fast"></a>
### /fast (切换快速模式)

原文: toggle Fast mode to enable fastest inference with increased plan usage

解读: 开启或关闭“打鸡血”模式。开启后，AI 生成回复和代码的速度会飙升（最快推理速度），但这会以更快的速度消耗你套餐内的额度（plan usage）。适合处理简单且需要立刻拿到结果的任务。

<a id="cmd-ide"></a>
### /ide (同步 IDE 上下文)

原文: include current selection, open files, and other context from your IDE

解读: 神仙联动功能！它允许你终端里的 Codex 直接“看到”你代码编辑器（比如 VS Code）里当前选中的代码、正在打开的文件页签。这样你就不用手动复制粘贴代码给它了。

<a id="cmd-permissions"></a>
### /permissions (权限控制)

原文: choose what Codex is allowed to do

解读: 随时调整 AI 的操作权限。如果你觉得 AI 马上要执行一些高危操作（比如大范围删改文件），可以用这个命令立刻把它的权限收紧成“操作前必须问我”或“只读”。

<a id="cmd-keymap"></a>
### /keymap (自定义快捷键)

原文: remap TUI shortcuts

解读: 直接在终端界面里修改操作快捷键（TUI 指的就是你当前看着的这个终端界面）。之前我们报错的那个“回车换行/发送消息”的冲突，其实可以直接用这个命令在界面里修改，不用去改代码文件。

<a id="cmd-vim"></a>
### /vim (Vim 键位模式)

原文: toggle Vim mode for the composer

解读: Vim 编辑器爱好者的福音！开启后，底部的聊天输入框（composer）就会变成一个小型的 Vim 编辑器，你可以使用原汁原味的 Vim 快捷键（比如 hjkl 移动，dd 删行，i 插入）来飞速编辑你要发给 AI 的提示词。

<a id="cmd-experimental"></a>
### /experimental (实验性功能开关)

原文: toggle experimental features

解读: 快速打开或关闭官方正在内测的一些新奇功能（比如多 Agent 协同打工）。相当于你在界面里按开关，它会自动帮你把修改写入到 config.toml 文件里。

<a id="cmd-approve"></a>
### /approve (破例批准操作)

原文: approve one retry of a recent auto-review denial

解读: 如果你配置了安全审查规则（比如不准 AI 跑删除命令），AI 刚才因为触发规则被系统自动拦截了（denial）。如果你作为人类老大看了眼觉得没问题，敲入这个命令，就可以给它一次“破例特批”，让它重试刚才那个被拦截的动作。

<a id="cmd-memories"></a>
### /memories (记忆管理)

原文: configure memory use and generation

解读: 管理 AI 的“长期记忆”。Codex 会在你们日常的协作中，默默记下你的代码习惯、偏好或你们团队踩过的坑（比如“你更喜欢用 TypeScript”或“这个 API 必须带 token 才能调用”）。使用这个命令可以查看它记住了什么，或者手动删除/添加某些记忆。

<a id="cmd-skills"></a>
### /skills (技能调用)

原文: use skills to improve how Codex performs specific tasks

解读: 管理和调用“特长技能”。类似于给 AI 加载特定的技能包（比如你公司内部自定义了一套“如何编写符合公司规范的 React 组件”的技能）。敲这个命令可以让 AI 在接下来的任务中，表现得更加专业和契合特定场景。

<a id="cmd-hooks"></a>
### /hooks (生命周期钩子管理)

原文: view and manage lifecycle hooks

解读: “钩子（Hooks）”指的是一种自动化机制。比如你可以设置：每次 AI 帮你改完代码后，自动触发一下 npm run lint 和 npm test。这个命令就是用来查看、管理当前生效的自动化钩子脚本的。

<a id="cmd-review"></a>
### /review (本地代码审查)

原文: review my current changes and find issues

解读: 让 AI 化身“无情的 Code Reviewer”。在你打算 git commit（提交代码）之前敲入这个命令，AI 会检查你目前工作区里所有刚改过的代码，帮你找出潜在的 Bug、性能隐患或不规范的地方，而它自己不会去乱改文件，仅仅是给你提供审查建议。

<a id="cmd-rename"></a>
### /rename (重命名对话)

原文: rename the current thread

解读: 给当前的对话线程改个名字。如果你和 AI 聊着聊着偏离了最初的主题，或者你想给这段长对话起个直观的名字（比如“重构支付模块登录逻辑”），方便以后在历史记录里快速找到它，就用这个命令。

<a id="cmd-new"></a>
### /new (开启新对话)

原文: start a new chat during a conversation

解读: 在不退出当前终端界面的情况下，直接“清空 AI 的大脑”，原地开启一段全新的对话。非常适合：上一个 Bug 刚修完，你要立马开始写一个毫不相干的新功能。

<a id="cmd-resume"></a>
### /resume (恢复历史对话)

原文: resume a saved chat

解读: “接上回聊”。它会调出你过去的历史对话列表。选定一个后，AI 会瞬间恢复当时的上下文记忆和代码状态，让你可以继续昨天没写完的任务。

<a id="cmd-fork"></a>
### /fork (复刻/分叉对话)

原文: fork the current chat

解读: 这是一个“后悔药”机制。当你在修复一个复杂问题到了关键节点，想让 AI 尝试一种激进的重构方案，但又怕搞砸了污染当前的对话历史。此时敲 /fork，就能直接克隆出一个拥有相同记忆的“平行宇宙（新线程）”。就算新方案搞砸了，你也可以直接切回老的线程重新尝试。
<a id="cmd-init"></a>
### /init (初始化项目指令)

原文: create an AGENTS.md file with instructions for Codex

解读: 在当前项目的根目录下自动创建一个名为 AGENTS.md 的文件。这个文件就像是你给 AI 写的“入职培训手册”，你可以在里面记录该项目的代码规范、使用的库版本或架构约定。Codex 以后每次在这个项目里干活，都会先读一遍这个手册并严格遵守。

<a id="cmd-compact"></a>
### /compact (精简/压缩对话记录)

原文: summarize conversation to prevent hitting the context limit

解读: 这是解决“对话太长导致 AI 断片”的神器。当你和 AI 聊了成百上千句，快要触及大模型的“上下文记忆上限（context limit）”时，敲入这个命令。AI 会主动把前面所有啰嗦的聊天记录压缩成一段高度浓缩的记忆摘要，从而释放出大量 Token 空间，让对话能继续下去。

<a id="cmd-plan"></a>
### /plan (切换到计划模式)

原文: switch to Plan mode

解读: 强行让 AI 开启“君子动口不动手”的模式。当你布置了一个非常复杂的任务时，直接写代码很容易出错。用这个命令让 AI 切换到计划模式，它会先乖乖给你输出一份详细的步骤规划和架构思路，等你审阅点头后，再真正开始修改文件。

<a id="cmd-collab"></a>
### /collab (切换协作模式)

原文: change collaboration mode (experimental)

解读: 这是一个还在测试中（experimental）的功能。主要用于调整你和 AI 甚至多个 AI 之间的协作交互方式。后续版本中可能会有更多具体玩法的更新。

<a id="cmd-agent"></a>
### /agent (切换子特工线程)

原文: switch the active agent thread

解读: 当你开启了“多任务并发（Multi-Agent）”功能后，Codex 可能会派生出好几个小特工在后台同时干活（比如一个在写前端，一个在测后端）。通过这个命令，你可以在不同的“子特工”对话面板之间自由切换，去“监工”或者指导它们。

<a id="cmd-side"></a>
### /side (开启侧边/临时对话)

原文: start a side conversation in an ephemeral fork

解读: 开启一个“阅后即焚”的临时聊天窗口。比如当前主线任务正在修一个极其复杂的 Bug，你突然遇到个英文报错看不懂，或者想让 AI 写段正则表达式。用 /side 问完后立刻退出，这次“开小差”的聊天记录不会被保存下来，也绝对不会污染你主线 Bug 修复的上下文思路。

<a id="cmd-copy"></a>
### /copy (一键复制回复)

原文: copy last response as markdown

解读: 救星级功能！直接把 AI 发给你的最后一段内容（连带里面排版好的 Markdown 格式和代码块）一键复制到你的系统剪贴板里。彻底告别在终端屏幕上用鼠标小心翼翼去划选大段代码的痛苦。

<a id="cmd-raw"></a>
### /raw (切换纯文本排版模式)

原文: toggle raw scrollback mode for copy-friendly terminal selection

解读: 在默认状态下，终端为了好看会渲染出各种颜色、表格和边框，但这会导致你用鼠标强行拖拽复制时格式全乱掉。开启这个“Raw（原生）模式”后，界面华丽的渲染会被瞬间卸除，退化成最干净的纯文本，非常方便你用鼠标在终端里精准选取大段日志或代码片段。

<a id="cmd-diff"></a>
### /diff (查看代码差异)

原文: show git diff (including untracked files)

解读: 直接在终端内显示 Git 的改动差异（Diff）。它非常强大的一点是，不仅能显示你修改过的文件，连你刚刚新建但还没交给 Git 追踪的文件（untracked files）也能一并显示。非常适合在 Commit 代码前，或者在 AI 写完代码后，快速确认到底改了哪些地方。

<a id="cmd-mention"></a>
### /mention (引用/提及文件)

原文: mention a file

解读: 类似于微信聊天里的 @ 功能。输入这个命令再加上文件路径，可以将特定的文件强行塞进当前对话的上下文中。这就相当于按着 AI 的头对它说：“接下来的问题，请务必结合这个文件里的代码来回答。”

<a id="cmd-status"></a>
### /status (查看会话状态与 Token 消耗)

原文: show current session configuration and token usage

解读: 打印当前会话的“体检报告”。你可以用它来确认目前正在使用的是什么模型、安全权限是怎么配置的，以及当前对话已经消耗了多少 Token 容量。当对话很久时，看一眼这个能防止突然爆显存/超出上下文上限。

<a id="cmd-title"></a>
### /title (自定义终端标题)

原文: configure which items appear in the terminal title

解读: 自定义你的终端软件（比如 iTerm2 或是 Windows Terminal）顶部标签页/窗口的名字。你可以设置让标题显示当前在用什么模型、执行什么任务、当前项目名叫什么，方便你在开了一堆终端窗口时一眼找到 Codex。

<a id="cmd-statusline"></a>
### /statusline (自定义底部状态栏)

原文: configure which items appear in the status line

解读: 自定义 Codex 聊天界面最下方的那行状态栏。你可以通过它开启或关闭显示：当前的 Git 分支、Token 计数器、速率限制提示等，打造符合你个人习惯的界面。

<a id="cmd-theme"></a>
### /theme (切换语法高亮主题)

原文: choose a syntax highlighting theme

解读: 给 AI 输出的代码“换皮肤”。当 AI 给你输出代码片段或者 Diff 差异时，你可以用这个命令挑选一个不同的语法高亮配色主题（比如换个暗色系或护眼系的主题），缓解眼部疲劳。

<a id="cmd-mcp"></a>
### /mcp (查看 MCP 工具列表)

原文: list configured MCP tools; use /mcp verbose for details

解读: MCP (Model Context Protocol) 是一种让 AI 接入外部工具的协议。这个命令用来列出当前 Codex 已经连接并可以使用的外部第三方工具。如果你输入 /mcp verbose，它还会打印出极其详细的服务器连接诊断信息，方便排错。

<a id="cmd-plugins"></a>
### /plugins (浏览插件管理)

原文: browse plugins

解读: 打开插件浏览器。你可以在里面查看已安装的插件、发现支持的新插件，并通过快捷键快速启用或禁用某些特定插件，从而扩展 Codex 的能力边界。
<a id="cmd-logout"></a>
### /logout (退出登录)

原文: log out of Codex

解读: 清除你当前在 Codex 上的账号登录凭证。如果你是在公司的公共开发机或借用别人的电脑操作，离开前务必执行此命令以保护你的账号安全。

<a id="cmd-exit"></a>
### /exit (退出程序)

原文: exit Codex

解读: 立即关闭并退出当前的 Codex 命令行程序，返回到你系统的普通终端。注意：退出前请确保 AI 帮你写的代码已经保存或提交，防止丢失工作进度。（注：/quit 也有同样的效果）。

<a id="cmd-feedback"></a>
### /feedback (发送反馈与日志)

原文: send logs to maintainers

解读: 一键报错工具。当你遇到诡异的 Bug、程序崩溃，或者 AI 出现了极其离谱的行为时，敲入这个命令，它会自动把你当前会话的运行日志打包发送给 Codex 官方的维护团队，帮助他们排查问题。

<a id="cmd-ps"></a>
### /ps (查看后台终端进程)

原文: list background terminals

解读: 类似于 Linux 系统里的 ps 命令。当 AI 在后台替你执行一些耗时较长的命令时（比如跑庞大的测试用例、执行 npm install 下载依赖），你可以用这个命令随时“监工”，它会列出所有后台终端的进度和最近几行输出日志。

<a id="cmd-stop"></a>
### /stop (停止所有后台终端)

原文: stop all background terminals

解读: 紧急刹车键！如果你发现 AI 在后台执行了一个错误的死循环脚本，或者你想强行打断它正在跑的长时间任务，用这个命令可以一键杀掉当前会话启动的所有后台进程。

<a id="cmd-clear"></a>
### /clear (清屏并开启新对话)

原文: clear the terminal and start a new chat

解读: 彻底清空当前终端屏幕上的视觉残留，并且重置 AI 的上下文记忆，开启一段干干净净的全新对话。（如果你只是嫌屏幕太满想清一下屏，但想保留对话记忆，请使用 Ctrl+L 快捷键，而不是这个命令）。

<a id="cmd-personality"></a>
### /personality (选择沟通风格)

原文: choose a communication style for Codex

解读: 随时调整 AI 跟你说话的语气。比如你赶时间，可以把它调成务实高冷（pragmatic）让它少废话多给代码；如果你想详细学习某个知识，可以调成友好（friendly）让它耐心给你讲解。

<a id="cmd-subagents"></a>
### /subagents (切换子特工线程)

原文: switch the active agent thread

解读: （与之前的 /agent 命令功能相同）当你开启了多核协同（Multi-Agent）功能时，Codex 可以同时派生出多个“子特工”去处理不同的文件和任务。这个命令让你可以在这些并行工作的子线程之间自由切换，去检阅不同特工的工作进度。
