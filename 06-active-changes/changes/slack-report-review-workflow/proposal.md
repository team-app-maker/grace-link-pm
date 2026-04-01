> Source: `grace-link-server/openspec/changes/slack-report-review-workflow/proposal.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## Why

신고는 현재 서버에 저장되고 관리자 리뷰 큐에 노출되지만, 운영팀이 즉시 인지하고 모바일 Slack 클라이언트에서 바로 처리할 수 있는 실시간 moderation workflow 가 없다.
신고 접수 즉시 Slack 으로 알리고, Slack 버튼 또는 관리자 API 로 신고 자체를 승인/거절할 수 있어야 운영 반응 속도와 감사 추적성이 올라간다.

## What Changes

- 신고 접수 시 Slack 채널로 interactive message 를 발송하는 moderation notification 흐름을 추가한다.
- Slack button click 을 검증된 interactivity callback 으로 받아 신고를 승인/거절하는 서버 경로를 추가한다.
- 관리자용 신고 승인/거절 REST API 를 추가하고, 신고 레코드에 review metadata 를 저장한다.
- 리뷰 큐와 리스크 계산을 OPEN 신고 기준으로 재정의하고, 신고 상태를 `OPEN`, `APPROVED`, `REJECTED` 로 운영한다.
- **BREAKING** chat message payload 에서 이미 제거한 `meaningful_flag` 와 무관하게, report moderation 쪽 API/DTO 에 review metadata 가 추가된다.

## Capabilities

### New Capabilities
- `slack-report-moderation`: 신고 Slack 알림, interactive action callback, Slack message update 흐름을 정의한다.

### Modified Capabilities
- `safety-admin`: 신고 상태 전이, 관리자 신고 승인/거절 API, 리뷰 큐/리스크 계산 기준을 변경한다.

## Impact

- Affected code: `GraceLinkFeatureController`, `GraceLinkFeatureService`, `FeatureEntities`, `FeatureRepositories`, `OpenApiConfig`, runtime properties, security-adjacent callback handling
- New integration: Slack Web API (`chat.postMessage`, `chat.update`) and Slack signed interactivity callback verification
- DB impact: `report_records` 에 review metadata / Slack delivery metadata 추가
- API impact: report moderation endpoints 추가, report DTO shape 확장, Slack callback endpoint 추가
