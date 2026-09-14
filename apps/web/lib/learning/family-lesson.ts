import type {TemplateId} from "../server/task-generator/generate.ts";

// Only link lessons that teach this family's actual skill. A broad topic route
// must not be used as a substitute for an explanation that does not exist yet.
const lessons:Partial<Record<TemplateId,{href:string;label:string}>>={
  "archimedes-force":{href:"/learn/archimedes-force",label:"Учебник: почему вода выталкивает тело"},
  "relative-velocity-vectors":{href:"/learn/relative-motion",label:"Учебник: сложение скоростей"},
  "vt-slope":{href:"/practice/kinematics-lesson",label:"Урок: ускорение и график скорости"},
  "average-speed-segments":{href:"/practice/average-speed-lesson",label:"Разобраться в опыте с Мио"},
  "average-speed-with-stop":{href:"/learn/uneven-motion",label:"Учебник: весь путь и всё время"},
  "gravity-force":{href:"/learn/gravity-elasticity-weight",label:"Учебник: тяжесть, упругость и вес"},
  "resultant-force":{href:"/learn/resultant-force-and-friction",label:"Учебник: равнодействующая и трение"},
  "hydrostatic-pressure":{href:"/learn/hydrostatic-pressure",label:"Учебник: давление жидкости на глубине"},
  "work-force-distance":{href:"/learn/mechanical-work",label:"Учебник: механическая работа"},
  "mechanical-power":{href:"/learn/mechanical-power",label:"Учебник: механическая мощность"},
  "mechanical-efficiency":{href:"/learn/mechanical-efficiency",label:"Учебник: коэффициент полезного действия"},
  "kinetic-energy":{href:"/learn/kinetic-energy",label:"Учебник: кинетическая энергия"},
  "gravitational-potential-energy":{href:"/learn/potential-energy",label:"Учебник: потенциальная энергия"},
  "mechanical-energy-conservation":{href:"/learn/mechanical-energy-conservation",label:"Учебник: превращение и сохранение энергии"},
  "newton-second":{href:"/learn/newton-second-law",label:"Учебник: сила, масса и ускорение"},
  "density-volume-ratio":{href:"/learn/density",label:"Учебник: масса, объём и плотность"},
  "contact-pressure":{href:"/learn/pressure",label:"Учебник: давление на опору"},
  "reflection-angle":{href:"/learn/reflection-of-light",label:"Учебник: закон отражения света"},
  "ohm-law":{href:"/learn/electric-current-and-ohms-law",label:"Учебник: ток, напряжение и сопротивление"},
  "heat-amount":{href:"/learn/heat-amount-and-balance",label:"Учебник: количество теплоты"},
  "heat-balance-simple":{href:"/learn/heat-amount-and-balance",label:"Учебник: тепловой баланс"},
  "phase-change-heat":{href:"/learn/melting-and-crystallization",label:"Учебник: нагревание и плавление"},
  "vaporization-heat":{href:"/learn/evaporation-and-boiling",label:"Учебник: испарение и кипение"},
};
export function getFamilyLesson(family:TemplateId){return lessons[family]??null;}


