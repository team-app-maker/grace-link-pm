> Source: `grace-link-server/openspec/specs/push-notification-delivery/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# push-notification-delivery Specification

## Purpose
Expo Push Service 기반 전달 규칙, deep link payload, delivery outcome 기록, invalid token cleanup 정책을 정의한다.
## Requirements
### Requirement: The system SHALL use Expo Push Service as the default server delivery path
The system SHALL treat Expo Push Service as the default server-side delivery path for mobile push notifications in this capability.
Direct Firebase Cloud Messaging (FCM) HTTP v1 sending from the backend SHALL NOT be the default implementation path for this change.

#### Scenario: Server sends through Expo Push API
- **WHEN** a push-eligible notification is emitted by backend business logic
- **THEN** the server sends the notification through the Expo Push API path defined by `ExpoPushGateway`

### Requirement: The system SHALL map supported domain events to Expo push deliveries
The system SHALL define which server-side events produce Expo push notifications.
The first supported push families SHALL include match acceptance, new chat message, and server-originated system notifications.

#### Scenario: Match acceptance triggers a push
- **WHEN** a match transitions to accepted and the configured recipient should receive background attention
- **THEN** the system creates an Expo push delivery attempt for the recipient with a match-oriented title/body/deep link

#### Scenario: Chat message triggers a push for the non-actor recipient
- **WHEN** a new chat message is accepted and the recipient is not the sending actor
- **THEN** the system creates an Expo push delivery attempt for the recipient with a chat deep link

### Requirement: Push payloads SHALL include canonical deep-link data
Every Expo push payload SHALL include a server-defined deep-link value that tells the mobile client where to navigate.

#### Scenario: Match push includes match deep link
- **WHEN** the system emits a push for a match acceptance event
- **THEN** the payload includes the canonical deep link for the newly opened chat or related match destination

#### Scenario: Chat push includes chat deep link
- **WHEN** the system emits a push for a chat message event
- **THEN** the payload includes the canonical deep link for the target chat room

### Requirement: Expo push delivery SHALL be preference-aware
The system SHALL check the recipient's notification preferences before sending an Expo push for an event category.

#### Scenario: Category is enabled
- **WHEN** the recipient has the relevant notification category enabled
- **THEN** the system may send the Expo push if the event is otherwise eligible

#### Scenario: Category is disabled
- **WHEN** the recipient has the relevant notification category disabled
- **THEN** the system suppresses the Expo push while preserving any allowed realtime/internal records

#### Scenario: Chat recipient already has an active realtime session
- **WHEN** the event category is `chat` and the recipient already has an active websocket session
- **THEN** the system suppresses the Expo push and records that the push was skipped due to active realtime presence

### Requirement: Expo push delivery SHALL record delivery outcomes and invalid token feedback
The system SHALL record the result of Expo delivery attempts and SHALL disable or remove tokens that Expo marks as invalid.

#### Scenario: Expo marks a token invalid
- **WHEN** Expo responds that a push token is invalid or unregistered
- **THEN** the system disables or deletes that token so future sends do not target it

#### Scenario: Expo returns a transient failure
- **WHEN** Expo returns a transient delivery error
- **THEN** the system records the failed attempt and preserves the token for retry policy handling

### Requirement: Android Expo push readiness SHALL depend on Firebase/FCM credentials
The system SHALL treat Firebase/FCM credentials as an operational prerequisite for Android push delivery through Expo.
Backend rollout for Android push support SHALL assume that the Expo/EAS environment has valid FCM v1 credentials configured.

#### Scenario: Android credentials are available
- **WHEN** Android push delivery is enabled in production
- **THEN** the deployment assumes valid Firebase/FCM credentials are already configured for Expo delivery

#### Scenario: Android credentials are missing
- **WHEN** Android push delivery prerequisites are not configured in Expo/EAS
- **THEN** Android push delivery is considered not ready for production rollout even if backend send logic exists

### Requirement: Match and chat push suppression SHALL consider active realtime presence
The push delivery layer SHALL evaluate whether the recipient already has at least one active websocket session before sending `chat` or `match` category pushes.

#### Scenario: Chat category evaluates active sessions
- **WHEN** a chat-category push is about to be sent
- **THEN** the delivery layer checks whether the recipient already has an active websocket session before sending

#### Scenario: Match category evaluates active sessions
- **WHEN** a match-category push is about to be sent
- **THEN** the delivery layer checks whether the recipient already has an active websocket session before sending

