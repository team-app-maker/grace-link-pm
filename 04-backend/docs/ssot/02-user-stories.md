> Source: `grace-link-server/docs/ssot/02-user-stories.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# GraceLink User Stories

이 문서는 `01-product-prd.md` 를 구현 단위로 나눈 핵심 스토리 모음입니다.
형식은 pm-skills의 **user stories** 스타일을 따릅니다.

## Epic A — Auth & Session

### Story A1 — SSO 로그인
**As a** mobile user, **I want** to sign in with Google or Apple and receive server-issued JWT tokens, **so that** I can access protected APIs without custom session logic.

Acceptance Criteria:
- `POST /auth/sso/sign-in` 또는 `/auth/sso/code/sign-in` 성공 시 token pair 가 반환된다.
- 응답에는 `user_uuid`, `access_token`, `refresh_token`, `token_type`, `expires_in`, `auth_status` 가 포함된다.
- 이후 보호 API는 Bearer access token 기준으로 호출된다.

### Story A2 — 세션 복구
**As a** returning user, **I want** the app to restore my session from a valid access token, **so that** I do not need to sign in again every app launch.

Acceptance Criteria:
- `GET /auth/me` 가 세션 복구 기준 API로 동작한다.
- 응답에는 `member_id`, `role`, `auth_status` 가 포함된다.
- 토큰이 무효하면 `TOKEN_INVALID` 로 실패한다.

## Epic B — Onboarding & Approval

### Story B1 — PASS 검증 후 온보딩 제출
**As a** new applicant, **I want** to complete PASS verification before onboarding submission, **so that** the system can gate access by trust level.

Acceptance Criteria:
- PASS 미검증 상태에서는 onboarding submit 이 거부된다.
- onboarding 완료 후 상태는 `UNDER_REVIEW` 로 전이될 수 있다.
- 승인 전에는 일부 기능 접근이 제한된다.

## Epic C — Match & Inbox

### Story C1 — 매치 요청 생성
**As a** user, **I want** to request a match without immediately opening chat, **so that** the other user can explicitly accept first.

Acceptance Criteria:
- `POST /match/request` 성공 시 `match.status=PENDING`
- 응답의 `chat_room` 은 `null` 가능
- 요청 직후 `GET /chats` 에는 나타나지 않는다.

### Story C2 — 매치 수락 후 채팅 시작
**As a** receiving user, **I want** chat to open only when I accept the match, **so that** unsolicited chat rooms are not created automatically.

Acceptance Criteria:
- `POST /match/accept` 성공 시 `match.status=ACCEPTED`
- 응답에 `chat_room` 이 포함된다.
- 관련 WebSocket 클라이언트는 `match.accepted` 이벤트를 받는다.

### Story C3 — 매치 거절 및 환불
**As a** receiving user, **I want** to reject an incoming match, **so that** I can decline unwanted interaction cleanly.

Acceptance Criteria:
- `POST /match/reject` 로 거절 가능
- PENDING 매치 거절 시 발신자에게 환불 적용
- 이미 종료된 매치에는 중복 처리되지 않는다.

## Epic D — Chat

### Story D1 — 채팅 초기 로딩
**As a** chatting user, **I want** to load my existing chat rooms and messages, **so that** I can resume conversations reliably.

Acceptance Criteria:
- `GET /chats` 는 채팅방 목록과 메시지 맵을 반환한다.
- `PENDING` 매치는 채팅 목록에 포함되지 않는다.
- 필요 시 `GET /chat/{chatId}` 로 단일 방 hydrate 가능하다.

### Story D2 — WebSocket으로 메시지 전송
**As a** chatting user, **I want** to send messages via WebSocket, **so that** message delivery and events stay real-time and consistent.

Acceptance Criteria:
- `/ws/chat` 연결 후 10초 이내 `auth` 프레임을 보내야 한다.
- 메시지 전송은 `chat.send` 프레임을 사용한다.

## Epic E — Safety & Commerce

### Story E1 — 결제/광고 보상으로 manna 획득
**As a** user, **I want** to obtain manna via purchase or rewarded ads, **so that** I can unlock product actions governed by manna.

Acceptance Criteria:
- `POST /purchase/verify` 는 중복 receipt 를 허용하지 않는다.
- `POST /rewarded-ad/claim` 은 승인 사용자만 가능하다.
- cooldown / daily cap / replay protection 이 적용된다.

### Story E2 — 신고/차단
**As a** user, **I want** to report or block unsafe counterparts, **so that** I can protect myself and reduce future exposure.

Acceptance Criteria:
- `POST /report` 로 신고 기록 생성
- `POST /block` 으로 노출/대화 차단
- 열린 채팅방이 있으면 서버가 정리한다.

### Story E3 — 같은 교회 / 연락처 visibility 필터
**As a** user, **I want** to hide people from the same church or already in my contacts, **so that** recommendation and 접근 흐름이 내 선호에 맞게 정리되길 원한다.

Acceptance Criteria:
- `PATCH /filters` 의 `exclude_same_church`, `exclude_contacts` 가 서버 visibility 규칙에 반영된다.
- `PUT /contacts/me/hashes` 는 주소록 해시 스냅샷을 전체 교체한다.
- 같은 교회 또는 연락처 매칭 대상은 `GET /reco/today`, `GET /vault`, `GET /profile/detail`, `POST /match/request` 에서 제외 또는 거부된다.
