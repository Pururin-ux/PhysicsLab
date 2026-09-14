"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import { MIO_SCENES, type MioScene } from "../../lib/learning/mio-assets";
import { roundTripInitial, roundTripReading, walkInitial } from "../../lib/learning/round-trip";
import { MeasurementModel } from "./MeasurementModel";
import { PhysicsLanguageModel } from "./PhysicsLanguageModel";
import { ScientificMethodModel } from "./ScientificMethodModel";
import { SIUnitsModel } from "./SIUnitsModel";
import { ParticleEvidenceModel } from "./ParticleEvidenceModel";
import { MatterStatesModel } from "./MatterStatesModel";
import { GasPressurePascalModel } from "./GasPressurePascalModel";
import { AtmosphericPressureModel } from "./AtmosphericPressureModel";
import { ArchimedesForceModel } from "./ArchimedesForceModel";
import { ElectroPredictionScene, ElectroResistanceExperiment } from "./ElectroResistanceExperiment";
import { DensityModel } from "./DensityModel";
import { InertiaModel } from "./InertiaModel";
import { PressureModel } from "./PressureModel";
import { ForceModel } from "./ForceModel";
import {RelativeMotionModel} from "./RelativeMotionModel";
import { UniformMotionGraphModel } from "./UniformMotionGraphModel";
import { UnevenMotionModel } from "./UnevenMotionModel";
import { GravityWeightModel } from "./GravityWeightModel";
import { ResultantFrictionModel } from "./ResultantFrictionModel";
import { HydrostaticPressureModel } from "./HydrostaticPressureModel";
import { MechanicalWorkModel } from "./MechanicalWorkModel";
import { MechanicalEfficiencyModel } from "./MechanicalEfficiencyModel";
import { MechanicalPowerModel } from "./MechanicalPowerModel";
import { KineticEnergyModel } from "./KineticEnergyModel";
import { PotentialEnergyModel } from "./PotentialEnergyModel";
import { MechanicalEnergyModel } from "./MechanicalEnergyModel";
import { ReflectionTextbookExperiment } from "./ReflectionContentLesson";
import { NewtonSecondLawTextbookExperiment } from "./DynamicsLesson";
import { HeatAmountModel } from "./HeatAmountModel";
import { FuelCombustionLab } from "./FuelCombustionLab";
import { HeatTransferExplorer } from "./HeatTransferExplorer";
import { IceMeltingModel } from "./IceMeltingModel";
import { EvaporationBoilingLab } from "./EvaporationBoilingLab";
import styles from "./TextbookScene.module.css";

