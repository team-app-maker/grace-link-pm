> Source: `grace-link-RN/docs/ux-screen-inventory.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# GraceLink 화면 인벤토리 (Reverse Engineered)

> SSOT 진입 문서: `docs/SSOT.md`

- 작성일: 2026-04-01
- 기준 브랜치: `docs/reverse-engineering-prd`
- 기준 소스: `app/`, `src/features/`, `docs/api/`, `GraceLink_v7.3_NoPhoto_v7.2plus7.3_FunctionalSpec_NoWeekend_RewardedAds.md`
- 런타임 캡처: `docs/runtime-captures/ios/README.md` (iPhone 16 Simulator / iOS 18.6 / Expo Go)
- 목적: 현재 React Native 앱에 실제로 구현된 화면, 진입 조건, CTA, 라우팅 흐름을 제품 관점에서 다시 정리한다.

## 1. 앱 구조 요약

### 1.1 루트 라우팅 규칙

`app/index.tsx`와 각 layout 기준으로 앱은 아래 상태 머신으로 동작한다.

| 사용자 상태 | 진입 화면 |
| --- | --- |
| 스토어 hydration 또는 세션 복구 중 | 로딩 문구 화면 |
| 비로그인 + splash 미확인 | `/(auth)/splash` |
| 비로그인 + splash 확인 | `/(auth)/login` |
| 로그인 + `UNDER_REVIEW` | `/(auth)/under-review` |
| 로그인 + `APPROVED` | `/(tabs)` |
| 로그인 + 그 외 상태(`SUBMITTED` 등) | `/(auth)/ob-01` |

### 1.2 레이아웃/접근 제어

| 라우트 | 역할 | 핵심 규칙 |
| --- | --- | --- |
| `app/_layout.tsx` | 전역 Provider + Stack | React Query, Theme, font, session restore, Google Sign-In 설정 |
| `app/(auth)/_layout.tsx` | 인증/온보딩 가드 | 승인 사용자는 탭으로, 심사중 사용자는 심사대기 화면으로 강제 이동 |
| `app/(tabs)/_layout.tsx` | 승인 사용자 탭 가드 | 비로그인/미승인 사용자는 탭 접근 불가 |

### 1.3 정보구조(IA)

현재 구현 기준으로 **하단 탭에 보이는 메뉴는 4개**이고, 나머지 주요 화면은 숨김 라우트/상세 라우트로 연결된다.

#### 노출 탭

| 탭 | 라우트 | 역할 |
| --- | --- | --- |
| 홈 | `/(tabs)` | 오늘의 말씀 + 공지 |
| 오늘의 소개 | `/(tabs)/reco` | 추천 카드 소비, 추가 추천 |
| 채팅 | `/(tabs)/chat` | 채팅방 목록 |
| 내 정보 | `/(tabs)/settings` | 프로필, 필터, 상점 진입 |

#### 숨김이지만 실제 사용되는 라우트

| 라우트 | 진입 방식 | 역할 |
| --- | --- | --- |
| `/(tabs)/inbox` | 헤더/내부 링크 | 받은 신청/보낸 신청 |
| `/(tabs)/vault` | 내 정보 메뉴 | 보관함 |
| `/(tabs)/shop` | 탭 내부용 별도 구현 | 만나 스토어 |
| `/shop` | 내 정보의 “만나 충전하기” | 실제 사용되는 독립 스토어 화면 |
| `/profile/[targetUuid]` | 추천/인박스/보관함 | 상대 프로필 상세 |
| `/profile/edit` | 내 프로필 카드 | 내 정보 수정 |
| `/chat/[chatId]` | 채팅 리스트/인박스 수락 직후 | 채팅방 상세 |
| `/admin/review` | 내 정보 메뉴 | 운영 심사 콘솔 |

## 2. 전체 라우트 인벤토리

### 2.1 제어/시스템 라우트

| 라우트 | 화면/역할 | 메모 |
| --- | --- | --- |
| `/` | 루트 분기 | 인증/심사 상태에 따라 목적지 재분기 |
| `/(auth)/_layout` | 인증 영역 가드 | splash/login/온보딩/심사대기 분기 |
| `/(tabs)/_layout` | 승인 사용자 탭 가드 | 하단 탭 설정 |
| `+not-found` | 404 화면 | 기본 예외 진입 처리 |
| `/modal` | Expo 템플릿 잔존 모달 | 현재 제품 플로우에서는 사용되지 않음 |

### 2.2 사용자/운영 화면 라우트

| 클러스터 | 라우트 | 화면명 | 목적 | 주요 CTA / 입력 | 다음 동작 |
| --- | --- | --- | --- | --- | --- |
| Auth | `/(auth)/splash` | 브랜드 스플래시 | 첫 진입 브랜딩 | 자동 타이머 | 1.1초 후 login |
| Auth | `/(auth)/login` | SSO 로그인 | Google/Apple 로그인 | Google, Apple | 상태에 따라 탭/심사/온보딩 |
| Auth | `/(auth)/under-review` | 심사 대기 | 심사 상태 확인 | 상태 새로고침, 개발용 승인, 홈 이동 | 승인 시 탭 진입 |
| Onboarding | `/(auth)/ob-01` | 본인인증 | PASS 인증 | PASS 인증하기, 다음 | `ob-02` |
| Onboarding | `/(auth)/ob-02` | 기본 정보 | 닉네임/성별/교단/지역 입력 | 다음 | `ob-03` |
| Onboarding | `/(auth)/ob-03` | 교회 등록 | 교회 검색/선택/등록요청 | 교회 선택, 등록 요청, 다음 | `ob-05` |
| Onboarding | `/(auth)/ob-05` | 관심 태그 | 태그 5~15개 선택 | 다음 | `ob-06` |
| Onboarding | `/(auth)/ob-06` | 말씀과 찬양 | 좋아하는 말씀/찬양 입력 | 말씀 추가, 찬양 추가, 다음 | `ob-07` |
| Onboarding | `/(auth)/ob-07` | 신앙 질문 | L1 질문 3개 선택 + 답변 작성 | 답변 작성하기, 이전/다음 질문, 다음 | `ob-08` |
| Onboarding | `/(auth)/ob-08` | 프로필 확인 | 입력 검토 후 제출 | 섹션 수정, 프로필 제출하기 | 심사대기 |
| Home | `/(tabs)` | 오늘 | 말씀/공지 허브 | pull-to-refresh | 유지 |
| Reco | `/(tabs)/reco` | 오늘의 소개 | 추천 카드 소비/추가 추천 | 카드 열기, 넘기기, 다음 두 사람 보기 | 프로필/페이월 |
| Inbox | `/(tabs)/inbox` | 인박스 | 받은 신청/보낸 신청 | 수락, 거절, 프로필 보기 | 채팅/프로필 |
| Chat | `/(tabs)/chat` | 채팅 목록 | 열린 채팅방 관리 | 채팅방 진입, 롱프레스 메뉴 | 채팅 상세 |
| Settings | `/(tabs)/settings` | 내 정보 | 프로필/필터/상점/운영 메뉴 | 프로필 수정, 토글, 충전하기, 보관함, 운영 심사 | 각 상세 라우트 |
| Vault | `/(tabs)/vault` | 보관함 | 저장된 카드 재열람/연장/복구 | 프로필 열기, 보관 늘리기, 다시 보관하기 | 프로필/페이월 |
| Shop | `/(tabs)/shop` | 탭용 스토어 | 만나 스토어 | 광고, 패키지 구매 | 잔액 증가 |
| Shop | `/shop` | 독립 스토어 | 실제 진입용 스토어 | 뒤로, 광고, 패키지 구매 | 잔액 증가 |
| Profile | `/profile/[targetUuid]` | 상대 프로필 상세 | 프로필 열람 + 매칭 신청 | 매칭 신청, 신고, 차단 | 인박스/페이월 |
| Profile | `/profile/edit` | 내 정보 수정 | 프로필 편집 | 저장 | 뒤로가기 |
| Chat | `/chat/[chatId]` | 채팅방 상세 | 메시지 송수신 | 전송, 신고, 차단, 나가기 | 유지/뒤로 |
| Admin | `/admin/review` | 운영 심사 | 리스크 큐 검토 | 승인, 반려, 정지, 마스킹 | 로그 갱신 |

## 3. 화면별 상세 메모

### 3.0 RN 런타임 대표 캡처

아래 이미지는 **코드 추론이 아니라 실제 RN 시뮬레이터에서 캡처한 화면**이다.

#### 인증 / 진입

<table>
  <tr>
    <td align="center"><strong>로그인</strong></td>
    <td align="center"><strong>온보딩 STEP 1</strong></td>
    <td align="center"><strong>온보딩 STEP 2</strong></td>
  </tr>
  <tr>
    <td><img src="./runtime-captures/ios/login-screen.png" alt="로그인 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/onboarding-pass-devbuild.png" alt="온보딩 PASS 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/onboarding-basic-screen.png" alt="온보딩 기본 정보 화면" width="220"></td>
  </tr>
  <tr>
    <td align="center"><strong>온보딩 STEP 3</strong></td>
    <td align="center"><strong>온보딩 STEP 4</strong></td>
    <td align="center"><strong>심사 대기</strong></td>
  </tr>
  <tr>
    <td><img src="./runtime-captures/ios/onboarding-church-devbuild.png" alt="온보딩 교회 등록 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/onboarding-tags-devbuild.png" alt="온보딩 태그 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/under-review.png" alt="심사 대기 화면" width="220"></td>
  </tr>
</table>

#### 추가 온보딩 심화 단계 캡처

<table>
  <tr>
    <td align="center"><strong>STEP 5 말씀/찬양</strong></td>
    <td align="center"><strong>STEP 6 신앙 질문</strong></td>
    <td align="center"><strong>STEP 7 제출 전 확인</strong></td>
  </tr>
  <tr>
    <td><img src="./runtime-captures/ios/onboarding-verses-devbuild.png" alt="온보딩 말씀과 찬양 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/onboarding-qa-devbuild.png" alt="온보딩 신앙 질문 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/onboarding-preview-devbuild.png" alt="온보딩 제출 전 확인 화면" width="220"></td>
  </tr>
</table>

#### 승인 후 메인

<table>
  <tr>
    <td align="center"><strong>홈</strong></td>
    <td align="center"><strong>오늘의 소개</strong></td>
    <td align="center"><strong>인박스</strong></td>
  </tr>
  <tr>
    <td><img src="./runtime-captures/ios/home.png" alt="홈 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/reco.png" alt="오늘의 소개 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/inbox.png" alt="인박스 화면" width="220"></td>
  </tr>
  <tr>
    <td align="center"><strong>채팅 목록</strong></td>
    <td align="center"><strong>내 정보</strong></td>
    <td align="center"><strong>보관함</strong></td>
  </tr>
  <tr>
    <td><img src="./runtime-captures/ios/chat-list.png" alt="채팅 목록 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/settings.png" alt="내 정보 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/vault.png" alt="보관함 화면" width="220"></td>
  </tr>
</table>

#### 서브 / 상세 / 운영

<table>
  <tr>
    <td align="center"><strong>스토어</strong></td>
    <td align="center"><strong>상대 프로필</strong></td>
    <td align="center"><strong>내 정보 수정</strong></td>
  </tr>
  <tr>
    <td><img src="./runtime-captures/ios/shop.png" alt="스토어 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/profile.png" alt="상대 프로필 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/profile-edit.png" alt="내 정보 수정 화면" width="220"></td>
  </tr>
  <tr>
    <td align="center"><strong>채팅 상세</strong></td>
    <td align="center"><strong>운영 심사</strong></td>
    <td></td>
  </tr>
  <tr>
    <td><img src="./runtime-captures/ios/chat-detail.png" alt="채팅 상세 화면" width="220"></td>
    <td><img src="./runtime-captures/ios/admin.png" alt="운영 심사 화면" width="220"></td>
    <td></td>
  </tr>
</table>

### 3.1 인증/초기 진입

#### `/(auth)/splash`
- `splash-icon.png`와 `GraceLink / Depth over Appearance` 문구를 노출한다.
- 1.1초 후 `markSplashSeen()` 실행 뒤 login으로 자동 이동한다.
- 실제 제품 기능보다는 첫 진입 분기용 인터셉트 성격이 강하다.

#### `/(auth)/login`
- Google/Apple SSO만 제공한다.
- Google은 native module 기준이며 web은 비지원 경고만 출력한다.
- Apple은 iOS 전용이다.
- 로그인 성공 후 `APPROVED`는 탭, `UNDER_REVIEW`는 심사대기, 나머지는 온보딩으로 이동한다.
- RN 캡처 기준으로 상단 브랜드 문구와 Apple/Google 로그인 버튼이 실제로 한 화면에 배치된다.

#### `/(auth)/under-review`
- 현재 `status`를 문구로 보여준다.
- 상태 새로고침이 가능하다.
- 개발용 승인 버튼이 있어 mock 환경에서 강제로 `APPROVED` 전환 가능하다.
- 홈 이동 버튼은 승인 상태에서만 활성화된다.

### 3.2 온보딩

#### `ob-01` 본인인증
- PASS SDK 자리 표시자 화면이다.
- 현재는 `verifyPass(1993)` mock 호출로 대체되어 있다.
- 인증 완료 전에는 PASS 인증하기 버튼만, 인증 후에는 다음 버튼이 보인다.
- 추가 dev build 캡처를 통해 STEP 1 화면 자체도 실제 RN 런타임에서 열리는 것을 확인했다.

#### `ob-02` 기본 정보
- 입력 항목: 닉네임, 성별, 교단, 지역(시/도, 구/군).
- 다음 버튼 활성 조건:
  - 닉네임 2자 이상
  - 성별 선택
  - 출생연도 숫자 가능
  - 교단, 시/도, 구/군 입력
- preview에서 되돌아왔을 때는 다시 `ob-08`로 복귀한다.
- RN 캡처에서 `STEP 2 OF 7` 스텝 헤더가 확인되어, 현재 온보딩 스텝 UI가 실제로 살아 있음을 검증했다.

#### `ob-03` 교회 등록
- 교회명 검색 결과를 mock seed에서 조회한다.
- 결과가 없으면 “교회 등록 요청” 카드가 나타난다.
- 선택 또는 요청이 완료되어야 다음 버튼이 활성화된다.
- 선택 후 배지 형태로 고정되며, 다시 눌러 초기화할 수 있다.
- dev build 캡처를 추가로 확보해, 교회 검색 단계가 실제 네이티브 런타임에서도 진입 가능함을 확인했다.

#### `ob-05` 관심 태그
- 카테고리형 태그 선택 UI다.
- 최소 5개, 최대 15개 조건을 강제한다.
- 최대치 도달 시 미선택 태그는 비활성 처리된다.
- dev build 캡처에서 태그 단계 화면도 별도 스텝으로 분기되는 것을 확인했다.

#### `ob-06` 말씀과 찬양
- 말씀: 필수 1개, 최대 3개.
- 찬양: 선택 0~3개.
- 다음 버튼은 첫 번째 말씀 reference가 비어 있지 않을 때만 활성화된다.
- 이유 입력은 선택이다.
- dev build 기준 추가 캡처를 확보했다. 한글 OCR 정확도는 낮았지만, 스크롤형 입력 스텝으로 동작하는 것은 실제 런타임에서 확인했다.

#### `ob-07` 신앙 질문
- L1 질문 6개 중 3개를 선택한다.
- 선택 후 답변 작성 phase로 전환된다.
- 각 답변은 150~600자 제한이며 anti-paste 감지가 걸린다.
- 3개 답변이 모두 150자 이상이어야 다음 버튼이 활성화된다.
- dev build 추가 캡처를 통해 질문/답변 단계가 별도 스텝으로 구동되는 것을 확인했다.

#### `ob-08` 프로필 확인
- 기본 정보/교회/태그/말씀&찬양/L1 답변 요약을 섹션 카드로 보여준다.
- 각 섹션을 누르면 해당 수정 화면으로 이동한다.
- `validateOnboardingDraft` 결과를 기반으로 제출 전 오류를 표시한다.
- 제출 성공 시 심사대기로 이동한다.
- dev build 추가 캡처를 확보했다. 제출 직전 검토 화면도 실제 온보딩 스텝 체인 안에 존재한다.

### 3.3 승인 후 메인 경험

#### `/(tabs)` 오늘
- 말씀 1개와 공지 2개를 읽는 허브 화면이다.
- 추천 카드 기능은 이 화면에 없고 `오늘의 소개` 탭으로 분리되어 있다.
- 현재는 정적 콘텐츠 성격이 강하다.
- RN 캡처에서는 본문 OCR이 제한적이었지만, 홈 전용 상단 레이아웃과 카드형 본문 구조는 실제로 확인됐다.

#### `/(tabs)/reco` 오늘의 소개
- 추천 카드를 quote-poster 형태로 노출한다.
- 카드 탭 시 상대 프로필 상세로 이동한다.
- 우측 상단 X로 카드 pass 처리 가능하다.
- 하단 CTA로 “다음 두 사람 보기”를 열 수 있으며, 만나 1개 사용 흐름과 paywall 재시도 흐름이 있다.
- 카드가 없을 때 empty state에서 L2 미션(현재 placeholder toast)과 광고 보상 CTA를 함께 보여준다.
- RN 캡처에서 `DAILY DUO 01`, `DAILY DUO 02` 텍스트가 실제 노출되는 것을 확인했다.

#### `/(tabs)/inbox`
- 받은 신청과 보낸 신청을 탭으로 구분한다.
- 받은 신청:
  - NORMAL/SUPER 표시
  - 48시간 countdown
  - 수락/거절
  - 프로필 다시 읽어보기
- 보낸 신청:
  - 상태 뱃지
  - 환불 안내
  - 프로필 재진입
- 수락 후 매칭 채팅방을 찾아 `/chat/[chatId]`로 이동한다.
- RN 캡처에서 `SUPER` 배지와 countdown 영역이 실제 카드 위에 보이는 것을 확인했다.

#### `/(tabs)/chat`
- 열린 채팅방 목록을 10초 간격으로 refetch한다.
- 길게 누르면 신고/차단/나가기 메뉴가 열린다.
- 비어 있으면 empty state를 보여준다.
- RN 캡처에서 복수 채팅방 행과 시간 정보가 실제로 존재했다.

#### `/(tabs)/settings`
- 내 프로필 카드, 만나 잔액, 매칭 필터, 기타 메뉴로 구성된다.
- 필터 토글: 연락처 차단, 같은 교회 제외, 같은 회사 제외.
- 메뉴: 보관함, 운영 심사 콘솔, 로그아웃.
- “만나 충전하기”는 실제로 `/shop` 독립 라우트로 이동한다.
- RN 캡처 기준으로 상단 내 정보 카드와 만나/필터/기타 블록이 한 화면에 쌓이는 구조다.

### 3.4 서브 경험

#### `/(tabs)/vault`
- 보관된 카드 목록 또는 empty state를 보여준다.
- 카드 CTA는 상태에 따라 달라진다.
  - `LOCKED`: 프로필 열기 (만나 1)
  - `DELETED`: 다시 보관하기 (만나 2)
  - 기타: 보관 늘리기 (만나 1, 3일 연장)
- 잔액 부족 시 paywall을 열고 완료 후 원래 액션을 자동 재실행한다.
- RN 캡처에서도 카드형 레이아웃과 하단 CTA 영역이 확인됐다.

#### `/(tabs)/shop` / `/shop`
- 만나 잔액(hero), 무료 만나 카드(광고), 패키지 리스트로 구성된다.
- `/shop`은 뒤로가기 버튼이 있고 실제 사용 흐름에서 호출된다.
- `/(tabs)/shop`은 동일 기능의 탭용 구현이지만 하단 탭에서는 숨겨져 있다.
- RN 캡처에서 `MANNA PACK`과 `₩2,900` 가격 블록이 실제로 보였다.

### 3.5 상세/전환 화면

#### `/profile/[targetUuid]`
- 상대 프로필의 핵심 정보, 관심 태그, 대표 L1 답변, 좋아하는 말씀/찬양, 추가 conversation starter를 노출한다.
- 현재 구현에서는 profile deep read 잠금 없이 주요 텍스트를 바로 읽을 수 있다.
- 하단 고정 CTA로 매칭 신청 sheet를 열 수 있다.
- sheet에서 NORMAL/SUPER 매칭을 선택하며 잔액 부족 시 자체 paywall 흐름으로 전환된다.
- 우상단 menu에서 신고/차단이 가능하다.
- RN 캡처에서 `PROFILE`, `MY PHILOSOPHY` 섹션이 실제로 노출됐다.

#### `/profile/edit`
- 기본 정보와 소개 문답 2개 섹션만 수정한다.
- 저장 조건:
  - 닉네임/성별/출생연도/교단/지역 필수
  - 선택된 L1 답변 각 150자 이상
- 저장 성공 시 내 정보 화면으로 되돌아간다.
- RN 캡처에서 프로필 편집 폼이 카드형 섹션 대신 스크롤형 입력폼으로 보이는 실제 구조를 확인했다.

#### `/chat/[chatId]`
- 채팅 메시지 리스트를 역순(inverted)으로 보여준다.
- 5초 간격 refetch가 걸려 있다.
- 닫힌 채팅방이면 종료 배너만 보이고 입력창은 숨긴다.
- 열린 채팅방이면 타이머와 입력창을 함께 보여준다.
- 메뉴는 신고/차단/채팅방 나가기다.
- RN 캡처에서 메시지 타임스탬프와 상단 타이머 영역이 동시에 잡혔다.

### 3.6 운영 화면

#### `/admin/review`
- HIGH/LOW risk queue를 카드 목록으로 나눈다.
- 상세 화면에서 profile, risk highlight, 보고된 원문, action log를 함께 보여준다.
- 버튼과 웹 hotkey를 둘 다 지원한다.
  - `Space`: 마스킹 토글
  - `Enter`: 승인
  - `Backspace`: 반려
  - `J/K`: 하이라이트 이동
  - `?`: 도움말 토글
- 운영자용 업무 콘솔에 가깝고 사용자용 경험과 분리되어 있다.
- RN 캡처에서 `Review Queue`, `HIGH`, `flags 2`, `Risk Detail`이 실제로 한 화면에 노출된다.

### 3.7 예외/잔존 화면

#### `+not-found`
- “페이지를 찾을 수 없습니다”와 홈 복귀 링크를 제공한다.
- 현재 제품 톤앤매너보다는 공통 예외 화면 성격이다.

#### `/modal`
- Expo starter template 잔존 화면이다.
- 제품 플로우와 연결되지 않는다.

## 4. 공통 상태/검증 규칙

### 4.1 온보딩 검증
- 닉네임: 2~10자
- 성별: 필수
- 출생연도: 4자리 숫자, 만 19세 이상
- 태그: 5~15개
- 좋아하는 말씀: 최소 1개
- L1 질문: 정확히 3개 선택
- L1 답변: 선택한 각 질문에 대해 150자 이상

### 4.2 결제/광고/재시도
- 추천 추가, 보관함 액션, 프로필 매칭 신청에서 `INSUFFICIENT_MANNA`가 나면 paywall을 띄운다.
- paywall은 두 가지 행동을 제공한다.
  - 광고 보상
  - 패키지 구매
- 완료 후 `pending intent`를 다시 실행한다.

### 4.3 채팅/매칭 정책(현재 구현 기준)
- NORMAL 신청: 3 만나
- SUPER 신청: 6 만나
- NORMAL 수락: 3 만나
- SUPER 수락: 무료
- 받은 신청은 48시간 countdown 표시
- 거절 시 신청자 환급 안내가 명시된다.

### 4.4 보관함 정책(현재 구현 기준)
- 카드 잠금 해제: 만나 1
- 보관 연장: 만나 1, 3일 연장, 최대 2회
- 삭제 카드 복구: 만나 2, 주 2회
- 삭제 기준 시간은 생성 후 7일 기준 helper를 사용한다.

## 5. 주요 사용자 플로우

### 5.1 신규 사용자
1. splash
2. login
3. PASS 인증
4. 기본 정보
5. 교회 등록
6. 태그 선택
7. 말씀/찬양 입력
8. L1 질문 선택 및 답변
9. 프로필 확인 후 제출
10. 심사 대기

### 5.2 승인 사용자
1. 홈에서 말씀/공지 확인
2. 오늘의 소개에서 카드 확인
3. 상대 프로필 열람
4. 매칭 신청 또는 pass
5. 인박스에서 수락/거절 처리
6. 수락 시 채팅으로 전환

### 5.3 잔액 부족 사용자
1. 추천 추가/매칭/보관함 액션 시도
2. 잔액 부족 감지
3. paywall bottom sheet 노출
4. 광고 또는 패키지 구매
5. 원래 의도한 액션 자동 재실행

### 5.4 운영자
1. 운영 심사 콘솔 진입
2. HIGH/LOW queue 선택
3. risk highlight와 보고 내용 확인
4. 승인/반려/정지/마스킹 실행
5. audit log 확인

## 6. 관찰 메모

- 현재 앱은 mock 환경을 강하게 전제하고 있으며, `심사 대기`, `개발용 승인`, `reward token`, `mock receipt` 같은 개발 편의 흐름이 UI에 남아 있다.
- 제품상 중요한 기능 다수가 **숨김 라우트**로 존재한다. 특히 인박스, 보관함, 스토어는 하단 탭에서 바로 보이지 않는다.
- `/(tabs)/shop`과 `/shop`은 기능이 거의 같은 중복 화면이다. 실제 사용자 진입은 `/shop` 쪽이 중심이다.
- `ob-04`는 라우트 자체가 없다. 즉, 현재 온보딩 단계는 7-step 제출 플로우다.
- `profile detail`은 현재 “깊게 읽기(Deep Read)” 과금 없이 주요 텍스트를 거의 전부 노출한다.
