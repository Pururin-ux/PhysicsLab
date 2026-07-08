# Exam Reference Source Inventory

Scope: PhysicsLab V3 exam-reference audit, branch `codex/physlab-v3-test-template`.

Product code was already dirty before this audit. This sprint adds documentation/data files only under `docs/exam-reference/`.

## Local And External Sources

| Source | Location | Year | Exam type | Subject | Variant | Pages | Readable text | Answer key | Images / graphs | Use in this audit | Notes |
| --- | --- | ---: | --- | --- | --- | ---: | --- | --- | --- | --- | --- |
| `ФИЗ РТ-3 24_25 В1 (1).pdf` | `PhysLabProt-main/` | 2024/2025 | РТ, этап III | физика | 1 | 12 | yes | yes | yes | full task catalog | РИКЗ тематическое консультирование: 30 tasks, with task text, solutions, answers, diagrams, graphs, circuits. Main analyzable source. |
| `ФИЗ РТ-3 24_25 В1 (1).txt` | `PhysLabProt-main/` | 2024/2025 | РТ, этап III | физика | 1 | n/a | yes | yes | partial layout loss | extraction aid | TXT has all 30 markers `А1-А10`, `В1-В20`; layout columns are noisy but task content and answers are extractable. |
| `ЦЭ,ЦТ 2025-1 (1).pdf` | `PhysLabProt-main/` | 2025 | ЦЭ / ЦТ | физика | collection, 10 variants; visual sample variant 1 | 43 | no | yes | partial visual sample only | Scanned сборник РИКЗ. `pypdf` extracted zero text on first pages. Visual sample pages show answer table, instructions, and variant 1 tasks. Full catalog requires OCR. |
| `ЦЭ,ЦТ 2025-1 (1).txt` | `PhysLabProt-main/` | 2025 | ЦЭ / ЦТ | физика | unknown | n/a | no | unknown | not useful | File length 43 bytes; contains only form-feed-like output. |
| `2_5377661034435710038 (1).pdf` | `PhysLabProt-main/` | 2019 | non-exam workbook | физика, 11 class | many variants | 161 | partial | yes/unknown | methodical context only | Зенькович, Слесарь. Самостоятельные и контрольные работы, базовый уровень. Not ЦТ/ЦЭ/РТ, so excluded from exam task statistics. Useful for Belarus school wording and topic coverage. |
| `2_5377661034435710038 (1).txt` | `PhysLabProt-main/` | 2019 | non-exam workbook | физика, 11 class | many variants | n/a | partial | unknown | methodical context only | TXT readable after page 3, but it is not an exam source. |
| `PhysicsLab_research_report.pdf` | repo root | 2026 | product research | physics education | n/a | 20 | yes | n/a | n/a | context only | Contains prior PhysicsLab research and cites RИКЗ 2026 structure. Not a task source. |
| `agent-system-context.md` | `prototypes/physlab-v3/research/` | 2026 | project research | physics education | n/a | n/a | yes | n/a | n/a | context only | Existing agent context; not a task source. |
| `bsu_physics_exam_ticket3.pdf` | `artifacts/` | 2026 | university state exam | physics | ticket 3 | 6 | yes | n/a | n/a | excluded | University-level BSU ticket, outside school ЦТ/ЦЭ/РТ scope. |
| RИКЗ specification 2026, physics | `https://rikc.by/ru/specification/2026/03.pdf` | 2026 | ЦЭ / ЦТ specification | физика | n/a | 9 | yes | n/a | no task set | structure reference | Downloaded to temp only. Confirms 30 tasks: A=10, B=20; section distribution: mechanics 10, MKT/thermo 7, electrodynamics 9, optics/STO 2, quantum 1, nuclear 1. |
| RИКЗ specification index | `https://rikc.by/cctesting/49-specifikacii-jekzamenacionnyh-testovyh-rabot-po-uchebnym-predmetam-dlja-provedenija-centralizovannogo-jekzamena-i-centralizovannogo-testirovanija-v-2026-godu.html` | 2026 | official index | all subjects | n/a | web | yes | n/a | n/a | source verification | Browser open returned intermittent 502 for PDF, but shell `HEAD`/download for `03.pdf` returned 200. |

## Processing Notes

- Full machine-readable task extraction was possible only for `ФИЗ РТ-3 24_25 В1`.
- `ЦЭ,ЦТ 2025-1` is confirmed as a scanned RИКЗ test collection. Visual pages inspected:
  - cover;
  - answer key for 10 variants;
  - instructions/constants page;
  - variant 1 pages containing `А1-А10` and `В1-В20`.
- The 2025 scanned collection appears to contain 10 variants x 30 tasks. Without OCR, only variant 1 was manually sampled. The other variants are not counted in frequency statistics.
- No large PDFs were copied into `docs/exam-reference/`.
- Sources in `artifacts/`, `.agents`, and prototype screenshots were not used as exam task corpora.

## Reliability Labels Used Later

- `full-text`: task text and answer were extracted from readable source.
- `visual-sample`: task was manually summarized from inspected scan pages.
- `source-placeholder`: source exists but task text was not extracted.
