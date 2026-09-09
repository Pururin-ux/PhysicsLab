import assert from "node:assert/strict";
import test from "node:test";
import {densityVolumeRatioBlueprint as blueprint} from "./density-volume-ratio.ts";

test("density explanation distinguishes rounded ratios from exact ones",()=>{
  const rounded={rho1:1,a1:3,rho2:2,a2:4};
  const exact={rho1:2,a1:2,rho2:1,a2:2};
  assert.ok(blueprint.explanationTemplate);
  assert.match(blueprint.explanationTemplate(rounded,27/128),/\\approx 0\{,\}211/);
  assert.doesNotMatch(blueprint.explanationTemplate(exact,2),/\\approx/);
});