const stories = {
  "physical-body-phenomenon-quantity": { asset: "inertia", title: "Тележка, движение или скорость?", caption: "Мио разделяет предмет, происходящее с ним изменение и величину, которой это изменение описывают.", alt: "Мио наблюдает лабораторную тележку и записывает её скорость" },
  "scientific-method": { asset: "measurement", title: "Два отсчёта. Какой проверять?", caption: "Мио фиксирует расхождение, выдвигает гипотезу и меняет только положение глаз.", alt: "Мио проверяет уровень воды в мензурке на уровне глаз" },
  "si-units-and-operations": { asset: "measurement", title: "Величина та же. Почему число другое?", caption: "Мио переводит один результат в разные единицы и проверяет физический смысл равенства.", alt: "Мио записывает результат измерения в разных единицах" },
  "measuring-volume": { asset: "measurement", title: "Вода или линейка — что измеряем прямо?", caption: "Мио снимает объём воды по мензурке. Для бруска она сначала измерит три ребра, а затем вычислит объём — сравним эти два действия.", alt: "Мио смотрит на уровень воды в мензурке на уровне глаз и готовится записать измерение" },
  "relative-motion":{asset:"relative",title:"Лодка идёт. А берег приближается?",caption:"Мио наблюдает за лодкой с берега. Сменим точку отсчёта и сравним два описания одного движения.",alt:"Мио с блокнотом наблюдает за моторной лодкой с берега реки"},
  "force-and-dynamometer":{asset:"force",title:"Пружина говорит на языке ньютонов",caption:"Мио записывает показание динамометра. Груз неподвижен, но пружина растянута. Проверим, что показывает прибор и как изменится показание со второй нагрузкой.",alt:"Мио с карандашом наблюдает динамометр на штативе; груз свободно висит на нижнем крючке"},
  "gravity-elasticity-weight":{asset:"force",title:"Один груз. А силы — разные",caption:"Мио не меняет установку, а меняет вопрос: Земля действует на груз, пружина — на груз, груз — на подвес.",alt:"Мио наблюдает за грузом, подвешенным к пружинному динамометру"},
  "resultant-force-and-friction":{asset:"inertia",title:"Тяга вправо. Что остаётся?",caption:"Мио сравнивает тягу и сопротивление одной тележки. Направление равнодействующей подскажет, как меняется скорость.",alt:"Мио наблюдает лабораторную тележку на столе"},
  "hydrostatic-pressure":{asset:"measurement",title:"Ниже — значит сильнее?",caption:"Мио выбирает точки на разной глубине в одной воде и сравнивает давление столба жидкости.",alt:"Мио наблюдает воду в высокой прозрачной мензурке"},
  "mechanical-work":{asset:"inertia",title:"Сила есть. А работа?",caption:"Мио сравнивает силу и перемещение лабораторной тележки, чтобы определить знак работы.",alt:"Мио наблюдает движение лабораторной тележки на столе"},
  "mechanical-efficiency":{asset:"inertia",title:"Работа затрачена. Какая часть полезна?",caption:"Мио сравнивает тягу и сопротивление тележки, чтобы отделить полезную работу от потерь.",alt:"Мио наблюдает лабораторную тележку на дорожке"},
  "mechanical-power":{asset:"average",title:"Работа та же. Время другое",caption:"Мио использует секундомер, чтобы сравнить быстроту совершения одинаковой работы.",alt:"Мио с секундомером стоит рядом с велосипедом"},
  "kinetic-energy":{asset:"acceleration",title:"Скорость вдвое. Энергия тоже?",caption:"Мио сравнивает один и тот же транспорт при разных скоростях и проверяет квадратную зависимость.",alt:"Мио едет в городском транспорте и наблюдает движение"},
  "potential-energy":{asset:"force",title:"Груз не двигается. Энергия есть?",caption:"Мио оставляет груз на месте и меняет только нулевой уровень, от которого измеряется высота.",alt:"Мио записывает положение подвешенного груза относительно выбранного уровня"},
  "mechanical-energy-conservation":{asset:"inertia",title:"Шайба замедляется. Куда уходит энергия?",caption:"Мио отмечает три положения подброшенной шайбы и сравнивает энергию движения с энергией высоты.",alt:"Мио записывает положения металлической шайбы во время вертикального подъёма"},
  pressure:{asset:"pressure",title:"Тот же брусок. Другая вмятина",caption:"Мио поставила одинаковые бруски на разные грани. Сила не выросла, но площадь контакта изменилась. Отделим эти два условия друг от друга.",alt:"Мио сравнивает вмятины от одинаковых брусков на широком и узком основании"},
  inertia: {asset:"inertia",title:"Тележку остановили. А шайбу?",caption:"Мио придержала тележку и заметила, что незакреплённый предмет продолжает движение. Разберём, какое тело тормозят и относительно чего оно движется.",alt:"Мио останавливает лабораторную тележку и наблюдает за свободной шайбой на платформе"},
  density: { asset: "density", title: "Больше — значит тяжелее? Проверим", caption: "Мио сравнивает два образца. Одного взгляда на размер мало: нужно сопоставить массу и объём, а затем проверить своё объяснение.", alt: "Мио внимательно взвешивает небольшой металлический образец; рядом лежит более крупный образец" },
  "reading-scales": { asset: "measurement", title: "Шкала мельче. А воды больше?", caption: "Мио смотрит на уровень воды сбоку. Проверим один и тот же объём по двум шкалам: что изменится в записи измерения?", alt: "Мио наклонилась к мензурке и смотрит на мениск на уровне глаз" },
  "uniform-motion": { asset: "inertia", title: "Тележка проходит равные участки?", caption: "Мио запускает тележку. Будем отмечать её положение через равные промежутки времени, сравним расстояния и опишем движение числом.", alt: "Мио запускает лабораторную тележку для наблюдения за её движением" },
  "uniform-motion-graphs": { asset: "average", title: "Секундомер готов. Что записывать?", caption: "Мио измеряет время движения велосипеда. Одни и те же наблюдения запишем двумя графиками: пройденного пути и постоянной скорости.", alt: "Мио держит секундомер и блокнот рядом с велосипедом перед измерением движения" },
  "uneven-motion": { asset: "acceleration", title: "Автобус стоит. Время идёт?", caption: "Мио засекла путь до остановки, ожидание и путь после неё. Остановка не добавляет пути, но часы продолжают идти.", alt: "Мио в автобусе держится за поручень и наблюдает поездку с остановкой" },
  "path-and-displacement": { asset: "path", title: "Забыла блокнот. Вернулась. Никуда не ходила?", caption: "Мио дошла от кабинета до скамейки и вернулась за блокнотом. Конечная точка та же — но прогулка всё-таки была.", alt: "Мио возвращается к двери лаборатории за забытым блокнотом" },
  "average-speed": { asset: "path", title: "Вернулась к двери. Средняя скорость — ноль?", caption: "От двери до скамейки 20 м. Мио прошла туда и обратно: путь 40 м, перемещение ноль. Теперь добавим время этой прогулки.", alt: "Мио вернулась в кабинет за блокнотом; в коридоре видна скамейка" },
  acceleration: { asset: "acceleration", title: "Троллейбус тронулся. Что изменилось?", caption: "Мио держится за поручень и наблюдает начало движения. Разберём модель разгона, а затем сравним её с торможением.", alt: "Мио в троллейбусе держится за поручень и смотрит на улицу" },
} as const satisfies Record<string, { asset: MioScene; title: string; caption: string; alt: string }>;

