> Source: `grace-link-server/openspec/changes/jwt-admin-report-review-authority/design.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## Context

현재 구현 계약은 Slack moderation 메시지에서 approve/reject action 을 받아 서버가 직접 신고 상태를 바꾸는 흐름을 포함한다.
하지만 운영 관점에서는 최종 승인 권한을 Slack actor 가 아니라 내부 관리자 세션(`ROLE_ADMIN`) 에 두는 편이 권한 모델, 감사 이력, 모바일 관리자 UX 모두에 더 일관적이다.

이번 change 는 구현이 아니라 목표 계약을 먼저 정리하는 문서 change 다.
핵심은 Slack 을 approval authority 에서 분리하고, 앱/관리 화면에서 JWT 기반 admin endpoint 를 호출하는 흐름을 canonical path 로 확정하는 것이다.

## Goals / Non-Goals

**Goals:**
- 신고 승인/거절의 유일한 권한 경계를 Bearer JWT + `ROLE_ADMIN` 으로 정의한다.
- Slack 메시지는 notify + deep link 역할만 수행하도록 정의한다.
- 감사 추적 기준을 internal admin actor 기준으로 정리한다.

**Non-Goals:**
- 모바일 관리자 화면 자체 구현
- Slack app UI/Block Kit 세부 디자인 확정
- 기존 moderation data model 의 즉시 구현 변경

## Decisions

### 1. Slack 은 notify/deep-link surface 로만 사용한다
- **Why:** Slack 은 운영자 attention/entrypoint 에는 적합하지만, 최종 권한 판정 source 로 두면 내부 auth model 과 분리된다.
- **Rejected:** Slack callback 으로 직접 승인/거절 | Slack identity 와 internal admin authority 가 따로 놀게 된다.

### 2. 신고 승인/거절은 authenticated admin API only 로 정의한다
- **Why:** 이미 서버는 JWT 기반 권한 모델을 갖고 있고 `ROLE_ADMIN` 판정이 canonical security boundary 다.
- **Rejected:** Slack allowlist 를 운영 권한 기준으로 승격 | 앱/서버 권한 체계와 중복된다.

### 3. Slack 메시지는 `gracelink://admin/reports/{reportId}` deep link 만 포함한다
- **Why:** Slack 메시지 클릭 후 실제 처리 화면에서 context 를 충분히 보고 결정하도록 유도하는 것이 실수 방지에 좋다.
- **Rejected:** Slack message 에서 one-tap moderation 유지 | 빠르지만 리뷰 컨텍스트 부족과 오조작 리스크가 있다.
- **Rejected:** 웹 admin URL 을 canonical 로 병행 | 모바일 운영 맥락에서 딥링크 하나로 고정하는 편이 구현/QA/운영이 단순하다.

### 4. 감사 이력은 internal admin actor 기준으로만 남긴다
- **Why:** 승인/거절의 최종 행위자는 앱의 관리자 세션이어야 하므로 `admin_id` 기준 audit 이 가장 신뢰 가능하다.
- **Rejected:** Slack user id 를 최종 reviewer 로 간주 | 내부 계정 체계와 연결이 약하다.

## Risks / Trade-offs

- [Risk] Slack 에서 바로 처리하던 UX 보다 한 단계 더 들어가야 해 속도가 느려질 수 있음 → Mitigation: deep link 로 report detail 화면을 바로 열어 friction 을 최소화한다
- [Risk] 구현 전까지 현재 코드와 목표 계약이 잠시 다를 수 있음 → Mitigation: 이번 change 는 pre-implementation SSOT 로 명시하고 후속 implementation PR 에서 일치시킨다
- [Risk] 모바일 관리자 화면이 아직 충분하지 않으면 운영자가 불편할 수 있음 → Mitigation: 앱/관리 화면 준비 범위를 별도 task 로 분리한다

## Migration Plan

- 이번 change 에서는 문서/스펙만 확정한다
- 후속 구현 change 에서 Slack interactivity callback 을 deprecate 하거나 notify-only 로 축소한다
- same release 또는 직후 release 에서 `gracelink://admin/reports/{reportId}` deep link 를 admin report approve/reject 화면에 연결한다

## Open Questions

- 없음
