> Source: `grace-link-server/openspec/changes/slack-report-review-workflow/tasks.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## 1. Spec / Contract Updates

- [x] 1.1 Update OpenSpec artifacts for Slack report moderation and report status lifecycle
- [x] 1.2 Update SSOT/OpenAPI-facing documentation for new report moderation endpoints and Slack callback semantics

## 2. Persistence / Domain

- [x] 2.1 Extend `report_records` with review metadata and Slack message metadata via Flyway migration
- [x] 2.2 Update report entities, DTOs, and repositories for `OPEN` / `APPROVED` / `REJECTED` lifecycle
- [x] 2.3 Restrict queue/risk aggregation to OPEN reports only

## 3. Slack Moderation Flow

- [x] 3.1 Add runtime Slack moderation configuration and a Slack client/service for `chat.postMessage` and `chat.update`
- [x] 3.2 Trigger Slack notification when a report is created without making report submission fail on Slack errors
- [x] 3.3 Add signed Slack interactivity callback handling for approve/reject button actions

## 4. Admin APIs / Verification

- [x] 4.1 Add authenticated admin report approve/reject endpoints and service methods
- [x] 4.2 Add regression tests for report creation, Slack callback approval/rejection, and OPEN-only queue behavior
- [x] 4.3 Run targeted and full Gradle verification and mark artifacts complete
