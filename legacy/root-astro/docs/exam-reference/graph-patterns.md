# Graph And Visual Patterns

Sources:

- Full-text РТ-2024/2025 stage III variant 1.
- Visual sample from scanned ЦЭ/ЦТ 2025 variant 1 pages 5-8.

The scanned ЦЭ/ЦТ source is not OCR-readable. Visual observations below are from manual page inspection and should be treated as sample evidence, not complete statistics for all 10 variants.

## Graph Tasks Found

| Source | Task | Graph type | Axes / units | Shape | Required action | Visual annotations needed | Common trap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| РТ 2024/2025 | В1 | v(t) | t, s; v, m/s | straight increasing segment | slope `Δv/Δt` | grid, two readable points | Use final velocity instead of slope. |
| РТ 2024/2025 | В10 | p(V) | V, p; symbolic `V0`, `p0` | rectangular cycle | area of cycle + first law on segment | state labels, shaded area, arrows | Treat area as requested heat without `ΔU`. |
| ЦЭ/ЦТ 2025 sample | А2 | x(t) | t, s; x, m | straight decreasing line | match equation `x=x0+vt` | grid, intercept, negative slope | Lose sign of velocity. |
| ЦЭ/ЦТ 2025 sample | А3 | p(t) qualitative | t; p | several option graphs | choose pressure-time graph from pipe constriction | multiple mini-graphs | Assume pressure is constant through changing section. |
| ЦЭ/ЦТ 2025 sample | А5 | V(T) | T; V | straight lines through/near origin | identify process type and compare statements | axes, state points 1 and 2 | Confuse isobaric and isochoric on V(T). |
| ЦЭ/ЦТ 2025 sample | В3 | v_x(s) | s, m; v_x, m/s | curve crossing zero | infer motion/displacement from velocity-position relation | grid, signed y-axis, axis labels | Read it as v(t). |
| ЦЭ/ЦТ 2025 sample | В10 | p(V) | V, l; p, 10^5 Pa | straight decreasing segment | compute `ΔU` from endpoints | state labels, units, grid | Use area under graph as `ΔU`. |
| ЦЭ/ЦТ 2025 sample | В11 | t(τ) | τ, min; t, °C | piecewise linear with plateau | identify melting interval and mass from latent heat | labeled points A-B-C-D, plateau | Use whole heating time instead of plateau. |
| ЦЭ/ЦТ 2025 sample | В12 | p(V) | V; p | cycle with curve + vertical segment | heat on one segment with isothermal condition elsewhere | state labels, arrow direction, curve | Mix cycle work with segment heat. |

## Non-Graph Visual Tasks Found

| Source | Task | Visual type | What renderer needs |
| --- | --- | --- | --- |
| РТ 2024/2025 | А2 | trajectory/vector diagram | arrows, displacement vectors, river-current shift. |
| РТ 2024/2025 | А6 | charge diagram | point charges, numbered direction arrows, point A. |
| РТ 2024/2025 | А7 | circuit | source, lamp, resistor, switch, before/after reasoning. |
| РТ 2024/2025 | А8 | magnetic field direction | current marker, point A, numbered arrows. |
| РТ 2024/2025 | В4 | vessel geometry | cone, fill level, dimension labels. |
| РТ 2024/2025 | В5 | force diagram | block, force at angle, normal, friction, gravity, axes. |
| РТ 2024/2025 | В6 | statics diagram | bent rod, support/thread, angle, center-of-mass positions. |
| РТ 2024/2025 | В15 | measurement circuit | source with internal resistance, ammeter, voltmeter, rheostat. |
| РТ 2024/2025 | В16 | resistor network | nodes, equal resistors, branch currents. |
| РТ 2024/2025 | В20 | optics diagram | lens, source, focus, object/image distances. |
| ЦЭ/ЦТ 2025 sample | А1 | vector grid | vector arrows on coordinate grid, axis projection. |
| ЦЭ/ЦТ 2025 sample | А7 | resistor network | numbered points/segments and equal resistors. |
| ЦЭ/ЦТ 2025 sample | А8 | wire magnetic field | coordinate axes, current direction, components. |
| ЦЭ/ЦТ 2025 sample | В1 | machined cylinder | two cylinder diameters and masses. |
| ЦЭ/ЦТ 2025 sample | В2 | velocity vectors on grid | vector subtraction on squared grid. |
| ЦЭ/ЦТ 2025 sample | В6 | pulley system | fixed/movable pulleys, rope, load, force arrow. |
| ЦЭ/ЦТ 2025 sample | В14 | charge-potential line | charges, points A/B, equal spacing. |
| ЦЭ/ЦТ 2025 sample | В16 | resistor network with voltmeter | ideal voltmeter branch and source terminals. |
| ЦЭ/ЦТ 2025 sample | В19 | optical/TIR geometry | square surface region, depth, source, light cone. |

## PhysicsGraph v1 Requirements

Minimum graph families:

1. `cartesian-line`: x(t), v(t), p(t), V(T), p(V) with straight segments.
2. `piecewise-line`: heating curves, multi-stage motion/thermo graphs.
3. `cycle-pv`: p(V) cycles with state labels, arrows, and shaded area.
4. `multi-option-mini-graphs`: small graph choices for part A.
5. `signed-axis-graph`: graphs with negative values, especially velocity components.

Core features:

- Axis labels with units.
- Grid with exam-like density.
- Arrowed axes where needed.
- State labels: 1, 2, 3, 4; points A/B/C/D.
- Segment arrows for process direction.
- Shaded area under graph or inside cycle.
- Dashed guide lines from points to axes.
- Support for symbolic ticks (`p0`, `2p0`, `V0`, `2V0`) and numeric ticks.
- Compact rendering at mobile widths without losing axis labels.

## Renderer Options

| Option | Similarity to exam visuals | Axes / arrows control | Point labels / shading | Testability | Mobile | Complexity | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Custom SVG renderer | High | High | High | High: snapshot and DOM assertions | High if responsive viewBox is strict | Medium | Best fit for v1. Exam visuals are simple but require precise labels/arrows/shading. |
| Recharts | Medium | Medium | Medium | Medium | Good | Low-medium | Useful for analytics charts, less ideal for exam-style axes and symbolic ticks. |
| D3 / visx | High | High | High | Medium | Good | High | Powerful but too much abstraction cost for first PhysicsGraph. Consider if graph families expand. |
| Canvas | Medium | High | High | Low-medium: pixel tests needed | Good | Medium-high | Avoid for v1: accessibility and testability are weaker than SVG. |

Conclusion: use custom semantic SVG for PhysicsGraph v1. Keep graph config declarative and physics-specific rather than adopting a general chart library first.

## Suggested GraphSpec Direction

Current generator `GraphSpec` supports only:

```ts
type: "vt" | "xt" | "at"
series: { t: number; v?: number; x?: number }[]
```

Needed next shape:

```ts
type: "xt" | "vt" | "at" | "pv" | "vT" | "tTau" | "generic"
axes: {
  x: { label: string; unit?: string; range: [number, number]; ticks?: Tick[] }
  y: { label: string; unit?: string; range: [number, number]; ticks?: Tick[] }
}
series: Segment[] | Curve[]
points?: LabeledPoint[]
areas?: ShadedArea[]
arrows?: SegmentArrow[]
guides?: GuideLine[]
```

Do not overbuild into a charting engine. The useful abstraction is "exam physics graph", not "all possible charts".
