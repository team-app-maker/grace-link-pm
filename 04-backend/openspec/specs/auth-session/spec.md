> Source: `grace-link-server/openspec/specs/auth-session/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# auth-session Specification

## Purpose
GraceLink의 SSO 로그인, JWT 발급, Bearer 인증, 세션 복구, refresh rotation, 개발용 fallback 규칙을 정의한다.
## Requirements
### Requirement: Social sign-in SHALL issue GraceLink token pairs
The system SHALL accept Google or Apple sign-in input, resolve the member identity, and issue a GraceLink access token and refresh token pair.
The successful sign-in response SHALL include `user_uuid`, `access_token`, `refresh_token`, `token_type`, `expires_in`, and `auth_status`.

#### Scenario: ID token sign-in succeeds
- **WHEN** a client calls `POST /auth/sso/sign-in` with a valid `provider` and `id_token`
- **THEN** the system returns a token pair response containing user identity and auth status metadata

#### Scenario: Authorization code sign-in succeeds
- **WHEN** a client calls `POST /auth/sso/code/sign-in` with a valid `provider`, `code`, and `redirect_uri`
- **THEN** the system exchanges the authorization code and returns the same token pair response shape

### Requirement: Protected HTTP APIs SHALL authenticate with Bearer access tokens
Protected APIs SHALL use `Authorization: Bearer <access_token>` as the canonical authentication mechanism.
If a request includes a `user_uuid` parameter or body field, the authenticated principal MUST match that identifier or the system MUST reject the request.

#### Scenario: Authenticated principal matches requested user
- **WHEN** a protected API is called with a valid Bearer access token and a matching `user_uuid`
- **THEN** the request is authorized and processed normally

#### Scenario: Authenticated principal differs from requested user
- **WHEN** a protected API is called with a valid Bearer access token and a different `user_uuid`
- **THEN** the system rejects the request with `FORBIDDEN`

### Requirement: Session restore SHALL use the current member endpoint
The system SHALL expose `GET /auth/me` as the canonical session restore endpoint for clients resuming an existing access token.
The response SHALL include `member_id`, `role`, and `auth_status`.

#### Scenario: Session restore succeeds
- **WHEN** a client calls `GET /auth/me` with a valid Bearer access token
- **THEN** the system returns the authenticated member identity, role, and auth status

#### Scenario: Session restore fails for invalid token
- **WHEN** a client calls `GET /auth/me` with a missing, blank, or invalid access token
- **THEN** the system rejects the request with `TOKEN_INVALID`

### Requirement: Refresh token rotation SHALL issue replacement token pairs
The system SHALL accept a valid refresh token at `POST /auth/token/refresh` and SHALL return a replacement access token and refresh token pair.
The previous refresh token MUST no longer be treated as the current session token after rotation.

#### Scenario: Refresh token rotation succeeds
- **WHEN** a client submits a valid `refresh_token`
- **THEN** the system returns a new access token and a new refresh token

#### Scenario: Refresh token rotation fails for invalid token
- **WHEN** a client submits an invalid or revoked refresh token
- **THEN** the system rejects the request with `TOKEN_INVALID`

### Requirement: Development-only fallback SHALL remain explicitly gated
The system SHALL allow `user_uuid`-based fallback identity resolution only when `auth.allow-insecure-user-uuid-fallback=true` is enabled in the runtime configuration.
This behavior MUST be treated as a development-only exception and MUST NOT be the default production contract.

#### Scenario: Dev fallback is enabled
- **WHEN** insecure fallback is enabled and a request provides a `user_uuid` without Bearer authentication
- **THEN** the system may resolve the request identity from that `user_uuid`

#### Scenario: Dev fallback is disabled
- **WHEN** insecure fallback is disabled and a request omits Bearer authentication
- **THEN** the system rejects the request with `TOKEN_INVALID`

### Requirement: Current-session logout SHALL revoke the current session token set
The system SHALL allow a client to revoke the current session by calling `POST /auth/logout` with the current Bearer access token.
A missing or blank access token MUST be rejected.

#### Scenario: Current-session logout succeeds
- **WHEN** a client calls `POST /auth/logout` with a valid Bearer access token
- **THEN** the system revokes the current session token set and returns a successful result

#### Scenario: Current-session logout fails without a token
- **WHEN** a client calls `POST /auth/logout` without a valid Bearer access token
- **THEN** the system rejects the request with `TOKEN_INVALID`

### Requirement: Global logout SHALL revoke all sessions for the authenticated member
The system SHALL allow an authenticated member to revoke all of their active sessions by calling `POST /auth/logout-all`.

#### Scenario: Global logout succeeds
- **WHEN** an authenticated member calls `POST /auth/logout-all`
- **THEN** the system revokes all sessions for that member and returns a successful result

#### Scenario: Global logout fails without an authenticated member
- **WHEN** `POST /auth/logout-all` is called without a valid authenticated principal
- **THEN** the system rejects the request with `TOKEN_INVALID`

