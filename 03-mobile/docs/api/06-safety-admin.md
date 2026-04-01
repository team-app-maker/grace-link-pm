> Source: `grace-link-RN/docs/api/06-safety-admin.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# API 6: 신고/차단/필터/운영

## 6.1 `POST /report`

### 요청

```json
{
  "reporter_uuid": "string",
  "target_uuid": "string",
  "context": "profile|chat",
  "reason": "string",
  "detail": "string?"
}
```

### 응답

```json
{ "report": { "report_id": "string", ...ReportRecord } }
```

### 호출 위치

- `app/profile/[targetUuid].tsx` (신고 버튼)
- `app/chat/[chatId].tsx` (대화 중 신고)

### 구현 포인트

- 신고 사유 저장 + risk 신호 스캔(전화번호/카카오/이메일 패턴)
- risk signal가 있으면 HIGH/LOW 계산

### 에러

- `USER_NOT_FOUND`

`report` 응답은 기존 신고 내역 누적을 반영해 `flags/risks`가 갱신되는 흐름을 구성합니다.

---

## 6.2 `POST /block`

### 요청

```json
{ "blocker_uuid": "string", "blocked_uuid": "string" }
```

### 응답

```json
{ "block": { "block_id": "string", "blocker_uuid": "string", "blocked_uuid": "string", "created_at": "ISO" } }
```

### 호출 위치

- `app/profile/[targetUuid].tsx`
- `app/chat/[chatId].tsx`

### 구현 포인트

- 중복 차단시 기존 block 그대로 반환 가능
- 차단 대상은 추천/채팅/노출에서 제외

### 에러

- `USER_NOT_FOUND`

차단은 중복 생성 허용 대신 기존 행위를 반환하는 방식이 mock 기준입니다.

---

## 6.3 `GET /filters?user_uuid=`

### 응답

```json
{ "filters": {
  "user_uuid":"string",
  "exclude_contacts": false,
  "exclude_same_church": false,
  "exclude_same_company": false
} }
```

### 호출 위치

- `app/(tabs)/settings.tsx` 노출 필터 조회

### 구현 포인트

- 사용자별 기본값 생성/반환

### 에러

- `USER_NOT_FOUND`

---

## 6.4 `PATCH /filters`

### 요청

```json
{
  "user_uuid": "string",
  "patch": {
    "exclude_contacts"?: true|false,
    "exclude_same_church"?: true|false,
    "exclude_same_company"?: true|false
  }
}
```

### 응답

```json
{ "filters": { ... } }
```

### 호출 위치

- `app/(tabs)/settings.tsx` 스위치 토글

### 에러

- `USER_NOT_FOUND`

---

## 6.5 `GET /admin/review/queue`

### 응답

```json
{ "low_risk": [RiskFlag], "high_risk": [RiskFlag] }
```

### 호출 위치

- `app/admin/review.tsx` 큐 로딩

### 구현 포인트

- 고위험, 저위험 큐 분리 반환

### 에러

- `ADMIN_FORBIDDEN` (운영권한 미보유 시)

---

## 6.6 `GET /admin/review/detail?target_uuid=`

### 응답

```json
{
  "profile": { ...Profile... },
  "risk": { "target_uuid":"string", "risk_level":"LOW|HIGH", "flags_json":[...], "matches_json":[...], "created_at":"ISO" },
  "reports": [ReportRecord],
  "masked": true|false
}
```

### 호출 위치

- `app/admin/review.tsx`

### 에러

- `PROFILE_NOT_FOUND`, `USER_NOT_FOUND`

---

## 6.7 `GET /admin/review/actions?target_uuid=`

### 응답

```json
{ "actions": [AdminActionRecord] }
```

### 호출 위치

- `app/admin/review.tsx` 디테일 패널

### 구현 포인트

- 시간 역순 정렬 권장

### 에러

- `USER_NOT_FOUND`

---

## 6.8 `POST /admin/review/approve`

### 요청

```json
{ "admin_id": "string", "target_uuid": "string", "reason_code"?: "string" }
```

### 응답

```json
{ "ok": true, "action": AdminActionRecord }
```

### 호출 위치

- `app/admin/review.tsx`

---

## 6.9 `POST /admin/review/reject`

### 요청

```json
{ "admin_id": "string", "target_uuid": "string", "reason_code": "string" }
```

### 응답

```json
{ "ok": true, "action": AdminActionRecord }
```

### 호출 위치

- `app/admin/review.tsx`

---

## 6.10 `POST /admin/review/suspend`

### 요청

```json
{ "admin_id": "string", "target_uuid": "string", "reason_code": "string" }
```

### 응답

```json
{ "ok": true, "action": AdminActionRecord }
```

### 호출 위치

- `app/admin/review.tsx`

---

## 6.11 `POST /admin/review/unsuspend`

### 요청

```json
{ "admin_id": "string", "target_uuid": "string", "reason_code"?: "string" }
```

### 응답

```json
{ "ok": true, "action": AdminActionRecord }
```

### 호출 위치

- `app/admin/review.tsx`

---

## 6.12 `POST /admin/review/mask`

### 요청

```json
{ "admin_id": "string", "target_uuid": "string", "reason_code"?: "string" }
```

### 응답

```json
{ "ok": true, "action": AdminActionRecord, "masked": true|false }
```

### 구현 포인트

- masked가 true면 노출/조회 제외 플래그 토글

### 호출 위치

- `app/admin/review.tsx`

---

## 6.13 `GET /users/{user_uuid}/manna`

### 응답

```json
{ "paid": 0, "bonus": 0 }
```

### 호출 위치

- `src/design-system/components/ScreenHeader.tsx`

### 에러

- `USER_NOT_FOUND`
