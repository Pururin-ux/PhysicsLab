import assert from "node:assert/strict";
import test from "node:test";
import { GRADUATED_SCALE_ACTUAL_VOLUME_ML } from "./graduated-scale-model.ts";
import {
  PARALLAX_MENISCUS_Y,
  PARALLAX_TOP_EYE_Y,
  PARALLAX_TOP_READING_ML,
  scaleValueAtY,
  sightLineAtScale,
} from "./scientific-method-parallax.ts";

test("raising only the eye changes the apparent reading, not the water level", () => {
  assert.equal(PARALLAX_MENISCUS_Y, 100);
  assert.equal(sightLineAtScale(PARALLAX_TOP_EYE_Y), 70);
  assert.equal(PARALLAX_TOP_READING_ML, 35);
  assert.equal(sightLineAtScale(PARALLAX_MENISCUS_Y), PARALLAX_MENISCUS_Y);
  assert.equal(scaleValueAtY(PARALLAX_MENISCUS_Y), GRADUATED_SCALE_ACTUAL_VOLUME_ML);
});
