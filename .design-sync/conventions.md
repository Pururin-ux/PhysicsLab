# PhysicsLab design conventions

PhysicsLab is a Russian-language companion for Belarusian secondary-school physics. Build calm, credible study screens; keep the dark space theme restrained. Prioritize the task, formula, diagram, units, and feedback. Keep Russian copy and standard SI notation; do not invent social features, fake metrics, or decorative scientific data.

## Runtime and theme setup

- Load `styles.css` before `_ds_bundle.js`, then use components from `window.PhysicsLab`.
- The theme is dark by default. Use `min-h-screen bg-space-950 text-white` for a full-page canvas. For `html[data-theme="light"]`, rely on semantic variables and components instead of hard-coded colors.
- `DsDarkSurface` is only the local preview harness used to grade isolated components. Never render it in a product page, never import it as an app shell, and never nest it around generated layouts.
- Preserve component props and interactions. Read the declaration before composing a graph, diagram, quiz, or theory component.

## Styling vocabulary

- Space surfaces progress from `bg-space-950` (page/deep canvas) through `bg-space-925`, `bg-space-900`, `bg-space-850`, and `bg-space-800` (raised detail). Prefer the existing `Card` component for primary content groups.
- Semantic CSS variables are the durable source for theme-aware custom styling: `--bg`, `--surface-shell`, `--surface-base`, `--surface-raised`, `--surface-elevated`, and `--border-subtle`. Brand and data accents come from `--action`, `--brand`, and `--data`.
- Accent utilities are purposeful: `text-nova-cyan` for data, `text-nova-blue` for actions/focus, `text-nova-gold` for results, and `text-nova-pink` or `text-nova-ember` for warnings.
- Reuse `rounded-card` for containers, `rounded-option` for controls, and `rounded-badge` for status labels. Keep borders subtle.
- Use `font-display` for headings, `font-mono` for technical values, and `physics-math`, `physics-number`, `physics-unit`, `formula-white`, or `formula-cyan` for notation.
- Motion should explain state. Keep hover movement small, preserve visible focus rings, and do not add ambient animation on top of `StarField` or diagram components.

## Sources of truth

- `styles.css` and `_ds_bundle.css` define the actual tokens, utilities, fonts, and theme behavior available in the project.
- `components/<group>/<Component>/<Component>.d.ts` is the prop contract. Use it before passing specs to `PhysicsGraph`, `CircuitDiagram`, `OpticsDiagram`, or `VectorDiagram`.
- `components/<group>/<Component>/<Component>.prompt.md` explains intent and includes production-based examples.
- Prefer a component prop over reproducing its visuals with arbitrary HTML. Do not redraw the graph axes, circuit symbols, optical rays, quiz states, or formula typography by hand.

## Idiomatic composition

```jsx
const { TopicPageHeader, Card, Badge, Button } = window.PhysicsLab;

export default function KinematicsStart() {
  return (
    <div className="min-h-screen bg-space-950 text-white">
      <main className="mx-auto grid max-w-[1120px] gap-6 p-6">
        <TopicPageHeader
          eyebrow="Кинематика"
          title="Равномерное движение"
          description="Повтори модель, проверь единицы и реши короткую задачу."
          accent="cyan"
        />
        <Card variant="elevated" className="grid gap-4 p-6">
          <Badge tone="cyan">7 класс · механика</Badge>
          <p className="max-w-[68ch] text-white/70">
            Сначала выдели известные величины, затем выбери формулу и переведи единицы в СИ.
          </p>
          <div><Button size="md">Начать задачу</Button></div>
        </Card>
      </main>
    </div>
  );
}
```

Keep pages readable, use one primary action per learning step, and give diagrams useful width without competing with the task or answer controls.
