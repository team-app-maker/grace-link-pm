> Source: `grace-link-server/openspec/specs/profile-reco-vault/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# profile-reco-vault Specification

## Purpose
프로필 조회/수정, 타깃 프로필 상세, unlock, 추천 카드, vault lifecycle 규칙을 정의한다.
## Requirements
### Requirement: Users SHALL be able to retrieve and update their own profile
The system SHALL provide a canonical endpoint to retrieve the authenticated user's profile and SHALL allow profile updates through a patch-style request.

#### Scenario: Retrieve current user's profile
- **WHEN** an authenticated user calls `GET /profile/me`
- **THEN** the system returns the user's current profile payload

#### Scenario: Update current user's profile
- **WHEN** an authenticated user calls `PATCH /profile/me` with valid profile fields
- **THEN** the system persists the changes and returns the updated profile payload

### Requirement: Users SHALL be able to view target profile detail with unlock state
The system SHALL provide target profile detail together with unlock records that describe which sections the viewer already owns.
Safety-hidden relationships and active visibility filters MUST prevent access.

#### Scenario: Target profile detail is visible
- **WHEN** an authenticated viewer calls `GET /profile/detail` for a visible target profile
- **THEN** the system returns the target profile and the viewer's existing unlock records

#### Scenario: Safety-hidden target profile is blocked
- **WHEN** an authenticated viewer requests a target profile that is hidden by safety rules
- **THEN** the system rejects the request

### Requirement: Profile sections SHALL support manna-based unlocks
The system SHALL allow a viewer to unlock supported profile sections and SHALL charge manna according to the unlock type when ownership does not already exist.

#### Scenario: New unlock is purchased
- **WHEN** a viewer posts a supported `unlock_type` for a target profile they do not yet own
- **THEN** the system charges manna, creates an unlock record, and returns it

#### Scenario: Existing unlock is reused
- **WHEN** a viewer posts an `unlock_type` they already own for the same target profile
- **THEN** the system returns the existing unlock without charging manna again

### Requirement: Recommendation retrieval SHALL return only currently eligible cards
The system SHALL provide recommendation cards for the viewer and SHALL exclude cards hidden by safety, deleted cards, passed cards, same-church filtered targets, and contact-filtered targets from the active recommendation set.

#### Scenario: Today's recommendations are requested
- **WHEN** a viewer calls `GET /reco/today`
- **THEN** the system returns the active recommendation cards that remain eligible for display

#### Scenario: Extra recommendations are requested
- **WHEN** a viewer calls `POST /reco/extra`
- **THEN** the system charges manna and returns additional recommendation cards

#### Scenario: Same church or contact filtered target is skipped
- **WHEN** a viewer enabled `exclude_same_church` or `exclude_contacts`
- **THEN** the system omits matching targets from recommendation creation and response payloads

### Requirement: Recommendation cards SHALL support unlock and pass lifecycle actions
The system SHALL allow cards to be unlocked and passed according to card state rules.

#### Scenario: Locked card is unlocked
- **WHEN** a viewer calls `POST /card/unlock` for a locked card they own
- **THEN** the system charges manna, updates card state, and returns the updated card

#### Scenario: Active or seen card is passed
- **WHEN** a viewer calls `POST /card/pass` for a card they own
- **THEN** the system marks the card as passed and removes it from active recommendation display

### Requirement: Vault cards SHALL support extend and restore flows
The system SHALL support extending eligible vault cards and restoring archived vault cards subject to manna cost and policy limits.

#### Scenario: Vault is extended for a target
- **WHEN** a viewer calls `POST /vault/extend` for an eligible target profile
- **THEN** the system charges manna, records the extend event, and updates relevant card timing

#### Scenario: Archived card is restored
- **WHEN** a viewer calls `POST /vault/restore` for an archived eligible card within policy limits
- **THEN** the system charges manna, restores the card lifecycle state, and returns the restored card

### Requirement: Vault retrieval SHALL return currently eligible non-passed cards
The system SHALL expose `GET /vault` as the canonical vault retrieval endpoint.
Vault retrieval SHALL exclude passed cards and cards hidden by current safety visibility rules, including same-church and contact-based filters.

#### Scenario: Vault cards are loaded
- **WHEN** an authenticated user calls `GET /vault`
- **THEN** the system returns the viewer's currently eligible non-passed vault cards

#### Scenario: Expired archived card is hidden from vault
- **WHEN** an archived card has been in archive for more than 7 days
- **THEN** the system excludes it from the vault response

### Requirement: Vault extension SHALL enforce per-target policy limits
The system SHALL support vault extension for a target profile and SHALL enforce the current per-target extend limit.
The current implemented policy SHALL allow at most two extend actions per user-target pair and SHALL charge 1 manna per successful extend.

#### Scenario: Eligible vault extend succeeds
- **WHEN** a user calls `POST /vault/extend` for a target profile below the limit
- **THEN** the system charges 1 manna, records the extend event, and updates the relevant card timing

#### Scenario: Vault extend limit is reached
- **WHEN** a user calls `POST /vault/extend` for a target profile that already reached the extend limit
- **THEN** the system rejects the request with a vault-extend limit error

### Requirement: Vault restore SHALL enforce archived-card and weekly-limit policy
The system SHALL restore archived cards only and SHALL enforce the current weekly restore limit.
The current implemented policy SHALL allow at most two restore actions per user per current week and SHALL charge 2 manna for a successful restore.
If the target card is not currently archived, the system SHALL return the current card state without performing a paid restore.

#### Scenario: Archived card restore succeeds
- **WHEN** a user calls `POST /vault/restore` for an archived card within the weekly limit
- **THEN** the system charges 2 manna, restores the card to the active vault lifecycle, and returns the restored card

#### Scenario: Non-archived card restore is a no-op
- **WHEN** a user calls `POST /vault/restore` for a card that is not archived
- **THEN** the system returns the current card state without performing a paid restore

#### Scenario: Weekly restore limit is reached
- **WHEN** a user calls `POST /vault/restore` after reaching the weekly restore limit
- **THEN** the system rejects the request with a vault-restore limit error
