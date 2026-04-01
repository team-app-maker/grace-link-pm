> Source: `grace-link-server/openspec/changes/jwt-admin-report-review-authority/proposal.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## Why

신고 승인/거절 권한을 Slack 버튼 처리에 두면 운영 채널 사용자와 내부 관리자 권한 모델이 분리되어 감사/보안 경계가 흐려진다.
Slack 은 알림과 deep link 진입점만 맡고, 실제 신고 승인/거절은 앱의 Bearer JWT 와 `ROLE_ADMIN` 기준으로만 처리되도록 계약을 재정의해야 한다.

## What Changes

- Slack 신고 moderation 역할을 "알림 + 관리자 화면 진입 링크"로 축소한다.
- 신고 승인/거절 권한을 `ROLE_ADMIN` Bearer JWT 기반 관리자 API로만 한정한다.
- Slack interactivity callback 기반 승인/거절 계약을 제거하고, Slack 메시지는 canonical deep link `gracelink://admin/reports/{reportId}` 만 포함하도록 정의한다.
- 신고 리뷰 흐름의 권한 경계와 감사 기준을 SSOT/OpenSpec 에 명시한다.

## Capabilities

### New Capabilities

### Modified Capabilities
- `safety-admin`: 신고 승인/거절 authority 를 JWT `ROLE_ADMIN` 기준으로 한정하고 review flow 를 명시한다
- `slack-report-moderation`: Slack 역할을 승인 surface 가 아닌 notify/deep-link surface 로 재정의한다

## Impact

- Affected product contract: report review authority, Slack moderation UX, admin mobile flow
- Affected implementation scope (future): Slack callback removal or deprecation, admin review API/auth enforcement, mobile deep link handling
- No code changes in this change; spec/SSOT definition only
