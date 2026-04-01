> Source: `grace-link-server/docs/ssot/03-auth-session-spec.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# Auth & Session Spec

## Scope
- SSO login
- token issuance / refresh / logout
- session restore
- Bearer auth rules
- dev-only insecure fallback

## Canonical Rules
- 보호 API는 `Authorization: Bearer <access_token>` 기준
- 앱 세션 복구 기준 API는 `GET /auth/me`
- 토큰 갱신은 `POST /auth/token/refresh`
- `user_uuid` fallback 은 `auth.allow-insecure-user-uuid-fallback=true` 인 개발 환경 예외
- request body/query 의 `user_uuid` 와 Bearer principal 이 다르면 `FORBIDDEN`

## Endpoints

### `POST /auth/sso/sign-in`
입력:
- `provider=google|apple`
- `id_token`

성공 응답 핵심:
- `user_uuid`
- `access_token`
- `refresh_token`
- `token_type`
- `expires_in`
- `auth_status`

참고:
- 푸시 토큰은 로그인 응답과 분리 운영됩니다. 필요 시 `POST /devices/push-token` 호출로 등록하세요.

### `POST /auth/sso/code/sign-in`
입력:
- `provider`
- `code`
- `redirect_uri`
- `code_verifier?`

용도:
- browser OAuth / PKCE 플로우

### `GET /auth/me`
용도:
- 앱 재실행 후 세션 복구
- access token 유효성 확인

응답 핵심:
- `member_id`
- `role`
- `auth_status`

### `POST /auth/token/refresh`
용도:
- refresh token rotation

주의:
- 성공 시 새 refresh token 을 저장해야 함

### `POST /auth/logout`
용도:
- 현재 세션만 종료

### `POST /auth/logout-all`
용도:
- 현재 사용자 모든 세션 종료

## Auth Status Payload

| Field | Meaning |
|---|---|
| `status` | 현재 회원 상태 |
| `pass_verified` | PASS 검증 완료 여부 |
| `onboarding_completed` | 온보딩 제출 완료 여부 |
| `login_allowed` | 로그인 후 메인 기능 접근 가능 여부 |
| `next_step` | 다음 유도 화면/단계 |

## Error Contract

HTTP 에러 공통 형식:

```json
{
  "error": "TOKEN_INVALID",
  "message": "TOKEN_INVALID"
}
```

주요 error:
- `TOKEN_INVALID`
- `FORBIDDEN`
- `BAD_REQUEST`
- `USER_NOT_FOUND`
- `USER_SUSPENDED`
