#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

// 配置文件路径
const CONFIG_PATH = path.join(__dirname, "config.json");
const SOUND_STATE_PATH = path.join(__dirname, ".sound-state.json");
const MUSIC_DIR = path.join(__dirname, "music");
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
    nameAsTitle: false,
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
    merged.sound.nameAsTitle = Boolean(merged.sound.nameAsTitle);
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

function buildSoundTitle(filePath) {
  const filename = path.basename(filePath, path.extname(filePath)).trim();
  return filename ? `Codex: ${truncate(filename, 80)}` : "Codex: Turn Complete";
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

function listMusicFiles() {
  try {
    const entries = fs.readdirSync(MUSIC_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(MUSIC_DIR, entry.name))
      .filter((filePath) => {
        try {
          fs.accessSync(filePath, fs.constants.R_OK);
          return true;
        } catch (error) {
          return false;
        }
      })
      .sort();
  } catch (error) {
    return [];
  }
}

function loadSoundState() {
  try {
    const raw = fs.readFileSync(SOUND_STATE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return isPlainObject(parsed) ? parsed : {};
  } catch (error) {
    return {};
  }
}

function saveSoundState(state) {
  fs.writeFileSync(SOUND_STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);
}

function buildSoundKey(filePaths) {
  return [...filePaths].sort().join("\n");
}

function pickWeightedRandom(entries) {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = Math.random() * totalWeight;

  for (const entry of entries) {
    cursor -= entry.weight;
    if (cursor <= 0) {
      return entry;
    }
  }

  return entries[entries.length - 1];
}

function chooseSoundFile(filePaths) {
  const soundKey = buildSoundKey(filePaths);
  const state = loadSoundState();
  const cycleState = isPlainObject(state[soundKey]) ? state[soundKey] : {};
  const eligible = filePaths.filter((filePath) => cycleState[filePath] !== 1);

  // 播放完一轮后重置衰减，让每个文件重新回到高概率池。
  const isNewCycle = eligible.length === 0;
  const activePaths = isNewCycle ? filePaths : eligible;
  const activeState = isNewCycle ? {} : cycleState;
  const weightedEntries = activePaths.map((filePath) => ({
    filePath,
    weight: activeState[filePath] === 1 ? 1 : 4,
  }));
  const selected = pickWeightedRandom(weightedEntries).filePath;
  const nextCycleState = { ...activeState, [selected]: 1 };

  if (isNewCycle) {
    saveSoundState({ [soundKey]: nextCycleState });
  } else {
    state[soundKey] = nextCycleState;
    saveSoundState(state);
  }
  return selected;
}

// 播放系统提示音
function playSystemSound() {
  if (commandExists("canberra-gtk-play")) {
    const result = runCommand("canberra-gtk-play", [
      "--id",
      "complete",
      "--description",
      "Codex",
    ]);
    return { ...result, soundFilePath: "" };
  }
  return {
    ok: false,
    skipped: true,
    message: "canberra-gtk-play not found",
    soundFilePath: "",
  };
}

// 播放自定义音频
function playCustomSound(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (commandExists("pw-play")) {
    const result = runCommand("pw-play", [filePath]);
    return { ...result, soundFilePath: filePath };
  }
  if (commandExists("ffplay")) {
    const result = runCommand("ffplay", [
      "-v",
      "error",
      "-nodisp",
      "-autoexit",
      filePath,
    ]);
    return { ...result, soundFilePath: filePath };
  }
  if (ext === ".wav" && commandExists("aplay")) {
    const result = runCommand("aplay", [filePath]);
    return { ...result, soundFilePath: filePath };
  }
  return {
    ok: false,
    skipped: true,
    message: "no supported audio player found for custom sound",
    soundFilePath: filePath,
  };
}

// 按配置播放声音
function playSound(config) {
  if (!config.sound.enabled) {
    return { ok: true, skipped: true, message: "" };
  }

  try {
    if (config.sound.mode === "file") {
      const musicFiles = listMusicFiles();
      if (musicFiles.length > 0) {
        return playCustomSound(chooseSoundFile(musicFiles));
      }
      return playSystemSound();
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

  const rawPayload = process.argv[2];
  let notification;
  try {
    notification = JSON.parse(rawPayload);
  } catch (error) {
    console.error(`invalid JSON payload: ${error.message}`);
    return 1;
  }

  if (notification.type !== "agent-turn-complete") {
    return 0;
  }

  const config = loadConfig();
  const body = buildBody(notification);
  const threadId = String(notification["thread-id"] || "");

  // 声音结果先算出来，允许用选中的音乐文件名覆盖通知标题。
  const soundResult = playSound(config);
  const title =
    config.sound.nameAsTitle && soundResult.soundFilePath
      ? buildSoundTitle(soundResult.soundFilePath)
      : buildTitle(notification);

  // 收集弹窗结果
  const popupResults = [];
  if (config.popup.system.enabled) {
    popupResults.push(sendSystemNotification(title, body, threadId, config));
  }
  if (config.popup.desktop.enabled) {
    popupResults.push(sendDesktopDialog(title, body, config));
  }

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
