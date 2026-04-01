> Source: `grace-link-server/openspec/specs/chat-realtime/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# chat-realtime Specification

## Purpose
채팅 REST hydrate, WebSocket 인증/메시지 전송, 이벤트 규칙을 정의한다.
## Requirements
### Requirement: Chat list retrieval SHALL return only real chat rooms
The system SHALL expose chat room hydration through REST endpoints and SHALL return only chat rooms that were actually created from accepted matches.

#### Scenario: Chats are loaded
- **WHEN** a user calls `GET /chats`
- **THEN** the system returns chat rooms, messages grouped by room, and counterpart nicknames for accepted chat rooms only

#### Scenario: Single chat detail is loaded
- **WHEN** a user calls `GET /chat/{chatId}` for a room they participate in
- **THEN** the system returns the room detail, ordered messages, and counterpart nickname

### Requirement: WebSocket chat SHALL authenticate before non-auth frames
The system SHALL require `/ws/chat` clients to send an `auth` frame with a valid GraceLink access token before any other frame is accepted.

#### Scenario: WebSocket auth succeeds
- **WHEN** a client connects to `/ws/chat` and sends a valid `auth` frame in time
- **THEN** the system replies with `auth.ok`

#### Scenario: Client sends chat frame before auth
- **WHEN** a client sends a non-auth frame before successful authentication
- **THEN** the system emits an error and closes the socket as unauthorized

### Requirement: Chat messages SHALL be sent through WebSocket frames
The system SHALL treat WebSocket `chat.send` as the canonical message send contract.
The system SHALL emit `chat.message.created` events to relevant participants when a message is accepted.

#### Scenario: Chat message is sent
- **WHEN** an authenticated client sends `chat.send` with a valid room and non-blank body
- **THEN** the system creates the message and emits `chat.message.created` to participants

#### Scenario: Sender client message id is echoed for dedupe
- **WHEN** the sender includes `client_message_id` in a valid `chat.send` frame
- **THEN** the sender-facing event may include that `client_message_id` for optimistic UI dedupe

### Requirement: Match and room lifecycle events SHALL be emitted in real time
The system SHALL emit real-time events for accepted matches and closed rooms.

#### Scenario: Match accepted event is emitted
- **WHEN** a pending match is accepted
- **THEN** the system emits `match.accepted` to relevant connected participants

#### Scenario: Chat room is closed
- **WHEN** a room is closed by leave, timeout, or block flow
- **THEN** the system emits `chat.room.closed` with the applicable close reason

### Requirement: Realtime chat events SHALL define whether they are push-eligible
Chat-related realtime events SHALL explicitly define whether they also create Expo push deliveries for recipients.
The initial push-eligible chat event SHALL be new participant chat messages.

#### Scenario: Actor does not receive a duplicate push for their own message
- **WHEN** a chat message event is created for the sending actor
- **THEN** the system does not send a push notification back to that same actor for the same message event

#### Scenario: Recipient already has an active realtime session
- **WHEN** a chat-category event targets a recipient who already has at least one active websocket session
- **THEN** the system suppresses the chat push notification and relies on realtime delivery instead
