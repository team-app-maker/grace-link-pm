> Source: `grace-link-server/openspec/changes/slack-report-review-workflow/specs/safety-admin/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## MODIFIED Requirements

### Requirement: Users SHALL be able to report unsafe behavior
The system SHALL allow authenticated users to create report records against target users in supported contexts.
Supported contexts MUST be limited to `profile` and `chat`.
The system MUST reject self-report attempts.
New report records SHALL be created in `OPEN` status.

#### Scenario: Report is submitted
- **WHEN** a user calls `POST /report` with a valid target, supported context, and reason
- **THEN** the system creates and returns a report record in `OPEN` status

#### Scenario: Self-report is rejected
- **WHEN** a user calls `POST /report` with their own user identifier as the target
- **THEN** the system rejects the request

### Requirement: Administrators SHALL be able to review and act on risk records
The system SHALL expose risk review queue, detail, action history, and state-changing admin actions to authorized administrators.
The review queue and risk aggregation MUST consider only `OPEN` reports.

#### Scenario: Admin queue is loaded
- **WHEN** an authorized admin calls `GET /admin/review/queue`
- **THEN** the system returns low-risk and high-risk groups built from currently `OPEN` reports only

#### Scenario: Admin applies a moderation action
- **WHEN** an authorized admin calls one of the admin review action endpoints with valid input
- **THEN** the system records the action and applies the requested moderation state change

### Requirement: Admin review detail SHALL expose profile, reports, risk, and mask state
The system SHALL provide an admin review detail endpoint that returns the target user's profile, associated reports, computed risk flag, and current admin mask state.
The reports list SHALL include each report's moderation status and review metadata when available.
The current risk payload SHALL be derived from currently `OPEN` reports only.

#### Scenario: Admin review detail is loaded
- **WHEN** an authorized admin calls `GET /admin/review/detail` for a target user
- **THEN** the system returns the target profile, related reports with statuses, the current risk payload, and whether the user is masked

## ADDED Requirements

### Requirement: Administrators SHALL be able to approve or reject individual reports
The system SHALL expose authenticated administrator endpoints that approve or reject a report record directly.
Approving or rejecting a report MUST move that report out of `OPEN` status and MUST persist review metadata.

#### Scenario: Report is approved
- **WHEN** an authorized admin calls the report-approve endpoint for an `OPEN` report
- **THEN** the system marks the report as `APPROVED` and records who reviewed it and when

#### Scenario: Report is rejected
- **WHEN** an authorized admin calls the report-reject endpoint for an `OPEN` report
- **THEN** the system marks the report as `REJECTED` and records who reviewed it and when

#### Scenario: Reviewed report is idempotently handled
- **WHEN** an authorized admin calls an approve or reject endpoint for a report that is already terminal
- **THEN** the system returns the current reviewed report state without creating a duplicate transition
