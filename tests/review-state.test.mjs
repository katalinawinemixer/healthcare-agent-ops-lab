import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
// Execute the real review initialization and policy without the rendering layer.
const initialization = source.slice(0, source.indexOf("const els ="));
const storageLoader = source.slice(source.indexOf("function loadPersistedReviews()"), source.indexOf("function persistReviews()"));
const policy = source.slice(source.indexOf("function currentCase()"), source.indexOf("function loadPersistedReviews()"))
  + source.slice(source.indexOf("function approvalBlockers()"), source.indexOf("function riskTone("));

function restore(raw, storageThrows = false) {
  const context = vm.createContext({
    localStorage: { getItem() { if (storageThrows) throw new Error("Storage unavailable"); return raw; } },
  });
  vm.runInContext(initialization + storageLoader + policy, context);
  return expression => JSON.parse(vm.runInContext(`JSON.stringify(${expression})`, context));
}

for (const raw of ["null", "[]", "5", '"old data"', "{broken"]) {
  test(`invalid storage container ${raw} falls back to defaults`, () => {
    const read = restore(raw);
    assert.equal(read("scoreFromRubric()"), 88);
    assert.deepEqual(read("state.tags"), []);
  });
}

test("unavailable local storage does not prevent a review", () => {
  assert.equal(restore(null, true)("state.decision"), "approve");
});

test("invalid saved fields cannot crash review controls or produce an invalid score", () => {
  const read = restore(JSON.stringify({
    "benefits-copay": { decision: "unknown", rubric: { accuracy: 100, grounding: null, empathy: "5", privacy: 4.5, workflow: 0, extra: 100 }, tags: null, notes: {} },
  }));
  assert.equal(read("scoreFromRubric()"), 88);
  assert.equal(read("state.decision"), "approve");
  assert.deepEqual(read("state.tags"), []);
  assert.equal(typeof read("state.notes"), "string");
});

test("valid partial saved reviews retain missing rubric defaults", () => {
  const read = restore(JSON.stringify({
    "benefits-copay": { rubric: { accuracy: 3 }, notes: "Check the plan year.", tags: ["privacy", "unknown", "privacy", 4] },
  }));
  assert.equal(read("scoreFromRubric()"), 84);
  assert.equal(read("state.notes"), "Check the plan year.");
  assert.deepEqual(read("state.tags"), ["privacy"]);
  assert.equal(read("(enforceDecisionPolicy(), state.decision)"), "escalate");
});
