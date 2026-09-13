# Reverse ATS / Dynamic Resume Builder — Feature Overview

This platform lets a person store their entire professional history once (the "Master Vault"), then paste any job description to instantly generate a tailored, ATS-friendly resume and cover letter.

Each feature is documented in its own file inside this folder. Build them in order — later features depend on earlier ones being in place.

## Build Order

### Phase 1 — Core (must work end-to-end first)
1. `01-user-account.md` — private login so personal data is never exposed
2. `02-master-vault.md` — the data source: every job, project, skill, bullet point ever written
3. `03-job-description-intake.md` — paste a JD, extract what it's really asking for
4. `04-matching-engine.md` — select and rephrase real vault content to match the JD
5. `05-resume-assembly.md` — lay matched content into a real resume structure
6. `06-ats-friendly-export.md` — download a clean, ATS-safe file

### Phase 2 — Advanced (add once Phase 1 works end-to-end)
All Phase 2 feature files live in the `advanced/` folder.
7. `advanced/07-gap-analyzer.md` — show what's missing instead of inventing it
8. `advanced/08-cover-letter-generator.md` — auto-write a matching cover letter
9. `advanced/09-application-tracker.md` — track status of every tailored application
10. `advanced/10-resume-variants.md` — generate and compare alternate versions
11. `advanced/11-template-management.md` — offer more than one visual layout
12. `advanced/12-settings-and-configuration.md` — control provider/model/key used for generation

## Guiding Principle

The system never invents experience. It only selects, reorders, and rephrases facts that already exist in the Master Vault. If a job description asks for something not present in the vault, the system says so honestly instead of fabricating it.
