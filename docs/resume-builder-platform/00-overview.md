# Reverse ATS / Dynamic Resume Builder — Feature Overview

This is a personal resume-building tool. A person stores their entire professional history once (the "Master Vault"), then pastes any job description to instantly generate a tailored, ATS-friendly resume and download it as a PDF. Every application is also saved as a searchable company record, so if a company reaches back out later, the person can look up exactly what role they applied for and which resume they sent.

The platform supports multiple separate user accounts (each person's data is fully private to them), but it is not a public or collaborative product — there's no admin panel, no sharing between accounts, and no social/OAuth login. Just username + password.

Each feature is documented in its own file inside this folder. Build them in order — later features depend on earlier ones being in place.

## Build Order

### Phase 1 — Core (the full working loop)
1. `01-user-account.md` — username/password login so each person's data stays private
2. `02-master-vault.md` — the data source: every job, project, skill, bullet point ever written, editable by tab with an optional AI "Analyze" pass to fix typos/grammar
3. `03-job-description-intake.md` — paste a JD, extract what it's really asking for
4. `04-matching-engine.md` — select and rephrase real vault content to match the JD
5. `05-resume-assembly.md` — lay matched content into a real resume structure
6. `06-pdf-export.md` — download the finished resume as a PDF
7. `07-company-records.md` — save and search company/JD/resume history for later reference
8. `08-template-management.md` — offer at least one clean, ATS-safe visual layout, with room to add more

### Phase 2 — Future Enhancements (optional, add later)
All Phase 2 feature files live in the `future-enhancements/` folder and are not required for the core loop to work.
- `future-enhancements/01-gap-analyzer.md` — show what's missing instead of inventing it
- `future-enhancements/02-cover-letter-generator.md` — auto-write a matching cover letter
- `future-enhancements/03-resume-variants.md` — generate and compare alternate versions
- `future-enhancements/04-ai-provider-settings.md` — control provider/model/key used for generation

## Guiding Principle

The system never invents experience. It only selects, reorders, and rephrases facts that already exist in the Master Vault. If a job description asks for something not present in the vault, the system says so honestly instead of fabricating it.
