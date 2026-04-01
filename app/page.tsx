import Link from "next/link";

import {
  BlueprintMap,
  CompactPolicyHighlights,
  FeatureRouteCards,
  HeroAnswerPanel,
  JourneyMap,
  MetricStrip,
  NarrativeStrip,
  PillarBoard,
  PortalHero,
  PortalLegend,
  SectionFooterCta,
  SectionSummaryPanel,
  SourceBundles,
} from "@/components/portal";
import {
  blueprintColumns,
  journeyLanes,
  policyGroups,
  portalMetrics,
  productPillars,
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
      <SectionSummaryPanel />
      <PillarBoard pillars={productPillars} />
      <NarrativeStrip />
      <JourneyMap lanes={journeyLanes.slice(0, 2)} />
      <PortalLegend />
      <SectionFooterCta
        href="/journey"
        label="Journey Canvas"
        title="승인 전/후/운영 루프 전체 보기"
        description="현재 앱 사용자 경험과 운영 루프를 단계별로 더 자세히 봅니다."
      />
      <CompactPolicyHighlights groups={policyGroups} />
      <BlueprintMap columns={blueprintColumns} />
      <SourceBundles bundles={sourceBundles} />
    </main>
  );
}
