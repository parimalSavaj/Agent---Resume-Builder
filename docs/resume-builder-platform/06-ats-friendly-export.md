# Feature 6: ATS-Friendly Export

## Why
None of this matters if the final file doesn't actually survive being scanned by a real ATS. The export step is what turns the reviewed resume into a document that reads cleanly to both software and humans.

## What It Does
- Renders the final resume as a single-column layout with standard section headings and standard fonts only.
- Never uses tables, text boxes, images, icons, or multi-column layouts — all of which risk being skipped or scrambled by scanning software.
- Supports downloading as either of the two most commonly accepted file types.
- Names each downloaded file predictably, based on company and job title, so it's easy to keep track of which file went where.

## Behavior / Acceptance Criteria
1. WHEN a person exports a resume, THE SYSTEM SHALL render it in a single-column layout using standard fonts and standard section headings only.
2. WHEN a person exports a resume, THE SYSTEM SHALL NOT include tables, text boxes, images, icons, or multi-column layouts.
3. WHEN export is requested, THE SYSTEM SHALL support both of the two standard output formats.
4. WHEN a file is generated, THE SYSTEM SHALL name it in a predictable pattern based on company and job title.

## Build Steps
- [ ] Define the shared layout structure used for every export (so both formats always match each other)
- [ ] Build export to the first standard format
- [ ] Build export to the second standard format
- [ ] Apply the predictable file naming pattern
- [ ] Manually verify: open exported files in a couple of common readers to confirm layout holds up
- [ ] Manually verify: run an exported file through an ATS-style scanner check to confirm sections and text are read correctly
