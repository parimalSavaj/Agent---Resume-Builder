# Feature 7: Missing Skills / Gap Analyzer

## Why
Sometimes a job description asks for something genuinely absent from the vault. The honest move is to say so clearly, before a resume gets generated, rather than quietly papering over it.

## What It Does
- Before finalizing a resume, shows a clear list of required keywords that had no matching vault content.
- Lets the person either go add real vault content addressing the gap, or acknowledge it and continue anyway.
- Never inserts placeholder or invented content for an unaddressed gap.

## Behavior / Acceptance Criteria
1. WHEN matching finds required keywords with no vault coverage, THE SYSTEM SHALL list them explicitly as missing before resume generation finishes.
2. WHEN a gap is shown, THE SYSTEM SHALL let the person either add new vault content for it or proceed without it.
3. IF the person proceeds without addressing a gap, THE SYSTEM SHALL NOT insert placeholder or fabricated content for that keyword.

## Build Steps
- [ ] Build the "gaps" review screen shown before final resume assembly
- [ ] Add a shortcut from a gap straight into adding new vault content for it
- [ ] Add an explicit "continue anyway" path that leaves the gap unfilled
- [ ] Manually verify: a resume generated with unresolved gaps contains no invented content for them
