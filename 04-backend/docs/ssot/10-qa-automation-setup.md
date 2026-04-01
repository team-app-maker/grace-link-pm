> Source: `grace-link-server/docs/ssot/10-qa-automation-setup.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# QA Automation Setup (Quick Plan)

퇴근 후 바로 이어서 작업할 수 있도록 남기는 **짧은 QA 자동화 구성 메모**입니다.
목표는 서버/클라이언트/스펙을 한 흐름으로 검증하는 것입니다.

## 목표

1. **웹에서 빠르게 확인**: RN web + Playwright
2. **모바일 고유 기능 확인**: Expo app + Maestro/Detox
3. **서버 계약 확인**: OpenSpec + Gradle test

---

## 추천 구성

## A. 서버 기준 검증 (항상 먼저)

실행:
```bash
openspec validate --all --no-interactive
./gradlew test
```

의미:
- 서버 계약이 깨졌는지 확인
- 알림/채팅/인증 회귀 확인

---

## B. 웹 QA (가장 먼저 붙일 것)

### 도구
- Expo web
- Playwright

### 이유
- 지금 당장 자동화하기 가장 쉬움
- 로그인 이후 화면 흐름 / 설정 / 인박스 / 채팅 기본 동작을 빨리 검증 가능

### 추천 시나리오
1. 앱 진입
2. dev/test 계정 로그인 또는 서버 테스트 계정 주입
3. 온보딩 상태 화면 확인
4. 추천/인박스/설정 화면 진입
5. 알림 설정 화면에서 preferences 조회/수정
6. 채팅방 목록/상세 hydrate 확인

### 한계
- native Google/Apple sign-in 완전 검증 어려움
- 실제 push permission / background 상태 / OS 알림함 검증 어려움

---

## C. 모바일 QA (2차)

### 도구
- Maestro 권장
- 대안: Detox

### 이유
- push permission
- deep link
- foreground/background
- 다중 기기 체감 시나리오
를 실제로 보기 좋음

### 추천 시나리오
1. 앱 설치 후 Expo push permission 허용
2. push token 서버 등록
3. notification preferences 수정
4. 채팅 메시지 수신 시 push 동작 확인
5. active session 있는 기기 / 없는 기기 비교
6. match push suppress 동작 확인
7. system push는 계속 오는지 확인

---

## 다중 기기 정책 확인 포인트

현재 서버 정책:
- `chat`: active websocket session 있으면 push suppress
- `match`: active websocket session 있으면 push suppress
- `system`: 기본 push 유지

QA할 때 꼭 봐야 하는 것:
1. A기기에서 채팅 열어둔 상태
2. B기기에도 같은 계정 로그인
3. chat/match/system 이벤트 각각 발생
4. 어떤 기기로 push가 가는지 비교

---

## 오늘 기준 가장 현실적인 실행 순서

### Step 1
서버 검증
```bash
openspec validate --all --no-interactive
./gradlew test
```

### Step 2
RN web + Playwright 세팅
- 목표: smoke test 3~5개
- 우선순위:
  - auth/session bootstrap
  - settings / notification preferences
  - inbox / chat list hydrate

### Step 3
Expo app + Maestro 세팅
- 목표: push / deep link / multi-device 체감 검증

---

## 프론트/QA에 같이 줄 문서

- `docs/ssot/09-rn-integration-gap-handoff.md`
- `docs/ssot/03-auth-session-spec.md`
- `docs/ssot/05-chat-websocket-spec.md`
- `openspec/specs/push-notification-delivery/spec.md`
- `openspec/specs/notification-preferences/spec.md`
- `openspec/specs/multi-device-notification-policy/spec.md`

---

## 다음 액션 메모

집에서 바로 할 일:
- [ ] RN web 실행 확인
- [ ] Playwright smoke test 초안 만들기
- [ ] Expo push permission / token 등록 실제 경로 확인
- [ ] Maestro로 multi-device push 흐름 검토
