"""Split and anchor an alpha sprite sheet for production animation.

Every output frame keeps a shared canvas, horizontal character centre and paw
baseline.  This prevents the common game-integration error where a visually
consistent strip jitters or floats because each crop gets a different pivot.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image


def _alpha_bbox(frame: Image.Image, threshold: int) -> tuple[int, int, int, int]:
    alpha = np.asarray(frame.getchannel("A"))
    ys, xs = np.where(alpha >= threshold)
    if len(xs) == 0:
        raise ValueError("frame has no visible pixels")
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--rows", type=int, default=2)
    parser.add_argument("--canvas-size", type=int, default=512)
    parser.add_argument("--baseline", type=int, default=444)
    parser.add_argument("--alpha-threshold", type=int, default=12)
    parser.add_argument("--name", default="frame")
    args = parser.parse_args()

    sheet = Image.open(args.source).convert("RGBA")
    if sheet.width % args.columns or sheet.height % args.rows:
        raise ValueError("sheet dimensions must divide evenly into the grid")
    cell_width = sheet.width // args.columns
    cell_height = sheet.height // args.rows
    args.output_dir.mkdir(parents=True, exist_ok=True)

    manifest: list[dict[str, object]] = []
    preview = Image.new(
        "RGBA",
        (args.canvas_size * args.columns, args.canvas_size * args.rows),
        (0, 0, 0, 0),
    )

    for index in range(args.columns * args.rows):
        column = index % args.columns
        row = index // args.columns
        cell = sheet.crop(
            (
                column * cell_width,
                row * cell_height,
                (column + 1) * cell_width,
                (row + 1) * cell_height,
            )
        )
        bbox = _alpha_bbox(cell, args.alpha_threshold)
        subject = cell.crop(bbox)
        destination_x = round((args.canvas_size - subject.width) / 2)
        destination_y = args.baseline - subject.height
        if destination_x < 0 or destination_y < 0:
            raise ValueError(
                f"frame {index} does not fit canvas: {subject.size} at "
                f"({destination_x}, {destination_y})"
            )

        canvas = Image.new("RGBA", (args.canvas_size, args.canvas_size), (0, 0, 0, 0))
        canvas.alpha_composite(subject, (destination_x, destination_y))
        frame_path = args.output_dir / f"{args.name}-{index:02d}.png"
        canvas.save(frame_path)
        preview.alpha_composite(
            canvas,
            (column * args.canvas_size, row * args.canvas_size),
        )
        manifest.append(
            {
                "index": index,
                "source_cell": [column, row, cell_width, cell_height],
                "source_alpha_bbox": list(bbox),
                "subject_size": list(subject.size),
                "canvas": [args.canvas_size, args.canvas_size],
                "placement": [destination_x, destination_y],
                "paw_baseline": args.baseline,
                "pivot_normalized": [0.5, args.baseline / args.canvas_size],
                "file": frame_path.name,
            }
        )

    preview_path = args.output_dir / f"{args.name}-contact-sheet.png"
    preview.save(preview_path)
    metadata_path = args.output_dir / f"{args.name}-anchors.json"
    metadata_path.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(
        f"frames={len(manifest)} canvas={args.canvas_size} baseline={args.baseline} "
        f"preview={preview_path} metadata={metadata_path}"
    )


if __name__ == "__main__":
    main()
