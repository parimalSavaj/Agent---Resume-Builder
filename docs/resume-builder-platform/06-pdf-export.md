# Feature 6: PDF Export

## Why
None of this matters if the final file doesn't actually survive being scanned by a real ATS. The export step is what turns the reviewed resume into a single, reliable PDF that reads cleanly to both software and humans.

## What It Does
- Renders the final resume as a single-column layout with standard section headings and standard fonts only.
- Never uses tables, text boxes, images, icons, or multi-column layouts — all of which risk being skipped or scrambled by scanning software.
- Supports downloading the resume as a PDF file (the only supported export format).
- Names each downloaded file predictably, based on company and job title, so it's easy to keep track of which file went where.

## Behavior / Acceptance Criteria
1. WHEN a person exports a resume, THE SYSTEM SHALL render it in a single-column layout using standard fonts and standard section headings only.
2. WHEN a person exports a resume, THE SYSTEM SHALL NOT include tables, text boxes, images, icons, or multi-column layouts.
3. WHEN export is requested, THE SYSTEM SHALL generate a downloadable PDF file.
4. WHEN a file is generated, THE SYSTEM SHALL name it in a predictable pattern based on company and job title (e.g. `CompanyName_JobTitle.pdf`).

## Build Steps
- [ ] Define the shared layout structure used for PDF rendering
- [ ] Build PDF export (e.g. render to HTML/print-safe layout, then convert to PDF)
- [ ] Apply the predictable file naming pattern
- [ ] Manually verify: open exported PDFs in a couple of common readers to confirm layout holds up
- [ ] Manually verify: run an exported PDF through an ATS-style scanner check to confirm sections and text are read correctly
