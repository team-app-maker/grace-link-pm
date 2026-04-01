> Source: `grace-link-server/openspec/specs/multi-device-notification-policy/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# multi-device-notification-policy Specification

## Purpose
다중 기기 환경에서 chat/match/system 카테고리별 push suppression 및 active-session 정책을 정의한다.
## Requirements
### Requirement: Multi-device notification policy SHALL be category-specific
The system SHALL define multi-device notification behavior separately for `match`, `chat`, and `system` categories instead of applying one global rule.

#### Scenario: Policy is evaluated by category
- **WHEN** the server decides whether to send a push notification for a recipient with multiple devices or active sessions
- **THEN** it applies the category-specific multi-device policy for that notification category

### Requirement: Chat notifications SHALL remain suppressed when any active realtime session exists
If the recipient has at least one active websocket session on any device, `chat` category pushes SHALL be suppressed and realtime delivery SHALL be treated as the primary channel.

#### Scenario: Active session exists for chat notification
- **WHEN** a chat-category notification targets a user who already has an active websocket session on another device
- **THEN** the system suppresses the push notification and relies on realtime delivery

### Requirement: Match notifications SHALL be suppressed when any active realtime session exists
If the recipient has at least one active websocket session on any device, `match` category pushes SHALL be suppressed and realtime delivery SHALL be treated as sufficient for the current session.

#### Scenario: Active session exists for match notification
- **WHEN** a match-category notification targets a user who already has an active websocket session on another device
- **THEN** the system suppresses the push notification and relies on realtime delivery for that active user session

### Requirement: System notifications SHALL remain push-eligible by default across devices
`system` category notifications SHALL remain push-eligible by default even when a websocket session exists on another device, unless user preferences disable the category.

#### Scenario: Active session exists for system notification
- **WHEN** a system-category notification targets a user who has an active websocket session on another device
- **THEN** the system still treats the notification as push-eligible by default

### Requirement: Notification preferences SHALL remain per-user until a later device-specific change is accepted
The current preference model SHALL remain per-user and per-category.
Per-device preference controls SHALL be treated as a future extension, not a baseline requirement of this change.

#### Scenario: User has multiple devices with one preference set
- **WHEN** a user updates notification preferences
- **THEN** the current setting applies to the user-level category policy rather than to one specific device only

