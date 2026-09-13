# Feature 8: Template Management

## Why
A single visual layout works for a minimal version, but having a couple of clean options keeps exported resumes from feeling identical, without risking ATS-safety.

## What It Does
- Offers at least one clean, ATS-safe layout by default.
- If more layouts are added later, checks that each one still follows the same ATS-safety rules as the PDF export feature (no tables, images, or multi-column layouts) before it can be used.

## Behavior / Acceptance Criteria
1. WHEN exporting, THE SYSTEM SHALL offer at least one clean, ATS-safe layout by default.
2. IF additional layouts are added, THE SYSTEM SHALL verify each one still satisfies the ATS-safety rules before allowing its use.

## Build Steps
- [ ] Confirm the default layout from `06-pdf-export.md` qualifies as the first template
- [ ] Design a second visual layout that still follows single-column, no-table, no-image rules
- [ ] Add a check that runs against any layout to confirm it stays ATS-safe before it's made available
- [ ] Manually verify: both layouts produce equally clean, ATS-safe output
