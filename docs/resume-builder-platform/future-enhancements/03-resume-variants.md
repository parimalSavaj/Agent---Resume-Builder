# Enhancement: Resume Variants / A/B Testing

## Why
For similar roles, it can be useful to try more than one angle — leading with technical depth versus leading with leadership, for example — and see which gets a better response over time.

## What It Does
- Lets the person generate an alternate version of a resume for the same job description, with a different emphasis or wording, while still only using real vault facts.
- Keeps multiple versions under the same company record (see `07-company-records.md`) rather than replacing the original.
- Lets the person mark which version was actually sent.

## Behavior / Acceptance Criteria
1. WHEN a person requests a variant, THE SYSTEM SHALL generate an alternate resume for the same job description with different emphasis/wording, still respecting the no-fabrication rule.
2. WHEN multiple versions exist for one application, THE SYSTEM SHALL let the person mark which one was actually sent.
3. WHEN viewing a company record, THE SYSTEM SHALL show all resume versions generated for that application, with the sent one clearly marked.

## Build Steps
- [ ] Build the "generate variant" action with an emphasis choice (e.g. lead with leadership vs. lead with technical depth)
- [ ] Store variants as separate versions under the same company record, never overwriting the original
- [ ] Add a "mark as sent" flag on a version
- [ ] Manually verify: generating a variant never overwrites the original version
