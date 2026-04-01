> Source: `grace-link-server/openspec/changes/slack-report-review-workflow/design.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## Context

현재 신고 flow 는 `POST /report` 로 `report_records` 를 저장하고, 관리자 `review/queue` 와 `review/detail` 에서 이를 조회하는 구조다.
하지만 신고는 passive queue 에만 쌓이고 Slack/mobile 운영자에게 즉시 전달되지 않으며, 신고 자체를 승인/거절하는 explicit moderation action 이 없다.

이번 변경은 외부 시스템(Slack Web API + Slack interactivity callback), 데이터 모델 변경(report status / review metadata / Slack message metadata), 새로운 moderation endpoint 를 동시에 포함하는 cross-cutting change 다.
또한 Slack callback 은 기존 Bearer auth 와 다른 trust model 을 쓰므로 signed request 검증이 필요하다.

## Goals / Non-Goals

**Goals:**
- 신고 접수 시 Slack moderation 채널에 interactive message 를 발송한다.
- Slack button click 또는 관리자 REST API 로 신고 자체를 `APPROVED` / `REJECTED` 처리한다.
- OPEN 신고만 큐/리스크 계산에 반영되도록 정리한다.
- 처리 결과를 report record 에 남기고 Slack 원본 메시지도 갱신한다.

**Non-Goals:**
- 승인된 신고가 자동으로 user suspend/reject/mask 를 수행하도록 연결하지 않는다.
- Slack slash command, modal, file upload 같은 고급 인터랙션은 추가하지 않는다.
- 별도 backoffice UI 를 만들지 않는다.

## Decisions

### 1. Slack delivery 는 bot token 기반 `chat.postMessage` / `chat.update` 를 사용한다
- **Why:** interactive block button 과 원본 메시지 갱신까지 안정적으로 다루려면 app-level API 가 필요하다.
- **Rejected:** Incoming webhook only | 버튼 interactivity 후 원본 메시지 갱신/일관된 auth model 이 불편하다.

### 2. Slack callback 은 `/slack/interactivity` 단일 endpoint 에서 signed request 를 검증한다
- **Why:** Slack interactivity payload 는 form-urlencoded raw body 서명이 필요하므로 별도 명확한 entrypoint 가 적합하다.
- **Rejected:** 기존 admin REST endpoint 재사용 | Slack mobile button click 은 Bearer JWT 를 제공하지 않는다.

### 3. 신고 상태는 `OPEN`, `APPROVED`, `REJECTED` 세 값으로 단순화한다
- **Why:** 이번 요구사항은 신고 승인/거절에 집중되어 있고 `IN_REVIEW` 같은 중간 상태는 현재 운영 필요가 없다.
- **Rejected:** `OPEN/IN_REVIEW/RESOLVED/...` 다단계 상태 | 현재 workflow 대비 복잡도만 증가한다.

### 4. review metadata 와 Slack message metadata 는 `report_records` 에 직접 저장한다
- **Why:** 한 신고가 한 Slack moderation message 를 갖는 현재 모델에서는 별도 join table 없이도 추적이 가능하다.
- **Rejected:** 별도 slack_report_messages table | 현재 요구 범위 대비 과하다.

### 5. Slack 전송 실패는 신고 접수를 실패시키지 않는다
- **Why:** 유저 safety action 은 외부 SaaS 장애 때문에 유실되면 안 된다. 신고 저장이 primary, Slack 통지는 secondary 다.
- **Rejected:** Slack 실패 시 `/report` 전체 실패 | 안전 기능 가용성이 Slack 상태에 종속된다.

### 6. queue/risk 는 OPEN 신고만 기준으로 계산한다
- **Why:** 이미 승인/거절된 신고까지 계속 queue/risk 에 반영되면 운영 의미가 흐려진다.
- **Rejected:** 전체 신고 누적 기준 유지 | 처리 완료된 이력이 현재 작업 큐를 오염시킨다.

## Risks / Trade-offs

- [Risk] Slack callback actor 는 기존 internal admin id 와 1:1 매핑되지 않을 수 있음 → Mitigation: `reviewed_by` 에 raw actor identifier(`admin:<id>` or `slack:<userId>`) 를 저장한다.
- [Risk] 같은 신고를 동시에 두 명이 처리할 수 있음 → Mitigation: terminal status 는 idempotent 하게 처리하고, 이미 처리된 경우 현재 상태를 반환한다.
- [Risk] Slack message update 실패 시 UI 와 DB 상태가 잠시 어긋날 수 있음 → Mitigation: DB 상태를 source of truth 로 두고 update 실패를 로깅한다.
- [Risk] Slack signing secret 검증 구현이 틀리면 위조 요청 수용 가능 → Mitigation: raw body + timestamp + HMAC SHA256 방식으로 검증하고 허용 시간창을 제한한다.

## Migration Plan

- Flyway 로 `report_records` 에 status lifecycle / review metadata / Slack metadata 컬럼을 추가한다.
- 신규 환경은 migration chain 으로 바로 최종 스키마에 도달하게 하고, 기존 환경은 무손실 확장 migration 으로 적용한다.
- Slack 설정이 비어 있으면 notification send/update 는 no-op 로 동작하게 해 rollout risk 를 줄인다.

## Open Questions

- 현재 v1 에서는 Slack actor allowlist 를 두지 않고 signed request + 내부 채널 접근 통제로 가정한다. 필요하면 후속 change 로 `allowed-user-ids` 를 추가할 수 있다.
