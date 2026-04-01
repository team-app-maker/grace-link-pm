# grace-link-pm

GraceLink의 기획·SSOT·handoff·QA 문서를 분리 보관하는 PM 전용 레포입니다.
이 레포는 2026-04-01 기준으로 `grace-link-RN`과 `grace-link-server`에서 기획 관련 문서를 이관해 구성했습니다.

## Web documentation app

이 레포는 이제 Next.js 기반 문서 웹앱을 함께 포함합니다.

- 개발 서버: `npm run dev`
- 정적 빌드: `npm run build`
- 정적 결과 미리보기: `npm run preview`
- 검증 일괄 실행: `npm run check`

UI 기준은 `ui-ux-pro-max` 스킬로 생성한 `design-system/gracelink-pm/MASTER.md`를 따릅니다.

## GitHub Pages workflow

- 워크플로 파일: `.github/workflows/deploy-pages.yml`
- Pages 배포용 정적 export를 기준으로 동작합니다.
- GitHub Actions에서 `actions/configure-pages@v5`의 `base_path` 출력을 받아 repo path/private Pages path에 맞춰 빌드합니다.

## Start here

1. [`00-index/README.md`](00-index/README.md)
2. [`01-product/unified-product-brief.md`](01-product/unified-product-brief.md)
3. [`03-mobile/docs/SSOT.md`](03-mobile/docs/SSOT.md)
4. [`04-backend/docs/ssot/README.md`](04-backend/docs/ssot/README.md)
5. [`05-qa/README.md`](05-qa/README.md)
6. [`06-active-changes/README.md`](06-active-changes/README.md)

## Scope

포함 범위:
- RN의 현재 제품 기준 문서, UX/정책 문서, API/계약 문서, 런타임 캡처, QA 문서
- Server의 SSOT, handoff, vault 상태 정리, OpenSpec main specs
- 현재 진행 중인 OpenSpec change proposal / design / tasks / change-local specs
- 레거시 기능명세와 구현용 프롬프트 문서(archive)

제외 범위:
- 배포/운영 로그, GH Actions 설정, OMX 로컬 상태 파일
- 테스트 리팩토링 가이드 같은 엔지니어링 전용 문서
- archived OpenSpec changes

## Repository structure

- `00-index/` — 문서 맵, 마이그레이션 매트릭스, 읽는 순서
- `01-product/` — 제품 관점 엔트리와 통합 요약
- `02-ux/` — UX 문서 안내
- `03-mobile/` — RN 기준 문서/캡처/계약
- `04-backend/` — 서버 SSOT 및 OpenSpec main specs
- `05-qa/` — QA 문서 진입점
- `06-active-changes/` — 현재 진행 중인 change proposal 묶음
- `99-archive/` — 레거시 참조 문서

## Working rule

- 기획 변경은 우선 이 레포에서 정리합니다.
- 구현 세부와 실제 코드 상태는 원본 구현 레포(`grace-link-RN`, `grace-link-server`)에서 이어갑니다.
- 이관된 원본 문서에는 상단에 출처 메모를 남겨 추적 가능하도록 유지했습니다.
