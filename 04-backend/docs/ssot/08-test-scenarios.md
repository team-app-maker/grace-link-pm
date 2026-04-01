> Source: `grace-link-server/docs/ssot/08-test-scenarios.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# Test Scenarios

이 문서는 pm-skills의 **test-scenarios** 형식을 따라 핵심 회귀 시나리오를 정리한 문서입니다.

## Scenario 1 — SSO 로그인 후 세션 복구

**Test Objective:** 로그인 응답과 `GET /auth/me` 가 같은 세션 기준 정보를 제공하는지 검증

**Starting Conditions:**
- 유효한 Google 또는 Apple 로그인 입력 존재
- 서버 실행 중

**User Role:** 모바일 사용자

**Test Steps:**
1. `POST /auth/sso/sign-in` 또는 `/auth/sso/code/sign-in` 호출
2. 응답에서 `access_token`, `refresh_token`, `user_uuid`, `auth_status` 확인
3. `Authorization: Bearer <access_token>` 로 `GET /auth/me` 호출

**Expected Outcomes:**
- 로그인 성공 시 token pair 반환
- `GET /auth/me` 가 `member_id`, `role`, `auth_status` 반환
- 무효 토큰이면 `TOKEN_INVALID`

## Scenario 2 — 매치 요청은 pending 만 만든다

**Test Objective:** `requestMatch` 가 chat room 없이 pending 상태만 만드는지 검증

**Starting Conditions:**
- sender, receiver 두 사용자 존재
- sender 가 충분한 manna 보유

**User Role:** 승인된 사용자

**Test Steps:**
1. sender 가 `POST /match/request` 호출
2. 응답의 `match.status`, `chat_room` 확인
3. `GET /chats` 로 sender 채팅 목록 확인

**Expected Outcomes:**
- `match.status=PENDING`
- `chat_room=null`
- 새 match 가 채팅 목록에 나타나지 않음

## Scenario 3 — 매치 수락 시 chat room 생성

**Test Objective:** `acceptMatch` 가 채팅방을 생성하고 이벤트를 발행하는지 검증

**Starting Conditions:**
- receiver 가 받은 PENDING 매치 존재
- sender, receiver 가 `/ws/chat` 에 연결 가능

**User Role:** 매치 수신자

**Test Steps:**
1. receiver 가 `POST /match/accept` 호출
2. 응답의 `chat_room` 확인
3. 연결 중인 클라이언트에서 `match.accepted` 이벤트 수신 확인

**Expected Outcomes:**
- `match.status=ACCEPTED`
- `chat_room != null`
- sender/receiver 모두 `match.accepted` 이벤트 수신

## Scenario 4 — 채팅 메시지는 WebSocket 으로만 전송

**Test Objective:** `chat.send` 가 WebSocket 기준으로 정상 동작하는지 검증

**Starting Conditions:**
- 열린 chat room 존재
- 유효한 access token 존재

**User Role:** 채팅 참여자

**Test Steps:**
1. `/ws/chat` 연결 후 `auth` 프레임 전송
2. `chat.send` 프레임 전송
3. `chat.message.created` 이벤트 확인

**Expected Outcomes:**
- WebSocket 전송은 성공
- 관련 참여자가 `chat.message.created` 수신

## Scenario 5 — purchase duplicate receipt 방지

**Test Objective:** 같은 receipt 재사용이 차단되는지 검증

**Starting Conditions:**
- 구매 가능한 사용자 존재
- 동일 receipt 문자열 준비

**User Role:** 승인된 사용자

**Test Steps:**
1. `POST /purchase/verify` 로 receipt 1회 사용
2. 같은 receipt 로 다시 호출

**Expected Outcomes:**
- 첫 호출은 성공하고 manna 지급
- 두 번째 호출은 `RECEIPT_INVALID`

## Scenario 6 — block 이 열린 채팅을 닫는다

**Test Objective:** 차단 시 기존 열린 채팅방이 정리되는지 검증

**Starting Conditions:**
- 두 사용자 사이 열린 chat room 존재

**User Role:** 차단 실행 사용자

**Test Steps:**
1. `POST /block` 호출
2. 채팅방 상태 확인
3. 관련 클라이언트 이벤트 확인

**Expected Outcomes:**
- block record 생성
- 열린 채팅방이 닫힘
- 필요 이벤트/노출 숨김 후속 처리 가능 상태가 됨

## Scenario 7 — 같은 교회 필터가 visibility 전역에 적용된다

**Test Objective:** 같은 교회 제외가 vault / profile detail / match request 에 일관되게 적용되는지 검증

**Starting Conditions:**
- viewer 와 target 이 같은 `church_id` 를 가짐
- viewer 가 `exclude_same_church=true`

**User Role:** 승인된 사용자

**Test Steps:**
1. `PATCH /filters` 로 `exclude_same_church=true` 설정
2. `GET /vault` 호출
3. `GET /profile/detail` 호출
4. `POST /match/request` 호출

**Expected Outcomes:**
- vault 에서 해당 target 이 제외됨
- profile detail 접근이 거부됨
- match request 가 생성되지 않음

## Scenario 8 — 연락처 해시 스냅샷 교체가 visibility 를 갱신한다

**Test Objective:** 연락처 해시 업로드/교체/삭제가 현재 snapshot 기준으로 visibility 를 바꾸는지 검증

**Starting Conditions:**
- target 이 canonical `phone_hash` 를 보유
- viewer 가 `exclude_contacts=true`

**User Role:** 승인된 사용자

**Test Steps:**
1. viewer 가 `PUT /contacts/me/hashes` 로 target 과 매칭되는 해시 업로드
2. `GET /vault`, `GET /profile/detail`, `POST /match/request` 확인
3. viewer 가 다른 해시로 snapshot 교체
4. 동일 API 들을 다시 확인
5. viewer 가 `DELETE /contacts/me/hashes` 호출

**Expected Outcomes:**
- 매칭 해시가 있을 때 target 은 숨겨짐
- snapshot 교체 후 이전 매칭은 사라지고 새 snapshot 기준만 적용됨
- snapshot 삭제 후 연락처 기반 숨김이 해제됨
