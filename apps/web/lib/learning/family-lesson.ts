import type {TemplateId} from "../server/task-generator/generate.ts";

// Only link lessons that teach this family's actual skill. A broad topic route
// must not be used as a substitute for an explanation that does not exist yet.
const lessons:Partial<Record<TemplateId,{href:string;label:string}>>={
  "relative-velocity-vectors":{href:"/learn/relative-motion",label:"Учебник: сложение скоростей"},
  "vt-slope":{href:"/practice/kinematics-lesson",label:"Урок: ускорение и график скорости"},
  "average-speed-segments":{href:"/practice/average-speed-lesson",label:"Разобраться в опыте с Мио"},
  "newton-second":{href:"/practice/dynamics-lesson",label:"Урок: сила, масса и ускорение"},
  "density-volume-ratio":{href:"/learn/density",label:"Учебник: масса, объём и плотность"},
  "contact-pressure":{href:"/learn/pressure",label:"Учебник: давление на опору"},
  "reflection-angle":{href:"/practice/optics-lesson",label:"Урок: закон отражения света"},
  "ohm-law":{href:"/practice/electro-lesson",label:"Урок: ток, напряжение и сопротивление"},
};
export function getFamilyLesson(family:TemplateId){return lessons[family]??null;}


