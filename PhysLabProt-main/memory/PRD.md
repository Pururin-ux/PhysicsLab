# PhysicsLab - Product Requirements Document

## Original Problem Statement
Build a business-ready edtech platform. Interactive online physics textbook for Belarusian schoolchildren with animated anime mascot. Dark theme, professional, student-friendly.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Frontend**: React 19 + Tailwind CSS + Framer Motion + Shadcn/UI
- **Auth**: JWT (httpOnly cookies) + bcrypt password hashing
- **Database**: MongoDB (users, courses, chapters, quizzes, user_progress, login_attempts)

## User Personas
1. **Student** (primary): Belarusian teenager preparing for CT/CE exams
2. **Admin**: Content manager who seeds/manages courses

## Core Requirements
- Interactive physics textbook with formula cards
- Quiz system with instant feedback and explanations
- Progress tracking with XP/leveling system
- Animated mascot "Физа" throughout the platform
- Dark theme with yellow (#FFD700) and cyan (#00E5FF) accents
- Russian language content

## What's Been Implemented (May 2025)
- [x] Landing page with animated mascot (Framer Motion)
- [x] JWT authentication (register, login, logout, me, refresh)
- [x] Admin seeding with brute force protection
- [x] Course catalog (6 physics topics, seeded)
- [x] Chapter view with Theory, Formulas, Quiz tabs
- [x] Formula cards with glassmorphism
- [x] Quiz system with per-question feedback + final results
- [x] XP/Level system
- [x] Student dashboard with stats
- [x] Leaderboard
- [x] Full responsive dark theme UI
- [x] All 17 backend tests passing
- [x] 95% frontend test pass rate

## Prioritized Backlog
### P0 (Next)
- More chapters/quizzes for all 6 courses
- Spaced repetition / review prompts
- Exam simulator (CT/CE format)

### P1
- Interactive simulations (predict-manipulate-observe)
- Streak tracking (daily login)
- "Boss fight" mixed quizzes

### P2
- Focus mode (reduced UI)
- Teacher dashboard
- Password reset flow
- Mobile optimization refinements
- Achievement badges collection

## Iteration 2 - UI/UX Redesign (May 2025)
- [x] Removed mascot checkered background using rembg (AI background removal)
- [x] Complete CSS rewrite: surface system (surface-base/elevated/overlay), 8px spacing, refined typography
- [x] Unbounded headings with -0.04em tracking, Inter body with -0.011em letter-spacing
- [x] Loading skeleton states for all data-fetching pages
- [x] Micro-animations: 200-250ms cubic-bezier transitions on all interactive elements
- [x] WCAG AA-compliant focus-visible rings
- [x] Layered box-shadows for depth (surface-elevated, card-interactive)
- [x] Refined Navbar with backdrop-blur overlay, NavLink active states
- [x] Premium quiz UX with hint toggle, feedback animations
- [x] Custom scrollbar, selection highlight, noise texture overlay
- [x] Progress bar with gradient (yellow to amber)

## Iteration 3 - CT/CE Corpus Analysis and Product Strategy (May 2026)

### Source Corpus Reviewed
- ЦЭ,ЦТ 2025-1 (1).pdf (OCR over 43 pages)
- ФИЗ РТ-3 24_25 В1 (1).pdf (structured methodical variant with solved commentary)
- 2_5377661034435710038 (1).pdf (teacher workbook, 11 class: 23 self-study + 4 control works, multi-variant)

### Key Findings (Belarus-specific)
- Exam shape is stable: 30 tasks / 210 min, split A (10) + B (20).
- Part A mixes single-choice, multi-choice, and matching; item logic often checks concept recognition + graph interpretation.
- Part B heavily checks numeric modeling with strict answer formatting (integer rounding, units not written in the answer cell).
- Topic rotation across variants is broad but predictable: mechanics, MKT/thermo, electrostatics/circuits, magnetism, optics, atomic/nuclear.
- Real RIKZ-style tasks often blend representations in one prompt: text + graph/table/diagram + formula choice.

### Implications for Site Information Architecture
1. Keep two independent tracks in product navigation and analytics:
   - School mastery track: concept depth, grade-linked progression, frequent short checks.
   - CT/CE performance track: timed sets, format compliance, scoring behavior under pressure.
2. Do not mix mastery and exam sessions in one metric.
   - School KPI: topic mastery and error-type reduction.
   - Exam KPI: score trajectory, time per item class, omission rate.
3. Add explicit weekly plan presets for Belarusian students:
   - 3x school sessions + 2x CT/CE sessions (adaptive by weak topic).

### Original Task Generation Policy (No repeats, no numeric re-skin)
- Forbidden:
  - Copying source task statements.
  - "Same story, new numbers" rewrites.
- Required generation pipeline:
  1. Extract skill blueprint from source item (target law, representation type, trap profile).
  2. Build new narrative context (different physical setup and givens graph/table).
  3. Enforce novelty checks against existing pool:
     - lexical similarity threshold,
     - structural equation graph distance,
     - distractor-pattern uniqueness.
  4. Validate solution path with symbolic/unit checker.
  5. Tag each generated item by skill and cognitive operation.
- Minimum novelty constraints per generated item:
  - New context entity,
  - New requested quantity,
  - New distractor rationale pattern.

### Recommended Task Taxonomy for PhysicsLab
- Concept check: definition/phenomenon discrimination.
- Representation translation: graph ↔ formula, table ↔ conclusion.
- Model selection: choose governing law and assumptions.
- Computation: multistep numeric with unit consistency.
- Matching/classification: phenomenon-device/effect-cause mapping.
- Experimental reasoning: infer from setup modifications.

### Visual Theory Upgrade Principles
- Every chapter should include:
  - concept map (5-8 nodes),
  - "how to solve" flow (4 steps),
  - quick formula board,
  - typical trap list.
- Theory should be representation-rich (diagram + text + formula + mini-check), not plain paragraphs.

### Mascot Animation Direction
- Move from only pose swapping to procedural secondary motion:
  - spring-based hair sway,
  - orbital "physics particles",
  - context-triggered reactions (correct/wrong/time warning).
- Keep animation lightweight (CSS/Framer) for browser performance on school laptops.

### Next Engineering Milestones
1. Build an item-blueprint schema in backend and seed at least 200 original CT/CE-style tasks with novelty hashes.
2. Add exam analytics: time-per-topic, guessed-answer risk, fatigue curve by task index.
3. Add adaptive assignment engine that alternates school depth and exam speed blocks.
4. Add reviewer mode for content QA (duplicate detector + explanation quality checklist).

### Additional Implementation Note
Landing Page, Dashboard, Chapter Page have been completely overhauled to utilize high-end UI patterns (glassmorphism cards, glowing gradients, noise texture, custom animations) without "standard generic text". 
The "school vs exam" paths are deeply partitioned in Dashboard and visually highlighted via specific value propositions (Methodology vs Timed Testing).
Mascot animation updated to pure 3D parallax + orbiting orbital elements representing vectors, math, and light symbols.
