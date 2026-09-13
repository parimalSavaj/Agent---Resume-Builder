# Feature 2: Master Vault

## Why
This is the foundation of the entire platform. Instead of writing a resume from scratch every time, the person enters their complete professional history once — every job, every project, every skill, every bullet point they've ever had. Every other feature reads from this vault; nothing gets typed twice.

## What It Does
- Stores work experience entries (company, title, location, dates, bullet points).
- Stores projects, education, certifications, and skills as their own distinct entries — not one big text blob.
- Lets each bullet point carry tags (e.g. "Leadership", "Data Analysis") and an optional metric (e.g. "reduced cost by 18%").
- Presents every entry type (work experience, project, education, certification, skill) inside its own editable tab in the vault UI.
- Lets the person add, edit, or delete any entry at any time.
- On each tab, offers an "Analyze" action (alongside plain "Save") that sends the entry's text to the LLM to fix typos, grammar, and awkward phrasing, without changing the underlying facts, dates, numbers, or tags.
- Shows the person a before/after comparison of any AI-suggested correction, and only applies it once the person accepts.
- Warns when a bullet point has no tags, since untagged content is harder to match against a job description later.
- Supports filtering/searching the vault by tag, date range, or which job/project a bullet belongs to.

## Behavior / Acceptance Criteria
1. WHEN a person adds a work experience entry, THE SYSTEM SHALL capture company, title, location, start/end dates, and its bullet points.
2. WHEN a person adds a bullet point, THE SYSTEM SHALL allow attaching tags and an optional metric.
3. WHEN a person adds a project, education entry, certification, or skill, THE SYSTEM SHALL store it as its own structured entry.
4. WHEN a person edits or deletes any vault entry, THE SYSTEM SHALL save the change immediately without losing other data.
5. IF a bullet point has no tags, THE SYSTEM SHALL still allow saving it but SHALL visibly flag it as untagged.
6. WHEN the vault is searched, THE SYSTEM SHALL support filtering by tag, date range, or parent job/project.
7. WHEN a person clicks "Save" on an entry, THE SYSTEM SHALL store the entry exactly as typed, with no AI involvement.
8. WHEN a person clicks "Analyze" on an entry, THE SYSTEM SHALL send that entry's text to the LLM and return a corrected version with typos, spelling, grammar, and phrasing fixed.
9. WHEN returning an AI-corrected version, THE SYSTEM SHALL NOT alter facts, dates, numbers, metrics, tags, or company/project/skill names — only wording, spelling, and grammar.
10. WHEN an AI correction is returned, THE SYSTEM SHALL show it next to the original text and SHALL only save it if the person explicitly accepts.
11. IF the person rejects or ignores an AI suggestion, THE SYSTEM SHALL leave the original entry unchanged.
12. IF the LLM call fails or times out, THE SYSTEM SHALL leave the original entry unchanged and SHALL show a clear error instead of blocking the plain "Save" action.

## Build Steps
- [ ] Define the structure for each entry type: work experience, bullet point, project, education, certification, skill
- [ ] Build add/edit/delete for each entry type, organized into tabs by entry type in the vault UI
- [ ] Build the bullet point editor with tag input and metric field
- [ ] Add the "untagged bullet" visual flag
- [ ] Build filtering/search across the vault (by tag, date, parent entry)
- [ ] Add "Save" and "Analyze" actions to each entry's editor
- [ ] Build the LLM correction call: send entry text, prompt it to fix only spelling/grammar/phrasing, and preserve facts/numbers/tags exactly
- [ ] Build the before/after review UI with accept/reject for AI-suggested corrections
- [ ] Handle LLM failure/timeout gracefully without blocking plain saves
- [ ] Manually verify: nothing is ever lost on edit, and every entry type can be created independently
- [ ] Manually verify: running "Analyze" on an entry with a typo and a metric fixes the typo but never changes the metric or dates
