> Source: `grace-link-RN/docs/api/10-front-frontend-validation.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# 프론트 고정 검증 규칙 정리 (백엔드 연동 기준)

이 문서는 화면에서 **서버 호출 이전에 수행하는 검증**을 모아둡니다.
실서버는 동일 동작을 모두 강제해야 하는 것은 아니지만, 신뢰 가능한 반려/권장 정책으로 반영하는 것을 권장합니다.

## 온보딩 공통 규칙

- ob-01(`PASS`)
  - `birth_year`는 숫자 입력만 허용 (클라이언트에서 `Number.isFinite`)
  - 화면에서 PASS API 호출 전 `Number.isFinite` 체크 실패 시 호출 미실행
  - API 결과 `verified === true` 여야 다음 화면 이동 가능

- ob-02(`기본정보`)
  - 닉네임 길이 `> 1`
  - 성별 선택 (`MALE` 또는 `FEMALE`)
  - 출생연도는 숫자
  - 교단, 시/도, 구/군 빈값 불가

- ob-05(`태그`)
  - 태그 수 `5 ~ 15`

- ob-06(`말씀`)
  - 말씀 ref가 최소 1개 이상

- ob-07(`L1`)
  - L1 질문은 정확히 3개 선택
  - 각 선택 질문의 답변 길이 `>= 150`

- ob-08(`제출`)
  - 위 조건을 통과한 payload(`draft`)를 통합 송신
  - `submitOnboarding({user_uuid, draft})` 한 번 호출

## 채팅/메시지 규칙

- sendMessage body는 최소 공백 제거 후 빈 문자열이면 호출 불가 (`INVALID_MESSAGE`)
- 클라이언트에서 "의미있는 메시지" 판정은 프론트에서만 표시 처리되고, 메시지 전송 자체는 막지 않음
  - 길이 >= 5
  - 한글/영문 최소 1자 포함
  - 순환 패턴(`ㅋ`, `ㅎ`, `ㅠ`, `ㅜ`만 반복) 제외

## 채팅 상대 유효성

- 대화 신고/차단 버튼 호출 전 상대 UUID가 비어 있으면 클라이언트에서 `TARGET_NOT_FOUND` 에러로 막음

## 보상/결제 트리거

- `INSUFFICIENT_MANNA`가 발생하면 paywall 재시도 모드(`pendingIntent`)로 이동:
  - 광고 보상(`placement` 기반): `paywall`, `my_free_manna`, `empty_state`
  - 구매(`verifyPurchase`) 후 원래 intent 재시도
- 동일 intent 재호출을 위해 서버는 멱등성 처리 또는 재요청 추적 정책 고려

