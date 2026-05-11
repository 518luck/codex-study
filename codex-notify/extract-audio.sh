#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="/home/duoyun/.codex/codex-notify/music"
START_TIME="00:58:12.80"
DURATION_SECONDS="3.0"
INPUT_NAME="/home/duoyun/视频/telegeram/提取音乐/444.mp4"
OUTPUT_NAME="111.wav"  

if [[ $# -ne 0 ]]; then
  echo "这个脚本不接收命令行参数。"
  echo "请直接修改脚本顶部这些变量后再运行："
  echo "INPUT_NAME / OUTPUT_NAME / START_TIME / DURATION_SECONDS"
  exit 1
fi

INPUT_FILE="$INPUT_NAME"
OUTPUT_PATH="$OUTPUT_DIR/$OUTPUT_NAME"

if [[ "$INPUT_FILE" != /* ]]; then
  INPUT_FILE="$PWD/$INPUT_FILE"
fi

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "输入文件不存在: $INPUT_FILE"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

ffmpeg -ss "$START_TIME" -i "$INPUT_FILE" -t "$DURATION_SECONDS" -vn "$OUTPUT_PATH"

echo "已生成: $OUTPUT_PATH"
