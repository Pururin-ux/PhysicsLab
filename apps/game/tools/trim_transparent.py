"""Trim transparent padding from a PNG while preserving a small safe border."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--padding", type=int, default=8)
    parser.add_argument("--alpha-threshold", type=int, default=8)
    args = parser.parse_args()

    image = Image.open(args.source).convert("RGBA")
    threshold = max(0, min(254, args.alpha_threshold))
    mask = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    bounds = mask.getbbox()
    if bounds is None:
        raise ValueError(f"{args.source} has no visible pixels")

    left, top, right, bottom = bounds
    padding = max(0, args.padding)
    crop = (
        max(0, left - padding),
        max(0, top - padding),
        min(image.width, right + padding),
        min(image.height, bottom + padding),
    )
    trimmed = image.crop(crop)
    args.destination.parent.mkdir(parents=True, exist_ok=True)
    trimmed.save(args.destination)
    print(
        f"saved={args.destination} original={image.size} trimmed={trimmed.size} "
        f"crop={crop}"
    )


if __name__ == "__main__":
    main()
