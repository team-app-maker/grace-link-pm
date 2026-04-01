> Source: `grace-link-server/openspec/changes/reco-visibility-same-church-contacts/specs/profile-reco-vault/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## MODIFIED Requirements

### Requirement: Recommendation retrieval SHALL return only currently eligible cards
Recommendation eligibility SHALL exclude targets hidden by same-church and contact-based visibility filters in addition to existing safety, deleted, and passed-card rules.

#### Scenario: Visibility-filtered target is omitted from recommendations
- **WHEN** a viewer enabled `exclude_same_church` or `exclude_contacts`
- **THEN** the system skips matching targets while creating and returning recommendation cards

### Requirement: Vault retrieval SHALL return currently eligible non-passed cards
Vault retrieval SHALL also exclude targets hidden by same-church and contact-based visibility filters.

#### Scenario: Visibility-filtered vault card is hidden
- **WHEN** a stored vault card points to a target hidden by same-church or contact filters
- **THEN** the card is omitted from `GET /vault`
