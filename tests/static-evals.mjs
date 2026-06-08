import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");

const casesMatch = appSource.match(/const cases = (\[[\s\S]*?\]);\n\nconst rubricLabels/);
const evidenceMatch = appSource.match(/const evidenceCatalog = ({[\s\S]*?});\n\nconst checklist/);

if (!casesMatch || !evidenceMatch) {
  throw new Error("Could not extract cases or evidence catalog from app.js");
}

const cases = Function(`return ${casesMatch[1]}`)();
const evidenceCatalog = Function(`return ${evidenceMatch[1]}`)();
const failures = [];

if (cases.length < 5) failures.push(`expected at least 5 cases, got ${cases.length}`);

for (const testCase of cases) {
  if ("sourceCoverage" in testCase) failures.push(`${testCase.id} has manual sourceCoverage drift risk`);
  if (!testCase.id || !testCase.domain || !testCase.title || !testCase.summary) {
    failures.push(`${testCase.id || "unknown"} missing identity fields`);
  }
  if (!["Medium", "High", "Critical"].includes(testCase.risk)) {
    failures.push(`${testCase.id} invalid risk: ${testCase.risk}`);
  }

  const sources = testCase.messages.flatMap((message) => message.sources || []);
  if (!sources.length) failures.push(`${testCase.id} lacks sourced agent output`);
  for (const source of sources) {
    if (!evidenceCatalog[source]) failures.push(`${testCase.id} missing evidence record for ${source}`);
  }

  if ((testCase.evals || []).length < 3) failures.push(`${testCase.id} needs at least 3 evals`);
  for (const evalCase of testCase.evals || []) {
    if ("score" in evalCase) failures.push(`${testCase.id}/${evalCase.scenario} has hand-authored score`);
    for (const field of ["scenario", "workflow", "risk", "expected"]) {
      if (!evalCase[field]) failures.push(`${testCase.id} eval missing ${field}`);
    }
  }
  if ((testCase.risks || []).length < 2) failures.push(`${testCase.id} needs at least 2 risk-register entries`);

  for (const [key, value] of Object.entries(testCase.rubric || {})) {
    if (value < 1 || value > 5) failures.push(`${testCase.id} rubric ${key} out of range: ${value}`);
  }
}

const allText = JSON.stringify(cases);
const identifierPatterns = [
  /\b\d{3}-\d{2}-\d{4}\b/,
  /\b[A-Z]{2}\d{6,}\b/,
  /\b\d{9,}\b/,
];
for (const pattern of identifierPatterns) {
  if (pattern.test(allText)) failures.push(`possible identifier-like pattern found: ${pattern}`);
}

for (const marker of [
  "function approvalBlockers",
  "function enforceDecisionPolicy",
  "button.disabled = disabled",
  "sourceCoverage()",
  "approvalBlockers()",
  "function evaluateEvalCase",
  "function evalAssertions",
  "result.passed",
]) {
  if (!appSource.includes(marker)) failures.push(`missing implementation marker: ${marker}`);
}

const evalRows = cases.reduce((sum, testCase) => sum + testCase.evals.length, 0);

const result = {
  status: failures.length ? "fail" : "pass",
  cases: cases.length,
  evalRows,
  evidenceRecords: Object.keys(evidenceCatalog).length,
  scoreMode: "computed from assertions in app.js",
  failures,
};

console.log(JSON.stringify(result, null, 2));

if (failures.length) process.exit(1);
