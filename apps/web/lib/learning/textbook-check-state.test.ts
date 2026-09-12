import assert from "node:assert/strict";
import test from "node:test";
import {checkQuestionKey,classifyTextbookCheck} from "./textbook-check-state.ts";
const check={question:"Какой ответ?",options:["A","B"],correct:1,feedback:["Нет","Да"]};
test("only a checked answer to the current question is classified as correct",()=>{
  const data={questionKey:checkQuestionKey(check),answer:"B",checked:true};
  assert.equal(classifyTextbookCheck(check,null),"untouched");
  assert.equal(classifyTextbookCheck(check,data),"correct");
  assert.equal(classifyTextbookCheck(check,{...data,checked:false}),"draft");
  assert.equal(classifyTextbookCheck(check,{...data,answer:"A"}),"retry");
  assert.equal(classifyTextbookCheck({...check,question:"Новый вопрос"},data),"updated");
  assert.equal(classifyTextbookCheck(check,{...data,answer:"deleted"}),"unavailable");
});
