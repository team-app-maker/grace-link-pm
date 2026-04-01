> Source: `grace-link-server/openspec/changes/reco-visibility-same-church-contacts/specs/match-lifecycle/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## MODIFIED Requirements

### Requirement: Match requests SHALL create pending matches before chat starts
Targets hidden by same-church or contact-based visibility filters SHALL be rejected before a pending match is created.

#### Scenario: Visibility-hidden target is rejected
- **WHEN** a sender calls `POST /match/request` for a target hidden by same-church or contact visibility filters
- **THEN** the system rejects the request without creating a pending match
