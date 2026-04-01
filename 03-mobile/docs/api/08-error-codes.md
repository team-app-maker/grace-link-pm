> Source: `grace-link-RN/docs/api/08-error-codes.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# API 8: 에러 코드 정합성

프론트에서는 `error.message` 문자열을 비교하는 패턴이 있으므로, 서버는 동일한 코드 문자열을 유지하는 것이 중요합니다.

`chat.tsx` 및 일부 화면에서는 API 호출 전/후 UI에서 local validation용 에러를 직접 생성합니다.
해당 항목은 mock과 동일하게 서버 필수 예외가 아니며, 서버는 동일 코드를 받는 추가 기능을 선택적으로 제공하면 됩니다.

## 공통 코드권장

- `USER_NOT_FOUND`
- `PROFILE_NOT_FOUND`
- `PROFILE_HIDDEN_BY_SAFETY`
- `INSUFFICIENT_MANNA`
- `FORBIDDEN`
- `MATCH_NOT_FOUND`
- `CARD_NOT_FOUND`
- `CHAT_ROOM_NOT_FOUND`
- `CHAT_ROOM_CLOSED`
- `CHAT_HIDDEN_BY_SAFETY`
- `INVALID_MESSAGE` (주로 UI validation)
- `TARGET_NOT_FOUND` (주로 UI에서 상대 UUID 누락 시)
- `VAULT_EXTEND_LIMIT_REACHED`
- `VAULT_RESTORE_WEEKLY_LIMIT_REACHED`
- `AD_DAILY_CAP_REACHED`
- `AD_COOLDOWN`
- `AD_RATE_LIMITED`
- `TOKEN_INVALID`
- `NOT_APPROVED`
- `ACCOUNT_SOFT_SUSPENDED`
- `PACKAGE_NOT_FOUND`
- `RECEIPT_INVALID`

## mock에서 노출되는 에러 목록

- `src/mock/api.ts` 기준:
  - `USER_NOT_FOUND`
  - `PROFILE_HIDDEN_BY_SAFETY`
  - `PROFILE_NOT_FOUND`
  - `INSUFFICIENT_MANNA`
  - `VAULT_EXTEND_LIMIT_REACHED`
  - `VAULT_RESTORE_WEEKLY_LIMIT_REACHED`
  - `NOT_APPROVED`
  - `ACCOUNT_SOFT_SUSPENDED`
  - `AD_RATE_LIMITED`
  - `TOKEN_INVALID`
  - `AD_DAILY_CAP_REACHED`
  - `AD_COOLDOWN`
  - `MATCH_NOT_FOUND`
  - `FORBIDDEN`
  - `CHAT_ROOM_NOT_FOUND`
  - `CHAT_ROOM_CLOSED`
  - `CHAT_HIDDEN_BY_SAFETY`
- `PACKAGE_NOT_FOUND`
- `RECEIPT_INVALID`

## 권장 추가 코드

- `ADMIN_FORBIDDEN` (운영 API 권한 제어 시)
- `REPEAT_REQUEST` (멱등성 보장 실패/중복 처리 시, 선택)

## HTTP 상태 권장

- `400 Bad Request`: 잘못된 파라미터/형식
- `401/403`: 미승인/권한(예: `NOT_APPROVED`, `FORBIDDEN`)
- `404 Not Found`: `USER_NOT_FOUND`, `PROFILE_NOT_FOUND`, `CARD_NOT_FOUND`, `MATCH_NOT_FOUND`, `CHAT_ROOM_NOT_FOUND`
- `409 Conflict`: 상태 충돌(락/중복 처리)
- `410 Gone`: 만료로 처리가 불가능한 자원
- `429 Too Many Requests`: `AD_COOLDOWN`, `AD_DAILY_CAP_REACHED`, `AD_RATE_LIMITED`
- `500 Internal Server Error`: 영속/외부 검증 실패

프론트 호환을 위해 `message` 에러 코드 문자열과 `error` 필드를 함께 반환 권장.
