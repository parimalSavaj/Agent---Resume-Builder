# Feature 9: Application Tracker

## Why
Once several tailored resumes exist across different companies, it's easy to lose track of what was sent where and what happened next. A simple status board keeps that visible.

## What It Does
- Creates or updates an application record whenever a resume is generated for a job.
- Shows applications on a board grouped by status: Applied, Interviewing, Rejected, Offer.
- Lets the person move an application between statuses, saving the change.
- Links every application back to the exact resume and cover letter version that was submitted for it.

## Behavior / Acceptance Criteria
1. WHEN a resume is generated for a job description, THE SYSTEM SHALL create or update an application record with a status.
2. WHEN a person changes an application's status, THE SYSTEM SHALL save it and reflect it on the board view.
3. WHEN viewing an application, THE SYSTEM SHALL link to the exact resume and cover letter version submitted for it.

## Build Steps
- [ ] Build the status board view grouped by Applied / Interviewing / Rejected / Offer
- [ ] Build status change action (e.g. drag between columns or a status picker)
- [ ] Link each application card to its associated resume and cover letter versions
- [ ] Manually verify: status changes persist and the right documents are linked on each card