function WalkModel() {
  const [state, setState] = useState(walkInitial);
  const draft = useLessonDraft("textbook-walk", state, setState, 3);
  const step = state.stage;
  const setStep = (stage: number) => setState(current => ({ ...current, stage }));
  const x = step === 1 ? 430 : 70;
  if (!draft.ready) return <p role="status">Открываю прогулку…</p>;
  return <div className={styles.experiment}>
    <p>В нашей модели от двери до скамейки 20 м. Выбери момент прогулки.</p>
    <div className={styles.controls}>{["У двери", "У скамейки", "Снова у двери"].map((label,index)=><button key={label} aria-pressed={step===index} onClick={()=>setStep(index)}>{label}</button>)}</div>
    <svg className={styles.diagram} viewBox="0 0 500 180" role="img" aria-label={`Мио ${step===1 ? "у скамейки" : "у двери"}; путь ${step * 20} метров; модуль перемещения ${step===1 ? 20 : 0} метров`}>
      <line x1="70" y1="125" x2="430" y2="125" stroke="currentColor" strokeWidth="2" />
      <line x1="70" y1="115" x2="70" y2="135" stroke="currentColor" strokeWidth="2" /><line x1="430" y1="115" x2="430" y2="135" stroke="currentColor" strokeWidth="2" />
      <text x="70" y="164" textAnchor="middle" fill="currentColor" fontSize="16">Дверь</text><text x="430" y="164" textAnchor="middle" fill="currentColor" fontSize="16">Скамейка</text>
      {step > 0 && <g className={styles.routeTrace}><path d="M70 64 H430 l-12 -7 m12 7 l-12 7" fill="none" stroke="var(--action-primary)" strokeWidth="3" /><text x="250" y="55" textAnchor="middle" fill="currentColor" fontSize="15">Туда · 20 м</text></g>}
      {step === 2 && <g className={styles.routeTrace}><path d="M430 99 H70 l12 -7 m-12 7 l12 7" fill="none" stroke="#dca638" strokeWidth="3" /><text x="250" y="91" textAnchor="middle" fill="currentColor" fontSize="15">Обратно · 20 м</text></g>}
      <g className={styles.walker} style={{transform:`translateX(${x}px)`}}><text y="25" textAnchor="middle" fill="currentColor" fontSize="15">Сейчас ↓</text></g>
    </svg>
    <div className={styles.readout} aria-live="polite"><p>Пройденный путь<strong>{step * 20} м</strong></p><p>Модуль перемещения<strong>{step === 1 ? 20 : 0} м</strong></p></div>
    <p className={styles.explanation}>{step === 2 ? "Вернулась в начальную точку: перемещение равно нулю. Но путь — 20 м туда и 20 м обратно, всего 40 м." : step === 1 ? "Пока Мио шла прямо к скамейке, путь и модуль перемещения совпали." : "Это начало отсчёта: Мио ещё не прошла ни одного участка."}</p>
    {step === 2 && <p className={styles.aside}>Мио: «Перемещение ноль. Шагомер с таким отчётом не согласен». Оба правы: они описывают разные величины.</p>}
    {step === 2 && <div className={styles.bridge}><p>Маршрут тот же, но пройти его можно за разное время. Как это изменит среднюю скорость?</p><Link href="/learn/average-speed">Добавить время к прогулке →</Link></div>}
    {draft.error && <p role="alert" className={styles.aside}>{draft.error}</p>}
  </div>;
}

