> Source: `grace-link-RN/docs/api/00-overview.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# API 명세 개요

본 문서는 현재 앱의 `apiClient` 사용 범위를 기준으로 작성했으며, mock 데이터 호출(`src/mock/api.ts`)을 기준 API 구현 사양으로 분리한 것입니다.

## 기본 정책

- Base URL: `env.apiUrl`
- content-type: `application/json`
- 인증: 현재 mock/실 서버 모두 `apiClient`는 `Authorization` 헤더를 자동 부여하지 않음. 실제 서버 구현 시 최소한 아래를 적용 권장
  - `Authorization: Bearer <token>`
  - `device-id` 또는 session id 기반 서버 식별
- 사용자 식별: 대부분의 요청은 mock에서 `user_uuid`를 body/query로 전달. 실제 운영에서는 인증 사용자 식별값(`auth user id`)을 우선 사용하고, 요청값과 불일치 시 `FORBIDDEN` 처리 권장.
- 화폐 단위: `MANNA_PAID`, `MANNA_BONUS` 분리
  - 비용/환불/보상 규칙은 **bonus 우선 사용 후 paid 사용**
- 공통 응답/에러 정책(권장)
  - 정상: `2xx` + JSON body
  - 실패: `{ "error": "ERROR_CODE", "message"?: "human readable" }` 또는 `{ "code": "ERROR_CODE" }` 하위 호환
  - 현재 프론트에서는 `Error.message` 값으로 에러 코드를 직접 비교하고 표시 (`ERROR_CODE` 문자열 권장)
 - 요청 식별: mock에서는 대부분 `user_uuid`를 body/query로 받지만, 운영은 JWT/session 기반 사용자 ID를 우선 식별자로 권장하고,
   body/query의 `user_uuid` 불일치 시 `FORBIDDEN` 처리

## 서버에 필요한 핵심 엔티티 (요약)

- `users`
  - `user_uuid`, `status`, `paid_manna_balance`, `bonus_manna_balance`, `exposure_weight`
- `profiles`
  - `user_uuid`, `nickname`, `gender`, `birth_year`, `region_*`, `denomination`, `church_id`, `tags`, `l1_answers_json`, `l2_answers_json`, `favorite_verses_json`, `favorite_ccm_json`
- `recommendation_cards`
  - `card_id`, `viewer_uuid`, `target_uuid`, `status(ACTIVE|LOCKED|SEEN|PASSED|DELETED)`, 타임스탬프들
- `unlocks`
  - `viewer_uuid`, `target_uuid`, `unlock_type`
- `matches`, `chat_rooms`, `chat_messages`, `transactions`, `risk_flags`, `reports`, `blocks`, `admin_actions`, `rewarded_ads`

## 현재 mock와의 매핑 포인트

- 서버 구현은 `src/mock/api.ts`의 동작을 기준으로 동기화하면 앱 기존 동작과 1:1 정합성 확보
- `src/core/api/real-adapter.ts`의 경로 문자열이 현재 실제 서버에서 구현해야 할 엔드포인트 고정표
- 공통 규칙/예외 코드는 `src/mock/api.ts`에서 사용 중인 에러 문자열을 그대로 사용

## 핵심 주의점

- `src/contracts/api_contract.md`는 일부 구버전 항목(`unlock/l1`, `match/accept` 응답 필드 등)이 현재 코드와 다릅니다.
  - 본 문서 기준은 `src/core/api/real-adapter.ts` + `src/mock/api.ts` 기준으로 통일해야 합니다.
- `OnboardingDraft.church_request`는 현재 mock 저장 플로우에서 사용되지 않음. 서버/DB에서 별도 필드로 받거나 검토 필요.
