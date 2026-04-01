> Source: `grace-link-server/openspec/specs/safety-admin/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# safety-admin Specification

## Purpose
신고, 차단, 필터 설정, 리스크 리뷰, 관리자 moderation action 규칙을 정의한다.
## Requirements
### Requirement: Users SHALL be able to report unsafe behavior
The system SHALL allow authenticated users to create report records against target users in supported contexts.

#### Scenario: Report is submitted
- **WHEN** a user calls `POST /report` with a valid target, context, and reason
- **THEN** the system creates and returns a report record

### Requirement: Users SHALL be able to block other users
The system SHALL allow authenticated users to block target users and SHALL prevent duplicate block records.
Blocking a user SHALL close open rooms between the two users if such rooms exist.

#### Scenario: New block is created
- **WHEN** a user calls `POST /block` for a target they have not blocked before
- **THEN** the system creates a block record and applies related chat visibility consequences

#### Scenario: Existing block is reused
- **WHEN** a user calls `POST /block` for a target they already blocked
- **THEN** the system returns the existing block record instead of creating a duplicate

### Requirement: Users SHALL be able to retrieve and update filter settings
The system SHALL allow authenticated users to view and update their filter preferences.

#### Scenario: Filter settings are first requested
- **WHEN** a user calls `GET /filters` without an existing settings row
- **THEN** the system creates default filter settings and returns them

#### Scenario: Filter settings are patched
- **WHEN** a user calls `PATCH /filters` with supported filter fields
- **THEN** the system persists and returns the updated filter settings

### Requirement: Administrators SHALL be able to review and act on risk records
The system SHALL expose risk review queue, detail, action history, and state-changing admin actions to authorized administrators.

#### Scenario: Admin queue is loaded
- **WHEN** an authorized admin calls `GET /admin/review/queue`
- **THEN** the system returns low-risk and high-risk review groups

#### Scenario: Admin applies a moderation action
- **WHEN** an authorized admin calls one of the admin review action endpoints with valid input
- **THEN** the system records the action and applies the requested moderation state change

### Requirement: Admin review detail SHALL expose profile, reports, risk, and mask state
The system SHALL provide an admin review detail endpoint that returns the target user's profile, associated reports, computed risk flag, and current admin mask state.

#### Scenario: Admin review detail is loaded
- **WHEN** an authorized admin calls `GET /admin/review/detail` for a target user
- **THEN** the system returns the target profile, related reports, current risk payload, and whether the user is masked

### Requirement: Admin action history SHALL be retrievable per target user
The system SHALL provide an endpoint to retrieve moderation action history for a target user.

#### Scenario: Admin action history is loaded
- **WHEN** an authorized admin calls `GET /admin/review/actions` for a target user
- **THEN** the system returns the recorded admin actions for that target ordered for review

### Requirement: Admin moderation endpoints SHALL map to explicit user state transitions
The system SHALL expose explicit moderation endpoints for approve, reject, suspend, unsuspend, and mask-toggle flows.
Approve SHALL move the target to approved state, reject SHALL move the target to rejected state, suspend SHALL move the target to suspended state, and unsuspend SHALL restore a suspended user to approved state.

#### Scenario: Admin approves a target
- **WHEN** an authorized admin calls `POST /admin/review/approve`
- **THEN** the system marks the target user as approved and records an admin action

#### Scenario: Admin rejects a target
- **WHEN** an authorized admin calls `POST /admin/review/reject`
- **THEN** the system marks the target user as rejected and records an admin action

#### Scenario: Admin suspends a target
- **WHEN** an authorized admin calls `POST /admin/review/suspend`
- **THEN** the system marks the target user as suspended and records an admin action

#### Scenario: Admin unsuspends a suspended target
- **WHEN** an authorized admin calls `POST /admin/review/unsuspend` for a suspended user
- **THEN** the system restores the target user to approved state and records an admin action

### Requirement: Admin mask toggling SHALL expose the next masked state
The system SHALL allow an authorized admin to toggle a target user's admin mask state and SHALL return the resulting masked value.

#### Scenario: Admin toggles mask state
- **WHEN** an authorized admin calls `POST /admin/review/mask`
- **THEN** the system records a mask-toggle admin action and returns the resulting masked state

