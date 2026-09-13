# Enhancement: Dynamic Cover Letter Generator

## Why
Once the resume is tailored, generating a matching cover letter costs very little extra effort and saves real time per application.

## What It Does
- Offers to generate a cover letter for an application right after its resume is ready.
- References specific language from the job description and specific real facts already used in the resume — not generic filler.
- Lets the person edit the generated letter and export it as a PDF, same as the resume.

## Behavior / Acceptance Criteria
1. WHEN a resume exists for an application, THE SYSTEM SHALL offer to generate a matching cover letter using the same job description and vault context.
2. WHEN generating a cover letter, THE SYSTEM SHALL reference specific job description language and specific real vault facts already used, not generic filler.
3. WHEN a cover letter is generated, THE SYSTEM SHALL allow manual editing and PDF export, reusing the same export pipeline as the resume.

## Build Steps
- [ ] Build the cover letter generation step, reusing the same job description and selected resume content
- [ ] Build the review/edit screen for the generated letter
- [ ] Reuse the PDF export step (`06-pdf-export.md`) for cover letter output
- [ ] Manually verify: generated letters reference real, specific facts rather than generic statements