function SpeedModel() {
  const [state, setState] = useState(roundTripInitial);
  const draft = useLessonDraft("textbook-round-trip-speed", state, setState, 1);
  const reading = roundTripReading(state.seconds, state.stop);
  const speed = reading.pathSpeed.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  const approximate = !Number.isInteger(reading.pathSpeed * 100);
  if (!draft.ready) return <p role="status">Открываю опыт…</p>;
  return <div className={styles.experiment}>
    <p>Дверь → скамейка → дверь: 20 м туда и 20 м обратно. Выбери время движения за всю прогулку.</p>
    <div className={styles.controls} aria-label="Время движения">{[10, 20, 40].map(seconds => <button key={seconds} aria-pressed={reading.movingTime === seconds} onClick={() => setState(current => ({ ...current, seconds }))}>{seconds} с</button>)}</div>
    <label className={styles.stopControl}><input type="checkbox" checked={state.stop} onChange={event => setState(current => ({ ...current, stop: event.target.checked }))} />Добавить 10 с остановки у скамейки</label>
    <div className={styles.readout} aria-live="polite">
      <p>Средняя скорость пути<strong>{approximate ? "≈ " : ""}{speed} м/с</strong><small>40 м ÷ {reading.elapsed} с</small></p>
      <p>Модуль средней скорости перемещения<strong>0 м/с</strong><small>0 м ÷ {reading.elapsed} с</small></p>
    </div>
    <p className={styles.explanation}>{state.stop ? `Весь промежуток: ${reading.movingTime} с движения + 10 с остановки = ${reading.elapsed} с. Остановка не добавила пути, но вошла во время прогулки.` : "Путь один и тот же: чем меньше времени заняла прогулка, тем больше средняя скорость пути."} Начало и конец совпадают при любом выбранном времени.</p>
    <p className={styles.aside}>Мио: «Ноль — правильный ответ. Только нужно уточнить, о какой скорости речь».</p>
    <div className={styles.bridge}><h3>А если известны две скорости?</h3><p>На новой поездке Мио записала 2 и 8 м/с. Она предлагает взять их полусумму — 5 м/с. Достаточно ли этих двух чисел?</p><Link href="/practice/average-speed-lesson">Проверить догадку Мио →</Link></div>
    {draft.error && <p role="alert" className={styles.aside}>{draft.error}</p>}
  </div>;
}

