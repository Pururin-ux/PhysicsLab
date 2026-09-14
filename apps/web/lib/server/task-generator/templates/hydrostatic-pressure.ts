import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function pressure(p:Params){return p.rho*10*p.h/1000;}

export const hydrostaticPressureBlueprint:TaskBlueprint={
  id:"hydrostatic-pressure",skill:"Гидростатическое давление",topic:"Динамика",group:"dynamics",difficulty:1,
  params:{rho:{min:700,max:1400,step:100,unit:"кг/м³"},h:{min:0.5,max:10,step:0.5,unit:"м"}},
  formula:"p=\\rho gh",answerUnit:"кПа",answerKind:"positive",solver:pressure,
  distractors:[
    {label:"не перевёл паскали в килопаскали",compute:p=>pressure(p)*1000},
    {label:"разделил на g вместо умножения",compute:p=>pressure(p)/100},
    {label:"принял метры глубины за сантиметры",compute:p=>pressure(p)*100},
  ],
  textTemplate:p=>`Неподвижная жидкость плотностью ${p.rho} кг/м³ имеет глубину ${formatAnswerValue(p.h)} м. Примите g = 10 Н/кг. Найдите гидростатическое давление на этой глубине в килопаскалях.`,
  explanationTemplate:(p,a)=>`$p=\\rho gh=${p.rho}\\cdot10\\cdot${formatMathValue(p.h)}=${formatMathValue(a*1000)}$ Па = ${formatMathValue(a)} кПа. Площадь и форма сосуда в эту формулу не входят.`,
  trap:"Путает глубину с объёмом или не переводит паскали в килопаскали.",
  coachLines:{correct:p=>`Да. Давление задают плотность ${p.rho} кг/м³ и глубина ${formatAnswerValue(p.h)} м.`,wrong:(p,s,c)=>`Используй p = ρgh и раздели паскали на 1000: получится ${formatAnswerValue(c)} кПа, а не ${formatAnswerValue(s)} кПа.`}
};
