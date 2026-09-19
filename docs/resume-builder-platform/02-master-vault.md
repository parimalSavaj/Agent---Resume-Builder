# Feature 2: Master Vault

**Status:** In progress

## Why
This is the foundation of the entire platform. Instead of writing a resume from scratch every time, the person enters their complete professional history once — every job, project, education record, certification, and skill. Every other feature reads from this vault; nothing gets typed twice.

## Current Implementation

The repository currently includes:

- A protected Master Vault page with separate tabs for work experience, projects, education, certifications, and skills.
- Create, list, edit, and delete operations for every entry type.
- Structured fields for each entry type, stored per user in PostgreSQL.
- Month-and-year date handling for work experience, projects, and education.
- Plain Save behavior that stores the person's text without calling AI.
- AI Analyze for work-experience and project descriptions through OpenRouter.
- A before/after AI review with explicit **Accept suggestion** and **Keep original** actions.
- Clear AI failure and timeout messages that do not prevent normal saving.

The following requirements are not fully implemented yet:

- Vault filtering by date range, entry type, or entry name is not available.

## What It Does
- Stores work experience entries (company, title, location, dates, and description).
- Stores projects, education, certifications, and skills as their own distinct entries — not one big text blob.
- Presents every entry type (work experience, project, education, certification, skill) inside its own editable tab in the vault UI.
- Lets the person add, edit, or delete any entry at any time.
- For work-experience and project descriptions, offers an "Analyze" action alongside plain "Save" that sends the description to the LLM to fix typos, grammar, and awkward phrasing without changing facts, dates, or numbers.
- Shows the person a before/after comparison of any AI-suggested correction, and only applies it once the person accepts.
- Supports filtering/searching the vault by date range, entry type, or entry name.

## Behavior / Acceptance Criteria
1. WHEN a person adds a work experience entry, THE SYSTEM SHALL capture company, title, location, start/end dates, and a description.
2. WHEN a person adds a project, education entry, certification, or skill, THE SYSTEM SHALL store it as its own structured entry.
3. WHEN a person edits or deletes any vault entry, THE SYSTEM SHALL save the change without losing other data.
4. WHEN the vault is searched, THE SYSTEM SHALL support filtering by date range, entry type, or entry name.
5. WHEN a person clicks "Save" on an entry, THE SYSTEM SHALL store the entry exactly as typed, with no AI involvement.
6. WHEN a person clicks "Analyze" on a work-experience or project description, THE SYSTEM SHALL send that description to the LLM and return a corrected version with typos, spelling, grammar, and phrasing fixed.
7. WHEN returning an AI-corrected version, THE SYSTEM SHALL NOT alter facts, dates, numbers, or company/project names — only wording, spelling, and grammar.
8. WHEN an AI correction is returned, THE SYSTEM SHALL show it next to the original text and SHALL only apply it if the person explicitly accepts.
9. IF the person rejects or ignores an AI suggestion, THE SYSTEM SHALL leave the original entry unchanged.
10. IF the LLM call fails or times out, THE SYSTEM SHALL leave the original entry unchanged and SHALL show a clear error instead of blocking the plain "Save" action.

## Build Steps
- [x] Define structured data for work experience, project, education, certification, and skill entries
- [x] Build add/edit/delete for each entry type, organized into tabs by entry type in the vault UI
- [ ] Build filtering/search across the vault by date range, entry type, and entry name
- [x] Ensure plain "Save" stores text exactly as typed without AI involvement
- [x] Add "Analyze" to work-experience and project description editors
- [x] Build the LLM correction call for spelling, grammar, and phrasing while instructing it to preserve facts and numbers
- [x] Build the before/after review UI with explicit accept/reject actions
- [x] Handle LLM failure/timeout without changing the original text or blocking plain Save
- [ ] Manually verify that edits never remove unrelated data and every entry type can be created independently
- [ ] Manually verify that Analyze fixes a typo without changing dates or numbers

## Definition of Done

This feature is complete only when all acceptance criteria and build-step checkboxes above are satisfied.
