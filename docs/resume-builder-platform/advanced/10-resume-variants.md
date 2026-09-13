# Feature 10: Resume Variants / A/B Testing

## Why
For similar roles, it can be useful to try more than one angle — leading with technical depth versus leading with leadership, for example — and see which gets a better response over time.

## What It Does
- Lets the person generate an alternate version of a resume for the same job description, with a different emphasis or wording, while still only using real vault facts.
- Keeps multiple versions under the same application rather than replacing the original.
- Lets the person mark which version was actually sent.
- Once outcomes are tracked, shows outcome versus version used, to spot patterns over time.

## Behavior / Acceptance Criteria
1. WHEN a person requests a variant, THE SYSTEM SHALL generate an alternate resume for the same job description with different emphasis/wording, still respecting the no-fabrication rule.
2. WHEN multiple versions exist for one application, THE SYSTEM SHALL let the person mark which one was actually sent.
3. WHEN application outcomes are recorded, THE SYSTEM SHALL allow viewing outcome versus version used.

## Build Steps
- [ ] Build the "generate variant" action with an emphasis choice (e.g. lead with leadership vs. lead with technical depth)
- [ ] Store variants as separate versions under the same application, never overwriting the original
- [ ] Add a "mark as sent" flag on a version
- [ ] Build a simple view comparing outcomes across versions once statuses are tracked
- [ ] Manually verify: generating a variant never overwrites the original version
