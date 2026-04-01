> Source: `grace-link-RN/docs/api/05-payment-ad.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# API 5: 구매/광고 보상

## 5.1 `GET /shop/packages`

### 요청

- 없음

### 응답

```json
{ "packages": [
  { "package_id": "manna_10", "manna_amount": 10, "price": "₩2,900" }
] }
```

### 호출 위치

- `src/features/paywall/PaywallBottomSheet.tsx`
- `app/(tabs)/shop.tsx`
- `app/(tabs)/settings.tsx`

### 구현 포인트

- 매칭, 추천 액션 실패 시 paywall 노출에서 사용
- 프론트는 `package_id`, `manna_amount`, `price` 표시만 사용

---

## 5.2 `POST /purchase/verify`

### 요청

```json
{ "user_uuid": "string", "package_id": "string", "receipt": "string" }
```

### 응답

```json
{ "granted": { "currency": "MANNA_PAID", "amount": 10 }, "tx_id": "string" }
```

### 호출 위치

- `app/(tabs)/shop.tsx` 구매 버튼
- `app/(tabs)/settings.tsx` 구매 버튼
- `src/features/paywall/PaywallBottomSheet.tsx` 구매 후 `onCompleted`

### 구현 포인트

- 영수증 위변조 검증 필수
- mock는 receipt 문자열 존재 여부만 확인
- 성공 시 paid 잔액 증가 + transactions 기록

### 에러

- `USER_NOT_FOUND`, `PACKAGE_NOT_FOUND`, `RECEIPT_INVALID`

---

## 5.3 `POST /rewarded-ad/claim`

### 요청

```json
{
  "user_uuid": "string",
  "placement": "paywall|my_free_manna|empty_state",
  "reward_token": "string"
}
```

### 응답

```json
{
  "reward": {
    "reward_id":"string","user_uuid":"string","placement":"paywall|my_free_manna|empty_state",
    "provider":"string","token_hash":"string","amount":1,"verified_at":"ISO"
  }
}
```

### 호출 위치

- `app/(tabs)/reco.tsx` empty-state 보상 버튼
- `app/(tabs)/shop.tsx` 무료 만나
- `app/(tabs)/settings.tsx` 무료 만나
- `src/features/paywall/PaywallBottomSheet.tsx` paywall 내 광고 보상

### 보상 정책(현재 mock)

- 승인된 사용자만 보상 (`APPROVED`)
- `reward_token` 재사용 불가
- `adDailyCap`, `adCooldownMinutes` 적용
- 일일 카운터 리셋은 KST 기준
- `reward.amount`는 현재 `1`로 고정

### 에러

- `USER_NOT_FOUND`, `NOT_APPROVED`, `AD_DAILY_CAP_REACHED`, `AD_COOLDOWN`, `TOKEN_INVALID`, `ACCOUNT_SOFT_SUSPENDED`, `AD_RATE_LIMITED`

---

## 5.4 Paywall intent 흐름(프런트 가정)

- 액션 수행 중 `INSUFFICIENT_MANNA`면
  - 하단 paywall 열기
  - 광고 1개 보상 또는 패키지 구매 후 `onCompleted`
  - 원래 의도한 API(예: unlock/restore/extend)를 재호출
- 구현 포인트: 멱등성 보장을 위해 `pendingIntent` 토큰 + 재시도/중복 방지 필요
