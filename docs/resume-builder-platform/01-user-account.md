# Feature 1: User Account & Session

## Why
This platform stores real personal data: full work history, contact details, and job applications. It must be private to the person using it, and structured so it stays safe even if more people use it later.

## What It Does
- Lets a person create an account and log in.
- Keeps every person's data completely separate from everyone else's.
- Requires login before any personal data can be viewed or changed.
- Ends access automatically after a period of inactivity, requiring login again.

## Behavior / Acceptance Criteria
1. WHEN a new person signs up, THE SYSTEM SHALL create an account with no visibility into any other account's data.
2. WHEN a person is not logged in, THE SYSTEM SHALL block access to vault data, job applications, and generated documents.
3. WHEN a session expires, THE SYSTEM SHALL require the person to log in again before continuing.
4. WHEN a person is using the platform alone, THE SYSTEM SHALL still enforce login, so it stays safe to open up to more people later without redoing this feature.

## Build Steps
- [ ] Design account creation and login flow (fields needed, validation rules)
- [ ] Design session handling (how long a login lasts, what "expired" means)
- [ ] Ensure every future feature that touches personal data checks "who is logged in" before doing anything
- [ ] Add a logout action
- [ ] Manually verify: one account can never see another account's data
