> Source: `grace-link-server/openspec/specs/church-catalog/spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# church-catalog Specification

## Purpose
교회 검색 및 등록, 정규화 기반 중복 방지 규칙을 정의한다.
## Requirements
### Requirement: Church search SHALL support normalized lookup
The system SHALL provide church search over the stored catalog and SHALL support normalized text queries that tolerate formatting differences.

#### Scenario: Matching church is found
- **WHEN** a client calls `GET /churches/search` with a query matching a registered church name
- **THEN** the system returns that church in the search results

### Requirement: Church registration SHALL avoid duplicate normalized entries
The system SHALL allow clients to register churches and SHALL return the existing church entry when the normalized identity already exists.

#### Scenario: New church is registered
- **WHEN** a client posts a previously unknown church with valid location and denomination fields
- **THEN** the system creates and returns a new church record

#### Scenario: Duplicate church registration is attempted
- **WHEN** a client posts a church whose normalized identity already exists
- **THEN** the system returns the existing church record instead of creating a duplicate

