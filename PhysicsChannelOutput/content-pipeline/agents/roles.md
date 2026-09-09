# Agent Roles

Use this role model for Codex subagents, separate Codex threads, or a future
LangGraph/Prefect/n8n automation.

## 1. Planner

Input:
- topic request;
- target grade;
- season/context;
- recent feed rhythm;
- official or trusted sources.

Output:
- `content_brief`;
- post type;
- audience;
- one educational objective;
- suggested style lane;
- acceptance criteria.

Hard rule:
- one post should teach one main thing.

## 2. Curriculum / Physics QC

Input:
- `content_brief`;
- exact formulas, units, signs, diagrams, and examples.

Output:
- approve/reject;
- exact corrections;
- risk notes.

Hard rule:
- can veto any asset before layout if physics/math is weak.

## 3. Writer

Input:
- approved brief;
- audience and post type.

Output:
- 2-3 Russian copy variants;
- recommended title;
- body copy;
- caption;
- CTA;
- carousel card text if needed.

Hard rule:
- keep voice friendly and clear; no teacherly moralizing, fake teenage slang,
  or generic AI motivation.

## 4. Voice Editor / Cringe Filter

Input:
- Writer variants;
- `voice-guide.md`;
- target audience and post type.

Output:
- approved copy variant;
- rejected lines and why;
- rewrite notes;
- tone risks.

Hard rule:
- copy that sounds like a teacher, corporate course ad, AI therapy, or adult
  forcing youth slang must be rewritten before physics/layout lock.

## 5. Visual Director

Input:
- locked copy;
- post type;
- recent style history.

Output:
- style lane or new lane;
- composition map;
- protected text zones;
- generated-layer prompt;
- negative prompt.

Hard rule:
- references are quality anchors, not templates to clone.

## 6. Character Continuity

Input:
- locked copy;
- style lane;
- approved character reference or temporary identity description;
- recent assets from the same series.

Output:
- character usage plan;
- identity-lock prompt details;
- reuse/cutout recommendation;
- drift risks.

Hard rule:
- a recurring character can change pose or emotion, but not identity, hair
  silhouette, clothing family, or core visual design without user approval.

## 7. ImageGen Worker

Input:
- Visual Director prompt;
- Character Continuity notes when relevant;
- locked protected text zones.

Output:
- original generated visual draft;
- saved image path;
- sidecar metadata;
- artifact risks.

Hard rule:
- no final readable text, formulas, numbers, or fake UI labels in generated
  output.

## 8. Layout Renderer

Input:
- locked copy;
- generated visual layer;
- deterministic template;
- formula renderer.

Output:
- SVG/HTML source;
- final PNG;
- manifest.

Hard rule:
- final text, formulas, graph labels, and answers are deterministic.

## 9. Visual QC

Input:
- final PNG;
- source manifest;
- protected zones.

Output:
- pass/fail JSON;
- visual notes;
- contact sheet if several variants exist.

Checks:
- dimensions;
- readable contrast;
- no overlaps;
- no generated gibberish;
- phone-size readability;
- character continuity;
- formula placement.

## 10. Publisher

Input:
- human-approved final PNG;
- caption;
- schedule;
- channel/account target.

Output:
- Telegram post/draft;
- publish log;
- performance metadata later.

Hard rule:
- do not publish without human approval.

## Recommended Operating Modes

MVP:
- use subagents in one Codex chat for planning, voice editing, QC, visual
  direction, character continuity, and rendering;
- keep final rendering and QC in this folder.

Manual production:
- create separate Codex threads for "Planner", "Visual Director", and
  "Renderer/QC" when the workload becomes noisy.

Automation:
- use LangGraph for role state and routing;
- use Prefect or n8n for schedules, retries, storage, and publishing handoff.
