> Source: `grace-link-server/docs/ssot/09-rn-integration-gap-handoff.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# RN Integration Gap Handoff

이 문서는 **현재 서버 구현 상태**를 기준으로 `grace-link-RN` 앱에서 아직 붙지 않았거나 구계약에 머물러 있는 부분을 정리한 프론트 handoff 문서입니다.

## 기준 문서

- 브라우저 API Reference: `/scalar`
- OpenAPI JSON: `/v3/api-docs`
- 서버 SSOT: `docs/ssot/`
- OpenSpec main specs: `openspec/specs/*`

---

## 1. 결론 요약

현재 RN은 **mock/구계약 기반 상태가 아직 많이 남아 있고**, 실서버 기준으로 보면 아래 4개가 가장 큽니다.

1. **인증/세션 미연동**
   - access/refresh token 저장, Bearer 헤더, refresh rotation, logout 흐름이 없음
2. **SSO 실연동 미완성**
   - Google/Apple 토큰을 실제 서버 로그인 API로 완전하게 넘기지 않음
3. **채팅 실시간 미연동**
   - 아직 `POST /chat/send` + polling 중심
   - 서버 공식 계약은 `/ws/chat` WebSocket
4. **푸시/알림 미연동**
   - push token 등록/해제, notification preferences, deep link 처리 없음

즉 RN은 현재 **실서버 production contract를 완전히 소비하는 상태가 아님**.

---

## 2. 서버 대비 RN 미구현 / 불일치 목록

## A. 인증 / 세션

### 현재 RN 상태
- `real-adapter.ts` 가 `Authorization: Bearer <token>` 를 자동 부착하지 않음
- session storage 모델이 없음
- `GET /auth/me`, `POST /auth/token/refresh`, `POST /auth/logout`, `POST /auth/logout-all` 사용 안 함
- `useOnboardingStore` 는 사실상 `user_uuid` 만 상태 기준으로 사용함

### 서버 기준 필수 구현
- 로그인 성공 응답에서 아래 저장
  - `access_token`
  - `refresh_token`
  - `token_type`
  - `expires_in`
  - `user_uuid`
  - `auth_status`
- 보호 API 호출 시 공통 Bearer 헤더 부착
- 401/TOKEN_INVALID 발생 시 `POST /auth/token/refresh` 로 1회 재시도
- 앱 시작 시 `GET /auth/me` 로 세션 복구
- 로그아웃 시 `POST /auth/logout` 호출 후 로컬 세션 삭제

### 프론트 수정 대상
- `src/core/api/real-adapter.ts`
- `src/core/storage.ts`
- `src/features/onboarding/store.ts`
- 앱 초기 hydration 위치 (`app/_layout.tsx` 또는 auth bootstrap 경로)

---

## B. SSO 로그인

### 현재 RN 상태
- `app/(auth)/login.tsx` 에서 Google Sign-In으로 `idToken` 을 가져오지만 **서버에 실제 전달하지 않음**
- 로그만 찍고 종료됨
- Apple도 `signInWithSso('apple')` 호출만 있고 실제 credential 전달 계약이 없음
- `ApiClient.signInWithSso` 타입이 `{ provider }` 만 받도록 되어 있어 서버 응답 shape와 입력 shape가 모두 구버전임

### 서버 기준 필수 구현
- Google: `POST /auth/sso/sign-in` with
  - `provider: 'google'`
  - `id_token`
- Apple: `POST /auth/sso/sign-in` 또는 `/auth/sso/code/sign-in` 에 맞는 credential 전달
- 응답에서 token pair 저장

### 프론트 수정 대상
- `app/(auth)/login.tsx`
- `src/core/api/types.ts`
- `src/core/api/real-adapter.ts`
- `src/features/onboarding/store.ts`

---

## C. 채팅 / WebSocket

### 현재 RN 상태
- `useChatDetail.ts` 가 `getChats()` polling + `sendChatMessage()` REST 호출 사용
- `sendChatMessage()` 는 아직 `/chat/send` 를 호출함
- 서버는 이 경로를 `410 GONE / DEPRECATED_ENDPOINT` 로 막음
- `/ws/chat`, `auth`, `chat.send`, `chat.message.created`, `match.accepted`, `chat.room.closed` 처리 코드 없음

### 서버 기준 필수 구현
- 초기 hydrate:
  - `GET /chats`
  - 필요 시 `GET /chat/{chatId}`
- 실시간:
  - `/ws/chat` 연결
  - `auth` 프레임으로 JWT 인증
  - `chat.send` 프레임으로 메시지 전송
  - 아래 이벤트 소비
    - `match.accepted`
    - `chat.message.created`
    - `chat.room.closed`
    - `heartbeat`
    - `error`

### 프론트 수정 대상
- `src/core/api/types.ts` 에서 REST send 제거 또는 deprecated 처리
- `src/core/api/real-adapter.ts`
- `src/features/chat/hooks/useChatDetail.ts`
- `app/chat/[chatId].tsx`
- 채팅 목록/인박스 갱신 흐름

---

## D. 푸시 알림 / 알림 설정

### 현재 RN 상태
- `Notifications` / Expo push token 등록 흐름 없음
- `/devices/push-token` 호출 없음
- `/notifications/preferences` 조회/수정 없음
- push deep link 처리 없음
- foreground/background 알림 정책 없음

### 서버 기준 현재 구현됨
- `POST /devices/push-token`
- `DELETE /devices/push-token`
- `GET /notifications/preferences`
- `PATCH /notifications/preferences`
- push category:
  - `match`
  - `chat`
  - `system`
- multi-device policy:
  - `chat`: active session 있으면 suppress
  - `match`: active session 있으면 suppress
  - `system`: 기본 push 유지

### 프론트 필수 구현
- Expo notifications permission 요청
- ExpoPushToken 취득 후 서버 등록
- 로그아웃/토큰 갱신/앱 재설치 등 상황에서 unregister 처리
- 알림 설정 화면 추가
- push payload `deep_link` 기반 라우팅

### 프론트 수정 대상
- 신규 알림 bootstrap 모듈 필요 (`src/core/notifications/*` 권장)
- settings 화면에 알림 설정 섹션 추가
- 앱 root deep-link handler 추가

---

## E. 문서/타입 구계약 잔존

### 현재 RN 상태
- `src/contracts/api_contract.md` 가 아직 `POST /chat/send` 기준
- `src/core/api/types.ts` 도 구응답 shape가 남아 있음
- 실서버 계약과 타입 정의가 불일치

### 서버 기준 조치 필요
- RN 내부 계약 문서는 서버 SSOT를 따라 재작성
- 서버를 기준으로 타입 재생성 또는 수동 정리

---

## 3. 프론트 구현 우선순위 (권장 순서)

## P0 — 막히는 것부터
1. **세션 저장/Bearer 헤더/refresh/auth-me**
2. **Google/Apple SSO 실제 서버 로그인 연결**
3. **채팅 WebSocket 전환**

## P1 — 사용자 경험 완성
4. **push token 등록/해제**
5. **notification preferences 화면/연동**
6. **push deep-link 라우팅**

## P2 — 안정화
7. 알림 foreground UX 정리
8. 앱 내 notification center 필요 여부 판단
9. per-device preference 필요성 검토

---

## 4. 프론트 전달용 구현 체크리스트

### Auth / Session
- [ ] token pair 저장소 추가
- [ ] Bearer header 자동 부착
- [ ] `GET /auth/me` 세션 복구
- [ ] `POST /auth/token/refresh` retry 처리
- [ ] `POST /auth/logout` 연동

### SSO
- [ ] Google `id_token` 서버 전달
- [ ] Apple credential/code 서버 전달
- [ ] 로그인 응답 shape를 실제 서버 기준으로 타입 수정

### Chat
- [ ] `/ws/chat` 클라이언트 추가
- [ ] `auth` 프레임 전송
- [ ] `chat.send` 구현
- [ ] `match.accepted`, `chat.message.created`, `chat.room.closed` 처리
- [ ] `/chat/send` 사용 제거

### Push
- [ ] Expo push permission 요청
- [ ] `POST /devices/push-token` 등록
- [ ] `DELETE /devices/push-token` 해제
- [ ] `GET/PATCH /notifications/preferences` 연결
- [ ] push `deep_link` 라우팅

---

## 5. 프론트에 전달할 때 이렇게 주면 좋음

### 권장 전달 패키지
1. 이 문서 `docs/ssot/09-rn-integration-gap-handoff.md`
2. `docs/ssot/03-auth-session-spec.md`
3. `docs/ssot/05-chat-websocket-spec.md`
4. `docs/ssot/07-frontend-handoff.md`
5. `openspec/specs/push-notification-delivery/spec.md`
6. `openspec/specs/notification-preferences/spec.md`
7. `openspec/specs/multi-device-notification-policy/spec.md`

### 전달 메시지 예시
- “RN은 현재 mock/구계약 기준이 남아 있으니 서버 SSOT 기준으로 붙여주세요.”
- “우선순위는 Auth/Session → SSO → WebSocket Chat → Push 순서입니다.”
- “Push는 Expo Push Service 기준이고, Android는 Expo/EAS 쪽 FCM credentials가 필요합니다.”

---

## 6. 최종 판단

현재 RN은 **실서버 production contract를 완전히 구현한 상태가 아님**.
하지만 서버 쪽 contract, OpenSpec, API, 테스트는 이제 기준점이 충분히 정리되어 있으므로,
프론트는 이 문서를 기준으로 **순차 구현**하면 됩니다.
