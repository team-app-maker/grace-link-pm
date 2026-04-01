> Source: `grace-link-server/openspec/changes/jwt-admin-report-review-authority/specs/safety-admin/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## MODIFIED Requirements

### Requirement: Administrators SHALL be able to approve or reject individual reports
The system SHALL expose authenticated administrator endpoints that approve or reject a report record directly.
Report approval and rejection authority MUST be determined by the server-side authenticated principal using Bearer JWT and `ROLE_ADMIN`.
Slack identity or Slack message interaction MUST NOT be treated as the final authority for approving or rejecting a report.

#### Scenario: Authenticated admin approves a report
- **WHEN** an authenticated administrator calls the report-approve endpoint for an `OPEN` report
- **THEN** the system marks the report as `APPROVED` based on the authenticated admin authority

#### Scenario: Non-admin user cannot approve a report
- **WHEN** a non-admin authenticated user calls the report-approve or report-reject endpoint
- **THEN** the system rejects the request

#### Scenario: Slack click alone is not sufficient authority
- **WHEN** an operator sees a Slack moderation message without entering an authenticated admin session
- **THEN** that Slack interaction alone cannot finalize report approval or rejection
