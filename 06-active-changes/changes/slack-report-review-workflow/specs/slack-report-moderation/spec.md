> Source: `grace-link-server/openspec/changes/slack-report-review-workflow/specs/slack-report-moderation/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## ADDED Requirements

### Requirement: Report submission SHALL notify the Slack moderation channel
When a new `OPEN` report is created, the system SHALL attempt to send a Slack moderation message that summarizes the report and includes approve/reject actions.
Slack notification failure MUST NOT fail the report submission itself.

#### Scenario: Slack moderation message is sent
- **WHEN** a user successfully submits a report and Slack moderation integration is enabled
- **THEN** the system sends a Slack message for that report and stores message coordinates needed for later updates

#### Scenario: Slack delivery failure does not fail report submission
- **WHEN** a user successfully submits a report but Slack delivery fails
- **THEN** the system still returns a successful report submission response

### Requirement: Slack interactivity SHALL verify signed requests before applying moderation actions
The system SHALL expose a Slack interactivity callback endpoint that validates the Slack signature and timestamp before processing approve/reject button actions.

#### Scenario: Valid Slack approve action is accepted
- **WHEN** Slack sends a signed button interaction payload for approving an `OPEN` report
- **THEN** the system verifies the request and marks the report as `APPROVED`

#### Scenario: Invalid Slack signature is rejected
- **WHEN** Slack interactivity is called with an invalid or expired signature
- **THEN** the system rejects the request without changing any report state

### Requirement: Slack moderation messages SHALL reflect the terminal review state
After a report is approved or rejected through Slack or the admin API, the system SHALL update the originating Slack moderation message to show the final state and prevent duplicate handling ambiguity.

#### Scenario: Slack message reflects approved state
- **WHEN** an `OPEN` report is approved
- **THEN** the system updates the original Slack message to show that the report has been approved and who reviewed it

#### Scenario: Already-reviewed report action is acknowledged safely
- **WHEN** Slack sends an action for a report that is already `APPROVED` or `REJECTED`
- **THEN** the system acknowledges the request without applying a second transition and updates Slack with the current final state
