> Source: `grace-link-server/openspec/specs/dev-support-surface/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# dev-support-surface Specification

## Purpose
브라우저 로그인 진입점, `/dev` prefix 로 그룹핑된 개발 지원 admin endpoints, 조건부 dev Google test surface를 정의한다.
## Requirements
### Requirement: Browser login entry SHALL remain available for OAuth browser flows
The system SHALL expose `GET /login` as the browser entry page for OAuth login flows.

#### Scenario: Browser login page is requested
- **WHEN** a client requests `GET /login`
- **THEN** the system renders the login page response used for browser OAuth entry

### Requirement: Development admin support endpoints SHALL remain available without JWT for local workflows
The system SHALL expose development support endpoints for granting manna and seeding opposite-gender users without requiring Bearer authentication.
These endpoints SHALL be treated as development support surface, not primary production-mobile contract.

#### Scenario: Development manna grant succeeds
- **WHEN** a caller submits `POST /dev/admin/grant-manna` with a valid user identifier and amount
- **THEN** the system increases the target user's paid manna balance and returns the updated balance payload

#### Scenario: Development opposite-user seeding succeeds
- **WHEN** a caller submits `POST /dev/admin/seed-opposite-users` with a valid gender and count
- **THEN** the system creates approved seeded users of the opposite gender and returns the created user summaries

### Requirement: Conditional dev Google test endpoints SHALL exist only when explicitly enabled
The system SHALL expose `/dev/test/google/*` support endpoints only when the test-token-endpoint runtime flag is enabled.
When enabled, the endpoints SHALL support minting a Google-like test ID token, test sign-in, token inspection, and JWKS discovery for development/integration workflows.

#### Scenario: Dev Google test endpoints are enabled
- **WHEN** `sso.enable-test-token-endpoints=true` is configured and a caller uses `/dev/test/google/sign-in`
- **THEN** the system returns a generated test Google identity flow response together with a GraceLink sign-in payload

#### Scenario: Dev Google test endpoints are disabled
- **WHEN** the test-token-endpoint flag is not enabled
- **THEN** the `/dev/test/google/*` support surface is not exposed as an active runtime endpoint set
