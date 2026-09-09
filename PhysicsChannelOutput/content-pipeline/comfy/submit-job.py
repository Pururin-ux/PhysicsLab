#!/usr/bin/env python3
"""Submit a content-pipeline ComfyUI job request.

This helper intentionally treats ComfyUI as an asset generator only. Final
Russian text, formulas, labels, and graph data belong to deterministic renderers.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import time
import urllib.parse
import urllib.request
import uuid
from pathlib import Path
from typing import Any


DEFAULT_BASE_URL = "http://127.0.0.1:8001"

SAFETY_PROFILES: dict[str, dict[str, float]] = {
    "laptop-8gb": {
        "max_temp_c": 82,
        "critical_temp_c": 85,
        "min_free_vram_mb": 900,
        "max_vram_used_mb": 7400,
        "cooldown_temp_c": 70,
        "monitor_seconds": 2,
    },
    "off": {
        "max_temp_c": 999,
        "critical_temp_c": 999,
        "min_free_vram_mb": 0,
        "max_vram_used_mb": 999999,
        "cooldown_temp_c": 999,
        "monitor_seconds": 2,
    },
}


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8-sig") as handle:
        return json.load(handle)


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def find_pipeline_root(start: Path) -> Path:
    for candidate in [start, *start.parents]:
        if (candidate / "manifest.json").exists() and (candidate / "contracts").exists():
            return candidate
    return start.parents[1]


def request_json(base_url: str, path: str, timeout: float = 30.0) -> Any:
    url = base_url.rstrip("/") + path
    with urllib.request.urlopen(url, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def post_json(base_url: str, path: str, payload: Any, timeout: float = 30.0) -> Any:
    url = base_url.rstrip("/") + path
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def post_json_allow_empty(base_url: str, path: str, payload: Any, timeout: float = 30.0) -> Any:
    try:
        return post_json(base_url, path, payload, timeout=timeout)
    except json.JSONDecodeError:
        return {}


def download_view(base_url: str, image_ref: dict[str, Any], destination: Path) -> Path:
    params = {
        "filename": image_ref["filename"],
        "subfolder": image_ref.get("subfolder", ""),
        "type": image_ref.get("type", "output"),
    }
    url = base_url.rstrip("/") + "/view?" + urllib.parse.urlencode(params)
    destination.mkdir(parents=True, exist_ok=True)
    subfolder = str(image_ref.get("subfolder", "")).replace("\\", "_").replace("/", "_").strip("_")
    filename = image_ref["filename"]
    output_name = f"{subfolder}_{filename}" if subfolder else filename
    output_path = destination / output_name
    with urllib.request.urlopen(url, timeout=60) as response:
        output_path.write_bytes(response.read())
    return output_path


def validate_request(data: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for field in [
        "contract_version",
        "job_id",
        "content_package_id",
        "workflow",
        "prompt",
        "generation",
        "output",
        "qc_policy",
    ]:
        if field not in data:
            errors.append(f"missing required field: {field}")

    if data.get("prompt", {}).get("language_policy") != "no_readable_text":
        errors.append("prompt.language_policy should be no_readable_text for production assets")

    if not data.get("qc_policy", {}).get("human_review_required", False):
        errors.append("qc_policy.human_review_required must be true")

    generation = data.get("generation", {})
    width = int(generation.get("width", 0) or 0)
    height = int(generation.get("height", 0) or 0)
    batch_size = int(generation.get("batch_size", 0) or 0)
    steps = int(generation.get("steps", 0) or 0)
    safety_profile = data.get("safety_profile", "laptop-8gb")
    if safety_profile == "laptop-8gb":
        if batch_size != 1:
            errors.append("laptop-8gb safety requires generation.batch_size = 1")
        if width % 64 != 0 or height % 64 != 0:
            errors.append("laptop-8gb safety requires width and height to be multiples of 64")
        if width * height > 1024 * 1280:
            errors.append("laptop-8gb safety blocks native generations above 1024x1280")
        if steps > 24:
            errors.append("laptop-8gb safety blocks generation.steps above 24")

    return errors


def gpu_sample() -> dict[str, Any]:
    if not shutil.which("nvidia-smi"):
        return {"available": False, "error": "nvidia-smi not found on PATH"}
    query = [
        "nvidia-smi",
        "--query-gpu=timestamp,name,memory.total,memory.used,memory.free,temperature.gpu,utilization.gpu",
        "--format=csv,noheader,nounits",
    ]
    try:
        completed = subprocess.run(
            query,
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=10,
        )
    except Exception as exc:  # noqa: BLE001
        return {"available": False, "error": str(exc)}

    line = completed.stdout.strip().splitlines()[0]
    parts = [part.strip() for part in line.split(",")]
    if len(parts) < 7:
        return {"available": False, "error": f"unexpected nvidia-smi output: {line}"}
    return {
        "available": True,
        "timestamp": parts[0],
        "name": parts[1],
        "memory_total_mb": int(float(parts[2])),
        "memory_used_mb": int(float(parts[3])),
        "memory_free_mb": int(float(parts[4])),
        "temperature_c": int(float(parts[5])),
        "utilization_gpu_pct": int(float(parts[6])),
    }


def safety_config(args: argparse.Namespace, request_data: dict[str, Any]) -> dict[str, float]:
    profile_name = args.safety_profile or request_data.get("safety_profile", "laptop-8gb")
    if profile_name not in SAFETY_PROFILES:
        raise ValueError(f"unknown safety profile: {profile_name}")
    config = dict(SAFETY_PROFILES[profile_name])
    for key in [
        "max_temp_c",
        "critical_temp_c",
        "min_free_vram_mb",
        "max_vram_used_mb",
        "cooldown_temp_c",
        "monitor_seconds",
    ]:
        value = getattr(args, key)
        if value is not None:
            config[key] = value
    config["profile"] = profile_name
    return config


def safety_issues(sample: dict[str, Any], config: dict[str, float], critical_only: bool = False) -> list[str]:
    if not sample.get("available"):
        return []
    issues: list[str] = []
    temp = sample["temperature_c"]
    used = sample["memory_used_mb"]
    free = sample["memory_free_mb"]
    if temp >= config["critical_temp_c"]:
        issues.append(f"critical GPU temperature {temp}C >= {config['critical_temp_c']}C")
    elif not critical_only and temp >= config["max_temp_c"]:
        issues.append(f"GPU temperature {temp}C >= {config['max_temp_c']}C")
    if used >= config["max_vram_used_mb"]:
        issues.append(f"VRAM used {used}MB >= {config['max_vram_used_mb']}MB")
    if free < config["min_free_vram_mb"]:
        issues.append(f"VRAM free {free}MB < {config['min_free_vram_mb']}MB")
    return issues


def wait_for_cooldown(config: dict[str, float], timeout_seconds: float = 180.0) -> list[dict[str, Any]]:
    samples: list[dict[str, Any]] = []
    start = time.time()
    while time.time() - start < timeout_seconds:
        sample = gpu_sample()
        samples.append(sample)
        if not sample.get("available"):
            return samples
        if (
            sample["temperature_c"] <= config["cooldown_temp_c"]
            and sample["memory_free_mb"] >= max(config["min_free_vram_mb"], 2500)
        ):
            return samples
        time.sleep(config["monitor_seconds"])
    return samples


def find_images(history: dict[str, Any]) -> list[dict[str, Any]]:
    images: list[dict[str, Any]] = []
    for prompt_data in history.values():
        outputs = prompt_data.get("outputs", {})
        for node_output in outputs.values():
            images.extend(node_output.get("images", []))
    return images


def patch_standard_workflow(workflow: dict[str, Any], request_data: dict[str, Any]) -> list[str]:
    """Patch common ComfyUI nodes from the worker contract.

    This keeps exported workflows reusable while the content package owns the
    prompt, seed, dimensions, and model choice.
    """

    notes: list[str] = []
    generation = request_data["generation"]
    prompt = request_data["prompt"]
    models = request_data.get("models", {})
    input_images = request_data.get("inputs", {}).get("control_images", [])

    text_nodes = []
    for node_id, node in workflow.items():
        class_type = node.get("class_type")
        inputs = node.setdefault("inputs", {})
        title = node.get("_meta", {}).get("title", "").lower()

        if class_type == "CheckpointLoaderSimple" and models.get("base"):
            inputs["ckpt_name"] = models["base"]
            notes.append(f"patched CheckpointLoaderSimple {node_id}")

        elif class_type == "EmptyLatentImage":
            inputs["width"] = generation["width"]
            inputs["height"] = generation["height"]
            inputs["batch_size"] = generation["batch_size"]
            notes.append(f"patched EmptyLatentImage {node_id}")

        elif class_type == "KSampler":
            inputs["seed"] = generation.get("seed", 0)
            inputs["steps"] = generation["steps"]
            inputs["cfg"] = generation["guidance"]
            inputs["sampler_name"] = generation["sampler"]
            inputs["scheduler"] = generation["scheduler"]
            inputs["denoise"] = generation.get("denoise", inputs.get("denoise", 1.0))
            notes.append(f"patched KSampler {node_id}")

        elif class_type == "SaveImage":
            safe_prefix = f"physics_channel/{request_data['job_id']}/{request_data['asset_kind']}"
            inputs["filename_prefix"] = safe_prefix
            notes.append(f"patched SaveImage {node_id}")

        elif class_type == "LoadImage" and input_images:
            inputs["image"] = input_images[0]
            notes.append(f"patched LoadImage {node_id}")

        elif class_type == "CLIPTextEncode":
            text_nodes.append((node_id, node, title))

    positive_done = False
    negative_done = False
    for node_id, node, title in text_nodes:
        inputs = node.setdefault("inputs", {})
        if "negative" in title:
            inputs["text"] = prompt["negative"]
            negative_done = True
            notes.append(f"patched negative CLIPTextEncode {node_id}")
        elif "positive" in title:
            inputs["text"] = prompt["positive"]
            positive_done = True
            notes.append(f"patched positive CLIPTextEncode {node_id}")

    remaining = [(node_id, node) for node_id, node, title in text_nodes if "positive" not in title and "negative" not in title]
    if not positive_done and remaining:
        node_id, node = remaining.pop(0)
        node.setdefault("inputs", {})["text"] = prompt["positive"]
        notes.append(f"patched fallback positive CLIPTextEncode {node_id}")
    if not negative_done and remaining:
        node_id, node = remaining.pop(0)
        node.setdefault("inputs", {})["text"] = prompt["negative"]
        notes.append(f"patched fallback negative CLIPTextEncode {node_id}")

    return notes


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("request", type=Path, help="Path to comfy-worker request JSON")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--poll-seconds", type=float, default=2.0)
    parser.add_argument("--timeout-seconds", type=float, default=600.0)
    parser.add_argument("--safety-profile", choices=sorted(SAFETY_PROFILES), default=None)
    parser.add_argument("--max-temp-c", type=float)
    parser.add_argument("--critical-temp-c", type=float)
    parser.add_argument("--min-free-vram-mb", type=float)
    parser.add_argument("--max-vram-used-mb", type=float)
    parser.add_argument("--cooldown-temp-c", type=float)
    parser.add_argument("--monitor-seconds", type=float)
    parser.add_argument("--skip-cooldown", action="store_true")
    args = parser.parse_args()

    request_path = args.request.resolve()
    request_data = load_json(request_path)
    try:
        safety = safety_config(args, request_data)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    errors = validate_request(request_data)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    root = find_pipeline_root(request_path.parent)
    output_destination = Path(request_data["output"]["destination"])
    if not output_destination.is_absolute():
        output_destination = (root / output_destination).resolve()

    workflow_path_value = request_data["workflow"].get("api_json_path")
    workflow_path = None
    workflow = None
    if workflow_path_value:
        workflow_path = Path(workflow_path_value)
        if not workflow_path.is_absolute():
            workflow_path = (root / workflow_path).resolve()
        if workflow_path.exists():
            workflow = load_json(workflow_path)

    response_path = request_path.parent / "response.json"
    relative_destination = str(request_data["output"]["destination"]).replace("\\", "/")
    path_warnings: list[str] = []
    if "runs/runs/" in relative_destination:
        path_warnings.append("output.destination contains runs/runs")
    if request_data["job_id"] not in relative_destination:
        path_warnings.append("output.destination does not include job_id")
    initial_gpu_sample = gpu_sample()
    dry_response = {
        "status": "dry_run",
        "job_id": request_data["job_id"],
        "content_package_id": request_data["content_package_id"],
        "base_url": args.base_url,
        "request_path": str(request_path),
        "workflow_path": str(workflow_path) if workflow_path else "",
        "workflow_exists": bool(workflow),
        "output_destination": str(output_destination),
        "response_path": str(response_path),
        "path_warnings": path_warnings,
        "safety": {
            "config": safety,
            "initial_gpu_sample": initial_gpu_sample,
        },
        "notes": [
            "ComfyUI generated assets are not final educational layouts.",
            "Overlay final Russian copy and formulas deterministically after generation.",
        ],
    }

    if workflow_path and workflow_path.exists():
        dry_response["workflow_sha256"] = sha256_file(workflow_path)

    if args.dry_run:
        write_json(response_path, dry_response)
        print(json.dumps(dry_response, ensure_ascii=False, indent=2))
        return 0

    if workflow is None:
        dry_response["status"] = "blocked"
        dry_response["error"] = "workflow.api_json_path is missing or does not exist"
        write_json(response_path, dry_response)
        print(json.dumps(dry_response, ensure_ascii=False, indent=2), file=sys.stderr)
        return 2

    patch_notes = patch_standard_workflow(workflow, request_data)

    try:
        request_json(args.base_url, "/system_stats", timeout=10)
    except Exception as exc:  # noqa: BLE001
        dry_response["status"] = "blocked"
        dry_response["error"] = f"ComfyUI is not reachable: {exc}"
        write_json(response_path, dry_response)
        print(json.dumps(dry_response, ensure_ascii=False, indent=2), file=sys.stderr)
        return 2

    preflight_sample = gpu_sample()
    preflight_issues = safety_issues(preflight_sample, safety)
    if preflight_issues:
        result = dict(dry_response)
        result.update(
            {
                "status": "blocked_safety_preflight",
                "safety": {
                    "config": safety,
                    "initial_gpu_sample": initial_gpu_sample,
                    "preflight_gpu_sample": preflight_sample,
                    "issues": preflight_issues,
                },
            }
        )
        write_json(response_path, result)
        print(json.dumps(result, ensure_ascii=False, indent=2), file=sys.stderr)
        return 4

    cooldown_samples: list[dict[str, Any]] = []
    if not args.skip_cooldown and safety["profile"] != "off":
        cooldown_samples = wait_for_cooldown(safety)

    client_id = str(uuid.uuid4())
    submit_payload = {
        "prompt": workflow,
        "client_id": client_id,
        "extra_data": {
            "job_id": request_data["job_id"],
            "content_package_id": request_data["content_package_id"],
        },
    }
    submit_response = post_json(args.base_url, "/prompt", submit_payload)
    prompt_id = submit_response["prompt_id"]

    start = time.time()
    history = None
    safety_samples: list[dict[str, Any]] = []
    next_monitor_at = 0.0
    while time.time() - start < args.timeout_seconds:
        now = time.time()
        if now >= next_monitor_at:
            sample = gpu_sample()
            safety_samples.append(sample)
            interrupt_issues = safety_issues(sample, safety, critical_only=True)
            if interrupt_issues:
                post_json_allow_empty(args.base_url, "/interrupt", {}, timeout=10)
                result = dict(dry_response)
                result.update(
                    {
                        "status": "interrupted_safety",
                        "prompt_id": prompt_id,
                        "elapsed_seconds": round(time.time() - start, 2),
                        "workflow_patch_notes": patch_notes,
                        "safety": {
                            "config": safety,
                            "initial_gpu_sample": initial_gpu_sample,
                            "preflight_gpu_sample": preflight_sample,
                            "cooldown_samples": cooldown_samples,
                            "samples": safety_samples,
                            "issues": interrupt_issues,
                        },
                    }
                )
                write_json(response_path, result)
                print(json.dumps(result, ensure_ascii=False, indent=2), file=sys.stderr)
                return 5
            next_monitor_at = now + safety["monitor_seconds"]
        history_candidate = request_json(args.base_url, f"/history/{prompt_id}", timeout=30)
        if history_candidate:
            history = history_candidate
            break
        time.sleep(args.poll_seconds)

    if history is None:
        result = dict(dry_response)
        result.update(
            {
                "status": "timeout",
                "prompt_id": prompt_id,
                "elapsed_seconds": round(time.time() - start, 2),
                "safety": {
                    "config": safety,
                    "initial_gpu_sample": initial_gpu_sample,
                    "preflight_gpu_sample": preflight_sample,
                    "cooldown_samples": cooldown_samples,
                    "samples": safety_samples,
                },
            }
        )
        write_json(response_path, result)
        print(json.dumps(result, ensure_ascii=False, indent=2), file=sys.stderr)
        return 3

    downloaded = []
    for image_ref in find_images(history):
        saved_path = download_view(args.base_url, image_ref, output_destination)
        downloaded.append(
            {
                "path": str(saved_path),
                "sha256": sha256_file(saved_path),
                "filename": image_ref.get("filename", saved_path.name),
                "subfolder": image_ref.get("subfolder", ""),
                "type": image_ref.get("type", "output"),
            }
        )

    result = dict(dry_response)
    result.update(
        {
            "status": "completed",
            "prompt_id": prompt_id,
            "elapsed_seconds": round(time.time() - start, 2),
            "workflow_patch_notes": patch_notes,
            "safety": {
                "config": safety,
                "initial_gpu_sample": initial_gpu_sample,
                "preflight_gpu_sample": preflight_sample,
                "cooldown_samples": cooldown_samples,
                "samples": safety_samples,
                "final_gpu_sample": gpu_sample(),
            },
            "outputs": downloaded,
        }
    )
    write_json(response_path, result)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
