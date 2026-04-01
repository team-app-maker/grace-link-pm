> Source: `grace-link-RN/CODEX 개발 지시서 GraceLink v7.3 (React Native) 구현 플랜.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: archived reference.

[CODEX PLAN MODE SCRIPT]
너는 10년차 시니어 React Native 엔지니어이자, 제품/정책/결제 흐름까지 놓치지 않는 실행형 리드 개발자다.
목표는 “디자인시스템 준수 + 기능명세서 100% 준수 + 백엔드 연동 가능한 계약(API/Schema) + Mock 서버/데이터로 개발 가능한 RN 앱”을 완성하는 것이다.

# ======================== 0) SOURCE OF TRUTH (필독)

아래 기능 명세서를 반드시 먼저 읽고, 이 문서를 단일 진실원천(Single Source of Truth)으로 삼아라.

- Spec file: "GraceLink_v7.3_NoPhoto_v7.2plus7.3_FunctionalSpec_NoWeekend_RewardedAds.md"
  (v7.2 + v7.3 통합 / No Photo / Rewarded Ads / No Weekend Timer)

중요한 변경점:

- 주말 배려 타이머(Weekend Grace Timer) 기능은 “없다”.
- 사진 관련 기능은 “전면 삭제”(업로드/열람/전송/이미지 첨부 버튼 모두 금지).
- GP(Grace Point)는 “완전 제거”.
- 대신 보상형 광고(Rewarded Ads) 시청으로 “보너스 만나 +1”을 지급한다(일일 상한/쿨다운/서버 검증).

========================

1. # PLAN MODE OUTPUT RULES
   Plan Mode로 작업한다.
1. 먼저 “구현 계획(Plan)”을 출력하라.
   - (A) 아키텍처/폴더구조
   - (B) 데이터모델(TypeScript 타입 + DB 스키마/필드명)
   - (C) API Contract(엔드포인트/Request/Response)
   - (D) Mock Server/Seed Data/배치 시뮬레이터
   - (E) 화면 목록 + 화면별 완료 정의(DoD)
   - (F) QA 체크리스트 매핑
1. 질문은 하지 마라. 필요한 가정은 합리적으로 결정하고 문서에 명시하라. 기능 개발 완료 후, 스스로 평가 하고, 자동 수정(self-healing) 후에, 완벽해지면 다음 계획,진행을 세워라.
1. Plan 승인 후에 구현 단계로 진행해야 한다. 각 모듈 완료마다 “진행 요약 + 다음 할 일”을 남겨라.

# ======================== 2) TECH STACK (고정)

- React Native + TypeScript
- Navigation: React Navigation (Bottom Tabs + Stack)
- Data fetching/cache: React Query
- State: Zustand(또는 React Context + Reducer) — 단, 단순/명확하게
- Storage: AsyncStorage(세션/토큰/MockDB 저장)
- BottomSheet: @gorhom/bottom-sheet
- Toast: react-native-toast-message (or expo library)
- Date: dayjs
- Lint/format: eslint + prettier

- 기존 구조에 맞춰 통합하되, 아래 폴더 기준을 최대한 유지하라.

# ======================== 3) DESIGN SYSTEM COMPLIANCE (필수)

디자인시스템을 반드시 적용한다.

- 만약 repo에 이미 DS가 있으면(components/tokens/typography 등) 그것을 우선 사용한다.
- 없다면 아래 최소 DS를 구현하여 모든 화면에서 사용한다(화면에서 RN 기본 컴포넌트 직접 사용 금지).

필수 DS 구성(예시):
/src/design-system/
tokens.ts (colors, spacing, radius, typography, shadow)
ThemeProvider.tsx
components/
AppText.tsx
Button.tsx (primary/secondary/ghost, disabled, loading)
TextInput.tsx (label, helper, error, counter)
Chip.tsx / TagChip.tsx
Card.tsx
Badge.tsx
Divider.tsx
ListItem.tsx
BottomSheet.tsx wrapper
Toast.tsx wrapper
EmptyState.tsx
Countdown.tsx

모든 화면은 DS 컴포넌트로만 구성한다.

# ======================== 4) MODULES & SCREENS (반드시 구현)

“Spec에 있는 기능”을 전부 구현한다(사진 관련만 제외).

(1) Auth/Onboarding (OB)

- OB-01 PASS 인증(실제 PASS 연동은 mock 처리 가능, UI/상태는 구현)
- OB-02 기본정보(닉/성별/출생년도/교단/지역: 시/도 → 구/군)
- OB-03 교회 검색 선택 + 교회 추가 요청(옵션)
- OB-04 직장 이메일 인증(옵션: 메일 발송/확인 mock)
- OB-05 태그 선택(5~15개, 카테고리)
- OB-06 좋아하는 말씀(필수 1+선택2) / 찬양CCM(선택0~3) 입력
- OB-07 L1 신앙 Q&A(6개 중 3개 선택, 150자 이상) + Anti-Paste(현실적 구현)
- OB-08 제출 → UNDER_REVIEW 대기 → APPROVED 시 홈 오픈

(2) Home/Reco

- 하루 2명 추천 노출
- +2 추천 확장(만나 1, 하루 2회)
- 카드 48h 미열람 LOCK + 해제(만나 1)
- 7일 지나면 삭제(보관함에서도 제거)
- PASS(재노출 없음)
- EMPTY(추천 0장) 리텐션 화면(“L2 1개 쓰기”, “무료 만나(광고)”, “내일 알림”)

(3) Vault(보관함)

- 7일 내 카드 리스트 + 상태 배지(LOCKED/SEEN/D-n)
- LOCK 해제 결제
- 보관 연장(+3일, 만나1, 프로필당 2회 제한)
- 삭제 카드 부활(만나2, 주 2회 제한)

(4) Profile Detail + Deep Read Unlock

- No Photo: 사진 UI/첨부/전송 금지
- L0 Preview: 기본정보/태그/L1 요약/말씀·찬양 레퍼런스
- Unlock:
  - L1 전체 열람(만나1, viewer-target 1회, 재열람 무료)
  - L2 열람(만나2, viewer-target 1회)
  - 말씀/찬양 “이유” 열람(만나1, viewer-target 1회)
- Unlock 상태는 어디서든 유지(Home/Inbox/Chat)

(5) Matching + Inbox

- 매칭 신청 바텀시트: NORMAL(3), SUPER(6)
- SUPER는 받은함 상단고정(pinned) + 강조 UI + “수락자 무료”
- 수락/거절 48h 타이머
- 정책:
  - 거절(REJECT)해도 신청자 100% 환급
  - 48h 무응답(EXPIRE)도 신청자 100% 환급
  - 수락자 페널티(Seen/Unseen 차등) — 노출 가중치 exposure_weight로 구현
- “착한 방치” 방지 카피: “거절해도 신청자는 환급됩니다”

(6) Chat

- 텍스트만
- 타이머: 첫 메시지 24h / 답장 24h (주말 연장 없음)
- meaningful message 판정(한국어):
  - len_trimmed >= 5
  - 한글/영문 포함(/[가-힣A-Za-z]/)
  - 자음/모음 반복(ㅋㅋㅋ/ㅎㅎㅎ/ㅠㅠㅠ)만으로 구성 금지
- 단방향 잠수(Asymmetric):
  - A가 meaningful 선톡, B가 24h 무응답이면:
    - B 페널티(Seen/Unseen 차등)
    - A 보상: “보너스 만나 +1”(주 3회 상한, 동일 상대 1회 제한)
- 시스템 메시지/토스트/상단 배너로 타이머/정책을 투명하게 안내

(7) Shop + Paywall UX Smoothing

- PAYWALL_BOTTOM_SHEET: 잔액 부족 시 화면 전환하지 말고 bottom sheet로 처리
- 구매 옵션 + 보상형 광고 옵션(가능한 경우)
- 결제/광고 성공 시 “원래 하려던 행동”을 자동 완료(intent-preserving)
- post_purchase_intent 개념을 클라이언트에서도 유지하여 UX를 끊지 마라.

(8) Rewarded Ads (GP 대체)

- “광고 보고 만나 1개 받기”
- 일일 상한 3회, 쿨다운(10분 또는 1시간) 적용 (Remote Config로)
- APPROVED 유저만
- 서버 검증(모의) 후 지급: reward_token 기반 claim 플로우
- placement:
  - paywall
  - my_free_manna
  - empty_state
- bonus_manna_balance/paid_manna_balance 분리 + 소비 우선순위 bonus→paid

(9) Safety/Report/Block

- 신고(프로필/채팅), 차단(상호 숨김)

(10) Admin (가능하면 구현, 최소 스텁)

- HIGH_RISK_REVIEW 큐 리스트 + 상세
- risk_matches 하이라이트(<mark> 렌더링)
- 마스킹 토글 + Hotkey
  - Space: 마스킹 토글
  - Enter: 승인
  - Backspace: 반려
  - J/K: 하이라이트 이동
  - ? 도움말
- 모바일 RN에서 hotkey는 제한이 있으니:
  - (A) 개발용 Admin을 Web(React)로 분리하거나
  - (B) RN에서도 물리키 입력이 되는 환경(데스크탑/웹 빌드) 기준으로 구현
  - 최소한 UI 명세/컴포넌트/로직은 코드로 포함하라.

# ======================== 5) BACKEND INTEGRATION 대비: 계약/스키마/필드명 (필수 산출물)

다음 산출물을 반드시 repo에 포함하라.

A) /src/contracts/db_schema.md

- 아래 테이블과 필드명을 문서화(backend dev가 그대로 쓰게)
- 예시(필수 포함):
  - users(user_uuid, ci_hash, status, paid_manna_balance, bonus_manna_balance, exposure_weight, created_at, last_active_at)
  - profiles(user_uuid, nickname, gender, birth_year, region_sido, region_sigungu, denomination, church_id, church_verified, work_verified, tags[], l1_answers_json, l2_answers_json, favorite_verses_json, favorite_ccm_json)
  - recommendation_cards(card_id, viewer_uuid, target_uuid, status, created_at, opened_at, locked_at, deleted_at, passed_at)
  - unlocks(unlock_id, viewer_uuid, target_uuid, unlock_type, created_at)
  - matches(match_id, sender_uuid, receiver_uuid, match_type, status, created_at, responded_at, receiver_opened_at, expired_at)
  - chat_rooms(chat_id, match_id, status, created_at, first_msg_deadline_at, reply_deadline_at)
  - chat_messages(msg_id, chat_id, sender_uuid, body, created_at, meaningful_flag)
  - transactions(tx_id, user_uuid, currency=MANNA_PAID|MANNA_BONUS, amount, action_type, related_id, meta_json, created_at)
  - rewarded_ads(reward_id, user_uuid, placement, provider, token_hash, amount, verified_at)
  - reports(report_id, reporter_uuid, target_uuid, context, reason, detail, created_at, status)
  - blocks(block_id, blocker_uuid, blocked_uuid, created_at)
  - risk_flags(target_uuid, risk_level, flags_json, matches_json, created_at)
  - admin_actions(action_id, admin_id, action_type, target_id, reason_code, meta_json, created_at)

B) /src/contracts/api_contract.md

- 엔드포인트, request/response, 상태코드
- spec에 있는 API를 기반으로 최소 구현
- 예:
  - GET /reco/today
  - POST /reco/extra
  - POST /card/unlock
  - POST /card/pass
  - GET /vault
  - POST /unlock/l1
  - POST /unlock/l2
  - POST /match/request
  - POST /match/accept
  - POST /match/reject
  - GET /inbox/received
  - GET /inbox/sent
  - GET /chats
  - POST /chat/send
  - POST /rewarded-ad/claim
  - GET /shop/packages
  - POST /purchase/verify
  - POST /report
  - POST /block
  - (admin) GET /admin/review/queue, GET /admin/review/detail, POST approve/reject

C) /src/contracts/types.ts

- 위 DB/API에 대응하는 TS 타입/enum을 단일 파일로 제공
- 프론트에서 전역적으로 재사용

# ======================== 6) MOCK SERVER (필수)

백엔드가 붙기 전까지 전 기능을 테스트할 수 있도록 Mock을 만든다.

요구사항:

- API_MODE=mock|real 환경변수로 전환
- mock 모드에서는 “서버처럼” 동작:
  - 데이터는 in-memory + AsyncStorage에 저장(앱 재실행해도 유지)
  - 네트워크 지연(200~600ms) 랜덤
  - ledger(원장) 기반으로 잔액/환급/보상형광고 지급을 처리
  - unlock viewer-target 1회 정책
  - 48h/7d/24h 타이머 관련 상태 변화는 “MockScheduler”가 주기적으로 갱신

MockScheduler가 처리할 작업:

- 카드 48h 미열람 LOCK 처리
- 카드 7일 삭제 처리
- 매칭 48h 만료 처리(Seen/Unseen 판정)
- 채팅 첫 메시지 24h 만료, 답장 24h 만료 처리
- Rewarded Ads 일일 상한 리셋(00:00 KST 기준, 로컬 시간으로 구현)

Seed Data:

- 최소 15명의 프로필(교단/지역/태그/말씀/CCM/L1/L2 다양)
- 내 계정 1개(approved 상태)
- 추천 카드/인박스/채팅 예시 데이터 몇 개(상태별)

# ======================== 7) POLICY LOGIC 구현 포인트(실수 금지)

- 주말 배려 타이머는 “절대 구현하지 마라”(모든 타이머는 고정 24h/48h)
- 거절(REJECT) 시 신청자 100% 환급
- 48h 무응답(EXPIRE)도 신청자 100% 환급
- unlock은 viewer-target 단위 1회 결제 후 재결제 없음
- bonus_manna 먼저 소비하고, paid_manna는 나중에 소비
- Rewarded Ads:
  - 일일 3회 cap + cooldown
  - 서버 검증(모의) 없이는 지급 금지(클라만으로 지급 금지)

Anti-Paste(현실적 RN 구현):

- 완벽 차단이 어려우므로:
  - onChangeText delta가 갑자기 커지는 경우(예: 10자 이상 급증) paste로 간주
  - 즉시 이전 값으로 롤백 + 토스트 “직접 작성해주세요 🙏”
  - iOS는 contextMenuHidden 적용(가능한 범위)
  - 이 로직을 DS TextInput에 옵션으로 제공

# ======================== 8) DELIVERABLES (최종 산출물)

- RN 앱 코드(실행 가능)
- DS 적용(모든 화면 DS 컴포넌트 사용)
- contracts(api/db/types) 3종
- mock server + scheduler + seed data
- README:
  - 실행 방법
  - mock/real 전환 방법
  - 주요 테스트 시나리오(QA 체크리스트 기반)

# ======================== 9) IMPLEMENTATION ORDER (권장)

1. 프로젝트 스캐폴딩 + Design System 구축
2. contracts(types/api/db) 문서/타입 생성
3. mock server + seed + scheduler
4. Navigation + Auth session
5. Onboarding 전체
6. Home + Reco + Vault + Deep Read unlock
7. Matching + Inbox
8. Chat + timers + asymmetric logic
9. Paywall + purchase mock + rewarded ads claim
10. Report/Block + Settings
11. (가능 시) Admin module
12. QA 시나리오 통과

지금부터 위 요구사항을 충족하는 코드를 작성하라.
먼저 Plan을 출력하고, 그 다음 구현을 시작하라.
[END SCRIPT]
