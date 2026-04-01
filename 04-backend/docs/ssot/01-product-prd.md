> Source: `grace-link-server/docs/ssot/01-product-prd.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# Product Requirements Document — GraceLink Core Client/Server Experience

**Author**: GraceLink team  
**Date**: 2026-03-18  
**Status**: Working SSOT  
**Stakeholders**: Product / Backend / Frontend(RN) / QA / Ops

## 1. Summary

GraceLink는 **신뢰 기반 온보딩 → 추천/매치 → 수락 후 채팅** 흐름으로 운영되는 크리스천 만남 서비스입니다.
이 PRD는 현재 서버와 RN이 공유해야 하는 핵심 제품 흐름을 정의하며, 하위 기술 스펙 문서들의 상위 문서 역할을 합니다.

## 2. Contacts

| Role | Owner | Comment |
|---|---|---|
| Product | TBD | 범위/우선순위 결정 |
| Backend | Repo owner | API 계약 / 보안 / 상태 전이 |
| Frontend (RN) | Repo owner | 모바일 구현 / 화면 흐름 |
| QA | TBD | 회귀 / 시나리오 검증 |
| Ops | TBD | 배포 / 런타임 설정 |

## 3. Background

- 기존에는 `docs/backend-spec.md` 하나에 여러 관심사가 섞여 있었습니다.
- 서버 구현과 RN 계약이 어긋난 경험이 있었고, 특히 인증/토큰, 매치 상태 전이, 채팅 전송 방식에서 혼선이 있었습니다.
- 현재는 **서버 구현 + OpenAPI + 분리형 spec 문서**를 기준으로 클라이언트가 따라오도록 정리하는 단계입니다.

## 4. Objective

### Goals
1. 인증/세션/매치/채팅 규약을 한눈에 찾을 수 있게 분리한다.
2. 프론트가 `requestMatch` 와 `acceptMatch` 를 잘못 해석하지 않도록 상태 전이를 명확히 한다.
3. WebSocket 기반 채팅 규약을 REST 규약과 분리해 설명한다.
4. 제품/백로그/QA 문서가 같은 용어와 흐름을 사용하도록 맞춘다.

### Non-Goals
1. 새로운 제품 기능을 이번 문서 작업으로 추가하지 않는다.
2. RN 구현을 이 작업 안에서 직접 수정하지 않는다.
3. 실제 운영 정책(가격, 승인 기준, 안전 정책)을 이번에 새로 재정의하지 않는다.

### Success Metrics

| Metric | Current | Target | Measurement |
|---|---|---|---|
| 핵심 도메인별 canonical 문서 수 | 1개 혼합 문서 | 1 concern = 1 문서 | docs/ssot 구조 |
| 프론트 구현에 필요한 핵심 규약 발견 시간 | 문서 탐색 필요 | 5분 이내 | 문서 맵/링크 구조 |
| 매치/채팅 상태 해석 오류 | 과거 혼선 있음 | 문서상 0 ambiguity | lifecycle / handoff / test scenario 정렬 |

## 5. Market Segment(s)

1. **신규 가입자 / 심사 대기 사용자**
   - PASS 검증과 온보딩 완료가 핵심
2. **승인된 일반 사용자**
   - 추천 카드, 매치 요청/수락, 채팅, 결제/광고 보상 사용
3. **운영/리뷰 관리자**
   - 신고/리스크 리뷰/승인/정지 관리

## 6. Value Proposition(s)

- 사진보다 **문장과 신뢰를 먼저 보는** 만남 경험
- 승인/온보딩 기반의 **신뢰도 높은 사용자 풀**
- 매치 수락 이후에만 채팅이 열리는 **통제된 상호작용**
- 신고/차단/리스크 리뷰가 있는 **안전 장치 포함 시스템**

## 7. Solution

### 7.1 Product Scope
- Auth / SSO / Token
- PASS verification / onboarding
- Profile / recommendation / vault
- Match / inbox / chat / WebSocket
- Shop / purchase / rewarded ad
- Safety / admin review

### 7.2 Key Product Rules
- `POST /match/request` 는 `PENDING` 매치만 생성
- `POST /match/accept` 시점에만 chat room 생성
- 실시간 메시지 전송은 `/ws/chat` 기준
- `exclude_same_church` / `exclude_contacts` 가 켜진 사용자는 추천/볼트/프로필 상세/매치 요청에서 해당 대상을 보지 못한다
- 연락처 제외는 raw 전화번호 저장 없이 canonical phone hash + uploaded contact hash 매칭으로 동작한다

### 7.3 Assumptions
- 모바일 클라이언트는 Bearer 토큰 기준 계약을 따른다.
- `user_uuid` fallback 은 개발용 편의 동작으로만 남는다.
- `/scalar` 와 `/v3/api-docs` 가 개발자 레퍼런스의 중심이 된다.

## 8. Release

### Phase 1 — SSOT 정리
- PRD / stories / technical specs / handoff / test scenarios 분리

### Phase 2 — Client alignment
- RN이 분리된 spec 문서를 기준으로 구현/수정

### Phase 3 — Verification hardening
- 문서/테스트/Scalar/OpenAPI 간 불일치 자동 검증 강화
