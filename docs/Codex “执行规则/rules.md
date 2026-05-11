# Codex 执行规则 (Rules) 详解

在默认的沙盒模式下，AI 的许多危险操作都会被拦截。通过 **Rules 机制**，你可以像编写防火墙规则一样，精确控制哪些命令可以直接放行、哪些必须询问、哪些绝对禁止。

> [!NOTE]
> 目前这是一个实验性功能。

---

## 目录
- [第一部分：创建规则文件](#第一部分创建规则文件)
- [第二部分：深入理解规则字段](#第二部分深入理解规则字段)
- [第三部分：Shell 包装与复合命令](#第三部分shell-包装与复合命令)
- [第四部分：如何测试规则](#第四部分如何测试规则)
- [第五部分：规则语言 (Starlark)](#第五部分规则语言-starlark)

---

## 第一部分：创建规则文件 (Create a rules file)

### 1. 文件位置
你需要在配置文件夹下建立一个 `rules/` 目录，并创建一个以 `.rules` 结尾的文件：
- **全局规则**：`~/.codex/rules/default.rules`
- **项目规则**：项目根目录下的 `.codex/rules/*.rules`（仅在项目被“信任”时加载）

### 2. 编写规则代码
规则使用类似 Python 的语法。以下是一个拦截 `pnpm install` 命令并在执行前询问的示例：

```python
# 拦截所有带有 `pnpm install` 前缀的命令，并在沙盒外执行前询问。
prefix_rule(
    # pattern (必填): 匹配的前缀。
    pattern = ["pnpm", "install"],

    # decision (决定): "prompt" 意味着弹窗询问是否允许。
    decision = "prompt",

    # justification (理由): 可选。拦截时会在屏幕上显示此说明。
    justification = "安装新依赖前，需要人工确认",

    # match / not_match: 可选的“内联单元测试”。
    # Codex 启动时会自动验证这些用例，确保规则逻辑正确。
    match = [
        "pnpm install react",
        "pnpm install -D typescript",
    ],
    not_match = [
        "pnpm run dev", # 前缀不匹配，不会被命中
    ],
)
```

### 3. 加载与生成
- **重启生效**：修改规则后需重启 Codex。
- **自动生成**：当你在拦截弹窗中选择“以后始终允许（allow list）”时，Codex 会自动在 `default.rules` 中添加放行规则。
- **智能推荐**：开启智能审批后，AI 可能会主动为你推荐一条 `prefix_rule` 代码。

---

## 第二部分：深入理解规则字段 (Understand rule fields)

`prefix_rule()` 函数支持以下核心字段：

- **`pattern` (必填)**：定义要匹配的命令前缀。
  - 固定词组：`["go", "build"]`
  - 多选一组合：`["pnpm", ["add", "install"]]`（同时匹配 `pnpm add` 和 `pnpm install`）

- **`decision` (判决结果)**：默认是 `"allow"`。
  - `allow`: 直接放行，不弹窗。
  - `prompt`: 弹窗询问用户。
  - `forbidden`: 绝对禁止执行，不进行询问。
  - *优先级：禁止 (forbidden) > 询问 (prompt) > 放行 (allow)*。

- **`justification` (可选)**：说明理由。在使用 `forbidden` 时，建议提供替代方案。

- **`match` 和 `not_match` (可选)**：用于排错的测试用例。

---

## 第三部分：Shell 包装与复合命令 (Shell wrappers and compound commands)

这是系统的核心安全机制。当 AI 试图执行复合命令（如 `git add . && rm -rf /`）时，Codex 的处理逻辑如下：

### 情况 A：可安全拆解脚本 (Safe split)
如果脚本是简单的流水账（仅使用 `&&`, `||`, `|`, `;` 连接，无复杂变量或通配符），Codex 会利用 **tree-sitter** 语法树进行拆解：
- **动作 1**：`["git", "add", "."]`
- **动作 2**：`["rm", "-rf", "/"]`
**安全效果**：每个动作分别进行安检。即使第一个动作被允许，第二个危险动作仍会被拦截。

### 情况 B：不可拆解脚本 (No split)
如果脚本包含以下复杂特性，Codex 将拒绝拆解：
- **重定向**：`>`
- **变量赋值**：`FOO=bar`
- **通配符**：`*`
- **逻辑判断**：`if`, `for` 循环等
**安全效果**：整段脚本被打包为 `["bash", "-lc", "<完整脚本>"]` 进行整体匹配。由于通常不会给未知的 bash 脚本开白名单，这会触发最严格的拦截（弹窗询问）。

---

## 第四部分：如何测试规则 (Test a rule file)

无需重启即可测试规则。使用以下命令查看特定动作的判决结果（输出为 JSON）：

```bash
# 测试规则文件对特定命令的态度
codex execpolicy check --pretty \
  --rules ~/.codex/rules/default.rules \
  -- pnpm install
```

---

## 第五部分：这到底是什么语言？(Understand the rules language)

`.rules` 文件使用的是 **Starlark** 语言（由 Google 开发，广泛用于 Bazel 构建系统）。
- **安全性**：它是 Python 的确定性子集，不具备读写文件或产生副作用的能力。
- **纯粹性**：规则引擎运行它时仅进行逻辑判断，确保了配置层的绝对隔离与安全。
