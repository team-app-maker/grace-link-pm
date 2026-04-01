> Source: `grace-link-server/openspec/changes/reco-visibility-same-church-contacts/specs/onboarding-approval/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## MODIFIED Requirements

### Requirement: PASS verification SHALL gate onboarding submission
When `POST /auth/pass/verify` receives canonical phone input, the system SHALL persist only the normalized SHA-256 phone hash for later contact visibility checks.

#### Scenario: PASS verification stores canonical phone hash
- **WHEN** a user completes PASS verification with a canonical phone number
- **THEN** the system stores the normalized SHA-256 phone hash without persisting the raw phone number
