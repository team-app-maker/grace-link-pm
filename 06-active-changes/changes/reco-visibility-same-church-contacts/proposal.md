> Source: `grace-link-server/openspec/changes/reco-visibility-same-church-contacts/proposal.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## Why

같은 교회 제외와 연락처 제외 필드는 이미 존재하지만 현재는 더미 규칙에 의존한다.
추천/볼트/프로필 상세/매치 요청 전반에서 일관된 visibility SSOT가 필요하다.

## What Changes

- same church 판정을 church_id 완전 일치 기준으로 고정한다.
- 연락처 제외를 전화번호 해시 업로드 기반 visibility 규칙으로 구현한다.
- 추천/볼트/프로필 상세/매치 요청에서 동일 visibility 엔진을 사용한다.

## Capabilities

### New Capabilities
- `contact-visibility`: 연락처 해시 업로드와 숨김 판정 계약

### Modified Capabilities
- `profile-reco-vault`: visibility 필터 계약 강화
- `onboarding-approval`: PASS 검증 시 canonical phone hash 저장

## Impact

- 연락처 해시 저장용 DB 테이블 및 profile phone hash 컬럼 추가
- 신규 연락처 동기화 API 추가
- 더미 contact exclusion 규칙 제거
