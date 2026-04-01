> Source: `grace-link-server/docs/ssot/04-match-lifecycle-spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# Match Lifecycle Spec

## State Model
- `PENDING`
- `ACCEPTED`
- `ARCHIVED`
- `REJECTED_REFUNDED`
- `EXPIRED_REFUNDED_UNSEEN`
- `EXPIRED_REFUNDED_SEEN`

## 1. Request Match

### Endpoint
`POST /match/request`

### Semantics
- sender 가 receiver 에게 매치 요청 생성
- 이 시점에는 **chat room 미생성**
- match cost 차감
- 단, receiver 가 현재 visibility 필터(같은 교회 제외 / 연락처 제외)에 의해 숨김 대상이면 요청 자체가 거부됨

### Response
- `match.status = PENDING`
- `chat_room = null`

### Notes
- 요청 직후 `GET /chats` 에 나타나지 않음
- inbox/sent 화면에서 상태를 추적해야 함

## 2. Accept Match

### Endpoint
`POST /match/accept`

### Semantics
- receiver 가 받은 매치를 수락
- 이 시점에 chat room 생성
- 관련 클라이언트에 `match.accepted` 이벤트 발행

### Response
- `match.status = ACCEPTED`
- `chat_room != null`

## 2.1 Auto Archive After No Response

### Rule
- `ACCEPTED` 이후 채팅방 생성 시점부터 48시간 동안 참여자 메시지가 1건도 없으면 자동 보관
- 이때 `match.status = ARCHIVED`
- chat room 은 닫히고 `GET /chats` 에서 제외
- inbox 에서는 `archived_at` 기준 7일 동안만 노출

## 3. Reject Match

### Endpoint
`POST /match/reject`

### Semantics
- receiver 가 매치를 거절
- PENDING 매치면 sender 에게 환불 적용

### Response
- 상태값 반환

## Inbox Rules

### `GET /inbox/received`
- 내가 받은 매치 요청 목록
- 상대 닉네임 포함
- 처음 열람 시 `receiver_opened_at` 갱신 가능

### `GET /inbox/sent`
- 내가 보낸 매치 요청 목록
- 상대 닉네임 포함
- `ARCHIVED` 상태는 보관 후 7일까지만 노출

## Chat Visibility Rule
- `PENDING` 매치는 채팅 목록에 노출되지 않음
- 오직 `ACCEPTED` 후 실제 chat room 이 생긴 매치만 채팅에서 다룸
- 단, 48시간 무응답으로 `ARCHIVED` 처리된 방은 `GET /chats` 에 다시 나오지 않음
