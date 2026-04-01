> Source: `grace-link-server/openspec/specs/notification-preferences/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# notification-preferences Specification

## Purpose
유저 단위 push 알림 카테고리 설정과 현재 preference scope 규칙을 정의한다.
## Requirements
### Requirement: Users SHALL be able to manage notification preferences by category
The system SHALL expose a preference surface allowing users to enable or disable push notifications by category.
The initial categories SHALL include at least `match`, `chat`, and `system`.

#### Scenario: User retrieves preferences
- **WHEN** an authenticated user requests their notification preferences
- **THEN** the system returns the current category values for that user

#### Scenario: User updates preferences
- **WHEN** an authenticated user submits a valid preference update
- **THEN** the system persists and returns the updated category values

### Requirement: The system SHALL define default preference values
The system SHALL define default notification preference values for new users and for existing users receiving migrated preference records.

#### Scenario: New user has no stored preferences yet
- **WHEN** a user requests notification preferences without an existing stored record
- **THEN** the system creates or returns the configured default preference set

### Requirement: Preference storage SHALL remain user-scoped in the current model
The current notification preference model SHALL remain user-scoped rather than device-scoped.
A later change MAY introduce device-specific refinement, but device-specific settings SHALL NOT be assumed in the current implementation model.

#### Scenario: User updates preferences while owning multiple devices
- **WHEN** a user updates notification preferences and has multiple registered device tokens
- **THEN** the updated settings apply to the user-level category policy rather than to just one device

