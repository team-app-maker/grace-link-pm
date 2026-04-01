> Source: `grace-link-server/openspec/changes/reco-visibility-same-church-contacts/tasks.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: active change reference.

## 1. OpenSpec / SSOT

- [x] 1.1 proposal/design/tasks/spec deltas 를 작성한다
- [x] 1.2 docs/ssot 를 visibility 필터 계약에 맞게 갱신한다

## 2. Data / API

- [x] 2.1 profile phone hash 저장과 contact hash 테이블 migration 을 추가한다
- [x] 2.2 연락처 해시 업로드/삭제 API 를 추가한다

## 3. Visibility Engine

- [x] 3.1 FeatureSafetyService 의 contact rule 을 실제 hash 매칭으로 교체한다
- [x] 3.2 reco/vault/profile/match 흐름이 동일 visibility 규칙을 따르도록 정리한다

## 4. Verification

- [x] 4.1 integration test 로 same church / contact visibility / snapshot replace 를 검증한다
- [x] 4.2 관련 테스트를 실행한다
