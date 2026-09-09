"""Turn a generated solid-chroma asset into a real transparent PNG.

The generator is asked for a flat green backdrop because an illustrated
checkerboard is not transparency.  This tool estimates that backdrop from the
four corners, builds a narrow anti-aliased alpha edge, and removes green spill
from partially transparent pixels.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image


def _corner_background(rgb: np.ndarray, sample: int = 64) -> np.ndarray:
    height, width, _ = rgb.shape
    size = max(1, min(sample, height // 4, width // 4))
    corners = np.concatenate(
        (
            rgb[:size, :size].reshape(-1, 3),
            rgb[:size, -size:].reshape(-1, 3),
            rgb[-size:, :size].reshape(-1, 3),
            rgb[-size:, -size:].reshape(-1, 3),
        ),
        axis=0,
    )
    return np.median(corners, axis=0).astype(np.float32)


def remove_chroma(
    source: Path,
    destination: Path,
    transparent_distance: float = 28.0,
    opaque_distance: float = 105.0,
    background_override: np.ndarray | None = None,
) -> tuple[np.ndarray, np.ndarray]:
    image = Image.open(source).convert("RGB")
    rgb = np.asarray(image, dtype=np.float32)
    background = (
        background_override.astype(np.float32)
        if background_override is not None
        else _corner_background(rgb)
    )

    distance = np.linalg.norm(rgb - background, axis=2)
    alpha = np.clip(
        (distance - transparent_distance)
        / (opaque_distance - transparent_distance),
        0.0,
        1.0,
    )
    # Smoothstep keeps the fringe narrow without making the contour jagged.
    alpha = alpha * alpha * (3.0 - 2.0 * alpha)

    # Reverse the chroma composite for edge pixels to prevent green halos.
    recovered = rgb.copy()
    safe_alpha = np.maximum(alpha[..., None], 0.05)
    recovered = (rgb - (1.0 - alpha[..., None]) * background) / safe_alpha
    recovered = np.clip(recovered, 0.0, 255.0)
    if background[1] > background[0] * 2 and background[1] > background[2] * 2:
        non_green = np.maximum(recovered[..., 0], recovered[..., 2]) + 4.0
        green_spill = recovered[..., 1] > non_green
        recovered[..., 1][green_spill] = non_green[green_spill]
    alpha[alpha < 0.03] = 0.0
    recovered[alpha <= 0.0] = 0.0

    rgba = np.dstack((recovered.astype(np.uint8), (alpha * 255).astype(np.uint8)))
    destination.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, mode="RGBA").save(destination)
    return background, rgba[..., 3]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--transparent-distance", type=float, default=28.0)
    parser.add_argument("--opaque-distance", type=float, default=105.0)
    parser.add_argument(
        "--background-hex",
        help="Optional six-digit chroma color, for example 00FF00.",
    )
    args = parser.parse_args()

    background_override = None
    if args.background_hex:
        value = args.background_hex.removeprefix("#")
        if len(value) != 6:
            raise ValueError("--background-hex must contain six hex digits")
        background_override = np.array(
            [int(value[index : index + 2], 16) for index in (0, 2, 4)],
            dtype=np.float32,
        )

    background, alpha = remove_chroma(
        args.source,
        args.destination,
        args.transparent_distance,
        args.opaque_distance,
        background_override,
    )
    print(
        f"saved={args.destination} mode=RGBA "
        f"background={background.round(1).tolist()} "
        f"alpha=({int(alpha.min())},{int(alpha.max())})"
    )


if __name__ == "__main__":
    main()