function AccelerationModel() {
  const [braking,setBraking] = useState(false);
  const [left,setLeft] = useState(false);
  const sign = left ? -1 : 1;
  const initialSpeed = sign * (braking ? 8 : 2);
  const finalSpeed = sign * (braking ? 2 : 8);
  const acceleration = (finalSpeed-initialSpeed)/3;
  const accelerationLeft = acceleration < 0;
  return <div className={styles.experiment}>
    <p>Положительное направление оси — вправо. На каждом выбранном участке ускорение постоянно.</p>
    <div className={styles.controls}><button aria-pressed={!braking} onClick={()=>setBraking(false)}>Разгон: от 2 до 8 м/с за 3 с</button><button aria-pressed={braking} onClick={()=>setBraking(true)}>Торможение: от 8 до 2 м/с за 3 с</button></div>
    <label className={styles.stopControl}><input type="checkbox" checked={left} onChange={event=>setLeft(event.target.checked)}/>Троллейбус едет влево</label>
    <div className={styles.vectorRow}><strong>Скорость</strong><DirectionArrow left={left} label={`Скорость ${left ? "влево" : "вправо"}`} /></div>
    <div className={styles.vectorRow}><strong>Ускорение</strong><DirectionArrow left={accelerationLeft} label={`Ускорение ${accelerationLeft ? "влево" : "вправо"}`} gold /></div>
    <p className={styles.aside}>Стрелки показывают направления, их длины не сравнивают скорость с ускорением.</p>
    <p className={styles.explanation} aria-live="polite">v₀ₓ = {initialSpeed} м/с; vₓ = {finalSpeed} м/с. aₓ = ({finalSpeed} − ({initialSpeed})) / 3 = {acceleration} м/с². {braking ? "Скорость и ускорение противоположны: троллейбус замедляется." : "Скорость и ускорение сонаправлены: троллейбус разгоняется."}</p>
    <p className={styles.aside}>{left && !braking ? "Мио: «Минус есть. Торможения нет». При разгоне влево проекция ускорения отрицательна." : "Мио: «Сначала посмотрю, куда направлены оба вектора. Один знак ещё не вся история»."}</p>
  </div>;
}

function DirectionArrow({left,label,gold=false}:{left:boolean;label:string;gold?:boolean}) {
  return <svg viewBox="0 0 240 48" role="img" aria-label={label}><g stroke={gold ? "#dca638" : "var(--action-primary)"} strokeWidth="4" fill="none"><path d={left ? "M220 24 H20 L36 12 M20 24 L36 36" : "M20 24 H220 L204 12 M220 24 L204 36"} /></g></svg>;
}

