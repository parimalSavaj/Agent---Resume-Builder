# Feature 4: Matching & Rewriting Engine

## Why
This is the core intelligence of the platform. It has to pick the right content from the vault and phrase it the way the job description phrases things — without ever inventing experience the person doesn't actually have. This single rule is the difference between "tailoring" a resume and "lying" on one.

## What It Does
- Compares every bullet point in the vault against the job description's extracted keywords and ranks them by relevance.
- Rewrites the wording of selected bullet points to mirror the job description's language, while keeping the underlying fact and any metric exactly the same.
- Never introduces a skill, tool, employer, or metric that doesn't already exist somewhere in the vault.
- Flags any required keyword that has no matching vault content as a "gap" instead of making something up to fill it.
- Returns a structured, ranked list of selected content (not loose paragraphs), so the rest of the system can assemble a resume from it reliably.
- Produces consistent picks when run again on the same job description and vault, so results can be trusted rather than feeling random.

## Behavior / Acceptance Criteria
1. WHEN extracted keywords are available, THE SYSTEM SHALL rank all vault bullet points by relevance to those keywords.
2. WHEN generating tailored content, THE SYSTEM SHALL only use facts already present in the vault — never fabricate skills, tools, employers, or metrics.
3. WHEN a bullet point is rewritten to match job description language, THE SYSTEM SHALL preserve its original fact/metric unchanged.
4. IF no vault content satisfies a required keyword, THE SYSTEM SHALL report it as a gap rather than fabricating a match.
5. WHEN matching completes, THE SYSTEM SHALL return a structured, ranked selection rather than free-form text.
6. WHEN the same job description and vault are submitted again, THE SYSTEM SHALL select consistent content, even if wording varies slightly.

## Build Steps
- [ ] Design a first-pass relevance scoring step (compares vault content to keywords) to narrow down candidates
- [ ] Design the rewriting step that rephrases only the narrowed-down candidates
- [ ] Enforce the "only real vault facts" rule as a hard check on the output, not just an instruction
- [ ] Build gap detection for required keywords with no match
- [ ] Define the structured output shape the rest of the system will consume
- [ ] Manually verify: run the same job description twice and compare selected content for consistency
- [ ] Manually verify: try a job description requiring a skill absent from the vault, confirm it shows as a gap and is never invented
