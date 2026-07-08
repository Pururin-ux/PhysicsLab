/**
 * Интерактивный фон ui-playground: «атомы» с орбитами электронов и редкие «звёзды».
 * Курсор отталкивает ядра; при reduced motion — статичный кадр без анимации.
 */

type Electron = {
  angle: number;
  orbit: number;
  speed: number;
};

type Atom = {
  kind: "atom";
  x: number;
  y: number;
  vx: number;
  vy: number;
  accent: boolean;
  electrons: Electron[];
};

type Star = {
  kind: "star";
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
  rays: boolean;
};

type Entity = Atom | Star;

const palette = {
  cyan: "88, 216, 255",
  gold: "255, 216, 77",
  violet: "181, 156, 255"
} as const;

export function initPlaygroundAtomsBackground(
  canvas: HTMLCanvasElement | null
): (() => void) | undefined {
  if (!canvas) return undefined;

  const shell = canvas.closest<HTMLElement>("[data-playground-shell]");
  if (!shell) return undefined;

  const context = canvas.getContext("2d");
  if (!context) return undefined;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let resizeObserver: ResizeObserver | undefined;

  let width = 0;
  let height = 0;
  let entities: Entity[] = [];
  let animationFrame = 0;
  let pointerX = -9999;
  let pointerY = -9999;
  let pointerActive = false;
  let time = 0;

  const repelRadius = 140;
  const repelStrength = 0.55;
  const maxSpeed = 2.4;
  const friction = 0.92;
  const drift = 0.04;

  const entityCount = () =>
    Math.max(14, Math.min(42, Math.round((width * height) / 28000)));

  const resize = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    width = shell.offsetWidth;
    height = shell.offsetHeight;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);

    const total = entityCount();
    const starCount = Math.max(8, Math.floor(total * 0.38));
    const atomCount = total - starCount;

    entities = [];

    for (let i = 0; i < atomCount; i += 1) {
      const accent = i % 5 === 0;
      const electronCount = accent ? 3 : 2;
      entities.push({
        kind: "atom",
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * drift,
        vy: (Math.random() - 0.5) * drift,
        accent,
        electrons: Array.from({ length: electronCount }, (_, e) => ({
          angle: Math.random() * Math.PI * 2,
          orbit: 10 + e * 5 + Math.random() * 4,
          speed: (accent ? 0.022 : 0.016) * (e % 2 === 0 ? 1 : -1)
        }))
      });
    }

    for (let i = 0; i < starCount; i += 1) {
      entities.push({
        kind: "star",
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * drift * 0.6,
        vy: (Math.random() - 0.5) * drift * 0.6,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 1.4 + 1.35,
        rays: Math.random() > 0.45
      });
    }
  };

  const applyPointerRepulsion = (entity: Entity) => {
    if (!pointerActive) return;

    const dx = entity.x - pointerX;
    const dy = entity.y - pointerY;
    const dist = Math.hypot(dx, dy);
    if (dist >= repelRadius || dist < 0.5) return;

    const push = ((repelRadius - dist) / repelRadius) ** 1.6 * repelStrength;
    entity.vx += (dx / dist) * push;
    entity.vy += (dy / dist) * push;
  };

  const clampVelocity = (entity: Entity) => {
    const speed = Math.hypot(entity.vx, entity.vy);
    if (speed > maxSpeed) {
      entity.vx = (entity.vx / speed) * maxSpeed;
      entity.vy = (entity.vy / speed) * maxSpeed;
    }
  };

  const wrapPosition = (entity: Entity) => {
    const pad = 24;
    if (entity.x < -pad) entity.x = width + pad;
    if (entity.x > width + pad) entity.x = -pad;
    if (entity.y < -pad) entity.y = height + pad;
    if (entity.y > height + pad) entity.y = -pad;
  };

  const drawAtom = (atom: Atom, animate: boolean) => {
    const coreRgb = atom.accent ? palette.gold : palette.cyan;

    for (const electron of atom.electrons) {
      if (animate) electron.angle += electron.speed;

      const ex = atom.x + Math.cos(electron.angle) * electron.orbit;
      const ey = atom.y + Math.sin(electron.angle) * electron.orbit;

      context.beginPath();
      context.arc(atom.x, atom.y, electron.orbit, 0, Math.PI * 2);
      context.strokeStyle = `rgba(${coreRgb}, 0.07)`;
      context.lineWidth = 0.6;
      context.stroke();

      context.beginPath();
      context.arc(ex, ey, 1.1, 0, Math.PI * 2);
      context.fillStyle = `rgba(${palette.cyan}, 0.55)`;
      context.fill();
    }

    const glow = atom.accent ? 5 : 3.5;
    const gradient = context.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, glow);
    gradient.addColorStop(0, `rgba(${coreRgb}, 0.5)`);
    gradient.addColorStop(1, `rgba(${coreRgb}, 0)`);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(atom.x, atom.y, glow, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.arc(atom.x, atom.y, atom.accent ? 2.2 : 1.8, 0, Math.PI * 2);
    context.fillStyle = `rgba(${coreRgb}, 0.85)`;
    context.fill();
  };

  const drawStar = (star: Star, animate: boolean) => {
    const twinkle = animate
      ? 0.72 + Math.sin(time * 0.05 + star.phase) * 0.22
      : 0.82;
    const glowRadius = star.size * 3.2;

    const halo = context.createRadialGradient(
      star.x,
      star.y,
      0,
      star.x,
      star.y,
      glowRadius
    );
    halo.addColorStop(0, `rgba(244, 247, 251, ${twinkle * 0.95})`);
    halo.addColorStop(0.35, `rgba(${palette.gold}, ${twinkle * 0.55})`);
    halo.addColorStop(0.7, `rgba(${palette.violet}, ${twinkle * 0.35})`);
    halo.addColorStop(1, "rgba(181, 156, 255, 0)");
    context.fillStyle = halo;
    context.beginPath();
    context.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    context.fillStyle = `rgba(244, 247, 251, ${Math.min(1, twinkle + 0.08)})`;
    context.fill();

    if (star.rays) {
      const ray = star.size * 2.4;
      context.strokeStyle = `rgba(${palette.gold}, ${twinkle * 0.85})`;
      context.lineWidth = 1.1;
      context.beginPath();
      context.moveTo(star.x - ray, star.y);
      context.lineTo(star.x + ray, star.y);
      context.moveTo(star.x, star.y - ray);
      context.lineTo(star.x, star.y + ray);
      context.stroke();

      context.strokeStyle = `rgba(${palette.cyan}, ${twinkle * 0.45})`;
      context.lineWidth = 0.7;
      const diag = ray * 0.72;
      context.beginPath();
      context.moveTo(star.x - diag, star.y - diag);
      context.lineTo(star.x + diag, star.y + diag);
      context.moveTo(star.x + diag, star.y - diag);
      context.lineTo(star.x - diag, star.y + diag);
      context.stroke();
    }
  };

  const drawLinks = () => {
    for (let i = 0; i < entities.length; i += 1) {
      const a = entities[i];
      if (a.kind !== "atom") continue;

      for (let j = i + 1; j < entities.length; j += 1) {
        const b = entities[j];
        if (b.kind !== "atom") continue;

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 150) continue;

        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.strokeStyle = `rgba(${palette.cyan}, ${(1 - dist / 150) * 0.09})`;
        context.lineWidth = 0.65;
        context.stroke();
      }
    }
  };

  const drawPointerRipple = () => {
    if (!pointerActive || reducedMotion.matches) return;

    const ripple = 28 + Math.sin(time * 0.08) * 4;
    const gradient = context.createRadialGradient(
      pointerX,
      pointerY,
      0,
      pointerX,
      pointerY,
      ripple
    );
    gradient.addColorStop(0, `rgba(${palette.gold}, 0.07)`);
    gradient.addColorStop(0.55, `rgba(${palette.cyan}, 0.04)`);
    gradient.addColorStop(1, "rgba(88, 216, 255, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(pointerX, pointerY, ripple, 0, Math.PI * 2);
    context.fill();
  };

  const step = (animate: boolean) => {
    context.clearRect(0, 0, width, height);
    drawPointerRipple();

    if (animate) time += 1;

    for (const entity of entities) {
      if (animate) {
        applyPointerRepulsion(entity);
        entity.vx *= friction;
        entity.vy *= friction;
        entity.vx += (Math.random() - 0.5) * 0.008;
        entity.vy += (Math.random() - 0.5) * 0.008;
        clampVelocity(entity);
        entity.x += entity.vx;
        entity.y += entity.vy;
        wrapPosition(entity);
      }

      if (entity.kind === "atom") drawAtom(entity, animate);
      else drawStar(entity, animate);
    }

    drawLinks();
  };

  const loop = () => {
    step(!reducedMotion.matches);
    if (!reducedMotion.matches) {
      animationFrame = window.requestAnimationFrame(loop);
    }
  };

  const onPointerMove = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = clientX - rect.left;
    pointerY = clientY - rect.top;
    pointerActive = true;
  };

  const handleMouseMove = (event: MouseEvent) => {
    onPointerMove(event.clientX, event.clientY);
  };

  const handleTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    onPointerMove(touch.clientX, touch.clientY);
  };

  const clearPointer = () => {
    pointerActive = false;
    pointerX = -9999;
    pointerY = -9999;
  };

  const restart = () => {
    window.cancelAnimationFrame(animationFrame);
    resize();
    step(false);
    loop();
  };

  resizeObserver = new ResizeObserver(() => restart());
  resizeObserver.observe(shell);

  restart();

  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: true });
  window.addEventListener("mouseleave", clearPointer);
  window.addEventListener("touchend", clearPointer);
  window.addEventListener("resize", restart, { passive: true });
  reducedMotion.addEventListener("change", restart);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
    } else {
      restart();
    }
  });

  return () => {
    window.cancelAnimationFrame(animationFrame);
    resizeObserver?.disconnect();
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("mouseleave", clearPointer);
    window.removeEventListener("touchend", clearPointer);
    window.removeEventListener("resize", restart);
    reducedMotion.removeEventListener("change", restart);
  };
}
