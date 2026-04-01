> Source: `grace-link-server/openspec/changes/reco-visibility-same-church-contacts/design.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## Context

현재 user_filter_settings 는 exclude_contacts / exclude_same_church / exclude_same_company 를 보유하지만,
`FeatureSafetyService.isSafetyHidden()` 의 연락처 규칙은 userUuid suffix 비교 더미 구현이다.

## Goals / Non-Goals

**Goals:**
- 실제 교회/연락처 기반 visibility SSOT 구현
- reco/vault/profile/match 전역 일관성 확보
- 프론트가 주소록 전체 해시 스냅샷을 업로드할 수 있는 최소 API 제공

**Non-Goals:**
- 회사 필터 규칙 재설계
- 교회 그룹/캠퍼스 매핑 도입
- 원문 전화번호 저장

## Decisions

- 같은 교회는 viewer.church_id == target.church_id 일 때 숨긴다.
- 연락처 제외는 클라이언트가 정규화한 전화번호를 SHA-256 hex 로 업로드하는 스냅샷 교체 모델로 구현한다.
- target 비교용 canonical phone hash 는 PASS verify 시 저장한다.
- 연락처 필터는 reco/vault/profile detail/match request 전역 visibility 규칙에 포함한다.

## Risks / Trade-offs

- PASS verify 이전 사용자에게는 phone hash 가 없어 연락처 매칭이 되지 않을 수 있음 → canonical data 부재 시 미매칭 처리
- 연락처 업로드는 snapshot replacement 이므로 클라이언트가 전체 목록을 보내야 함 → 계약에 명시

## Migration Plan

- DB migration 으로 profiles.phone_hash 및 user_contact_hashes 추가
- 기존 사용자는 PASS verify 재실행 또는 별도 backfill 전까지 phone hash 없음

## Open Questions

- 없음
