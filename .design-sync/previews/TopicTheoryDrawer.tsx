import { CompactHelpCard, TopicTheoryDrawer } from "web";

export const InlineOpen = () => (
  <div style={{ width: 720 }}>
    <TopicTheoryDrawer
      title="Справка по задаче"
      description="Открыт раздел, который нужен для текущего вопроса."
      accent="cyan"
      layout="stack"
      presentation="inline"
      open
      activeSectionId="reflection"
      subtopics={[
        {
          id: "reflection",
          label: "Отражение",
          shortHint: "Угол отражения равен углу падения; оба отсчитываются от нормали.",
        },
        {
          id: "refraction",
          label: "Преломление",
          shortHint: "Отношение показателей преломления равно отношению синусов углов от нормали.",
        },
      ]}
    >
      <div data-help-section-id="reflection">
        <CompactHelpCard
          accent="cyan"
          title="Отражение"
          body="Угол отражения равен углу падения. Оба угла отсчитываются от нормали."
          formula={"\\beta=\\alpha"}
          trap="Не отсчитывай углы от поверхности зеркала."
        />
      </div>
      <div data-help-section-id="refraction">
        <CompactHelpCard
          accent="cyan"
          title="Преломление"
          body="На границе двух сред луч меняет направление."
          formula={"\\frac{\\sin\\alpha}{\\sin\\gamma}=\\frac{n_2}{n_1}"}
          trap="Дели синусы, а не сами углы."
        />
      </div>
    </TopicTheoryDrawer>
  </div>
);
