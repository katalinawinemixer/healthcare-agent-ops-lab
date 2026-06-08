# Healthcare Agent Ops Lab

Healthcare Agent Ops Lab is a small review workspace for testing synthetic
healthcare agent responses before they are approved.

I built it around a reviewer workflow: compare an agent response against source
evidence, tag failure modes, score behavior across safety and usefulness
criteria, and block approval when a response crosses a risk boundary.

The project explores a practical question: how do you make healthcare agent risk
visible enough for a human reviewer to catch problems before the response reaches
a patient, member, or operations team?

## Live Demo

```text
https://katalinawinemixer.github.io/healthcare-agent-ops-lab/
```

## Screenshots

![Healthcare Agent Ops Lab review workspace](docs/assets/screenshots/review-workspace.png)

![Healthcare Agent Ops Lab eval matrix](docs/assets/screenshots/eval-matrix.png)

## Review Workflow

The lab uses synthetic cases across benefits, billing, patient access, prior
authorization, and clinical-trial navigation. Each case includes a user request,
agent response, source references, expected behavior, and review risks.

The reviewer can:

- Inspect the transcript and the evidence ledger behind each source reference.
- Score the response for accuracy, grounding, empathy, privacy, and workflow
  completion.
- Tag failure modes such as ungrounded claims, privacy risk, empathy gaps,
  workflow misses, and missing handoffs.
- Decide whether to approve, revise, or escalate the response.
- Save notes and review state locally in the browser.
- Export a JSON review record.

## Evals

The eval matrix turns each scenario into explicit assertions against the
synthetic agent output. Instead of treating every scenario as a pass/fail demo,
the rows check whether the response uses audited sources, avoids unsupported
certainty, names data-access boundaries, minimizes sensitive data, and includes
handoff paths for higher-risk workflows.

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

## What I Would Build Next

- Move scenario fixtures into structured JSON and run evals from a backend.
- Add reviewer accounts and immutable audit history.
- Track source freshness, owner, and policy status in the evidence ledger.
- Add adversarial cases for prompt injection, pasted PHI, and conflicting source
  documents.
- Support exports for product, implementation, and customer-success review.

## Data Boundary

All examples are synthetic. The project intentionally avoids real PHI, real
member IDs, real claims, real patient records, or live healthcare system access.

## No License

No license is included. The code is visible for review and learning, but reuse is
not granted unless a license is added later.
