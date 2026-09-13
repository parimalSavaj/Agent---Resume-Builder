# Feature 2: Master Vault

## Why
This is the foundation of the entire platform. Instead of writing a resume from scratch every time, the person enters their complete professional history once — every job, every project, every skill, every bullet point they've ever had. Every other feature reads from this vault; nothing gets typed twice.

## What It Does
- Stores work experience entries (company, title, location, dates, bullet points).
- Stores projects, education, certifications, and skills as their own distinct entries — not one big text blob.
- Lets each bullet point carry tags (e.g. "Leadership", "Data Analysis") and an optional metric (e.g. "reduced cost by 18%").
- Lets the person add, edit, or delete any entry at any time.
- Warns when a bullet point has no tags, since untagged content is harder to match against a job description later.
- Supports filtering/searching the vault by tag, date range, or which job/project a bullet belongs to.

## Behavior / Acceptance Criteria
1. WHEN a person adds a work experience entry, THE SYSTEM SHALL capture company, title, location, start/end dates, and its bullet points.
2. WHEN a person adds a bullet point, THE SYSTEM SHALL allow attaching tags and an optional metric.
3. WHEN a person adds a project, education entry, certification, or skill, THE SYSTEM SHALL store it as its own structured entry.
4. WHEN a person edits or deletes any vault entry, THE SYSTEM SHALL save the change immediately without losing other data.
5. IF a bullet point has no tags, THE SYSTEM SHALL still allow saving it but SHALL visibly flag it as untagged.
6. WHEN the vault is searched, THE SYSTEM SHALL support filtering by tag, date range, or parent job/project.

## Build Steps
- [ ] Define the structure for each entry type: work experience, bullet point, project, education, certification, skill
- [ ] Build add/edit/delete for each entry type
- [ ] Build the bullet point editor with tag input and metric field
- [ ] Add the "untagged bullet" visual flag
- [ ] Build filtering/search across the vault (by tag, date, parent entry)
- [ ] Manually verify: nothing is ever lost on edit, and every entry type can be created independently
