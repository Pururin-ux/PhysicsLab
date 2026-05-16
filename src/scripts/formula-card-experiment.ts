export type FormulaPart = "none" | "x" | "x0" | "v" | "t" | "vt";

type PartCopy = {
  title: string;
  sub: string;
  hint: string;
  insight: string;
  cards: string[];
  graph: string[];
  formula: string[];
};

const DEFAULT_PART: FormulaPart = "none";

const PART_COPY: Record<FormulaPart, PartCopy> = {
  none: {
    title: "Наведи на часть формулы",
    sub: "Выбери символ в формуле или карточку переменной.",
    hint: "Нажми на символ формулы - увидишь, за что он отвечает.",
    insight: "График показывает, как меняется координата x со временем t.",
    cards: [],
    graph: [],
    formula: []
  },
  x: {
    title: "x - где тело окажется",
    sub: "Это координата в выбранный момент времени.",
    hint: "x получается из старта x0 и добавки vt.",
    insight: "Желтая точка на графике показывает текущее значение x.",
    cards: ["x"],
    graph: ["current"],
    formula: ["x"]
  },
  x0: {
    title: "x0 - откуда начали",
    sub: "Стартовая координата сдвигает всю линию вверх или вниз.",
    hint: "Если изменить x0, график x(t) поднимется или опустится целиком.",
    insight: "Стартовая точка показывает координату в момент t = 0.",
    cards: ["x0"],
    graph: ["start"],
    formula: ["x0"]
  },
  v: {
    title: "v задает наклон графика x(t)",
    sub: "Больше скорость - круче линия. Минусовая скорость ведет линию вниз.",
    hint: "Наведи на v: она входит в vt и отвечает за наклон.",
    insight: "Скорость v - это наклон линии координаты от времени.",
    cards: ["v"],
    graph: ["line"],
    formula: ["v", "vt"]
  },
  t: {
    title: "t показывает, сколько времени прошло",
    sub: "Чем больше времени, тем дальше вправо точка на графике.",
    hint: "Маркер времени показывает выбранный момент на оси t.",
    insight: "Вертикальная линия помогает увидеть координату в выбранный момент.",
    cards: ["t"],
    graph: ["time", "current"],
    formula: ["t", "vt"]
  },
  vt: {
    title: "vt - сколько координаты добавилось",
    sub: "Это изменение координаты за время t при скорости v.",
    hint: "vt связывает скорость и время: так появляется прирост координаты.",
    insight: "Подсвеченный участок показывает добавку к координате после старта.",
    cards: ["v", "t"],
    graph: ["delta", "line", "current"],
    formula: ["v", "t", "vt"]
  }
};

const getPartFromElement = (element: HTMLElement): FormulaPart => {
  const part = element.dataset.formulaPart ?? element.dataset.variableCard;
  return isFormulaPart(part) ? part : DEFAULT_PART;
};

const isFormulaPart = (value: string | undefined): value is FormulaPart =>
  value === "x" ||
  value === "x0" ||
  value === "v" ||
  value === "t" ||
  value === "vt" ||
  value === "none";

export function initFormulaCardExperiment(root: HTMLElement | null): void {
  if (!root || root.dataset.fceReady === "true") return;
  root.dataset.fceReady = "true";

  const statusTitle = root.querySelector<HTMLElement>("[data-fce-status-title]");
  const statusSub = root.querySelector<HTMLElement>("[data-fce-status-sub]");
  const hint = root.querySelector<HTMLElement>("[data-fce-hint]");
  const insight = root.querySelector<HTMLElement>("[data-fce-insight]");
  const formulaParts = Array.from(root.querySelectorAll<HTMLElement>("[data-formula-part]"));
  const variableCards = Array.from(root.querySelectorAll<HTMLElement>("[data-variable-card]"));
  const graphElements = Array.from(root.querySelectorAll<HTMLElement | SVGElement>("[data-graph-element]"));

  let selectedPart: FormulaPart = DEFAULT_PART;
  let hoverPart: FormulaPart = DEFAULT_PART;
  let focusPart: FormulaPart = DEFAULT_PART;

  const activatePart = (part: FormulaPart) => {
    const copy = PART_COPY[part];
    root.dataset.activePart = part;

    if (statusTitle) statusTitle.textContent = copy.title;
    if (statusSub) statusSub.textContent = copy.sub;
    if (hint) hint.textContent = copy.hint;
    if (insight) insight.textContent = copy.insight;

    formulaParts.forEach((item) => {
      const isActive = copy.formula.includes(item.dataset.formulaPart ?? "");
      item.toggleAttribute("data-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    variableCards.forEach((card) => {
      const isActive = copy.cards.includes(card.dataset.variableCard ?? "");
      card.toggleAttribute("data-active", isActive);
      card.setAttribute("aria-pressed", String(isActive));
    });

    graphElements.forEach((element) => {
      const isActive = copy.graph.includes(element.getAttribute("data-graph-element") ?? "");
      element.toggleAttribute("data-active", isActive);
    });
  };

  const syncPart = () => {
    if (focusPart !== DEFAULT_PART) {
      activatePart(focusPart);
      return;
    }

    if (hoverPart !== DEFAULT_PART) {
      activatePart(hoverPart);
      return;
    }

    activatePart(selectedPart);
  };

  const previewPart = (part: FormulaPart) => {
    hoverPart = part;
    syncPart();
  };

  const clearPreviewPart = (part: FormulaPart) => {
    if (hoverPart === part) hoverPart = DEFAULT_PART;
    syncPart();
  };

  const focusFormulaPart = (part: FormulaPart) => {
    focusPart = part;
    syncPart();
  };

  const clearFocusPart = (part: FormulaPart) => {
    if (focusPart === part) focusPart = DEFAULT_PART;
    syncPart();
  };

  const selectPart = (part: FormulaPart) => {
    selectedPart = part;
    syncPart();
  };

  [...formulaParts, ...variableCards].forEach((control) => {
    const part = getPartFromElement(control);
    control.addEventListener("pointerenter", () => previewPart(part));
    control.addEventListener("pointerleave", () => clearPreviewPart(part));
    control.addEventListener("focus", () => focusFormulaPart(part));
    control.addEventListener("blur", () => clearFocusPart(part));
    control.addEventListener("click", () => selectPart(part));
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      selectedPart = DEFAULT_PART;
      hoverPart = DEFAULT_PART;
      focusPart = DEFAULT_PART;
      syncPart();
    }
  });

  syncPart();
}
