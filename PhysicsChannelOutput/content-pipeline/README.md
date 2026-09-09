# Physics Channel Content Pipeline

Local production skeleton for the physics/math Telegram channel.

This folder is intentionally outside the `PhysicsLab` app code. It is for
content production, agent handoff, ImageGen drafts, deterministic layout,
visual QC, and publishing prep.

## Core Rule

Image models must not own final educational text.

Use generated layers for mood, characters, textures, paper, stickers, and
empty composition zones. Overlay all Russian copy, formulas, graph labels,
answers, and units with deterministic SVG/HTML/KaTeX/Python rendering.

## Current Stack

- Reference board: `C:/Users/lalad/OneDrive/Desktop/Pinterest-всякое`
- Toolchain: `C:/Users/lalad/OneDrive/Desktop/PhysicsChannelKit`
- Output root: `C:/Users/lalad/OneDrive/Desktop/PhysicsChannelOutput`
- Visual generator: built-in `imagegen` / ChatGPT Image
- ComfyUI API target: deprecated for this channel unless explicitly requested
- Durable Codex skill: `C:/Users/lalad/OneDrive/Desktop/PhysicsLab/.agents/skills/physics-telegram-creator/SKILL.md`
- Voice guide: `C:/Users/lalad/OneDrive/Desktop/PhysicsLab/.agents/skills/physics-telegram-creator/references/voice-guide.md`
- Character continuity: `C:/Users/lalad/OneDrive/Desktop/PhysicsLab/.agents/skills/physics-telegram-creator/references/character-continuity.md`

## Folders

- `agents/` - role model for multi-agent production.
- `contracts/` - JSON schemas and examples for handoffs.
- `comfy/` - local ComfyUI health check and job submit helper.
- `qc/` - local image checks before human review.
- `workflows/` - place exported ComfyUI API workflows here.
- `model-registry/` - model and LoRA inventory.
- `runs/` - generated job requests, responses, and outputs.
- `automation/` - recurring workflow notes.

## Minimal Production Flow

1. Planner creates a `content-package` from a topic.
2. Physics QC checks formulas, units, signs, and wording.
3. Writer drafts 2-3 Russian copy variants.
4. Voice Editor removes cringe, forced slang, teacherly tone, and AI-ish
   phrasing.
5. Visual Director chooses a style lane and empty text zones.
6. Character Continuity checks identity rules when a recurring character is
   used.
7. ImageGen generates the visual draft or illustration layer.
8. Layout Renderer overlays exact copy/formulas deterministically.
9. Visual QC checks dimensions, contrast, blankness, generated gibberish risk,
   protected zones, and character drift.
10. Human review approves the final asset.
11. Publisher posts or drafts it in Telegram.

## Smoke Commands

ComfyUI scripts are retained as deprecated reference material only. Do not use
local SDXL checkpoints for this channel unless the user explicitly asks to try
ComfyUI again.

Run image QC:

```powershell
C:\Users\lalad\OneDrive\Desktop\PhysicsChannelKit\.venv\Scripts\python.exe `
  .\qc\image-qc.py `
  C:\Users\lalad\OneDrive\Desktop\PhysicsChannelOutput\mini-pack-20260605\finals\01-fizmat-letom-da.png `
  --expect-width 1080 --expect-height 1350
```

## Quality Bar

Reject or revise when:

- text blends into character art or busy texture;
- generated layer contains readable fake text, numbers, UI labels, or formulas;
- the post copies a reference composition too literally;
- formulas are generated instead of overlaid;
- the post is visually nice but educationally vague.
- the copy sounds fake, forced, teacherly, or like generic AI motivation;
- recurring character identity changes between similar posts/cards without a
  reason.
