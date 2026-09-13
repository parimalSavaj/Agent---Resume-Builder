# Feature 3: Job Description Intake & Keyword Extraction

## Why
Before anything can be matched, the system needs to understand what a specific job is actually asking for — not just store the raw text, but pull out the real requirements and language a recruiter or screener would look for.

## What It Does
- Lets the person paste a job description along with the job title and company name, creating a new application record.
- Reads the job description and pulls out: required skills, nice-to-have skills, seniority level, and key repeated phrases/terminology.
- Shows the extracted keywords back to the person, clearly separating "required" from "nice-to-have."
- Rejects a submission that's empty or too short to be a real job description.
- Creates or updates the matching company record (see `07-company-records.md`) so the job description stays searchable by company later.

## Behavior / Acceptance Criteria
1. WHEN a person pastes a job description and submits it, THE SYSTEM SHALL store the raw text, job title, and company name as a new application, and create or update the corresponding company record.
2. WHEN a job description is submitted, THE SYSTEM SHALL extract required skills, nice-to-have skills, seniority level, and key repeated phrases.
3. WHEN keywords are extracted, THE SYSTEM SHALL display them with a clear visual distinction between required and nice-to-have.
4. IF the pasted text is empty or too short, THE SYSTEM SHALL reject submission with a clear message instead of processing it.

## Build Steps
- [ ] Build the "new application" form (job description, job title, company)
- [ ] Add input validation (reject empty/too-short submissions)
- [ ] Design the keyword extraction step (what counts as "required" vs "nice-to-have" vs "seniority" vs "phrase")
- [ ] Build the results view showing extracted keywords, grouped clearly
- [ ] Manually verify: extraction results make sense against a few real job postings
