> Source: `grace-link-server/docs/backend-spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend supporting reference.

# GraceLink Backend Spec (Overview)

이 문서는 기존 단일 백엔드 스펙 문서의 **개요/진입점** 입니다.
상세 SSOT는 이제 `docs/ssot/` 아래의 분리 문서들을 기준으로 관리합니다.

## Canonical Sources

- 브라우저 API Reference: `/scalar`
- 기계가 읽는 OpenAPI: `/v3/api-docs`
- 사람이 읽는 분리형 SSOT: `docs/ssot/`

## Quick Summary

- `POST /match/request` 결과는 `PENDING`
- 채팅방은 `POST /match/accept` 시점에 생성
- 채팅 실시간 연결/메시지 전송은 `/ws/chat` WebSocket 기준
- 보호 API는 `Authorization: Bearer <access_token>` 기준
- `user_uuid` fallback 은 개발용 예외 동작일 뿐 공식 모바일 계약이 아님

## SSOT Document Map

1. [docs/ssot/README.md](ssot/README.md)
2. [docs/ssot/01-product-prd.md](ssot/01-product-prd.md)
3. [docs/ssot/02-user-stories.md](ssot/02-user-stories.md)
4. [docs/ssot/03-auth-session-spec.md](ssot/03-auth-session-spec.md)
5. [docs/ssot/04-match-lifecycle-spec.md](ssot/04-match-lifecycle-spec.md)
6. [docs/ssot/05-chat-websocket-spec.md](ssot/05-chat-websocket-spec.md)
7. [docs/ssot/06-rest-api-surface.md](ssot/06-rest-api-surface.md)
8. [docs/ssot/07-frontend-handoff.md](ssot/07-frontend-handoff.md)
9. [docs/ssot/08-test-scenarios.md](ssot/08-test-scenarios.md)

## Migration Note

- 기존 `docs/backend-spec.md` 에 있던 상세 계약은 `docs/ssot/03~08` 로 분리되었습니다.
- 프론트 구현 체크리스트는 `docs/ssot/07-frontend-handoff.md` 를 우선 참조하세요.
- QA/회귀 기준은 `docs/ssot/08-test-scenarios.md` 를 기준으로 유지합니다.
