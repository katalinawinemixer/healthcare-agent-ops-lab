# Case Study: Healthcare Agent Ops Lab

## Problem

Healthcare AI agents fail in ways that generic chatbot demos often hide. A
benefits answer can overstate cost certainty. A billing answer can accidentally
turn an explanation of benefits into payment advice. A scheduling flow can drift
into symptom triage. A trial-navigation assistant can sound like it is making an
eligibility determination.

This prototype asks a practical question: what would a lightweight review and
eval surface need to show before a healthcare agent response could be trusted?

## Scope

The lab uses synthetic scenarios across five workflows:

- Benefits and cost-share questions.
- Explanation-of-benefits and billing confusion.
- Patient-access intake with urgent symptom boundaries.
- Prior authorization status education.
- Clinical-trial eligibility pre-screening.

The app does not connect to live payer, provider, EHR, claims, scheduling, or
trial systems. It intentionally avoids real PHI and real patient/member records.

## Product Decisions

The interface is built around a human reviewer rather than an end-user chat
surface. That makes the important work visible:

- Transcript review shows what the agent said and which sources it used.
- Evidence ledger records source name, type, version, and excerpt.
- Rubric scoring separates accuracy, grounding, empathy, privacy, and workflow
  completion.
- Safety gates block approval when the score is low, a critical case requires
  escalation, or privacy / ungrounded / missing-handoff failures are tagged.
- Eval rows are scored from explicit assertions against the synthetic agent
  output instead of hand-authored row scores.

## Evaluation Approach

Each scenario includes expected behavior and synthetic agent output. The eval
runner checks for practical assertions such as:

- Uses at least one audited source.
- Avoids guaranteed outcomes.
- Shows source grounding when required.
- Names uncertainty or data-access boundaries.
- Includes escalation or human handoff paths for higher-risk workflows.
- Minimizes sensitive data collection.
- Refuses diagnosis or eligibility determination where appropriate.

The goal is not to claim production-grade clinical validation. The goal is to
show the shape of an agent-development workflow: define risky scenarios, encode
expected behavior, evaluate outputs, tag failures, and preserve reviewer notes.

## Safety And Compliance Framing

This is a synthetic portfolio prototype, not clinical, billing, or coverage
software. It demonstrates design judgment around regulated workflows:

- Avoid collecting unnecessary medical or member-identifying details.
- Do not diagnose, triage, guarantee costs, determine eligibility, or predict
  authorization outcomes.
- Escalate urgent symptoms and high-risk operational ambiguity.
- Keep source gaps visible to the reviewer.
- Separate demo behavior from authenticated live-system access.

## What This Proves

For healthcare AI agent roles, the point is not merely that I can assemble a UI.
The point is that I can translate operational healthcare failure modes into
reviewable product behavior:

- I understand how clinical/regulatory workflows create software risk.
- I can define safety gates and review criteria instead of relying on vague
  trust in a model response.
- I can use synthetic data responsibly to prototype regulated workflows.
- I can build and test a small product surface that exposes evidence,
  uncertainty, escalation, and human oversight.

## What I Would Build Next

- Add a backend eval runner that reads scenario fixtures from JSON.
- Add reviewer accounts and immutable audit history.
- Add richer source records with freshness, owner, and policy status.
- Add adversarial scenarios for prompt injection, PHI paste, and conflicting
  source documents.
- Add export formats for product, implementation, and customer-success review.
