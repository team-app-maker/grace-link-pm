> Source: `grace-link-RN/docs/api/04-match-inbox-chat.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# API 4: 매칭/인박스/채팅

## 4.1 `POST /match/request`

### 요청

```json
{
  "sender_uuid": "string",
  "receiver_uuid": "string",
  "match_type": "NORMAL|SUPER"
}
```

### 응답

```json
{ "match": {
  "match_id":"string","sender_uuid":"string","receiver_uuid":"string",
  "match_type":"NORMAL|SUPER","status":"PENDING",
  "created_at":"ISO","responded_at":null,
  "receiver_opened_at":null,"expired_at":null
}}
```

### 호출 위치

- `app/profile/[targetUuid].tsx` `handleRequestMatch`

### 비용

- NORMAL: 3 만나
- SUPER: 6 만나

### 에러

- `USER_NOT_FOUND`, `INSUFFICIENT_MANNA`

---

## 4.2 `POST /match/accept`

### 요청

```json
{ "match_id": "string", "receiver_uuid": "string" }
```

### 응답

```json
{ "match": { ...MatchRecord... } }
```

### 호출 위치

- `app/(tabs)/inbox.tsx` `handleAccept`

### 구현 포인트

- receiver_uuid 확인 후 승인 가능
- NORMAL 승인 시 비용 3 차감
- 승인 시 채팅방 생성(없을 경우)

### 에러

- `MATCH_NOT_FOUND`, `FORBIDDEN`, `USER_NOT_FOUND`, `INSUFFICIENT_MANNA`

---

## 4.3 `POST /match/reject`

### 요청

```json
{ "match_id": "string" }
```

### 응답

```json
{ "status": "REJECTED_REFUNDED|..." }
```

### 호출 위치

- `app/(tabs)/inbox.tsx` `handleReject`

### 구현 포인트

- 신청 상태를 환급/완료 상태로 변경
- sender에게 매칭 신청 비용 전액 환급

### 에러

- `MATCH_NOT_FOUND`, `USER_NOT_FOUND`

---

## 4.4 `GET /inbox/received?user_uuid=`

### 응답

```json
{ "items": [MatchRecord...] }
```

### 호출 위치

- `app/(tabs)/inbox.tsx`

### 구현 포인트

- 받는 목록만 조회
- 첫 조회 시 `receiver_opened_at` 마킹

### 에러

- `USER_NOT_FOUND`, `PROFILE_HIDDEN_BY_SAFETY`

---

## 4.5 `GET /inbox/sent?user_uuid=`

### 응답

```json
{ "items": [MatchRecord...] }
```

### 호출 위치

- `app/(tabs)/inbox.tsx`

### 구현 포인트

- 신청 발신 목록 조회

### 에러

- `USER_NOT_FOUND`, `PROFILE_HIDDEN_BY_SAFETY`

---

## 4.6 `GET /chats?user_uuid=`

### 응답

```json
{
  "rooms": [
    {
      "chat_id":"string","match_id":"string","status":"OPEN|CLOSED",
      "created_at":"ISO","first_msg_deadline_at":"ISO","reply_deadline_at":"ISO|null"
    }
  ],
  "messagesByRoom": {
    "<chat_id>": [
      { "msg_id":"string", "chat_id":"string", "sender_uuid":"string", "body":"string", "created_at":"ISO", "meaningful_flag": true }
    ]
  }
}
```

### 호출 위치

- `app/(tabs)/chat.tsx`(룸 목록)
- `app/chat/[chatId].tsx`(단일 방 로딩)

### 구현 포인트

- sender가 차단/필터/정지 상태면 목록에서 제외
- 채팅방 상태/타임라인 기반 데드라인 표시

### 에러

- `USER_NOT_FOUND`, `PROFILE_HIDDEN_BY_SAFETY`

---

## 4.7 `POST /chat/send`

### 요청

```json
{ "chat_id": "string", "sender_uuid": "string", "body": "string" }
```

### 응답

```json
{ "message": {"msg_id":"string","chat_id":"string","sender_uuid":"string","body":"string","created_at":"ISO","meaningful_flag": true|false}, "meaningful_flag": true|false }
```

### 호출 위치

- `app/chat/[chatId].tsx` `sendMutation`

### 메시지 규칙(현재 mock)

- 의미있는 메시지: 길이 5자 이상 + 한글/영문 포함 + 밈 반복문자 전용 문장 불허

### 구현 포인트

- 방이 OPEN일 때만 전송
- 상대응답 타임라인 갱신

### 에러

- `CHAT_ROOM_NOT_FOUND`, `CHAT_ROOM_CLOSED`, `MATCH_NOT_FOUND`, `FORBIDDEN`, `CHAT_HIDDEN_BY_SAFETY`

