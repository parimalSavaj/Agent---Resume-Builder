# Feature 1: User Account & Session

## Why
This platform stores real personal data: full work history, contact details, job descriptions, and generated resumes. Multiple people may use the same deployed instance, so each account must be completely private, and login must stay simple — just a username and password, nothing tied to a third-party identity provider.

## What It Does
- Lets a person create an account with a username and password (no email/OAuth/social login of any kind).
- Keeps every account's data (vault, applications, company records, resumes) completely separate from every other account's.
- Requires login before any personal data can be viewed or changed.
- Ends access automatically after a period of inactivity, requiring login again.
- Provides a logout action.

## Behavior / Acceptance Criteria
1. WHEN a new person signs up, THE SYSTEM SHALL create an account using only a username and password, with no visibility into any other account's data.
2. THE SYSTEM SHALL NOT offer Google, social, or any other third-party login option — username + password is the only method.
3. WHEN a person is not logged in, THE SYSTEM SHALL block access to vault data, job applications, company records, and generated documents.
4. WHEN a session expires, THE SYSTEM SHALL require the person to log in again before continuing.
5. WHEN a person logs out, THE SYSTEM SHALL end the session immediately and require login again for further access.
6. WHEN a password is stored, THE SYSTEM SHALL store it hashed (never in plain text) and never display it back to the person.

## Build Steps
- [ ] Design account creation and login flow (username/password fields, validation rules, password hashing)
- [ ] Design session handling (how long a login lasts, what "expired" means)
- [ ] Ensure every feature that touches personal data checks "who is logged in" and scopes data to that account only
- [ ] Add a logout action
- [ ] Manually verify: one account can never see another account's vault, applications, or resumes
- [ ] Manually verify: no login option other than username/password is present anywhere in the UI
