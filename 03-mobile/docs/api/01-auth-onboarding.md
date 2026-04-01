> Source: `grace-link-RN/docs/api/01-auth-onboarding.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# API 1: 인증/온보딩

- 호출 경로 기준: `src/core/api/real-adapter.ts`
- 클라이언트 엔트리: `src/features/onboarding/store.ts`

## 1.1 `POST /auth/sso/sign-in`

### 요청

```json
{ "provider": "google" | "apple" }
```

### 응답

```json
{
  "user_uuid": "string",
  "status": "SUBMITTED|UNDER_REVIEW|APPROVED|REJECTED|NEEDS_EDIT|SUSPENDED",
  "provider": "google|apple"
}
```

### 호출 위치

- `src/features/onboarding/store.ts` `signInWithSso`
  - UI: `app/(auth)/login.tsx`

### 구현 포인트

- 신규 유저면 users/profile 최소 레코드 생성
- 기존 유저면 마지막 활동 갱신
- 상태는 `status` 반환값 사용

### 에러

- 미정의 provider / 회원 생성 실패 케이스는 `400`/`409` 등으로 처리

---

## 1.2 `POST /auth/pass/verify`

### 요청

```json
{
  "user_uuid": "string",
  "birth_year": 1990
}
```

### 응답

```json
{ "verified": true | false }
```

### 호출 위치

- `src/features/onboarding/store.ts` `verifyPass`
  - UI: `app/(auth)/ob-01.tsx`

### 현재 프론트 검증

- `ob-01`에서 숫자 변환이 가능한 생년인지 1차 필터

### 구현 포인트

- 서버에서 만 19세 이상 판정 권장
- `verified=false`면 다음 단계 이동 버튼 비활성 (`pass_verified`)

### 에러

- `USER_NOT_FOUND`

---

## 1.3 `POST /onboarding/submit`

### 요청

```json
{
  "user_uuid": "string",
  "draft": {
    "nickname": "string",
    "gender": "MALE|FEMALE|",
    "birth_year": "string",
    "denomination": "string",
    "region_sido": "string",
    "region_sigungu": "string",
    "church_name": "string",
    "church_request": "string",
    "tags": ["string"],
    "favorite_verses": [{ "ref": "string", "reason": "string" }],
    "favorite_ccm": [{ "title": "string", "reason": "string" }],
    "l1_selected_ids": ["string"],
    "l1_answers": { "L1_01": "string", "L1_02": "string" }
  }
}
```

### 응답

```json
{ "status": "UNDER_REVIEW|APPROVED|..." }
```

### 호출 위치

- `src/features/onboarding/store.ts` `submitOnboarding`
  - UI: `app/(auth)/ob-08.tsx`

### 프론트에서 선검증(모아 제출)

- `ob-01`: PASS 인증 성공 여부
- `ob-02`: 닉네임>1, 성별, 출생연도, 교단, 시/도, 구/군 required
- `ob-05`: 태그 수 5~15
- `ob-06`: 말씀 ref 필수
- `ob-07`: L1 3개 선택 + 각 답변 150자 이상

### 구현 포인트

- 현재 mock는 `l1_selected_ids`는 반영하지 않고 `l1_answers_json`에 직접 반영
- `church_request`는 mock에 저장되지 않음 → 서버는 별도 컬럼 또는 `profile.church_request` 파트 저장 정책 필요
- 제출 즉시 `status`를 `UNDER_REVIEW`로 전환 권장

### 에러

- `USER_NOT_FOUND`

---

## 1.4 `GET /auth/status?user_uuid=`

### 요청

- query: `user_uuid`

### 응답

```json
{ "status": "SUBMITTED|UNDER_REVIEW|APPROVED|REJECTED|NEEDS_EDIT|SUSPENDED" }
```

### 호출 위치

- `src/features/onboarding/store.ts` `refreshStatus`
  - UI: `app/(auth)/under-review.tsx`, `app/(auth)/login.tsx`(로그인 직후 호출)

### 에러

- `USER_NOT_FOUND`

---

## 1.5 `POST /admin/dev/approve-user`

### 요청

```json
{ "user_uuid": "string" }
```

### 응답

```json
{ "status": "APPROVED" }
```

### 호출 위치

- `src/features/onboarding/store.ts` `approveForDev`
  - UI: `app/(auth)/under-review.tsx`

### 목적

- 개발/테스트용 관리 동작, 운영에는 별도 인증/권한 필요

### 에러

- `USER_NOT_FOUND`

