import type {Params,TaskBlueprint} from "../types.ts";
import {variantIndex} from "../solver.ts";
import {formatAnswerValue,formatMathValue} from "../validator.ts";

const target=(p:Params)=>variantIndex(p,3);
const totalArea=(p:Params)=>p.area*p.supports;
const force=(p:Params)=>p.pressure*totalArea(p)/10;
const exact=(n:number)=>String(n).replace(".","{,}");
const answer=(p:Params)=>target(p)===0?p.pressure:target(p)===1?force(p):totalArea(p);
const conditions="Сила направлена перпендикулярно поверхности и равномерно распределена по всей площади контакта.";

export const contactPressureBlueprint:TaskBlueprint={
  id:"contact-pressure",skill:"Давление на опору",topic:"Динамика",group:"dynamics",difficulty:1,
  params:{pressure:{min:2,max:30,step:2,unit:"кПа"},area:{min:5,max:30,step:5,unit:"см²"},supports:{min:2,max:4,step:1,unit:""}},
  formula:"p=\\frac{F}{S}",answerUnit:p=>["кПа","Н","см²"][target(p)],answerKind:"positive",variantCount:3,
  // Один набор чисел используется для одной искомой величины: соседняя
  // обратная задача не раскрывается условием уже решённой задачи.
  constraints:[p=>target(p)===(p.pressure/2+p.area/5+p.supports)%3],
  solver:answer,
  distractors:[
    {label:"перепутал площадь одной опоры с общей",compute:p=>target(p)===0?answer(p)*p.supports:answer(p)/p.supports},
    {label:"не согласовал квадратные единицы и килопаскали",compute:p=>target(p)===1?answer(p)*10:answer(p)/10},
    {label:"лишний раз учёл число опор",compute:p=>target(p)===0?answer(p)/p.supports:target(p)===1?answer(p)/(p.supports*p.supports):answer(p)*p.supports},
  ],
  textTemplate:p=>{
    const supports=`У неё ${p.supports} одинаковые опоры площадью по ${p.area} см².`;
    if(target(p)===1)return `Платформа создаёт давление ${p.pressure} кПа. ${supports} ${conditions} Найдите полную силу давления в ньютонах.`;
    if(target(p)===2)return `Платформа действует на поверхность полной силой ${formatAnswerValue(force(p))} Н и создаёт давление ${p.pressure} кПа. У неё ${p.supports} одинаковые опоры. ${conditions} Найдите суммарную площадь контакта всех опор в см².`;
    return `Платформа действует на горизонтальную поверхность полной силой ${formatAnswerValue(force(p))} Н. ${supports} ${conditions} Найдите давление в кПа.`;
  },
  explanationTemplate:(p,value)=>{
    const areaSI=exact(totalArea(p)/10000);
    if(target(p)===1)return `Общая площадь $S=${p.supports}\\cdot${p.area}=${totalArea(p)}$ см² $=${areaSI}$ м². Переводим давление: $p=${p.pressure*1000}$ Па. Полная сила $F=pS=${p.pressure*1000}\\cdot${areaSI}=${formatMathValue(value)}$ Н.`;
    if(target(p)===2)return `Выразим общую площадь: $S=F/p$. Давление $p=${p.pressure*1000}$ Па, поэтому $S=${formatMathValue(force(p))}/${p.pressure*1000}=${areaSI}$ м² $=${formatMathValue(value)}$ см². Это площадь всех опор: повторно умножать её на число опор не нужно.`;
    return `Общая площадь $S=${p.supports}\\cdot${p.area}=${totalArea(p)}$ см² $=${areaSI}$ м². Давление $p=F/S=${formatMathValue(force(p))}/${areaSI}=${p.pressure*1000}$ Па $=${formatMathValue(value)}$ кПа. Полную силу делят на суммарную площадь всех опор.`;
  },
  trap:"Путает полную силу, площадь одной опоры и суммарную площадь контакта.",
  coachLines:{correct:p=>target(p)===1?"Верно: полная сила равна давлению, умноженному на общую площадь опор.":target(p)===2?"Верно: общая площадь равна полной силе, делённой на давление.":"Верно: полную силу делим на суммарную площадь контакта, затем переводим Па в кПа.",wrong:()=>"Вырази искомую величину из p=F/S. Здесь F — полная сила, S — общая площадь. Проверь: 1 см² = 0,0001 м²; 1 кПа = 1000 Па."},
};
