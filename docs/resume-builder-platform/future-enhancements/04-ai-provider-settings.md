# Enhancement: Settings & Configuration

## Why
The person needs control over which AI service and model powers generation, along with the credential that connects to it, kept safe and easy to change.

## What It Does
- Lets the person choose which AI provider and model is used, and enter the credential needed to connect to it.
- Stores that credential securely and never shows it in full again after saving.
- Blocks AI-dependent features with a clear setup message if no valid credential is configured, while still allowing full manual vault management.
- Applies a changed provider or model choice immediately, without needing a restart.

## Behavior / Acceptance Criteria
1. WHEN a person sets a credential, THE SYSTEM SHALL store it securely and never display it again in full after saving.
2. WHEN no valid credential is configured, THE SYSTEM SHALL block AI-dependent features with a clear setup prompt, while still allowing manual vault management.
3. WHEN a person switches the selected provider/model, THE SYSTEM SHALL apply it to all following generation requests without requiring a restart.

## Build Steps
- [ ] Build the settings screen: provider/model choice, credential entry
- [ ] Store the credential securely; only ever show a masked version afterward
- [ ] Add the "not configured" blocking state across every AI-dependent feature
- [ ] Confirm switching provider/model takes effect immediately
- [ ] Manually verify: credential is never visible in full after the initial save
