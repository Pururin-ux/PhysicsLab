type FormulaPart = "none" | "x" | "x0" | "v" | "t" | "vt";

type FormulaPartCopy = {
  title: string;
  insight: string;
  formula: FormulaPart[];
  graph: string[];
  relatedTerm?: boolean;
};

const PART_COPY: Record<FormulaPart, FormulaPartCopy> = {
  none: {
    title: "Нажми на символ формулы — увидишь, за что он отвечает.",
    insight: "График показывает, как меняется координата, а не дорогу по карте.",
    formula: [],
    graph: []
  },
  x: {
    title: "x — координата тела в выбранный момент времени.",
    insight: "Текущая точка на графике показывает это значение x.",
    formula: ["x"],
    graph: ["current", "current-label"]
  },
  x0: {
    title: "x₀ — стартовая координата: откуда начали при t = 0.",
    insight: "Стартовая точка показывает координату в начале движения.",
    formula: ["x0"],
    graph: ["start", "start-label"]
  },
  v: {
    title: "v задаёт наклон графика: чем больше скорость, тем круче линия.",
    insight: "Подсвеченная линия показывает, что скорость отвечает за наклон x(t).",
    formula: ["v"],
    graph: ["line", "slope-family", "slope-label"],
    relatedTerm: true
  },
  t: {
    title: "t — сколько времени прошло. На графике это движение вправо по оси времени.",
    insight: "Вертикальный маркер показывает выбранный момент времени.",
    formula: ["t"],
    graph: ["time"],
    relatedTerm: true
  },
  vt: {
    title: "vt — изменение координаты",
    insight: "vt показывает, насколько изменилась координата за время t.",
    formula: ["vt"],
    graph: ["delta", "delta-label"]
  }
};

const toPart = (value: string | null): FormulaPart =>
  value === "x" || value === "x0" || value === "v" || value === "t" || value === "vt"
    ? value
    : "none";

export const initFormulaCardExperiment = (root: HTMLElement) => {
  if (root.dataset.fceReady === "true") {
    return;
  }

  root.dataset.fceReady = "true";

  const formulaParts = Array.from(
    root.querySelectorAll<HTMLElement>("[data-formula-part]")
  );
  const graphElements = Array.from(
    root.querySelectorAll<HTMLElement | SVGElement>("[data-graph-element]")
  );
  const titleNode = root.querySelector<HTMLElement>("[data-fce-insight-title]");
  const insightNode = root.querySelector<HTMLElement>("[data-fce-insight]");
  const termNode = root.querySelector<HTMLElement>("[data-fce-term]");

  let selectedPart: FormulaPart = "none";
  let hoverPart: FormulaPart = "none";
  let focusPart: FormulaPart = "none";

  const getActivePart = (): FormulaPart => {
    if (focusPart !== "none") {
      return focusPart;
    }

    if (hoverPart !== "none") {
      return hoverPart;
    }

    return selectedPart;
  };

  const render = () => {
    const activePart = getActivePart();
    const copy = PART_COPY[activePart];

    root.dataset.activePart = activePart;

    if (titleNode) {
      titleNode.textContent = copy.title;
    }

    if (insightNode) {
      insightNode.textContent = copy.insight;
    }

    formulaParts.forEach((element) => {
      const part = toPart(element.dataset.formulaPart ?? null);
      const isActive = copy.formula.includes(part);
      element.toggleAttribute("data-active", isActive);
      element.setAttribute("aria-pressed", String(isActive || selectedPart === part));
    });

    graphElements.forEach((element) => {
      const graphKey = element.getAttribute("data-graph-element") ?? "";
      element.toggleAttribute("data-active", copy.graph.includes(graphKey));
    });

    termNode?.toggleAttribute("data-related", Boolean(copy.relatedTerm));
  };

  const activateFromElement = (element: HTMLElement, mode: "hover" | "focus" | "select") => {
    const part = toPart(element.dataset.formulaPart ?? null);

    if (mode === "hover") {
      hoverPart = part;
    } else if (mode === "focus") {
      focusPart = part;
    } else {
      selectedPart = selectedPart === part ? "none" : part;
    }

    render();
  };

  formulaParts.forEach((element) => {
    element.addEventListener("pointerenter", () => activateFromElement(element, "hover"));
    element.addEventListener("pointerleave", () => {
      hoverPart = "none";
      render();
    });
    element.addEventListener("focus", () => activateFromElement(element, "focus"));
    element.addEventListener("blur", () => {
      focusPart = "none";
      render();
    });
    element.addEventListener("click", () => activateFromElement(element, "select"));
    element.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        selectedPart = "none";
        hoverPart = "none";
        focusPart = "none";
        render();
      }
    });
  });

  render();
};
