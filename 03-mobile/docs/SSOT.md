> Source: `grace-link-RN/docs/SSOT.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# GraceLink SSOT

> 현재 앱 기준 제품 고도화 작업의 **공식 시작점**

## 1. 이 문서의 역할

이 문서는 GraceLink 제품 변경을 시작할 때 가장 먼저 읽어야 하는 **SSOT 진입 문서**다.

목표는 세 가지다.
- 무엇이 현재 제품의 기준선인지 빠르게 파악한다.
- 어떤 문서를 봐야 하는지 헤매지 않게 한다.
- 기능 변경 시 무엇이 깨질 수 있는지 미리 점검하게 만든다.

즉, 앞으로 제품 고도화 작업을 할 때는 **이 문서를 시작점으로 삼고**, 여기서 연결되는 문서를 순서대로 보는 것을 기본 원칙으로 한다.

## 2. 소스 우선순위

GraceLink 현재 상태를 판단할 때는 아래 순서로 신뢰한다.

1. **RN 런타임 캡처**
   - `docs/runtime-captures/ios/README.md`
   - 실제 시뮬레이터에서 보인 화면 증거
2. **실제 앱 코드**
   - `app/` 라우트, `src/features/`, `src/mock/`, `src/core/`
3. **API/정책 문서**
   - `docs/api/*`
4. **기존 상위 기능 명세**
   - `GraceLink_v7.3_NoPhoto_v7.2plus7.3_FunctionalSpec_NoWeekend_RewardedAds.md`
   - 단, 현재 코드/런타임과 충돌하면 “목표 상태 참고 자료”로만 취급

### 판단 원칙
- 화면이 실제로 보이면 런타임 캡처를 우선한다.
- 화면은 없고 로직만 있으면 코드 기준으로 판단한다.
- 문서에만 있고 코드/화면에 없으면 **미구현**으로 본다.

## 3. 문서 맵

| 문서 | 역할 | 언제 읽는가 |
| --- | --- | --- |
| `docs/SSOT.md` | SSOT 진입점 | 모든 변경 시작 전 |
| `docs/prd-reverse-engineered-current-app.md` | 현재 제품 기준 PRD | 제품 방향, 범위, 정책, 갭을 볼 때 |
| `docs/ux-screen-inventory.md` | 화면/라우트/플로우 기준 문서 | 특정 화면 또는 UX 흐름을 바꿀 때 |
| `docs/ssot/ia-menu-structure.md` | IA / 메뉴 구조 문서 | 구조 개편이나 탭 개편을 할 때 |
| `docs/ssot/product-policy-spec.md` | 제품 정책 문서 | 비용, 시간, 검증, 운영 규칙을 볼 때 |
| `docs/runtime-captures/ios/README.md` | RN 런타임 증거 문서 | 실제 UI를 확인할 때 |
| `docs/ssot/home-redesign-and-copy-strategy.md` | 메인 화면 개편 + L1/L2 용어 전략 | 홈 개편이나 카피 개편을 할 때 |
| `docs/ssot/l1-l2-replacement-inventory.md` | L1/L2 치환 인벤토리 | 사용자 노출 용어 전환 시 |
| `docs/ssot/home-wireframe-spec.md` | 홈 와이어프레임 상세 명세 | 홈 구현 전에 |
| `docs/ssot/implementation-ticket-breakdown.md` | 구현 티켓 분해 | 실행 단계로 쪼갤 때 |
| `docs/roadmap-next.md` | 다음 고도화 우선순위 | 분기/스프린트 계획을 잡을 때 |
| `docs/api/*.md` | API/정책 보조 문서 | 데이터 계약, 에러, 스케줄러 규칙을 볼 때 |
| `docs/ssot/change-impact-matrix.md` | 변경 영향 체크리스트 | 구현 전에 영향 범위를 확인할 때 |

## 4. 현재 제품의 핵심 정의

### 4.1 제품 한 줄 정의
GraceLink는 **사진 없이 신앙과 문장 중심으로 관계를 시작하게 만드는 승인형 소개 앱**이다.

### 4.2 현재 제품의 비가역 원칙
아래는 현재 기준으로 쉽게 건드리면 안 되는 원칙이다.

- **No Photo**: 사진 업로드/열람/전송 UI 없음
- **Approval Gate**: 승인 전에는 메인 추천 경험 진입 불가
- **High Intent**: 무료 무한 탐색이 아니라 제한된 추천과 비용 구조 사용
- **Faith First**: 프로필/추천/문답 중심 구조 유지
- **Manual Trust Layer**: 운영 심사 콘솔이 실제 제품 구조 안에 포함됨

## 5. 현재 릴리스 요약

### 승인 전
- Splash
- SSO 로그인
- 본인인증
- 기본 정보
- 교회 등록
- 태그
- 말씀/찬양
- 신앙 질문
- 제출 전 확인
- 심사 대기

### 승인 후
- 홈
- 오늘의 소개
- 인박스
- 채팅
- 내 정보
- 보관함
- 스토어
- 상대 프로필
- 프로필 수정
- 운영 심사

## 6. 수치/정책 빠른 표

### 6.1 노출 구조
| 항목 | 현재 값 |
| --- | --- |
| 노출 탭 수 | 4 |
| 노출 탭 | 홈 / 오늘의 소개 / 채팅 / 내 정보 |
| 숨김 핵심 라우트 | 인박스 / 보관함 / 스토어 / 프로필 상세 / 채팅 상세 / 운영 심사 |

### 6.2 온보딩
| 항목 | 현재 값 |
| --- | --- |
| 실사용 온보딩 스텝 | 7 |
| PASS 단계 | STEP 1 |
| 기본 정보 | STEP 2 |
| 교회 등록 | STEP 3 |
| 태그 | STEP 4 |
| 말씀/찬양 | STEP 5 |
| 신앙 질문 | STEP 6 |
| 제출 전 확인 | STEP 7 |

### 6.3 검증 규칙
| 항목 | 현재 규칙 |
| --- | --- |
| 닉네임 | 2~10자 |
| 출생연도 | 4자리, 만 19세 이상 |
| 태그 수 | 5~15개 |
| 말씀 | 최소 1개 |
| L1 질문 수 | 정확히 3개 |
| L1 답변 | 각 150자 이상 |

### 6.4 만나/추천/보관함
| 항목 | 현재 값 |
| --- | --- |
| 추가 추천 | 만나 1로 +2명 |
| 카드 LOCK 전환 | 생성 후 48시간 |
| 카드 삭제 | 생성 후 7일 |
| 카드 잠금 해제 | 만나 1 |
| 보관 연장 | 만나 1 / 3일 / 최대 2회 |
| 삭제 카드 복구 | 만나 2 / 주 2회 |

### 6.5 매칭/채팅
| 항목 | 현재 값 |
| --- | --- |
| NORMAL 신청 | 만나 3 |
| SUPER 신청 | 만나 6 |
| NORMAL 수락 | 만나 3 |
| SUPER 수락 | 무료 |
| 인박스 응답 마감 | 48시간 |
| 첫 메시지 마감 | 24시간 |
| 답장 마감 | 24시간 |

### 6.6 광고 보상
| 항목 | 현재 값 |
| --- | --- |
| 1회 광고 보상 | 만나 +1 |
| 일일 상한 | 3회 |
| 쿨다운 | 10분 |
| 주요 placement | `paywall`, `my_free_manna`, `empty_state` |

## 7. 변경 전에 꼭 확인할 것

### 추천/보관함을 바꾸려면
- `docs/prd-reverse-engineered-current-app.md`
- `docs/ssot/ia-menu-structure.md`
- `docs/ssot/product-policy-spec.md`
- `docs/ux-screen-inventory.md`
- `docs/api/03-reco-vault.md`
- `docs/runtime-captures/ios/reco.png`
- `docs/runtime-captures/ios/vault.png`

### 매칭/인박스/채팅을 바꾸려면
- `docs/prd-reverse-engineered-current-app.md`
- `docs/ssot/ia-menu-structure.md`
- `docs/ssot/product-policy-spec.md`
- `docs/api/04-match-inbox-chat.md`
- `docs/runtime-captures/ios/inbox.png`
- `docs/runtime-captures/ios/chat-list.png`
- `docs/runtime-captures/ios/chat-detail.png`

### 온보딩을 바꾸려면
- `docs/ux-screen-inventory.md`
- `docs/runtime-captures/ios/README.md`
- `docs/ssot/home-redesign-and-copy-strategy.md`
- `src/features/onboarding/store.ts`
- `src/features/onboarding/validateOnboardingDraft.ts`

### 홈 / 용어 / 카피를 바꾸려면
- `docs/prd-reverse-engineered-current-app.md`
- `docs/ssot/home-redesign-and-copy-strategy.md`
- `docs/ssot/l1-l2-replacement-inventory.md`
- `docs/ssot/home-wireframe-spec.md`
- `docs/ssot/implementation-ticket-breakdown.md`
- `docs/roadmap-next.md`
- 관련 런타임 캡처

### 스토어/광고를 바꾸려면
- `docs/ssot/product-policy-spec.md`
- `docs/api/05-payment-ad.md`
- `src/core/env.ts`
- `docs/runtime-captures/ios/shop.png`

### 운영 심사를 바꾸려면
- `docs/ssot/product-policy-spec.md`
- `docs/api/06-safety-admin.md`
- `docs/runtime-captures/ios/admin.png`
- `app/admin/review.tsx`

## 8. 문서 업데이트 원칙

제품 고도화 작업 후에는 아래를 같이 업데이트한다.

| 변경 유형 | 같이 업데이트해야 하는 문서 |
| --- | --- |
| 화면 구조 변경 | `docs/ux-screen-inventory.md`, 필요 시 캡처 문서 |
| 정책/비용/타이머 변경 | `docs/prd-reverse-engineered-current-app.md`, `docs/api/*` |
| 새 화면 추가 | `docs/ux-screen-inventory.md`, `docs/runtime-captures/ios/README.md` |
| 운영 규칙 변경 | `docs/prd-reverse-engineered-current-app.md`, `docs/api/06-safety-admin.md` |
| API 계약 변경 | 해당 `docs/api/*.md` + 관련 PRD 섹션 |

## 9. 현재 가장 큰 갭

현재 제품 고도화 관점에서 가장 중요한 갭은 아래다.

1. **탭 구조와 발견성**
   - 인박스/보관함/스토어가 핵심 기능인데 숨김 라우트다.
2. **온보딩 미완성 요소**
   - 약관 UI, 직장 인증(OB-04)이 빠져 있다.
3. **Deep Read 미구현**
   - 상위 명세의 BM 차별화가 현재 UI에 거의 반영되지 않았다.
4. **L2 미션 미완성**
   - Empty state CTA는 있지만 실제 작성 플로우가 없다.
5. **광고 보상 카피 불일치**
   - 실제 보상 +1, 일부 UX 카피는 +2 뉘앙스가 남아 있다.

## 10. 실무 권장 순서

제품 고도화 작업을 시작할 때 추천 순서:

1. `docs/SSOT.md`
2. `docs/prd-reverse-engineered-current-app.md`
3. `docs/ssot/change-impact-matrix.md`
4. 관련 `docs/api/*.md`
5. 관련 런타임 캡처
6. 실제 코드

---

이 문서는 **현재 앱 기준 SSOT 진입점**이다.
세부 화면은 `docs/ux-screen-inventory.md`, 제품 범위와 갭은 `docs/prd-reverse-engineered-current-app.md`, 실제 UI 증거는 `docs/runtime-captures/ios/README.md`를 본다.
