#!/usr/bin/env python3
"""Basic image QC for generated and final Telegram assets."""

from __future__ import annotations

import argparse
import json
import math
import shutil
import subprocess
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image


def image_stats(path: Path) -> dict[str, Any]:
    with Image.open(path) as image:
        rgb = image.convert("RGB")
        gray = image.convert("L")
        arr = np.asarray(gray, dtype=np.float32)
        rgb_arr = np.asarray(rgb, dtype=np.float32)
        mean = float(arr.mean())
        stddev = float(arr.std())
        entropy = float(gray.entropy())
        min_value = float(arr.min())
        max_value = float(arr.max())
        color_std = [float(rgb_arr[:, :, idx].std()) for idx in range(3)]
        return {
            "path": str(path),
            "exists": True,
            "width": image.width,
            "height": image.height,
            "mode": image.mode,
            "aspect": round(image.width / image.height, 4),
            "brightness_mean": round(mean, 3),
            "luma_stddev": round(stddev, 3),
            "entropy": round(entropy, 3),
            "min_luma": round(min_value, 3),
            "max_luma": round(max_value, 3),
            "color_stddev": [round(value, 3) for value in color_std],
        }


def run_ocr(path: Path) -> dict[str, Any]:
    tesseract = shutil.which("tesseract")
    if not tesseract:
        return {
            "available": False,
            "text": "",
            "notes": "Tesseract is not installed or not on PATH.",
        }

    completed = subprocess.run(
        [tesseract, str(path), "stdout", "-l", "rus+eng", "--psm", "6"],
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    text = completed.stdout.strip()
    return {
        "available": True,
        "text": text,
        "returncode": completed.returncode,
        "stderr": completed.stderr.strip(),
    }


def evaluate(stats: dict[str, Any], args: argparse.Namespace) -> list[str]:
    issues: list[str] = []
    if args.expect_width and stats["width"] != args.expect_width:
        issues.append(f"width {stats['width']} != expected {args.expect_width}")
    if args.expect_height and stats["height"] != args.expect_height:
        issues.append(f"height {stats['height']} != expected {args.expect_height}")
    if stats["luma_stddev"] < args.min_luma_stddev:
        issues.append(f"low luma stddev: {stats['luma_stddev']} < {args.min_luma_stddev}")
    if stats["entropy"] < args.min_entropy:
        issues.append(f"low entropy: {stats['entropy']} < {args.min_entropy}")
    if math.isclose(stats["min_luma"], stats["max_luma"]):
        issues.append("image appears blank: min_luma equals max_luma")
    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("images", nargs="+", type=Path)
    parser.add_argument("--expect-width", type=int, default=0)
    parser.add_argument("--expect-height", type=int, default=0)
    parser.add_argument("--min-luma-stddev", type=float, default=8.0)
    parser.add_argument("--min-entropy", type=float, default=2.0)
    parser.add_argument("--ocr", action="store_true")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    results = []
    for image_path in args.images:
        path = image_path.resolve()
        if not path.exists():
            results.append(
                {
                    "path": str(path),
                    "exists": False,
                    "status": "failed",
                    "issues": ["file does not exist"],
                }
            )
            continue

        stats = image_stats(path)
        issues = evaluate(stats, args)
        result = {
            **stats,
            "status": "passed" if not issues else "failed",
            "issues": issues,
        }
        if args.ocr:
            result["ocr"] = run_ocr(path)
        results.append(result)

    payload = {
        "status": "passed" if all(item["status"] == "passed" for item in results) else "failed",
        "results": results,
    }

    text = json.dumps(payload, ensure_ascii=False, indent=2)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text + "\n", encoding="utf-8")
    print(text)
    return 0 if payload["status"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())

