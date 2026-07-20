import { PracticeWithHelp } from "../../../components/quiz/PracticeWithHelp";
import { CompactHelpCard } from "../../../components/theory/CompactHelpCard";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { topicHelpSections } from "../../../lib/learning/topic-help";

export const metadata = {
  title: "Оптика | PhysicsLab",
};

export default function OpticsDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-8 sm:gap-10">
      <TopicAmbientGlow accent="cyan" />

      <TopicPageHeader
        eyebrow="Тренировка"
        title="Оптика"
        description="10 задач с диаграммами: отражение, плоское зеркало, преломление и собирающая линза."
        accent="cyan"
      />

      <section id="practice" className="scroll-mt-24">
        <PracticeWithHelp
          topicId="optics"
          generatedTemplate="optics-mixed"
          generatedTopic="Оптика"
          generatedTitle="Задачи по оптике"
          accent="cyan"
          drawerTitle="Справка по задаче"
          drawerDescription="Открыт раздел, который нужен для текущего вопроса."
          drawerLayout="stack"
          subtopics={topicHelpSections.optics}
        >
          <div data-help-section-id="reflection">
            <CompactHelpCard
              accent="cyan"
              title="Отражение"
              body="Угол отражения равен углу падения. Оба угла отсчитываются от нормали — перпендикуляра к зеркалу в точке падения."
              formula={"\\beta=\\alpha"}
              trap="Если в условии угол дан от поверхности зеркала, сначала переведи его: угол от нормали равен 90° минус угол от поверхности."
            />
          </div>

          <div data-help-section-id="plane-mirror">
            <CompactHelpCard
              accent="cyan"
              title="Плоское зеркало"
              body="Мнимое изображение находится за зеркалом на том же расстоянии, что предмет перед ним. Поэтому расстояние между предметом и изображением — удвоенное расстояние до зеркала."
              formula={"L=2d"}
              trap="«Расстояние до изображения» и «расстояние между предметом и изображением» — разные величины: перечитай вопрос."
            />
          </div>

          <div data-help-section-id="refractive-index">
            <CompactHelpCard
              accent="cyan"
              title="Показатель преломления"
              body="Показатель преломления показывает, во сколько раз свет в среде медленнее, чем в вакууме. Скорость в вакууме дели на скорость в среде."
              formula={"n=\\frac{c}{v}"}
              trap="У вещества n всегда не меньше единицы: если получилось меньше 1 — деление перевёрнуто."
            />
          </div>

          <div data-help-section-id="refraction">
            <CompactHelpCard
              accent="cyan"
              title="Преломление"
              body="На границе двух сред луч меняет направление. Отношение показателей преломления равно отношению синусов углов, отсчитанных от нормали."
              formula={"\\frac{\\sin\\alpha}{\\sin\\gamma}=\\frac{n_2}{n_1}"}
              trap="Дели синусы, а не сами углы: закон преломления связывает синусы углов."
            />
          </div>

          <div data-help-section-id="thin-lens">
            <CompactHelpCard
              accent="cyan"
              title="Тонкая линза"
              body="Формула линзы связывает фокусное расстояние с расстояниями до предмета и до изображения. Для действительного изображения предмет стоит дальше фокуса."
              formula={"\\frac{1}{F}=\\frac{1}{d}+\\frac{1}{f}"}
              trap="Выражая f, следи за знаменателем: f = F·d/(d − F), там разность."
            />
          </div>

          <div data-help-section-id="optical-power">
            <CompactHelpCard
              accent="cyan"
              title="Оптическая сила"
              body="Оптическая сила — обратная величина фокусного расстояния. Диоптрия равна 1/м, поэтому фокусное расстояние сначала переводится в метры."
              formula={"D=\\frac{1}{F}"}
              trap="20 см — это 0,2 м: D = 1/0,2 = 5 дптр, а не 1/20."
            />
          </div>

          <div data-help-section-id="magnification">
            <CompactHelpCard
              accent="cyan"
              title="Увеличение"
              body="Линейное увеличение равно отношению расстояния до изображения к расстоянию до предмета. Во столько же раз изображение выше или ниже предмета."
              formula={"\\Gamma=\\frac{f}{d}=\\frac{H}{h}"}
              trap="Расстояние до изображения — в числителе: если изображение дальше предмета, оно крупнее."
            />
          </div>
        </PracticeWithHelp>
      </section>
    </div>
  );
}
