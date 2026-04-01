import Link from "next/link";

import { SearchBox } from "@/components/search-box";
import {
  BookOpenIcon,
  BranchIcon,
  CheckCircleIcon,
  FolderIcon,
  LayersIcon,
  SparkIcon,
} from "@/components/icons";
import {
  FEATURED_DOCS,
  SECTION_ORDER,
  getDocStats,
  getFeaturedDocCards,
  getSearchEntries,
  getSectionSummaries,
} from "@/lib/docs";

const iconMap = {
  product: LayersIcon,
  ux: SparkIcon,
  mobile: BookOpenIcon,
  backend: FolderIcon,
  qa: CheckCircleIcon,
  changes: BranchIcon,
  archive: BookOpenIcon,
  general: FolderIcon,
} as const;

export default function HomePage() {
  const stats = getDocStats();
  const sections = getSectionSummaries();
  const searchEntries = getSearchEntries();
  const featuredDocs = getFeaturedDocCards(FEATURED_DOCS);

  return (
    <main id="main-content" className="page-shell home-shell">
      <section className="hero-panel surface">
        <div className="hero-copy">
          <span className="eyebrow">GraceLink PM Knowledge Hub</span>
          <h1>기획서, SSOT, QA, 변경안을 한 화면에서 관리하는 문서 허브</h1>
          <p className="hero-description">
            UI/UX Pro Max의 Minimalism &amp; Swiss Style 가이드를 적용해,
            기획 문서를 빠르게 찾고 유지보수하기 쉬운 Next.js 기반 문서 사이트로
            정리했습니다.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/docs">
              전체 문서 보기
            </Link>
            <Link className="button button-secondary" href="/docs/01-product/unified-product-brief">
              통합 브리프 열기
            </Link>
          </div>
        </div>
        <div className="hero-search-card surface-muted">
          <div className="hero-search-header">
            <SparkIcon className="icon" />
            <div>
              <h2>빠른 문서 탐색</h2>
              <p>검색 자동완성과 섹션별 이동으로 필요한 문서를 바로 여세요.</p>
            </div>
          </div>
          <SearchBox entries={searchEntries} variant="hero" />
          <ul className="hero-tips">
            <li>예시: SSOT, roadmap, websocket, QA, archive policy</li>
            <li>모든 클릭 요소는 키보드 포커스와 빠른 이동을 지원합니다.</li>
          </ul>
        </div>
      </section>

      <section className="stats-grid" aria-label="문서 요약 통계">
        <article className="stat-card surface">
          <span className="stat-label">총 문서 수</span>
          <strong>{stats.totalDocs.toLocaleString("ko-KR")}</strong>
          <p>README, SSOT, QA, OpenSpec, archive까지 포함한 현재 기준 문서 수입니다.</p>
        </article>
        <article className="stat-card surface">
          <span className="stat-label">섹션 수</span>
          <strong>{stats.totalSections.toLocaleString("ko-KR")}</strong>
          <p>제품, UX, 모바일, 백엔드, QA, 활성 변경, 아카이브 섹션으로 구성했습니다.</p>
        </article>
        <article className="stat-card surface">
          <span className="stat-label">활성 변경안</span>
          <strong>{stats.activeChangeCount.toLocaleString("ko-KR")}</strong>
          <p>현재 살아 있는 OpenSpec change proposal 묶음을 별도 섹션으로 유지합니다.</p>
        </article>
        <article className="stat-card surface">
          <span className="stat-label">런타임 캡처</span>
          <strong>{stats.runtimeCaptureCount.toLocaleString("ko-KR")}</strong>
          <p>모바일 실사용 근거 이미지를 자산 라우트로 바로 확인할 수 있습니다.</p>
        </article>
      </section>

      <section className="content-grid two-up">
        <div className="surface">
          <div className="section-heading">
            <h2>핵심 진입 문서</h2>
            <Link className="inline-link" href="/docs/00-index">
              인덱스 열기
            </Link>
          </div>
          <div className="featured-doc-grid">
            {featuredDocs.map((doc) => (
              <Link key={doc.href} className="featured-doc-card" href={doc.href}>
                <span className="featured-doc-section">{doc.sectionTitle}</span>
                <strong>{doc.title}</strong>
                <p>{doc.summary}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface">
          <div className="section-heading">
            <h2>유지 원칙</h2>
          </div>
          <ol className="maintenance-list">
            <li>기획 변경은 먼저 이 레포 문서에서 정리합니다.</li>
            <li>구현 세부/실행 코드는 RN, server 원본 레포와 동기화합니다.</li>
            <li>활성 change는 `06-active-changes`에서 따로 추적합니다.</li>
            <li>레거시 기능명세는 `99-archive`에 분리해 최신 기준과 혼동하지 않게 합니다.</li>
          </ol>
        </div>
      </section>

      <section className="surface">
        <div className="section-heading">
          <h2>섹션별 탐색</h2>
          <p>문서 허브의 주요 카테고리를 카드로 빠르게 이동할 수 있습니다.</p>
        </div>
        <div className="section-card-grid">
          {SECTION_ORDER.map((section) => {
            const data = sections.find((item) => item.key === section.key);
            const Icon = iconMap[section.icon];

            return (
              <Link key={section.key} className="section-card" href={section.href}>
                <div className="section-card-top">
                  <Icon className="icon" />
                  <span className="section-count">
                    {(data?.docCount ?? 0).toLocaleString("ko-KR")} docs
                  </span>
                </div>
                <strong>{section.title}</strong>
                <p>{section.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
