import type {TextbookChapter} from "./textbook.ts";

export type TextbookCheckState = "untouched" | "draft" | "retry" | "correct" | "updated" | "unavailable";
export function checkQuestionKey(check:TextbookChapter["check"]){return JSON.stringify([check.question,check.options]);}
export function classifyTextbookCheck(check:TextbookChapter["check"],data:Record<string,unknown>|null):TextbookCheckState{
  if(!data) return "untouched";
  if(data.questionKey!==checkQuestionKey(check)) return "updated";
  if(data.answer==="") return "untouched";
  const index=typeof data.answer==="string"?check.options.indexOf(data.answer):-1;
  if(index<0||typeof data.checked!=="boolean") return "unavailable";
  if(!data.checked) return "draft";
  return index===check.correct?"correct":"retry";
}
