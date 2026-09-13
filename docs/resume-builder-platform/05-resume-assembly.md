# Feature 5: Resume Assembly

## Why
Matched content on its own isn't a resume — it needs to be laid out into real sections, trimmed to a sensible length, and reviewable before it goes anywhere near an actual application.

## What It Does
- Takes the ranked, matched content and lays it into standard resume sections (header, summary, experience, education, skills, projects).
- When the assembled resume runs long, keeps the highest-relevance content and trims the lowest-relevance content first, aiming for a typical one-page length.
- Lets the person manually adjust the result before export: reorder items, bring back something that got trimmed, tweak wording.
- Saves manual edits as their own version, separate from both the original vault data and the original AI-matched output — so nothing upstream ever gets overwritten by a one-off edit.

## Behavior / Acceptance Criteria
1. WHEN matched content is ready, THE SYSTEM SHALL assemble it into a structured resume with standard sections.
2. WHEN the assembled resume exceeds a target length, THE SYSTEM SHALL prioritize higher-relevance content and trim lower-relevance content first.
3. WHEN a person views the assembled resume, THE SYSTEM SHALL allow manual edits before export.
4. WHEN a person manually edits the assembled resume, THE SYSTEM SHALL save it as a distinct version without changing the vault source data.

## Build Steps
- [ ] Define the standard section structure (header, summary, experience, education, skills, projects)
- [ ] Build the assembly step that fills sections from matched content in relevance order
- [ ] Build the length-trimming logic (target length, what gets cut first)
- [ ] Build the review/edit screen: reorder, remove, re-add, edit text inline
- [ ] Ensure edits save as a new version rather than overwriting vault or match data
- [ ] Manually verify: trimming behaves sensibly on a long profile, edits never touch the vault
