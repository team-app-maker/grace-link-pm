> Source: `grace-link-server/docs/frontend-vault-status.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend supporting reference.

# Vault 카드 상태 정리 (프론트 전달용)

## 목적
이 문서는 서버 구현 기준으로 보관함(vault) 카드의 `DELETED`, `LOCKED` 상태 의미와 프론트 interaction 방식을 정리한 것입니다.
프론트는 이 문서를 기준으로 보관함 카드 노출, CTA 노출, 상태 갱신 흐름을 맞추면 됩니다.

## 기준 범위
- 서버 기준 source of truth
- 현재 워크스페이스에는 프론트 코드가 없으므로, 서버 API 계약과 테스트 기준으로 정리

---

## 상태 정의

### `LOCKED`
의미:
- 카드가 잠긴 상태
- 추천 카드가 생성된 뒤 아직 열지 않았고, 48시간이 지나면 서버가 자동으로 `LOCKED` 로 전환

주요 특징:
- 보관함(`GET /vault`)에서 조회될 수 있음
- 프론트는 이 상태에서 **잠금 해제 CTA** 를 노출하면 됨
- `POST /card/unlock` 성공 시 `SEEN` 으로 전환됨

### `DELETED`
의미:
- 카드가 만료되어 삭제된 상태
- 카드 생성 후 7일이 지나면 서버가 자동으로 `DELETED` 로 전환

주요 특징:
- 오늘 추천(`GET /reco/today`)에서는 제외됨
- 보관함(`GET /vault`)에서는 조회될 수 있음
- 프론트는 이 상태에서 **복구 CTA** 를 노출하면 됨
- `POST /vault/restore` 성공 시 `LOCKED` 로 복구됨

---

## 상태 전이

```text
ACTIVE
  ├─ (미열람 + 48시간 경과) -> LOCKED
  ├─ (7일 경과) -> DELETED
  └─ (pass 요청) -> PASSED

LOCKED
  ├─ (card/unlock 성공) -> SEEN
  ├─ (7일 경과) -> DELETED
  └─ (pass 요청) -> PASSED

SEEN
  ├─ (7일 경과) -> DELETED
  └─ (pass 요청) -> PASSED

DELETED
  └─ (vault/restore 성공) -> LOCKED