export function TextbookScene({chapterId}:{chapterId:string}) {
  if (chapterId === "physical-body-phenomenon-quantity") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио о языке физики"><PhysicsLanguageModel /></section>;
  }
  if (chapterId === "scientific-method") {
    return <section className={styles.scene} aria-label="Исследование Мио о проверке гипотезы"><ScientificMethodModel /></section>;
  }
  if (chapterId === "si-units-and-operations") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио об основных единицах СИ"><SIUnitsModel /></section>;
  }
  if (chapterId === "particle-model-and-diffusion") {
    return <section className={styles.scene} aria-label="Разбор наблюдений, подтверждающих частичное строение вещества"><ParticleEvidenceModel /></section>;
  }
  if (chapterId === "states-temperature-expansion") {
    return <section className={styles.scene} aria-label="Исследование состояний вещества, теплового расширения и температуры"><MatterStatesModel /></section>;
  }
  if (chapterId === "gas-pressure-and-pascal") {
    return <section className={styles.scene} aria-label="Опыт о давлении газа и передаче давления жидкостью"><GasPressurePascalModel /></section>;
  }
  if (chapterId === "atmospheric-pressure") {
    return <section className={styles.scene} aria-label="Опыт с изменением атмосферного давления при подъёме"><AtmosphericPressureModel /></section>;
  }
  if (chapterId === "archimedes-force") {
    return <section className={styles.scene} aria-label="Опыт с выталкивающей силой"><ArchimedesForceModel /></section>;
  }
  if (chapterId === "electric-current-and-ohms-law") {
    return <section className={styles.scene} aria-label="Опыт Мио с напряжением, сопротивлением и силой тока"><ElectroPredictionScene caption="Мио оставляет напряжение неизменным. Меняй сопротивление и сравнивай показание амперметра." /><ElectroResistanceExperiment /></section>;
  }
  if (chapterId === "reflection-of-light") {
    return <section className={styles.scene} aria-label="Опыт с законом отражения света"><ReflectionTextbookExperiment /></section>;
  }
  if (chapterId === "newton-second-law") {
    return <section className={styles.scene} aria-label="Опыт о связи силы, массы и ускорения"><NewtonSecondLawTextbookExperiment /></section>;
  }
  if (chapterId === "heat-amount-and-balance") {
    return <section className={styles.scene} aria-label="Графический опыт о количестве теплоты"><HeatAmountModel /></section>;
  }
  if (chapterId === "fuel-combustion") {
    return <section className={styles.scene} aria-label="Сравнение энергии полного сгорания топлива"><FuelCombustionLab /></section>;
  }
  if (chapterId === "internal-energy-and-heat-transfer") {
    return <section className={styles.scene} aria-label="Сравнение способов теплопередачи"><HeatTransferExplorer /></section>;
  }
  if (chapterId === "melting-and-crystallization") {
    return <section className={styles.scene} aria-label="Графический опыт с нагреванием и плавлением льда"><IceMeltingModel /></section>;
  }

  if (chapterId === "evaporation-and-boiling") {
    return <section className={styles.scene} aria-label="Исследование испарения и кипения воды"><EvaporationBoilingLab /></section>;
  }
  if (!(chapterId in stories)) return null;
  if (chapterId === "force-and-dynamometer") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио и динамометром"><ForceModel /></section>;
  }
  if (chapterId === "gravity-elasticity-weight") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио о силе тяжести, упругости и весе"><GravityWeightModel /></section>;
  }
  if (chapterId === "resultant-force-and-friction") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио о равнодействующей и сопротивлении движению"><ResultantFrictionModel /></section>;
  }
  if (chapterId === "hydrostatic-pressure") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио о гидростатическом давлении"><HydrostaticPressureModel /></section>;
  }
  if (chapterId === "mechanical-work") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио о механической работе"><MechanicalWorkModel /></section>;
  }
  if (chapterId === "mechanical-efficiency") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио о коэффициенте полезного действия"><MechanicalEfficiencyModel /></section>;
  }
  if (chapterId === "mechanical-power") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио о механической мощности"><MechanicalPowerModel /></section>;
  }
  if (chapterId === "kinetic-energy") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио о кинетической энергии"><KineticEnergyModel /></section>;
  }
  if (chapterId === "potential-energy") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио о потенциальной энергии"><PotentialEnergyModel /></section>;
  }
  if (chapterId === "mechanical-energy-conservation") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио о сохранении механической энергии"><MechanicalEnergyModel /></section>;
  }
  if (chapterId === "reading-scales") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио и мензуркой"><MeasurementModel /></section>;
  }
  if (chapterId === "pressure") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио и опытом о давлении"><PressureModel /></section>;
  }
  if (chapterId === "inertia") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио и опытом об инерции"><InertiaModel /></section>;
  }
  if (chapterId === "density") {
    return <section className={styles.scene} aria-label="Наблюдение с Мио и опытом о плотности"><DensityModel /></section>;
  }
  const story=stories[chapterId as keyof typeof stories];
  return <section className={styles.scene} aria-label="История и модель с Мио">
    <figure className={styles.illustration}><Image className={styles.art} src={MIO_SCENES[story.asset]} alt={story.alt} width={1536} height={1024} sizes="(max-width:640px) 100vw, 450px" priority /><figcaption className={styles.caption}><h2>{story.title}</h2><p>{story.caption}</p></figcaption></figure>
    {chapterId==="relative-motion"?<RelativeMotionModel/>:chapterId==="path-and-displacement"?<WalkModel/>:chapterId==="average-speed"?<SpeedModel/>:chapterId==="acceleration"?<AccelerationModel/>:chapterId==="uniform-motion-graphs"?<UniformMotionGraphModel/>:chapterId==="uneven-motion"?<UnevenMotionModel/>:null}
  </section>;
}

