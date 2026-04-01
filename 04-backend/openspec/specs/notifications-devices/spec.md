> Source: `grace-link-server/openspec/specs/notifications-devices/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# notifications-devices Specification

## Purpose
디바이스 push token 등록 및 해제 규칙을 정의한다.
## Requirements
### Requirement: Users SHALL be able to register device push tokens
The system SHALL allow the authenticated user to register a device push token with platform and optional device metadata.

#### Scenario: Push token is registered
- **WHEN** a user calls `POST /devices/push-token` with a valid token and platform
- **THEN** the system stores or updates the device token registration and returns the resulting device record

### Requirement: Users SHALL be able to unregister device push tokens
The system SHALL allow the authenticated user to unregister an existing device push token.

#### Scenario: Push token is unregistered
- **WHEN** a user calls `DELETE /devices/push-token` with a registered token
- **THEN** the system removes that token registration and returns a successful result

### Requirement: Device token registration SHALL validate Expo-compatible token shape
The system SHALL validate that registered push tokens are compatible with the supported Expo push format before treating them as eligible delivery targets.
The canonical token shape for this change SHALL be the Expo push token format consumed by the Expo Push API.

#### Scenario: Expo token shape is valid
- **WHEN** a client registers a token that matches the supported Expo token format
- **THEN** the system stores or updates the registration as a push-eligible device token

#### Scenario: Expo token shape is invalid
- **WHEN** a client attempts to register a token that does not match the supported Expo token format
- **THEN** the system rejects the token or stores it as ineligible according to the implementation policy

### Requirement: Device token lifecycle SHALL respond to invalidation feedback
The system SHALL transition device tokens out of active use when Expo reports them invalid or unregistered.

#### Scenario: Registered token becomes invalid
- **WHEN** Expo reports a registered token as invalid during delivery or receipt handling
- **THEN** the system removes or disables that token for future sends

