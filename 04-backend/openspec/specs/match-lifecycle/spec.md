> Source: `grace-link-server/openspec/specs/match-lifecycle/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# match-lifecycle Specification

## Purpose
매치 요청/수락/거절, inbox visibility, chat room 생성 시점과 무응답 보관 정책을 정의한다.
## Requirements
### Requirement: Match requests SHALL create pending matches before chat starts
The system SHALL create a match request in `PENDING` state when a sender requests a match.
The system MUST NOT create a chat room at request time.
Targets hidden by current visibility filters MUST NOT receive a new match request.

#### Scenario: Match request succeeds
- **WHEN** a sender calls `POST /match/request` with a valid target and sufficient manna
- **THEN** the system returns a match in `PENDING` state and `chat_room` remains null

#### Scenario: Newly requested match does not appear as a chat room
- **WHEN** a sender requests a match and then loads `GET /chats`
- **THEN** the pending match is not included in the chat room list

#### Scenario: Visibility-hidden target is rejected
- **WHEN** a sender calls `POST /match/request` for a target hidden by same-church or contact visibility filters
- **THEN** the system rejects the request before creating a pending match

### Requirement: Match acceptance SHALL create the chat room
The system SHALL create the chat room only when the receiver accepts the pending match.

#### Scenario: Match acceptance succeeds
- **WHEN** a receiver calls `POST /match/accept` for a pending match they received
- **THEN** the system transitions the match to `ACCEPTED` and returns a non-null `chat_room`

#### Scenario: Re-accepting an accepted match reuses existing room
- **WHEN** a receiver accepts a match that is already accepted
- **THEN** the system returns the accepted match and the existing chat room instead of creating a duplicate

### Requirement: Accepted matches SHALL archive after 48 hours without any participant message
The system SHALL transition an `ACCEPTED` match to `ARCHIVED` when the connected chat room receives no participant message within 48 hours of room creation.
When this archive transition happens, the chat room SHALL close with a no-response archive reason and SHALL no longer appear in `GET /chats`.

#### Scenario: Accepted match is archived after no response
- **WHEN** an `ACCEPTED` match reaches 48 hours after chat-room creation with zero participant messages
- **THEN** the system marks the match as `ARCHIVED`, closes the room with the no-response archive reason, and hides the room from `GET /chats`

### Requirement: Match rejection SHALL close the request with sender refund behavior
The system SHALL allow the receiver to reject a pending match and SHALL refund the sender's paid manna according to match type policy.

#### Scenario: Pending match is rejected
- **WHEN** a receiver calls `POST /match/reject` for a pending match
- **THEN** the system marks the match as rejected/refunded and refunds the sender according to policy

### Requirement: Inbox APIs SHALL expose sent and received match visibility separately
The system SHALL expose sent and received match lists through separate inbox endpoints.
Received inbox visibility SHALL update `receiver_opened_at` the first time a pending request is observed.
`ARCHIVED` matches SHALL remain visible in inbox surfaces for 7 days after `archived_at` and SHALL be hidden afterwards.

#### Scenario: Received inbox is loaded
- **WHEN** a user calls `GET /inbox/received`
- **THEN** the system returns received match items enriched with counterpart nickname

#### Scenario: Sent inbox is loaded
- **WHEN** a user calls `GET /inbox/sent`
- **THEN** the system returns sent match items enriched with counterpart nickname

#### Scenario: Archived match remains visible during retention window
- **WHEN** a user calls an inbox endpoint within 7 days of a match becoming `ARCHIVED`
- **THEN** the system includes the archived match item in the response

#### Scenario: Archived match expires out of inbox visibility
- **WHEN** a user calls an inbox endpoint more than 7 days after a match became `ARCHIVED`
- **THEN** the system omits that archived match from the response

### Requirement: Match requests SHALL charge the sender based on match type policy
The system SHALL charge the sender when creating a match request.
The current implemented policy SHALL charge 3 manna for `NORMAL` and 6 manna for `SUPER`.

#### Scenario: Normal match request charges sender
- **WHEN** a sender calls `POST /match/request` with `match_type=NORMAL`
- **THEN** the system charges 3 manna before persisting the pending match

#### Scenario: Super match request charges sender
- **WHEN** a sender calls `POST /match/request` with `match_type=SUPER`
- **THEN** the system charges 6 manna before persisting the pending match

### Requirement: Match acceptance SHALL apply receiver cost only for normal matches
The system SHALL apply the receiver-side accept cost only for `NORMAL` matches.
The current implemented policy SHALL charge 3 manna to the receiver when accepting a normal match and SHALL not apply this extra receiver charge for `SUPER` matches.

#### Scenario: Normal match acceptance charges receiver
- **WHEN** a receiver accepts a pending `NORMAL` match
- **THEN** the system charges 3 manna to the receiver before opening the chat room

#### Scenario: Super match acceptance does not charge receiver
- **WHEN** a receiver accepts a pending `SUPER` match
- **THEN** the system opens the chat room without the additional normal-match receiver charge

### Requirement: Match rejection refunds SHALL follow match type policy
The system SHALL refund the sender according to match type when a pending match is rejected.
The current implemented policy SHALL refund 3 manna for `NORMAL` and 6 manna for `SUPER`.

#### Scenario: Normal match rejection refunds sender
- **WHEN** a pending `NORMAL` match is rejected
- **THEN** the system refunds 3 manna to the sender

#### Scenario: Super match rejection refunds sender
- **WHEN** a pending `SUPER` match is rejected
- **THEN** the system refunds 6 manna to the sender

### Requirement: Match acceptance SHALL declare push-eligibility for recipients
The system SHALL define whether match acceptance generates an Expo push in addition to realtime delivery.
The initial policy SHALL allow a push to the recipient who needs background attention and SHALL suppress unnecessary duplicate attention to the acting user.

#### Scenario: Non-actor recipient receives match-accepted push
- **WHEN** a match is accepted and the non-actor participant is eligible for push delivery
- **THEN** the system generates a match-accepted Expo push for that recipient
