> Source: `grace-link-RN/docs/api/03-reco-vault.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# API 3: 추천/보관함

## 3.1 `POST /reco/extra`

### 요청

```json
{ "user_uuid": "string", "amount": 2 }
```

`amount`는 현재 클라이언트에서 `2`로 고정해 보내고, mock은 이 값을 사용하지 않습니다.
실서버도 다음 중 하나로 구현 가능합니다.

- 요청 본문에 `amount`를 받되 현재는 값 검증만 수행(`2` 권장)
- 또는 서버가 내부 정책으로 2개를 고정 생성

### 응답

```json
{ "cards": [ ...RecommendationCardWithProfile[] ... ] }
```

### 호출 위치

- `app/(tabs)/reco.tsx` `handleExtra`, `requestExtraReco`

### 구현 포인트

- 서버에서는 `amount`가 2로 고정 요청되는 것으로 보고됨
- 카드 생성 및 추가 반환
- 비용은 `1`(`INSUFFICIENT_MANNA` 시)

### 에러

- `USER_NOT_FOUND`, `INSUFFICIENT_MANNA`

---

## 3.2 `GET /vault?user_uuid=`

### 응답

```json
{ "cards": [ {
  "card_id":"string","viewer_uuid":"string","target_uuid":"string",
  "status":"ACTIVE|LOCKED|SEEN|DELETED|PASSED",
  "created_at":"ISO","opened_at":"ISO|null",
  "locked_at":"ISO|null","deleted_at":"ISO|null","passed_at":"ISO|null"
} ] }
```

### 호출 위치

- `app/(tabs)/vault.tsx`

### 구현 포인트

- 보관함에는 `PASSED` 제외 화면 필터 처리

### 에러

- `USER_NOT_FOUND`, `PROFILE_HIDDEN_BY_SAFETY`

---

## 3.3 `GET /reco/today?user_uuid=`

### 응답

```json
{ "cards": [RecommendationCardWithProfile] }
```

### 호출 위치

- `app/(tabs)/reco.tsx`

### 구현 포인트

- `app/(tabs)/reco.tsx`는 `PASSED` 제거 후 표시

### 에러

- `USER_NOT_FOUND`, `PROFILE_HIDDEN_BY_SAFETY`

---

## 3.4 `POST /card/unlock`

### 요청

```json
{ "user_uuid": "string", "card_id": "string" }
```

### 응답

```json
{ "card": { ...RecommendationCard... } }
```

### 호출 위치

- `app/(tabs)/reco.tsx` (추천 카드 해제)
- `app/(tabs)/vault.tsx` (보관함 카드 해제)

### 비용

- 1 만나

### 에러

- `USER_NOT_FOUND`, `CARD_NOT_FOUND`, `INSUFFICIENT_MANNA`

---

## 3.5 `POST /card/pass`

### 요청

```json
{ "user_uuid": "string", "card_id": "string" }
```

### 응답

```json
{ "card": { ...RecommendationCard... } }
```

### 호출 위치

- `app/(tabs)/reco.tsx`

### 구현 포인트

- card status를 PASSED 처리

### 에러

- `USER_NOT_FOUND`, `CARD_NOT_FOUND`

---

## 3.6 `POST /vault/extend`

### 요청

```json
{ "user_uuid": "string", "target_uuid": "string" }
```

### 응답

```json
{ "ok": true, "count": 1 }
```

### 호출 위치

- `app/(tabs)/vault.tsx`

### 규칙

- 대상 `target_uuid`당 확장 횟수 제한: 2회/사용자
- 비용: 1

### 에러

- `USER_NOT_FOUND`, `VAULT_EXTEND_LIMIT_REACHED`, `INSUFFICIENT_MANNA`

---

## 3.7 `POST /vault/restore`

### 요청

```json
{ "user_uuid": "string", "card_id": "string" }
```

### 응답

```json
{ "card": { ...RecommendationCard... }, "weekCount": 1 }
```

### 호출 위치

- `app/(tabs)/vault.tsx`

### 규칙

- DELETED 카드에 대해만 복구
- 비용: 2
- 주간 횟수 제한: `weekCount` 기준 2회

### 에러

- `USER_NOT_FOUND`, `CARD_NOT_FOUND`, `VAULT_RESTORE_WEEKLY_LIMIT_REACHED`, `INSUFFICIENT_MANNA`
