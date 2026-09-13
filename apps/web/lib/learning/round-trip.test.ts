import test from "node:test";
import assert from "node:assert/strict";
import { roundTripInitial, roundTripReading, walkInitial } from "./round-trip.ts";
import { lessonDraftCodec, lessonDraftExportCodecs, restoreLessonDraft } from "./lesson-draft.ts";
import { decodeStoredValue } from "../stores/storage-envelope.ts";

test("closed walk keeps nonzero path speed and zero displacement speed", () => {
  for (const seconds of [10, 20, 40]) {
    for (const stop of [false, true]) {
      const result = roundTripReading(seconds, stop);
      assert.equal(result.distance, 40);
      assert.equal(result.displacement, 0);
      assert.equal(result.elapsed, seconds + (stop ? 10 : 0));
      assert.equal(result.pathSpeed * result.elapsed, 40);
      assert.equal(result.displacementSpeed, 0);
      if (stop) assert.ok(result.pathSpeed < roundTripReading(seconds, false).pathSpeed);
    }
  }
  for (const seconds of [0, -1, Infinity, NaN, 15]) {
    assert.equal(roundTripReading(seconds, false).pathSpeed, 2);
  }
});

test("both scene drafts participate in backup and restore their controls", () => {
  const fixtures = [
    { id: "textbook-walk", defaults: walkInitial, count: 3, saved: { ...walkInitial, stage: 2 } },
    { id: "textbook-round-trip-speed", defaults: roundTripInitial, count: 1, saved: { ...roundTripInitial, seconds: 40, stop: true } },
  ];
  for (const { id, defaults, count, saved } of fixtures) {
    const exportCodec = lessonDraftExportCodecs.find(codec => codec.key === `physicslab-lesson-draft-${id}`);
    assert.ok(exportCodec);
    const raw = JSON.stringify({ version: 1, data: saved });
    const exported = decodeStoredValue(exportCodec, raw);
    assert.ok(exported.ok);
    const restored = decodeStoredValue(lessonDraftCodec(id, defaults, count), raw);
    assert.ok(restored.ok);
    assert.deepEqual(restored.value, saved);
    assert.equal(restoreLessonDraft({ ...saved, stage: count }, defaults, count), null);
  }
});
