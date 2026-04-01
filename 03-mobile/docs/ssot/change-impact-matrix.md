> Source: `grace-link-RN/docs/ssot/change-impact-matrix.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# GraceLink 변경 영향 매트릭스

> 기능 변경 전에 “어디까지 같이 봐야 하는지” 빠르게 확인하기 위한 실무 문서

## 1. 사용법

변경하려는 영역을 찾고, 아래 네 가지를 같이 점검한다.
- 영향 화면
- 영향 코드
- 영향 정책
- 최소 검증 항목

## 2. 매트릭스

| 변경 영역 | 영향 화면 | 우선 확인 코드 | 우선 확인 문서 | 최소 검증 |
| --- | --- | --- | --- | --- |
| 로그인/세션 | splash, login, under-review, root redirect | `app/index.tsx`, `app/(auth)/_layout.tsx`, `src/features/onboarding/store.ts` | `docs/SSOT.md`, `docs/ux-screen-inventory.md`, `docs/api/01-auth-onboarding.md` | 로그인 진입, 승인/미승인 분기 |
| 온보딩 검증 | ob-01, ob-02, ob-03, ob-05, ob-06, ob-07, ob-08 | `src/features/onboarding/store.ts`, `validateOnboardingDraft.ts`, `config.ts` | `docs/ux-screen-inventory.md`, `docs/runtime-captures/ios/README.md` | 스텝 이동, 검증, 제출 |
| 추천 | reco, profile detail | `app/(tabs)/reco.tsx`, `app/profile/[targetUuid].tsx`, `src/mock/api.ts` | `docs/api/03-reco-vault.md`, `docs/prd-reverse-engineered-current-app.md` | 카드 조회, pass, 추가 추천 |
| 보관함 | vault, profile detail | `useVault.ts`, `vaultHelpers.ts`, `src/mock/api.ts` | `docs/api/03-reco-vault.md` | unlock/extend/restore, paywall 재시도 |
| 매칭 | profile detail, inbox | `requestMatch`, `acceptMatch`, `rejectMatch`, `app/(tabs)/inbox.tsx` | `docs/api/04-match-inbox-chat.md` | 신청/수락/거절/환급 |
| 채팅 | chat list, chat detail | `useChatDetail.ts`, `useChatMenu.ts`, `src/mock/scheduler.ts` | `docs/api/04-match-inbox-chat.md` | 목록, 전송, 종료, 타이머 |
| 만나 스토어/광고 | shop, settings, paywall | `useShop.ts`, `PaywallBottomSheet.tsx`, `src/core/env.ts`, `claimRewardedAd` | `docs/api/05-payment-ad.md` | 구매, 광고 보상, 잔액 반영 |
| 설정/필터 | settings | `settings.tsx`, `ProfileCard.tsx`, `updateMyFilterSettings` | `docs/api/06-safety-admin.md`, `docs/prd-reverse-engineered-current-app.md` | 토글 반영, 내 정보 진입 |
| 운영 심사 | admin/review | `app/admin/review.tsx`, `getRiskReviewQueue`, `admin* actions` | `docs/api/06-safety-admin.md`, `docs/runtime-captures/ios/admin.png` | queue, detail, action log |
| 공통 레이아웃/탭 | root layout, auth layout, tabs layout | `app/_layout.tsx`, `app/(tabs)/_layout.tsx` | `docs/SSOT.md`, `docs/ux-screen-inventory.md` | 진입 가드, 탭 노출 |

## 3. 자주 놓치는 연쇄 영향

### 추천 변경 시
- 프로필 상세 진입 방식도 같이 본다.
- 보관함 정책과 카드 상태 정의가 같이 깨질 수 있다.
- 추가 추천 cost/카피와 스토어 문구도 같이 확인한다.

### 온보딩 변경 시
- 제출 검증만 바꾸지 말고 preview 화면도 같이 본다.
- 심사 대기 전환과 사용자 status 전환이 같이 맞는지 본다.
- 캡처 문서와 스텝 수 표기도 같이 갱신한다.

### 매칭/채팅 변경 시
- 인박스 countdown, 채팅 타이머, scheduler 만료 규칙이 동시에 영향을 받는다.
- NORMAL/SUPER cost 표와 paywall 재시도도 같이 확인한다.

### 스토어/광고 변경 시
- `env.adDailyCap`, `env.adCooldownMinutes`, paywall placement, empty state 카피를 함께 점검한다.

### 운영 변경 시
- 사용자용 신고/차단 UX와 운영 큐가 서로 어긋나지 않는지 본다.
- mask/suspend가 추천/노출에 어떤 영향을 주는지 같이 점검한다.

## 4. 권장 검증 패키지

### 화면/정책 변경 공통
- `npm run lint`
- `npx tsc --noEmit`
- `npm test -- --runInBand`

### 문서 변경 포함 시
- 관련 캡처 파일 링크 검증
- `docs/SSOT.md`에서 링크되는 문서 업데이트 여부 확인

## 5. 실무 팁

- 기능 하나를 바꿀 때는 “화면 1개”만 보지 말고, 반드시 **정책 + 상태 + 캡처**를 함께 본다.
- GraceLink는 mock 로직에 정책 값이 많이 들어가 있으므로, UI만 바꿔도 실제 제품 규칙이 안 따라오면 바로 불일치가 생긴다.
- 고도화 작업은 `SSOT → PRD → 영향 매트릭스 → API 문서 → 코드` 순으로 읽고 시작하는 것이 가장 안전하다.
