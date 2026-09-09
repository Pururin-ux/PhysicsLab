# ComfyUI Workflow Registry

Put exported ComfyUI API workflows here.

Recommended structure:

```text
workflows/
  empty-text-zone-poster/
    0.1.0/
      workflow.api.json
      workflow.ui.json
      manifest.json
      README.md
```

## Workflow Rules

- Export API format from ComfyUI.
- Keep generated layers free of final readable text.
- Prefer workflows that reserve empty zones for later SVG/HTML overlays.
- Store a UI workflow copy when useful for manual editing.
- Record model names and hashes in `model-registry/`.
- Run a fixed-seed smoke job before using a workflow for production.

## First Workflows To Add

1. `empty-text-zone-poster` - background with clean overlay areas.
2. `character-sticker` - transparent or cutout-style character/sticker.
3. `paper-texture-pack` - subtle textures for deterministic layouts.

