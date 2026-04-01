> Source: `grace-link-server/openspec/specs/onboarding-approval/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# onboarding-approval Specification

## Purpose
PASS 검증, 온보딩 제출, 상태 조회, 승인 대기 및 개발용 승인 전이를 정의한다.
## Requirements
### Requirement: PASS verification SHALL gate onboarding submission
The system SHALL require PASS verification before a user can successfully submit onboarding.
A user who has not completed PASS verification MUST NOT transition to onboarding-complete state.
When canonical phone input is provided during PASS verification, the system SHALL persist only its normalized SHA-256 hash for later contact-based visibility filtering.

#### Scenario: PASS verification succeeds
- **WHEN** a user calls `POST /auth/pass/verify` with valid PASS verification input
- **THEN** the system marks the user as PASS verified and returns updated auth status metadata

#### Scenario: PASS verification stores canonical phone hash
- **WHEN** a user completes `POST /auth/pass/verify` with a canonical phone number
- **THEN** the system stores the normalized SHA-256 phone hash without persisting the raw phone number

#### Scenario: Onboarding submit is attempted before PASS verification
- **WHEN** a user calls `POST /onboarding/submit` before PASS verification is complete
- **THEN** the system rejects the request with a PASS-related validation error

### Requirement: Onboarding submission SHALL transition users into review flow
The system SHALL accept onboarding submission after PASS verification and SHALL update the user's auth status to reflect review gating.

#### Scenario: Onboarding submission succeeds
- **WHEN** a PASS-verified user submits valid onboarding data
- **THEN** the system stores the onboarding data and returns an auth status indicating review progression

#### Scenario: Status query reflects onboarding progression
- **WHEN** a client calls `GET /auth/status` after onboarding submission
- **THEN** the system returns the current status, PASS verification flag, onboarding completion flag, and next step

### Requirement: Development approval SHALL be able to move users to approved state
The system SHALL support a development approval endpoint that moves a target user into approved status for local and integration workflows.

#### Scenario: Dev approval succeeds
- **WHEN** a caller submits `POST /dev/admin/approve-user` with a valid target user identifier
- **THEN** the system updates the user status to approved and returns updated auth status metadata
