# codex-notify

这是一个给 Codex CLI 用的 Linux 通知脚本。

当前入口文件是：

- `notify.js`
- `test-notify.sh`

Codex 配置示例：

```toml
notify = ["node", "/home/duoyun/idea/idea/codex-notify/codex-notify/notify.js"]
```

脚本会接收 Codex 传入的 JSON 事件，目前只处理 `agent-turn-complete`。

## 手动测试

你可以不等 Codex 触发，直接手动测试：

```bash
cd /home/duoyun/idea/idea/codex-notify/codex-notify
bash ./test-notify.sh
```

也可以自定义标题、提示词和 cwd：

```bash
bash ./test-notify.sh "测试标题" "这是测试内容" "/tmp/demo"
```

如果你的 `node` 不在默认 `PATH`，可以临时指定：

```bash
NODE_BIN="/home/duoyun/.nvm/versions/node/v24.14.0/bin/node" bash ./test-notify.sh
```

参数说明：

- 第一个参数：通知标题来源
- 第二个参数：模拟的 `input-messages`
- 第三个参数：模拟的 `cwd`

## 配置文件

配置文件是同目录下的 `config.json`。

默认内容：

```json
{
  "popup": {
    "system": {
      "enabled": true,
      "expireTimeMs": 10000
    },
    "desktop": {
      "enabled": false,
      "timeoutMs": 15000
    }
  },
  "sound": {
    "enabled": false,
    "mode": "system",
    "filePath": ""
  }
}
```

## 字段说明

### `popup`

控制弹窗相关行为。

### `popup.system.enabled`

- 类型：`boolean`
- 作用：是否启用系统通知
- 默认值：`true`

这里的“系统通知”指 Linux 通知中心消息，脚本使用 `notify-send` 发送。

设为 `true`：

```json
"system": {
  "enabled": true,
  "expireTimeMs": 10000
}
```

设为 `false`：

```json
"system": {
  "enabled": false,
  "expireTimeMs": 10000
}
```

### `popup.system.expireTimeMs`

- 类型：`number`
- 作用：系统通知显示时长，单位毫秒
- 默认值：`10000`

例如显示 5 秒：

```json
"system": {
  "enabled": true,
  "expireTimeMs": 5000
}
```

### `popup.desktop.enabled`

- 类型：`boolean`
- 作用：是否启用桌面对话框
- 默认值：`false`

这里的“桌面弹窗”指 GUI 对话框，脚本使用 `zenity` 弹出窗口。

例如开启桌面对话框：

```json
"desktop": {
  "enabled": true,
  "timeoutMs": 15000
}
```

### `popup.desktop.timeoutMs`

- 类型：`number`
- 作用：桌面对话框自动关闭时间，单位毫秒
- 默认值：`15000`

例如 8 秒后自动关闭：

```json
"desktop": {
  "enabled": true,
  "timeoutMs": 8000
}
```

### `sound`

控制声音提醒。

### `sound.enabled`

- 类型：`boolean`
- 作用：是否启用声音提醒
- 默认值：`false`

例如开启声音：

```json
"sound": {
  "enabled": true,
  "mode": "system",
  "filePath": ""
}
```

### `sound.mode`

- 类型：`string`
- 可选值：`"system"`、`"file"`
- 默认值：`"system"`

含义：

- `"system"`：播放系统提示音
- `"file"`：播放你指定的本地音频文件

### `sound.filePath`

- 类型：`string`
- 作用：自定义音频文件路径
- 默认值：`""`

只有当 `sound.mode` 为 `"file"` 时才会使用这个字段。

可以写绝对路径：

```json
"sound": {
  "enabled": true,
  "mode": "file",
  "filePath": "/home/duoyun/Music/notify.wav"
}
```

也可以写相对路径。相对路径会以 `config.json` 所在目录为基准：

```json
"sound": {
  "enabled": true,
  "mode": "file",
  "filePath": "./sounds/notify.wav"
}
```

## 常用配置示例

### 1. 只显示系统通知

```json
{
  "popup": {
    "system": {
      "enabled": true,
      "expireTimeMs": 10000
    },
    "desktop": {
      "enabled": false,
      "timeoutMs": 15000
    }
  },
  "sound": {
    "enabled": false,
    "mode": "system",
    "filePath": ""
  }
}
```

### 2. 只显示桌面对话框

```json
{
  "popup": {
    "system": {
      "enabled": false,
      "expireTimeMs": 10000
    },
    "desktop": {
      "enabled": true,
      "timeoutMs": 15000
    }
  },
  "sound": {
    "enabled": false,
    "mode": "system",
    "filePath": ""
  }
}
```

### 3. 系统通知和桌面对话框都开启

```json
{
  "popup": {
    "system": {
      "enabled": true,
      "expireTimeMs": 10000
    },
    "desktop": {
      "enabled": true,
      "timeoutMs": 15000
    }
  },
  "sound": {
    "enabled": false,
    "mode": "system",
    "filePath": ""
  }
}
```

### 4. 只播放系统提示音

```json
{
  "popup": {
    "system": {
      "enabled": false,
      "expireTimeMs": 10000
    },
    "desktop": {
      "enabled": false,
      "timeoutMs": 15000
    }
  },
  "sound": {
    "enabled": true,
    "mode": "system",
    "filePath": ""
  }
}
```

### 5. 系统通知加系统提示音

```json
{
  "popup": {
    "system": {
      "enabled": true,
      "expireTimeMs": 10000
    },
    "desktop": {
      "enabled": false,
      "timeoutMs": 15000
    }
  },
  "sound": {
    "enabled": true,
    "mode": "system",
    "filePath": ""
  }
}
```

### 6. 系统通知加自定义音频

```json
{
  "popup": {
    "system": {
      "enabled": true,
      "expireTimeMs": 10000
    },
    "desktop": {
      "enabled": false,
      "timeoutMs": 15000
    }
  },
  "sound": {
    "enabled": true,
    "mode": "file",
    "filePath": "/home/duoyun/Music/notify.wav"
  }
}
```

## Linux 依赖说明

这个脚本只适配 Linux，目标系统是 Ubuntu 和 Fedora。

会优先使用这些系统命令：

- 系统通知：`notify-send`
- 桌面对话框：`zenity`
- 系统提示音：`canberra-gtk-play`
- 自定义音频：`pw-play`、`ffplay`
- 如果是 `.wav` 文件，还会尝试 `aplay`

## 降级行为

如果某个功能依赖的命令不存在：

- 不会让整个脚本崩溃
- 会在终端输出错误信息
- 如果弹窗都失败了，会回退为终端文本输出

## 注意事项

- `sound.mode = "file"` 时，`filePath` 不能为空
- 自定义音频文件必须存在，并且当前用户可读
- `aplay` 主要适合 `.wav` 文件
- `notify-send` 和 `zenity` 是否可用，取决于你的桌面环境和系统安装情况