```

복구 시 서버 동작:
- `status = LOCKED`
- `created_at = now()` 로 리셋
- `locked_at = now()`
- `opened_at = null`
- `deleted_at = null`
- `passed_at = null`

즉, 프론트 입장에서는 **복구 직후 바로 다시 열람 가능한 상태가 아니라 잠긴 상태로 돌아온다**고 이해하면 됩니다.

---

## 화면별 노출 규칙

### 1) 오늘 추천 화면 (`GET /reco/today`)
서버가 아래 카드는 제외해서 반환합니다.
- `DELETED`
- `PASSED`
- 안전/차단/숨김 대상 카드

프론트 해석:
- `DELETED` 카드는 추천 화면에서 따로 처리할 필요 없음
- `LOCKED` 는 추천 세트에는 남을 수 있지만, 실제 노출 시점에는 서버 응답 상태 기준으로 분기하면 됨

### 2) 보관함 화면 (`GET /vault`)
서버는 `PASSED` 만 제외하고, 현재 사용자에게 여전히 보여도 되는 카드들을 반환합니다.
즉 아래 상태 카드가 보관함에 올 수 있습니다.
- `ACTIVE`
- `LOCKED`
- `SEEN`
- `DELETED`

프론트 권장 처리:
- `DELETED` -> 복구 버튼 노출
- `LOCKED` -> 잠금 해제 버튼 노출
- `SEEN` -> 일반 카드처럼 표시
- `ACTIVE` -> 일반 카드처럼 표시

---

## 프론트 interaction 계약

### Vault 조회
`GET /vault`

응답 카드 주요 필드:
- `card_id`
- `target_uuid`
- `status`
- `created_at`
- `opened_at`
- `locked_at`
- `deleted_at`
- `passed_at`
- `profile`

프론트 사용 포인트:
- 리스트 렌더링은 `status` 기준으로 분기
- 시간 표시는 필요 시 `locked_at`, `deleted_at` 을 사용
- 버튼 노출 여부는 `status` 하나로도 충분함

### 잠금 해제
`POST /card/unlock`

Request:
```json
{
  "card_id": "card_1234"
}
```

동작:
- 카드가 `LOCKED` 일 때만 manna 1 차감
- 성공 시 응답 카드 상태가 `SEEN` 으로 바뀜
- `LOCKED` 가 아니면 서버는 현재 카드 상태를 그대로 반환

프론트 처리:
- 성공 응답의 `card.status` 로 로컬 상태 갱신
- 복구 직후 카드가 `LOCKED` 이므로, 복구 다음 액션으로 이 API 호출 가능

### 복구
`POST /vault/restore`

Request:
```json
{
  "card_id": "card_1234"
}
```

동작:
- 카드가 `DELETED` 일 때만 유효한 복구 흐름
- 주간 2회 제한
- 성공 시 manna 2 차감
- 성공 응답의 카드 상태는 `LOCKED`
- 카드가 이미 `DELETED` 가 아니면 no-op 으로 현재 상태를 그대로 반환

Response 핵심:
- `card`
- `weekCount`

프론트 처리:
- 성공 시 해당 카드 상태를 `LOCKED` 로 갱신
- 이어서 잠금 해제 CTA 를 보여주면 됨
- `weekCount` 로 주간 사용량 표시가 필요하면 활용 가능

### 패스
`POST /card/pass`

Request:
```json
{
  "card_id": "card_1234"
}
```

동작:
- 성공 시 `PASSED`
- 이후 추천/보관함의 active set 에서 사실상 빠짐

---

## 프론트 UX 기준 요약

### `status = DELETED`
- 의미: 만료된 카드
- 위치: 추천 X / 보관함 O
- CTA: `복구`
- 성공 후 기대 상태: `LOCKED`

### `status = LOCKED`
- 의미: 잠긴 카드
- 위치: 보관함 O
- CTA: `잠금 해제`
- 성공 후 기대 상태: `SEEN`

### 권장 사용자 플로우
1. 보관함 조회
2. 카드가 `DELETED` 이면 복구 버튼 노출
3. 복구 성공 후 응답 상태를 `LOCKED` 로 반영
4. `LOCKED` 카드에 잠금 해제 버튼 노출
5. 잠금 해제 성공 후 응답 상태를 `SEEN` 으로 반영

---

## 서버 기준 검증된 예시
통합 테스트에서도 아래 흐름이 검증되어 있습니다.

1. 오래된 `ACTIVE` 카드 생성
2. `GET /vault` 조회 시 서버가 해당 카드를 `DELETED` 로 정규화해서 반환
3. `POST /vault/restore` 호출 시 카드 상태가 `LOCKED`
4. `POST /card/unlock` 호출 시 카드 상태가 `SEEN`

즉 프론트는 아래처럼 이해하면 됩니다.

```text
보관함 진입 -> DELETED 카드 표시 -> 복구 -> LOCKED -> 잠금 해제 -> SEEN
```

---

## 참고 서버 계약
- `GET /vault`
- `POST /card/unlock`
- `POST /vault/restore`
- `POST /card/pass`
- `GET /reco/today`

참고 구현 위치:
- `src/main/kotlin/com/gracelink/server/service/FeatureLifecycleService.kt`
- `src/main/kotlin/com/gracelink/server/service/GraceLinkFeatureService.kt`
- `src/main/kotlin/com/gracelink/server/api/GraceLinkFeatureController.kt`
- `src/test/kotlin/com/gracelink/server/GraceLinkApiContractIntegrationTest.kt`
