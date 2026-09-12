#!/usr/bin/env python3
"""Run ComfyUI request JSON files sequentially with laptop-safe pacing."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import time
import urllib.request
from pathlib import Path


DEFAULT_BASE_URL = "http://127.0.0.1:8001"


def request_json(base_url: str, path: str, timeout: float = 15.0):
    with urllib.request.urlopen(base_url.rstrip("/") + path, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def gpu_sample() -> dict:
    if not shutil.which("nvidia-smi"):
        return {"available": False, "error": "nvidia-smi not found"}
    completed = subprocess.run(
        [
            "nvidia-smi",
            "--query-gpu=timestamp,memory.used,memory.free,temperature.gpu,utilization.gpu",
            "--format=csv,noheader,nounits",
        ],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=10,
    )
    parts = [part.strip() for part in completed.stdout.strip().splitlines()[0].split(",")]
    return {
        "available": True,
        "timestamp": parts[0],
        "memory_used_mb": int(float(parts[1])),
        "memory_free_mb": int(float(parts[2])),
        "temperature_c": int(float(parts[3])),
        "utilization_gpu_pct": int(float(parts[4])),
    }


def wait_for_queue_empty(base_url: str, timeout_seconds: float = 120.0) -> bool:
    start = time.time()
    while time.time() - start < timeout_seconds:
        queue = request_json(base_url, "/queue")
        if not queue.get("queue_running") and not queue.get("queue_pending"):
            return True
        time.sleep(2)
    return False


def wait_for_cooldown(max_temp_c: int, min_free_vram_mb: int, timeout_seconds: float = 240.0) -> list[dict]:
    samples = []
    start = time.time()
    while time.time() - start < timeout_seconds:
        sample = gpu_sample()
        samples.append(sample)
        if not sample.get("available"):
            return samples
        if sample["temperature_c"] <= max_temp_c and sample["memory_free_mb"] >= min_free_vram_mb:
            return samples
        time.sleep(5)
    return samples


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("requests", nargs="+", type=Path)
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--submit-job", type=Path, default=Path(__file__).with_name("submit-job.py"))
    parser.add_argument("--timeout-seconds", type=int, default=1200)
    parser.add_argument("--cooldown-temp-c", type=int, default=70)
    parser.add_argument("--cooldown-free-vram-mb", type=int, default=2500)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    log = {
        "status": "running",
        "base_url": args.base_url,
        "requests": [str(path.resolve()) for path in args.requests],
        "jobs": [],
    }

    try:
        request_json(args.base_url, "/system_stats")
    except Exception as exc:  # noqa: BLE001
        log["status"] = "blocked"
        log["error"] = f"ComfyUI is not reachable: {exc}"
        print(json.dumps(log, ensure_ascii=False, indent=2), file=sys.stderr)
        return 2

    for request_path in args.requests:
        if not wait_for_queue_empty(args.base_url):
            log["status"] = "blocked"
            log["error"] = "ComfyUI queue did not become empty"
            print(json.dumps(log, ensure_ascii=False, indent=2), file=sys.stderr)
            return 3

        before = gpu_sample()
        cmd = [
            sys.executable,
            str(args.submit_job.resolve()),
            str(request_path.resolve()),
            "--base-url",
            args.base_url,
            "--timeout-seconds",
            str(args.timeout_seconds),
        ]
        if args.dry_run:
            cmd.append("--dry-run")
        completed = subprocess.run(cmd, check=False, text=True)
        after = gpu_sample()
        cooldown_samples = wait_for_cooldown(args.cooldown_temp_c, args.cooldown_free_vram_mb)
        log["jobs"].append(
            {
                "request": str(request_path.resolve()),
                "returncode": completed.returncode,
                "before": before,
                "after": after,
                "cooldown_samples": cooldown_samples,
            }
        )
        if completed.returncode != 0:
            log["status"] = "stopped"
            log["error"] = f"job failed: {request_path}"
            print(json.dumps(log, ensure_ascii=False, indent=2), file=sys.stderr)
            return completed.returncode

    log["status"] = "completed"
    print(json.dumps(log, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
