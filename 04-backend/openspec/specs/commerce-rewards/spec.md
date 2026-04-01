> Source: `grace-link-server/openspec/specs/commerce-rewards/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# commerce-rewards Specification

## Purpose
상점 패키지 조회, 구매 검증, 광고 보상, 만나 잔액 조회 규칙을 정의한다.
## Requirements
### Requirement: Shop packages SHALL be discoverable through a package listing endpoint
The system SHALL expose the currently supported manna purchase packages through `GET /shop/packages`.

#### Scenario: Shop packages are listed
- **WHEN** a client calls `GET /shop/packages`
- **THEN** the system returns the currently supported package identifiers, manna amounts, and pricing metadata

### Requirement: Purchase verification SHALL grant paid manna exactly once per receipt
The system SHALL verify client purchase receipts and SHALL grant paid manna only once per normalized receipt.

#### Scenario: New receipt is verified
- **WHEN** a client submits a valid purchase verification request with a new receipt
- **THEN** the system grants paid manna and returns a transaction identifier

#### Scenario: Duplicate receipt is reused
- **WHEN** a client submits a receipt that has already been consumed
- **THEN** the system rejects the request as invalid or duplicate

### Requirement: Rewarded ad claims SHALL enforce approval and anti-abuse policy
The system SHALL allow rewarded ad claims only for approved users and SHALL enforce replay protection, cooldown, and daily cap behavior.

#### Scenario: Approved user claims a valid ad reward
- **WHEN** an approved user submits a valid rewarded ad token for an allowed placement
- **THEN** the system grants bonus manna and records the reward claim

#### Scenario: Claim exceeds cooldown or cap
- **WHEN** a user submits a rewarded ad claim that violates cooldown or daily cap policy
- **THEN** the system rejects the claim

### Requirement: Users SHALL be able to retrieve manna balances
The system SHALL provide current paid and bonus manna balances for the authenticated user and a compatibility path constrained to the same authenticated principal.

#### Scenario: Current user balance is retrieved
- **WHEN** an authenticated user calls `GET /users/me/manna`
- **THEN** the system returns current paid and bonus manna balances

#### Scenario: Compatibility path is used with matching principal
- **WHEN** an authenticated user calls `GET /users/{user_uuid}/manna` for their own identifier
- **THEN** the system returns the same balance information

