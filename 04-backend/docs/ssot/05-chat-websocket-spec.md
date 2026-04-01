> Source: `grace-link-server/docs/ssot/05-chat-websocket-spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# Chat & WebSocket Spec

## Chat Responsibilities Split

### REST
- `GET /chats` — 채팅방 목록 + 메시지 맵 hydrate
- `GET /chat/{chatId}` — 단일 채팅방 상세 hydrate
- `POST /chat/leave` — 채팅 종료

### WebSocket
- `/ws/chat` 연결
- `auth` 프레임으로 인증
- `chat.send` 프레임으로 메시지 전송
- 서버 이벤트 수신

## Connection
- local: `ws://localhost:8080/ws/chat`
- prod: `wss://<host>/ws/chat`

연결 후 규칙:
- 10초 안에 `auth` 프레임 전송
- 인증 전 `auth` 외 프레임 전송 시 실패

## Client → Server: `auth`

```json
{
  "type": "auth",
  "request_id": "auth-1",
  "access_token": "<JWT access token>"
}
```

## Server → Client: `auth.ok`

```json
{
  "type": "auth.ok",
  "request_id": "auth-1",
  "user_uuid": "user_123",
  "connected_at": "2026-03-17T12:34:56Z"
}
```

## Client → Server: `chat.send`

```json
{
  "type": "chat.send",
  "request_id": "send-1",
  "client_message_id": "local-msg-1",
  "chat_id": "chat_abcd1234",
  "body": "안녕하세요 :)"
}
```

필드 규칙:
- `chat_id` 필수
- `body` 는 trim 후 빈 문자열이면 실패
- `client_message_id` 는 optimistic UI dedupe 용

## Server Events
- `match.accepted`
- `chat.message.created`
- `chat.room.closed`
- `heartbeat`
- `error`

## `match.accepted`
- 매치 요청 시점이 아니라 **수락 시점**에만 옴
- 새 chat room 생성 이벤트로 취급

## `chat.message.created`
- sender / receiver 모두 수신
- sender 이벤트에만 `client_message_id` 가 들어갈 수 있음

## `chat.room.closed`
`closed_reason` 예시:
- `NO_RESPONSE_ARCHIVED`
- `LEFT`
- `BLOCKED`
