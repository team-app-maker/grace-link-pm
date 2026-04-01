> Source: `grace-link-server/docs/ssot/README.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# GraceLink SSOT Index

이 디렉터리는 GraceLink의 **분리형 SSOT(single source of truth)** 문서 모음입니다.
기존 단일 문서(`docs/backend-spec.md`)에 섞여 있던 내용을 **PM-style 상위 문서 + 주제별 기술 스펙**으로 나눴습니다.

## 문서 맵

1. [01-product-prd.md](01-product-prd.md) — 제품/플랫폼 관점 PRD
2. [02-user-stories.md](02-user-stories.md) — 구현 단위로 쪼갠 핵심 user stories
3. [03-auth-session-spec.md](03-auth-session-spec.md) — 인증/세션 규약
4. [04-match-lifecycle-spec.md](04-match-lifecycle-spec.md) — 매치/인박스 상태 전이
5. [05-chat-websocket-spec.md](05-chat-websocket-spec.md) — 채팅/웹소켓 규약
6. [06-rest-api-surface.md](06-rest-api-surface.md) — REST API 표면 정리
7. [07-frontend-handoff.md](07-frontend-handoff.md) — 프론트 구현 체크리스트
8. [08-test-scenarios.md](08-test-scenarios.md) — QA/수동검증 기준 시나리오
9. [09-rn-integration-gap-handoff.md](09-rn-integration-gap-handoff.md) — RN 구현 gap 분석 및 handoff
10. [10-qa-automation-setup.md](10-qa-automation-setup.md) — 웹/모바일 QA 자동화 구성 메모
11. [11-match-archive-policy.md](11-match-archive-policy.md) — 매치/보관함 ARCHIVED 정책
12. [12-report-review-jwt-authority.md](12-report-review-jwt-authority.md) — 신고 승인 authority 정책
13. [13-db-design-and-constraints.md](13-db-design-and-constraints.md) — 서버 DB 설계/제약사항

## SSOT 운영 규칙

- **사람이 읽는 기준 문서**: 이 폴더의 문서들
- **브라우저 API 레퍼런스**: `/scalar`
- **기계가 읽는 기준 문서**: `/v3/api-docs`
- 기술 계약을 바꾸면 최소한 아래 순서로 함께 갱신합니다:
  1. PRD / user stories
  2. 해당 주제 spec (`03~06`)
  3. frontend handoff
  4. test scenarios
  5. OpenAPI / Scalar

## 변경 책임 가이드

- 제품 방향/범위 변경: `01-product-prd.md`
- 구현 우선순위/백로그 변경: `02-user-stories.md`
- 인증/세션 변경: `03-auth-session-spec.md`
- 매치 상태 전이 변경: `04-match-lifecycle-spec.md`
- 채팅/웹소켓 변경: `05-chat-websocket-spec.md`
- 엔드포인트 추가/삭제: `06-rest-api-surface.md` + OpenAPI
- 프론트 반영사항 변경: `07-frontend-handoff.md`
- QA 기준 변경: `08-test-scenarios.md`
- RN 구현 handoff 갱신: `09-rn-integration-gap-handoff.md`
- QA 자동화 메모 갱신: `10-qa-automation-setup.md`
- DB 스키마/마이그레이션 변경: `13-db-design-and-constraints.md`
