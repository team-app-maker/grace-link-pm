import Link from "next/link";

import {
  FeatureRouteCards,
  HeroAnswerPanel,
  MetricStrip,
  PortalHero,
  SectionFooterCta,
  SourceBundles,
} from "@/components/portal";
import { OverviewSystemCanvas } from "@/components/flow-diagrams";
import {
  portalMetrics,
  sourceBundles,
} from "@/lib/portal-data";

export default function HomePage() {
  return (
    <main id="main-content" className="page-shell portal-home">
      <PortalHero
        eyebrow="GraceLink PM Portal"
        title="문서보다 먼저, GraceLink 제품 시스템을 읽게 만드는 PM 포털"
        description="신뢰 게이트, 탐색 루프, 응답 구조, 정책 축, 운영 흐름을 먼저 보여주고 필요한 근거 문서는 그다음에 열게 만드는 형태로 정리했습니다."
        actions={
          <>
            <Link className="button button-primary" href="/journey">
              유저플로우 보기
            </Link>
            <Link className="button button-secondary" href="/docs">
              근거 문서 열기
            </Link>
          </>
        }
      />

      <section className="surface home-answer-band">
        <HeroAnswerPanel />
      </section>

      <section className="surface home-overview-band">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Overview shortcuts</span>
            <h2>지금 이 제품을 판단할 때 먼저 봐야 할 신호와 진입점</h2>
          </div>
          <p>핵심 수치와 deep-dive entry를 한 영역으로 묶어 첫 화면 밀도를 낮췄습니다.</p>
        </div>
        <MetricStrip metrics={portalMetrics} />
        <FeatureRouteCards />
      </section>

      <OverviewSystemCanvas />
      <SectionFooterCta
        href="/journey"
        label="Journey Canvas"
        title="실제 스크린샷 기반 flow/IA 다이어그램으로 들어가기"
        description="홈은 executive map으로 정리하고, 세부 흐름과 구조도는 Journey/IA 페이지에서 깊게 봅니다."
      />
      <SourceBundles bundles={sourceBundles} />
    </main>
  );
}
