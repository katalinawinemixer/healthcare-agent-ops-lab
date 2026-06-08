# Healthcare Agent Ops Lab

A standalone portfolio prototype for reviewing healthcare AI agent behavior
across sensitive payer, provider, billing, authorization, patient-access, and
clinical-trial workflows.

The project is designed as a hiring artifact for healthcare AI agent, product
ops, implementation, and agent-development roles. It shows how I think about
source grounding, PHI minimization, escalation, human review, and evals before an
agent is trusted in a regulated workflow.

## Live Demo

```text
https://katalinawinemixer.github.io/healthcare-agent-ops-lab/
```

## Screenshots

![Healthcare Agent Ops Lab review workspace](docs/assets/screenshots/review-workspace.png)

![Healthcare Agent Ops Lab eval matrix](docs/assets/screenshots/eval-matrix.png)

## What It Demonstrates

- Agent behavior review with source-grounded transcript examples.
- Human QA decisions: approve, revise, or escalate.
- Rubric scoring across accuracy, grounding, empathy, privacy, and workflow
  completion.
- Failure-mode tagging for ungrounded claims, privacy risk, empathy gaps,
  workflow misses, and missing handoffs.
- A scenario-driven eval matrix for realistic healthcare scenarios, with row
  scores computed from explicit assertions against the synthetic agent output.
- A visible evidence ledger for every source referenced in the transcript.
- A build playbook that maps discovery, design, evaluation, and operations.
- Local review persistence with `localStorage`.
- Exportable JSON review records.

## Open Locally

Open `index.html` in a browser.

This prototype has no build step and uses no external dependencies. It is meant
to be portable into a larger React/Vite repo later if needed.

## Run Evals

```bash
node tests/static-evals.mjs
```

The static eval checks scenario count, evidence records for every displayed
source, rubric bounds, synthetic identifier patterns, absence of hand-authored
eval scores, and the approval-gating / assertion-runner implementation markers.

## Safety Gates

The review UI blocks approval when the rubric score is below 85, a critical case
requires escalation, a privacy/ungrounded/missing-handoff failure is tagged, or
the displayed transcript references a source without an evidence record.

Reviewer notes, tags, rubric changes, and decisions persist locally in the
browser with `localStorage` so a reviewer can move between cases or reload
without losing the current review state.

## Case Study

Read the project write-up: [docs/case-study.md](docs/case-study.md).

## Adversarial Review

This project was reviewed with adversarial sub-agents during development. The
first pass found unsafe approval, declarative evals, weak source auditability,
non-persistent review state, mobile ordering issues, search empty-state issues,
and incomplete tab semantics. Those issues were fixed, tested, and re-reviewed.
The final adversarial verification found no P0/P1 blockers.

## Data Boundary

All examples are synthetic. The project intentionally avoids real PHI, real
member IDs, real claims, real patient records, or live healthcare system access.

## No License

No license is included. The code is visible for review and learning, but reuse is
not granted unless a license is added later.
