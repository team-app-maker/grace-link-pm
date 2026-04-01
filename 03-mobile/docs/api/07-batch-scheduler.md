> Source: `grace-link-RN/docs/api/07-batch-scheduler.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# API 7: 배치/백그라운드 스케줄

이 섹션은 엔드포인트가 아닌 서버 배치 규칙입니다. mock는 `src/mock/scheduler.ts` + `src/mock/useMockScheduler.ts`에서 1분 간격으로 실행됩니다.

## 7.1 카드 상태 전이

- `ACTIVE` + 48시간 경과 + `opened_at` 없음 -> `LOCKED` (`locked_at` 갱신)
- `DELETED`가 아닌 카드 생성 후 7일 경과 -> `DELETED` (`deleted_at` 갱신)
- 노출/보관/삭제 타이머는 주말 상관없이 항상 동작

## 7.2 매칭 만료(48시간)

- `MATCH_STATUS = PENDING` 건에 대해 48시간 초과 시 만료 처리
- 만료 시 비용 전액 환불 (`REJECT` 유사 상태)
- 노출 가중치 노출 페널티 반영
  - receiver가 본 경우(`receiver_opened_at` 존재) -> seen 페널티 factor 0.7
  - 미열람인 경우 -> unseen 페널티 factor 0.9
- `expired_at` 업데이트

## 7.3 채팅 룸 종료

- `OPEN` 룸에서 첫 메시지 24시간 내 발송 없으면 자동 종료 + 시스템 메시지
- 마지막 meaningful 메시지 후 24시간 내 상대 응답 없으면 종료
  - 선톡자가 meaningful이었고 상대 무응답이면 보상/페널티 정책 적용
  - 상대가 마지막 meaningful을 한 번도 본 적 없는지 여부 따라 페널티 라벨 분기
- 종료 시 `status = CLOSED`

## 7.4 광고 카운터 일일 리셋

- KST 기준 날짜 변경 시 ad counter를 리셋(`count=0`, `last_claim_at=null`)
- 보상 금지/쿨다운은 user 기준으로 저장

## 7.5 채팅 비대칭 보상(선톡)

- 상대가 meaningful로 마지막 응답 이후 24시간 내 응답 없으면
  - 선톡자 보너스 만나 +1(주당 3회 상한)
  - 같은 보상 상대 페어 1회 제한

## 7.6 구현 포인트

- 운영 환경에서는 큐 기반 cron(예: `*/10 * * * *`) 권장
- 배치 작업은 idempotent(재실행 시 결과 중복 증가 없음) 설계 필요
