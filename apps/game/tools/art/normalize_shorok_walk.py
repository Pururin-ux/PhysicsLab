"""Normalize Blender-rendered Shorok walk frames for Godot.

Raw renders are preserved.  This production-prep pass only translates whole
RGBA canvases vertically so the lowest visible planted contact shares one
baseline; it never rescales, deforms, crops, or interpolates character pixels.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parents[4]
SOURCE_DIR = (
    PROJECT_ROOT
    / "apps"
    / "game"
    / "art"
    / "characters"
    / "shorok-walk-blender-v1"
    / "frames"
)
OUTPUT_DIR = (
    PROJECT_ROOT
    / "apps"
    / "game"
    / "art"
    / "characters"
    / "shorok-walk-runtime-v1"
)
METADATA_PATH = OUTPUT_DIR / "shorok-walk-anchors.json"

FRAME_COUNT = 24
CANVAS_SIZE = (512, 512)
TARGET_BASELINE_Y = 444
ALPHA_THRESHOLD = 13


def visible_bounds(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = np.asarray(image.getchannel("A"))
    ys, xs = np.where(alpha >= ALPHA_THRESHOLD)
    if not len(xs):
        raise RuntimeError("Frame has no visible pixels")
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    records: list[dict[str, object]] = []
    for index in range(FRAME_COUNT):
        source = SOURCE_DIR / f"shorok-walk-{index + 1:04d}.png"
        if not source.exists():
            raise FileNotFoundError(source)
        image = Image.open(source).convert("RGBA")
        if image.size != CANVAS_SIZE:
            raise RuntimeError(f"Unexpected canvas {image.size}: {source}")
        x0, y0, x1, y1 = visible_bounds(image)
        shift_y = TARGET_BASELINE_Y - y1
        normalized = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
        normalized.alpha_composite(image, (0, shift_y))
        output = OUTPUT_DIR / f"shorok-walk-{index:02d}.png"
        normalized.save(output, optimize=True)
        nx0, ny0, nx1, ny1 = visible_bounds(normalized)
        if ny1 != TARGET_BASELINE_Y:
            raise RuntimeError(f"Baseline normalization failed: {output}")
        records.append(
            {
                "frame": index,
                "source": source.relative_to(PROJECT_ROOT).as_posix(),
                "runtime": output.relative_to(PROJECT_ROOT).as_posix(),
                "translation_px": [0, shift_y],
                "visible_bounds": [nx0, ny0, nx1, ny1],
            }
        )

    metadata = {
        "asset_id": "shorok-walk-blender-v1",
        "status": "WIP_RUNTIME_QA_REQUIRED",
        "canvas": list(CANVAS_SIZE),
        "frame_count": FRAME_COUNT,
        "source_fps": 24,
        "baseline_y": TARGET_BASELINE_Y,
        "ground_socket": [256, TARGET_BASELINE_Y],
        "scale_channels": 0,
        "prep": "whole-canvas translation only; no resize, crop, warp, or interpolation",
        "frames": records,
    }
    METADATA_PATH.write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"NORMALIZED_FRAMES={FRAME_COUNT}")
    print(f"OUTPUT_DIR={OUTPUT_DIR}")
    print(f"METADATA={METADATA_PATH}")


if __name__ == "__main__":
    main()
