#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

// 配置文件路径
const CONFIG_PATH = path.join(__dirname, "config.json");
// 默认配置
const DEFAULT_CONFIG = {
  popup: {
    system: {
      enabled: true,
      expireTimeMs: 10000,
    },
    desktop: {
      enabled: false,
      timeoutMs: 15000,
    },
  },
  sound: {
    enabled: false,
    mode: "system",
    filePath: "",
  },
};

// 判断是否为普通对象
function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

// 递归合并配置
function mergeConfig(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : override;
  }

  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    merged[key] = key in base ? mergeConfig(base[key], value) : value;
  }
  return merged;
}

// 校正数值配置
function clampNumber(value, fallback) {
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

// 读取配置并回退默认值
function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    const merged = mergeConfig(DEFAULT_CONFIG, parsed);

    merged.popup.system.enabled = Boolean(merged.popup.system.enabled);
    merged.popup.system.expireTimeMs = clampNumber(
      Number(merged.popup.system.expireTimeMs),
      DEFAULT_CONFIG.popup.system.expireTimeMs,
    );
    merged.popup.desktop.enabled = Boolean(merged.popup.desktop.enabled);
    merged.popup.desktop.timeoutMs = clampNumber(
      Number(merged.popup.desktop.timeoutMs),
      DEFAULT_CONFIG.popup.desktop.timeoutMs,
    );
    merged.sound.enabled = Boolean(merged.sound.enabled);
    merged.sound.mode = merged.sound.mode === "file" ? "file" : "system";
    merged.sound.filePath =
      typeof merged.sound.filePath === "string" ? merged.sound.filePath : "";
    return merged;
  } catch (error) {
    console.error(
      `codex-notify: failed to load ${CONFIG_PATH}, using defaults: ${error.message}`,
    );
    return DEFAULT_CONFIG;
  }
}

// 检查命令是否存在
function commandExists(command) {
  const result = spawnSync("sh", ["-lc", `command -v ${command}`], {
    encoding: "utf8",
  });
  return result.status === 0;
}

// 执行外部命令
function runCommand(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
  });

  if (result.error) {
    return { ok: false, message: result.error.message };
  }
  if (result.status !== 0) {
    return {
      ok: false,
      message: (
        result.stderr ||
        result.stdout ||
        `exit ${result.status}`
      ).trim(),
    };
  }
  return { ok: true, message: "" };
}

