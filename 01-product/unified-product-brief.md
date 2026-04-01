# GraceLink Unified Product Brief

작성일: 2026-04-01

## 목적

`grace-link-pm`은 GraceLink의 제품/UX/계약/QA 문서를 한 곳에서 이어서 관리하기 위한 기획 레포입니다.
이 문서는 RN 기준 현재 앱 상태와 서버 기준 shared contract를 한 번에 찾기 위한 최상위 브리프입니다.

## 제품 한 줄 정의

GraceLink는 **사진 없이 신앙과 문장 중심으로 관계를 시작하게 하고, 승인과 비용 구조로 의도를 높이는 소개 서비스**입니다.

## 기준선 문서

### 현재 앱 기준선
- [`../03-mobile/docs/SSOT.md`](../03-mobile/docs/SSOT.md)
- [`../03-mobile/docs/prd-reverse-engineered-current-app.md`](../03-mobile/docs/prd-reverse-engineered-current-app.md)
- [`../03-mobile/docs/runtime-captures/ios/README.md`](../03-mobile/docs/runtime-captures/ios/README.md)

### 플랫폼/서버 공용 기준선
- [`../04-backend/docs/ssot/README.md`](../04-backend/docs/ssot/README.md)
- [`../04-backend/docs/ssot/01-product-prd.md`](../04-backend/docs/ssot/01-product-prd.md)
- [`../04-backend/openspec/specs/`](../04-backend/openspec/specs/)

## 지금 이 레포에서 우선 보는 흐름

1. 제품 방향 / 범위 확인: `03-mobile/docs/prd-reverse-engineered-current-app.md`
2. 정책 확인: `03-mobile/docs/ssot/product-policy-spec.md`
3. UX 구조 확인: `02-ux/README.md`
4. 서버 계약 확인: `04-backend/docs/ssot/03~06`, `04-backend/openspec/specs/*`
5. QA / acceptance 확인: `05-qa/README.md`
6. 현재 진행 중인 변경안 확인: `06-active-changes/README.md`

## 핵심 묶음

### Product / Strategy
- 현재 앱 PRD: [`../03-mobile/docs/prd-reverse-engineered-current-app.md`](../03-mobile/docs/prd-reverse-engineered-current-app.md)
- 서버 공용 PRD: [`../04-backend/docs/ssot/01-product-prd.md`](../04-backend/docs/ssot/01-product-prd.md)
- 로드맵: [`../03-mobile/docs/roadmap-next.md`](../03-mobile/docs/roadmap-next.md)
- 유저 스토리: [`../04-backend/docs/ssot/02-user-stories.md`](../04-backend/docs/ssot/02-user-stories.md)

### UX
- 화면 인벤토리: [`../03-mobile/docs/ux-screen-inventory.md`](../03-mobile/docs/ux-screen-inventory.md)
- IA / 메뉴 구조: [`../03-mobile/docs/ssot/ia-menu-structure.md`](../03-mobile/docs/ssot/ia-menu-structure.md)
- 홈 개편 전략: [`../03-mobile/docs/ssot/home-redesign-and-copy-strategy.md`](../03-mobile/docs/ssot/home-redesign-and-copy-strategy.md)
- 홈 와이어프레임: [`../03-mobile/docs/ssot/home-wireframe-spec.md`](../03-mobile/docs/ssot/home-wireframe-spec.md)

### Delivery / Validation
- RN API docs: [`../03-mobile/docs/api/`](../03-mobile/docs/api/)
- Backend SSOT specs: [`../04-backend/docs/ssot/`](../04-backend/docs/ssot/)
- QA docs: [`../05-qa/README.md`](../05-qa/README.md)
- Active changes: [`../06-active-changes/README.md`](../06-active-changes/README.md)

## 운영 원칙

- 새로운 기획 문서는 가능하면 이 레포의 상위 섹션(`01-product`, `02-ux`, `05-qa`)에서 먼저 정리합니다.
- 구현 세부 문서가 필요하면 `03-mobile`, `04-backend`, `06-active-changes`에 원본 맥락을 유지하며 추가합니다.
- 레거시 참조는 `99-archive/`에 두고, 최신 기준 문서로 오인되지 않게 분리합니다.
