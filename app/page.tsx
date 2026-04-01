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
        title="기획 문서를 나열하지 말고, 제품 시스템을 한 화면에서 보여주는 허브"
        description="이제 이 웹은 raw markdown 목록이 아니라, GraceLink의 user flow, IA/menu structure, policy system, 그리고 source-of-truth 문서를 한 개의 제품 포털로 묶어 보여줍니다."
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
        aside={<HeroAnswerPanel />}
      />

      <MetricStrip metrics={portalMetrics} />
      <FeatureRouteCards />
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
