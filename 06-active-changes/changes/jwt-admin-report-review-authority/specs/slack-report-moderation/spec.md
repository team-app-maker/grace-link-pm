> Source: `grace-link-server/openspec/changes/jwt-admin-report-review-authority/specs/slack-report-moderation/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## MODIFIED Requirements

### Requirement: Report submission SHALL notify the Slack moderation channel
When a new `OPEN` report is created, the system SHALL attempt to send a Slack moderation message that summarizes the report.
The Slack message SHALL serve as an operator notification and entry point only.
The Slack message SHALL include the canonical review deep link `gracelink://admin/reports/{reportId}` that opens the authenticated moderation surface for that report.
Slack notification failure MUST NOT fail the report submission itself.

#### Scenario: Slack moderation message is sent
- **WHEN** a user successfully submits a report and Slack moderation integration is enabled
- **THEN** the system sends a Slack message for that report as a notification and review entry point

#### Scenario: Slack delivery failure does not fail report submission
- **WHEN** a user successfully submits a report but Slack delivery fails
- **THEN** the system still returns a successful report submission response

## REMOVED Requirements

### Requirement: Slack interactivity SHALL verify signed requests before applying moderation actions
**Reason**: Slack is no longer the final approval authority; report moderation authority is moved to authenticated admin JWT flows.
**Migration**: Replace Slack approve/reject button actions with a deep link or admin review link that opens the authenticated moderation screen, then call the existing admin report approve/reject API from the app or admin surface.

### Requirement: Slack moderation messages SHALL reflect the terminal review state
**Reason**: The canonical approval flow moves to authenticated admin surfaces; Slack message update behavior is no longer required as part of the authority contract.
**Migration**: Treat Slack as notify-only. If desired, a later implementation may still update Slack messages as a convenience, but that behavior is non-authoritative and outside this contract.
