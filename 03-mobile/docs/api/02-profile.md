> Source: `grace-link-RN/docs/api/02-profile.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# API 2: 프로필

## 2.1 `GET /profile/detail?viewer_uuid=&target_uuid=`

### 응답

```json
{
  "profile": {
    "user_uuid": "string",
    "nickname": "string",
    "gender": "MALE|FEMALE",
    "birth_year": 1990,
    "region_sido": "string",
    "region_sigungu": "string",
    "denomination": "string",
    "church_id": "string|null",
    "church_verified": false,
    "work_verified": false,
    "tags": ["string"],
    "l1_answers_json": { "L1_01": "string" },
    "l2_answers_json": { "L2_01": "string" },
    "favorite_verses_json": [{ "ref": "string", "reason": "string" }],
    "favorite_ccm_json": [{ "title": "string", "reason": "string" }]
  },
  "unlocks": [
    {
      "unlock_id": "string",
      "viewer_uuid": "string",
      "target_uuid": "string",
      "unlock_type": "L1|L2|VERSE_REASON|CCM_REASON",
      "created_at": "ISO8601"
    }
  ]
}
```

### 호출 위치

- `app/profile/[targetUuid].tsx` 초기 load
- `app/profile/[targetUuid].tsx` Deep Read 화면

### 에러

- `USER_NOT_FOUND`, `PROFILE_HIDDEN_BY_SAFETY`, `PROFILE_NOT_FOUND`

---

## 2.2 `GET /profile/me?user_uuid=`

### 응답

```json
{ "profile": { ...profile fields... }
```

### 호출 위치

- `app/profile/edit.tsx`(프로필 수정 화면)
- `app/(tabs)/settings.tsx`(내 정보 화면)

### 에러

- `USER_NOT_FOUND`, `PROFILE_NOT_FOUND`

---

## 2.3 `PATCH /profile/me`

### 요청

```json
{
  "user_uuid": "string",
  "patch": {
    "nickname": "string?",
    "gender": "MALE|FEMALE?",
    "birth_year": 1990,
    "denomination": "string?",
    "region_sido": "string?",
    "region_sigungu": "string?",
    "church_name": "string?",
    "l1_answers_json": { "L1": "string" },
    "l2_answers_json": { "L2": "string", "L3": "string" }
  }
}
```

### 응답

```json
{ "profile": { ...profile fields... } }
```

### 호출 위치

- `app/profile/edit.tsx`

### 프런트 검증

- 닉네임 길이 > 1, 성별/지역/교단 required
- 출생연도 숫자

### 구현 포인트

- partial patch 허용
- `church_name` 값은 기존 스키마의 `church_id`와 매핑 필요 (mock는 직접 값 대입)

### 에러

- `PROFILE_NOT_FOUND`, `USER_NOT_FOUND`

---

## 2.4 `POST /profile/unlock`

### 요청

```json
{
  "viewer_uuid": "string",
  "target_uuid": "string",
  "unlock_type": "L1|L2|VERSE_REASON|CCM_REASON"
}
```

### 응답

```json
{
  "unlock": {
    "unlock_id": "string",
    "viewer_uuid": "string",
    "target_uuid": "string",
    "unlock_type": "L1|L2|VERSE_REASON|CCM_REASON",
    "created_at": "ISO8601"
  },
  "alreadyOwned": true|false
}
```

### 호출 위치

- `app/profile/[targetUuid].tsx` -> `handleUnlock`

### 비용

- `L1` 1, `L2` 2, `VERSE_REASON` 1, `CCM_REASON` 1
- 동일 대상/타입 재열람이면 비용 미차감 (alreadyOwned=true)

### 에러

- `INSUFFICIENT_MANNA`, `USER_NOT_FOUND`, `PROFILE_HIDDEN_BY_SAFETY`, `FORBIDDEN`
