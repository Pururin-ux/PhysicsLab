import { PracticeWithHelp } from "../../../components/quiz/PracticeWithHelp";
import { CompactHelpCard } from "../../../components/theory/CompactHelpCard";
import { ConceptReveal } from "../../../components/theory/ConceptReveal";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { topicHelpSections } from "../../../lib/learning/topic-help";
import {
  ACCELERATED_MOTION_XT,
  UNIFORM_MOTION_VT,
} from "../../../lib/physics/graph-data";
import { FORMULAS } from "../../../lib/physics/formulas";

export const metadata = {
  title: "Кинематика | PhysicsLab",
};

export default function KinematicsDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-8 sm:gap-10">
      <TopicAmbientGlow accent="cyan" />

      <TopicPageHeader
        eyebrow="Тренировка"
        title="Кинематика"
        description="10 задач: движение, графики и формулы. Если застрянешь — открой разбор темы."
        accent="cyan"
      />

      <section id="practice" className="scroll-mt-24">
        <PracticeWithHelp
          topicId="kinematics"
          generatedTemplate="mixed"
          generatedTopic="Кинематика"
          generatedTitle="Задачи по кинематике"
          accent="cyan"
          drawerTitle="Справка по задаче"
          drawerDescription="Открыт раздел, который нужен для текущего вопроса."
          subtopics={topicHelpSections.kinematics}
        >
          <div data-help-section-id="uniform-motion">
            <ConceptReveal
              graph={UNIFORM_MOTION_VT}
              title="Равномерное движение"
              modelText="Линия скорости горизонтальна: за ==равные промежутки времени== тело проходит ==равные пути==."
              meaningText="Скорость постоянна, поэтому ==площадь под графиком v(t)== и есть перемещение."
              trap="Ошибка: взять одно значение скорости вместо площади под графиком."
              formula={FORMULAS.uniform_motion}
              formulaCaption="путь при постоянной скорости"
              symbols={[
                "s — путь или модуль перемещения, м",
                "v — постоянная скорость, м/с",
                "t — время движения, с",
              ]}
              limitation="Пока скорость постоянна и направление не меняется."
            />
          </div>

          <div data-help-section-id="accelerated-motion">
            <ConceptReveal
              graph={ACCELERATED_MOTION_XT}
              title="Равноускоренное движение"
              modelText="Парабола координаты: чем дольше едет тело, тем **быстрее** растёт путь."
              meaningText="Скорость растёт ==равномерно==, а координата — **неравными шагами**."
              trap="Ошибка: путать путь за n-ю секунду и путь за n секунд."
              formula={FORMULAS.accelerated_motion}
              formulaCaption="координата при постоянном ускорении"
              symbols={[
                "x — координата тела, м",
                "x₀ — начальная координата, м",
                "v₀ — начальная скорость, м/с",
                "a — постоянное ускорение, м/с²",
                "t — время движения, с",
              ]}
              limitation="Пока движение прямолинейное с постоянным ускорением."
            />
          </div>

          <div data-help-section-id="motion-graphs">
            <CompactHelpCard
              accent="cyan"
              title="Графики движения"
              body="Сначала прочитай вертикальную ось. На $v(t)$ наклон показывает ускорение, а площадь под линией — перемещение. На $x(t)$ наклон показывает скорость."
              formula={"a = \\frac{\\Delta v}{\\Delta t},\\quad s = S_{v(t)}"}
              trap="Не бери конечную скорость как путь: для перемещения нужна площадь под графиком скорости."
            />
          </div>

          <div data-help-section-id="average-speed">
            <CompactHelpCard
              accent="cyan"
              title="Средняя скорость"
              body="Средняя скорость — это весь путь, делённый на всё время. Нельзя просто усреднять скорости, если участки занимали разное время."
              formula={"v_{avg}=\\frac{s_{all}}{t_{all}}"}
            />
          </div>

          <div data-help-section-id="vectors-relative-motion">
            <CompactHelpCard
              accent="cyan"
              title="Векторы и относительное движение"
              body="При движении навстречу скорости сближения складываются. При догоняющем движении работает разность. Перпендикулярные скорости складываются как катеты треугольника."
              formula={"v_{rel}=v_1+v_2\\quad \\text{or}\\quad v_2-v_1"}
              trap="Сначала назови направления, потом выбирай сумму, разность или теорему Пифагора."
            />
          </div>
        </PracticeWithHelp>
      </section>
    </div>
  );
}
