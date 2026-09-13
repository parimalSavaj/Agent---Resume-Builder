# Feature 7: Company Records & Search

## Why
Over time, applications pile up across many companies. When a company reaches back out (a recruiter call, an interview invite), it's easy to forget exactly what role was applied for, what the job description said, and which resume version was actually sent. A simple, searchable record removes that guesswork.

## What It Does
- Automatically creates a company record whenever a job description is submitted for a new company (see `03-job-description-intake.md`), or lets the person create one manually.
- Stores, per application: company name, job title, the original job description text, the date applied, and a link to the exact resume version generated/used for it.
- Lets the person search or filter records by company name to instantly pull up everything tied to that company.
- Lets the person view, edit notes on, or delete any stored record.
- Does not track application status (e.g. Applied/Interviewing/Rejected/Offer) — this is a lookup and reference tool, not a pipeline tracker.

## Behavior / Acceptance Criteria
1. WHEN a job description is submitted for a company, THE SYSTEM SHALL create or update a company record containing the company name, job title, job description text, and date.
2. WHEN a resume is generated for that application, THE SYSTEM SHALL link the resume version to its company record.
3. WHEN a person searches by company name, THE SYSTEM SHALL return all matching records, including partial/case-insensitive matches.
4. WHEN a person opens a company record, THE SYSTEM SHALL show the stored job description, job title, date, and the linked resume version, with an option to view or download that resume again.
5. WHEN a person edits or deletes a company record, THE SYSTEM SHALL save or remove it without affecting the underlying vault data or other company records.
6. THE SYSTEM SHALL NOT include or require any application status field (e.g. Applied/Interviewing/Rejected/Offer) as part of a company record.

## Build Steps
- [ ] Define the company record structure (company name, job title, job description text, date, linked resume version, optional notes)
- [ ] Auto-create/update a company record when a job description is submitted (hook into `03-job-description-intake.md`)
- [ ] Link the generated resume version to its company record (hook into `05-resume-assembly.md`)
- [ ] Build the company search view (search-as-you-type by company name)
- [ ] Build the record detail view (job title, JD text, date, linked resume, notes, re-download option)
- [ ] Add edit and delete actions for a record
- [ ] Manually verify: searching a company name returns the right record with the correct resume version linked
