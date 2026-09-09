import assert from "node:assert/strict";
import test from "node:test";
import {contactPressureBlueprint as blueprint} from "./contact-pressure.ts";
import {generateTasks} from "../generate.ts";

test("pressure uses all supports and preserves intermediate square-metre precision",()=>{
  const p={pressure:40,area:5,supports:3};
  assert.equal(blueprint.solver(p),40);
  assert.ok(blueprint.explanationTemplate);
  assert.match(blueprint.explanationTemplate(p,40),/0\{,\}0015/);
});
test("generated pressure answers agree with independent SI conversion",()=>{
  const units=new Set<string>();
  const situations=new Set<string>();
  for(const item of generateTasks("contact-pressure",30)){
    units.add(item.answerUnit);
    const p=item.params;
    const situation=JSON.stringify(p);
    assert.ok(!situations.has(situation),"inverse tasks must use a new numerical situation");
    situations.add(situation);
    const totalArea=p.supports*p.area;
    const expected=item.answerUnit==="Н"?p.pressure*1000*totalArea*1e-4:item.answerUnit==="см²"?totalArea:p.pressure;
    assert.ok(Math.abs(item.answerValue-expected)<=0.000501);
    assert.ok(["кПа","Н","см²"].includes(item.answerUnit));
    assert.equal(new Set(item.options.map(option=>option.value)).size,4);
  }
  assert.deepEqual([...units].sort(),["Н","кПа","см²"].sort());
});
