> Source: `grace-link-RN/docs/api/09-caller-matrix.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# API 9: 호출 매트릭스 (tsx / store / endpoint)

## 인증/온보딩

- `app/(auth)/login.tsx`
  - `useOnboardingStore.signInWithSso` -> `src/features/onboarding/store.ts` -> `apiClient.signInWithSso()` -> `POST /auth/sso/sign-in`
  - `useOnboardingStore.refreshStatus` -> `GET /auth/status?user_uuid=`

- `app/(auth)/ob-01.tsx`
  - `useOnboardingStore.verifyPass` -> `apiClient.verifyPass()` -> `POST /auth/pass/verify`

- `app/(auth)/ob-08.tsx`
  - `useOnboardingStore.submitOnboarding` -> `apiClient.submitOnboarding()` -> `POST /onboarding/submit`

- `app/(auth)/under-review.tsx`
  - `refreshStatus` -> `GET /auth/status`
  - `approveForDev` -> `POST /admin/dev/approve-user`

- `src/features/onboarding/store.ts`
  - 위 액션들의 공통 adapter 진입점(상태 저장 포함)

## 프로필

- `app/profile/[targetUuid].tsx`
  - `apiClient.getProfileDetail()` -> `GET /profile/detail?viewer_uuid=&target_uuid=`
  - `apiClient.unlockProfileSection()` -> `POST /profile/unlock`
  - `apiClient.requestMatch()` -> `POST /match/request`
  - `apiClient.reportUser()` -> `POST /report`
  - `apiClient.blockUser()` -> `POST /block`

- `app/profile/edit.tsx`
  - `apiClient.getMyProfile()` -> `GET /profile/me?user_uuid=`
  - `apiClient.updateMyProfile()` -> `PATCH /profile/me`

- `app/(tabs)/settings.tsx`
  - `apiClient.getMyProfile()` -> `GET /profile/me?user_uuid=`
  - `apiClient.updateMyFilterSettings()` -> `PATCH /filters`
  - `apiClient.getMyFilterSettings()` -> `GET /filters?user_uuid=`

## 추천/보관함

- `app/(tabs)/reco.tsx`
  - `apiClient.getRecoToday()` -> `GET /reco/today?user_uuid=`
  - `apiClient.requestExtraReco()` -> `POST /reco/extra`
    - payload: `{ user_uuid, amount: 2 }`
  - `apiClient.unlockCard()` -> `POST /card/unlock`
  - `apiClient.passCard()` -> `POST /card/pass`
  - `apiClient.claimRewardedAd()` -> `POST /rewarded-ad/claim`
    - payload: `{ user_uuid, placement: 'empty_state', reward_token: 'empty-${Date.now()}' }`

- `app/(tabs)/vault.tsx`
  - `apiClient.getVault()` -> `GET /vault?user_uuid=`
  - `apiClient.extendVault()` -> `POST /vault/extend`
  - `apiClient.restoreVaultCard()` -> `POST /vault/restore`
  - `apiClient.unlockCard()` -> `POST /card/unlock`

## 매칭/인박스/채팅

- `app/(tabs)/inbox.tsx`
  - 병렬 `apiClient.getInboxReceived()` + `apiClient.getInboxSent()`
  - `apiClient.acceptMatch()` -> `POST /match/accept`
  - `apiClient.rejectMatch()` -> `POST /match/reject`

- `app/(tabs)/chat.tsx`
  - `apiClient.getChats()` -> `GET /chats?user_uuid=`

- `app/chat/[chatId].tsx`
  - `apiClient.getChats()` -> `GET /chats?user_uuid=`
  - `apiClient.sendChatMessage()` -> `POST /chat/send`
  - `apiClient.reportUser()` -> `POST /report`
  - `apiClient.blockUser()` -> `POST /block`

## 결제/광고

- `app/(tabs)/shop.tsx`
  - `apiClient.getShopPackages()` -> `GET /shop/packages`
  - `apiClient.verifyPurchase()` -> `POST /purchase/verify`
    - payload: `{ user_uuid, package_id, receipt }`
  - `apiClient.claimRewardedAd()` -> `POST /rewarded-ad/claim`
    - payload: `{ user_uuid, placement: 'my_free_manna', reward_token: ... }`

- `app/(tabs)/settings.tsx`
  - `apiClient.getShopPackages()` -> `GET /shop/packages`
  - `apiClient.verifyPurchase()` -> `POST /purchase/verify`
  - `apiClient.claimRewardedAd()` -> `POST /rewarded-ad/claim`

- `src/features/paywall/PaywallBottomSheet.tsx`
  - `getShopPackages()` / `claimRewardedAd()` / `verifyPurchase()`

## 안전/운영

- `app/admin/review.tsx`
  - `getRiskReviewQueue()` -> `GET /admin/review/queue`
  - `getRiskReviewDetail()` -> `GET /admin/review/detail?target_uuid=`
  - `getAdminActions()` -> `GET /admin/review/actions?target_uuid=`
  - `adminApprove()` -> `POST /admin/review/approve`
  - `adminReject()` -> `POST /admin/review/reject`
  - `adminSuspend()` -> `POST /admin/review/suspend`
  - `adminUnsuspend()` -> `POST /admin/review/unsuspend`
  - `adminToggleMask()` -> `POST /admin/review/mask`

- `src/design-system/components/ScreenHeader.tsx`
  - `apiClient.getMannaBalance()` -> `GET /users/{user_uuid}/manna`

## 상태조회/주입 지점

- `app/index.tsx`
  - 라우팅 상태: `is_authenticated`, `status`를 기준으로 엔드포인트 호출 경로 전환 (직접 API 없음)
