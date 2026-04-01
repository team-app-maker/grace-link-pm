> Source: `grace-link-server/openspec/changes/reco-visibility-same-church-contacts/specs/contact-visibility/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## ADDED Requirements

### Requirement: Users SHALL be able to sync contact hashes for visibility filtering
The system SHALL accept a user-owned snapshot of normalized contact phone hashes and SHALL use that snapshot for contact-based visibility filtering without storing raw phone numbers.

#### Scenario: Contact hash snapshot is replaced
- **WHEN** an authenticated user calls `PUT /contacts/me/hashes` with a list of contact hashes
- **THEN** the system replaces the previously stored snapshot for that user with the provided hashes

#### Scenario: Contact hash snapshot is cleared
- **WHEN** an authenticated user calls `DELETE /contacts/me/hashes`
- **THEN** the system deletes the stored contact hash snapshot for that user

### Requirement: Contact visibility SHALL hide matched users across visibility-gated surfaces
If a viewer enables `exclude_contacts`, the system SHALL hide targets whose canonical phone hash matches one of the viewer's uploaded contact hashes.

#### Scenario: Contact-matched target is hidden from visibility-gated surfaces
- **GIVEN** the viewer enabled `exclude_contacts` and uploaded a hash matching the target's canonical phone hash
- **WHEN** the viewer loads recommendations, vault, target profile detail, or requests a match
- **THEN** the target is excluded or rejected by the visibility gate