// 截断过长文本
function truncate(text, limit) {
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, Math.max(0, limit - 1))}…`;
}

// 生成通知标题
function buildTitle(notification) {
  const lastMessage = String(
    notification["last-assistant-message"] || "",
  ).trim();
  if (!lastMessage) {
    return "Codex: Turn Complete";
  }
  const firstLine = lastMessage.split(/\r?\n/, 1)[0].trim();
  return `Codex: ${truncate(firstLine, 80)}`;
}

// 生成通知正文
function buildBody(notification) {
  const inputMessages = Array.isArray(notification["input-messages"])
    ? notification["input-messages"]
    : [];
  const userText = inputMessages
    .map((message) => String(message).trim())
    .filter(Boolean)
    .join(" ");
  const cwd = String(notification.cwd || "").trim();

  const parts = [];
  if (userText) {
    parts.push(truncate(userText, 200));
  }
  if (cwd) {
    parts.push(`cwd: ${cwd}`);
  }
  return parts.length > 0 ? parts.join("\n") : "Codex finished a turn.";
}

// 发送系统通知
function sendSystemNotification(title, body, threadId, config) {
  if (!commandExists("notify-send")) {
    return { ok: false, skipped: true, message: "notify-send not found" };
  }

  const args = [
    "--app-name=Codex",
    `--expire-time=${config.popup.system.expireTimeMs}`,
    "--icon=dialog-information",
  ];
  if (threadId) {
    args.push(
      `--hint=string:x-canonical-private-synchronous:codex-${threadId}`,
    );
  }
  args.push(title, body);
  return runCommand("notify-send", args);
}

// 弹出桌面对话框
function sendDesktopDialog(title, body, config) {
  if (!commandExists("zenity")) {
    return { ok: false, skipped: true, message: "zenity not found" };
  }

  const timeoutSeconds = Math.max(
    1,
    Math.ceil(config.popup.desktop.timeoutMs / 1000),
  );
  return runCommand("zenity", [
    "--info",
    "--title",
    title,
    "--text",
    body,
    "--timeout",
    String(timeoutSeconds),
    "--width",
    "420",
  ]);
}

// 解析自定义音频路径
function resolveSoundFile(filePath) {
  const resolvedPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(__dirname, filePath);
  const stats = fs.statSync(resolvedPath);
  if (!stats.isFile()) {
    throw new Error("sound.filePath is not a file");
  }
  fs.accessSync(resolvedPath, fs.constants.R_OK);
  return resolvedPath;
}

// 播放系统提示音
function playSystemSound() {
  if (commandExists("canberra-gtk-play")) {
    return runCommand("canberra-gtk-play", [
      "--id",
      "complete",
      "--description",
      "Codex",
    ]);
  }
  return { ok: false, skipped: true, message: "canberra-gtk-play not found" };
}

// 播放自定义音频
function playCustomSound(filePath) {
  const resolvedPath = resolveSoundFile(filePath);
  const ext = path.extname(resolvedPath).toLowerCase();

  if (commandExists("pw-play")) {
    return runCommand("pw-play", [resolvedPath]);
  }
  if (commandExists("ffplay")) {
    return runCommand("ffplay", [
      "-v",
      "error",
      "-nodisp",
      "-autoexit",
      resolvedPath,
    ]);
  }
  if (ext === ".wav" && commandExists("aplay")) {
    return runCommand("aplay", [resolvedPath]);
  }
  return {
    ok: false,
    skipped: true,
    message: "no supported audio player found for custom sound",
  };
}

// 按配置播放声音
function playSound(config) {
  if (!config.sound.enabled) {
    return { ok: true, skipped: true, message: "" };
  }

  try {
    if (config.sound.mode === "file") {
      if (!config.sound.filePath.trim()) {
        return { ok: false, skipped: true, message: "sound.filePath is empty" };
      }
      return playCustomSound(config.sound.filePath.trim());
    }
    return playSystemSound();
  } catch (error) {
    return { ok: false, skipped: true, message: error.message };
  }
}

// 主入口
function main() {
  if (process.argv.length !== 3) {
    console.error("usage: notify.js '<json payload>'");
    return 1;
  }

  let notification;
  try {
    notification = JSON.parse(process.argv[2]);
  } catch (error) {
    console.error(`invalid JSON payload: ${error.message}`);
    return 1;
  }

  if (notification.type !== "agent-turn-complete") {
    return 0;
  }

  const config = loadConfig();
  const title = buildTitle(notification);
  const body = buildBody(notification);
  const threadId = String(notification["thread-id"] || "");

  // 收集弹窗结果
  const popupResults = [];
  if (config.popup.system.enabled) {
    popupResults.push(sendSystemNotification(title, body, threadId, config));
  }
  if (config.popup.desktop.enabled) {
    popupResults.push(sendDesktopDialog(title, body, config));
  }

  // 声音结果单独处理
  const soundResult = playSound(config);
  const results = [...popupResults];
  if (!soundResult.skipped || !soundResult.ok) {
    results.push(soundResult);
  }

  // 弹窗失败时回退到终端输出
  const successfulPopup = popupResults.some((result) => result.ok);
  if (
    !successfulPopup &&
    !config.popup.system.enabled &&
    !config.popup.desktop.enabled
  ) {
    console.log(`${title}\n${body}`);
  } else if (
    !successfulPopup &&
    (config.popup.system.enabled || config.popup.desktop.enabled)
  ) {
    console.log(`${title}\n${body}`);
  }

  // 输出失败原因但不中断
  for (const result of results) {
    if (!result.ok && result.message) {
      console.error(`codex-notify: ${result.message}`);
    }
  }

  return 0;
}

// 以退出码结束进程
process.exit(main());
