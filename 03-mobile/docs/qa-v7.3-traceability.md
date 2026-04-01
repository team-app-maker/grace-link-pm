> Source: `grace-link-RN/docs/qa-v7.3-traceability.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# GraceLink v7.3 QA Traceability

## Policy Critical
- [x] No Photo 경로/기능 없음
- [x] GP 필드/문구 없음
- [x] 주말 연장 타이머 없음 (24h/48h)
- [x] REJECT 100% 환급
- [x] EXPIRE 100% 환급
- [x] Unlock 재열람 무료 (viewer-target-type)
- [x] bonus -> paid 소진 순서
- [x] Rewarded ad token 재사용 금지 + cap/cooldown
- [x] Meaningful 선톡 + 24h 무응답 비대칭 처리
- [x] Paywall 완료 후 intent 자동 재실행

## Feature QA
- [x] 온보딩 승인 게이트
- [x] 추천/추가추천/카드 타이머
- [x] Vault 연장/부활
- [x] Inbox 환급 상태 분기
- [x] Chat 텍스트 전용 + 타이머
- [x] Report/Block/Filter 노출 반영
- [x] Admin review queue/detail/action/hotkeys

## Batch QA
- [x] scheduler 루프에서 lock/delete/match/chat 만료 처리
- [x] ad counter KST 리셋 처리

## Release Gate
- [x] lint 통과
- [x] typecheck 통과
- [x] test 통과
- [ ] iOS/Android 수동 주요 플로우 점검 (수동 필요)
- [ ] mock mode 앱 재시작 일관성 점검 (수동 필요)
