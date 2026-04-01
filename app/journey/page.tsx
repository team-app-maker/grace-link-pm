import Link from "next/link";

import { PortalHero, SectionFooterCta, SourceBundles } from "@/components/portal";
import { JourneyFlowCanvas } from "@/components/flow-diagrams";
import { sourceBundles } from "@/lib/portal-data";

export default function JourneyPage() {
  return (
    <main id="main-content" className="page-shell portal-subpage">
      <PortalHero
        eyebrow="Journey Canvas"
        title="승인 게이트부터 운영 심사까지, GraceLink의 실제 user flow"
        description="현재 앱 기준으로 applicant journey, approved member loop, operations & safety loop를 한 번에 보여줍니다. 이 페이지는 기능 설명보다 흐름과 병목을 먼저 읽도록 설계했습니다."
        actions={
          <>
            <Link className="button button-primary" href="/ia">
              IA도 같이 보기
            </Link>
            <Link className="button button-secondary" href="/docs/03-mobile/docs/prd-reverse-engineered-current-app/">
              원본 PRD
            </Link>
          </>
        }
      />
      <JourneyFlowCanvas />
      <SectionFooterCta
        href="/policy"
        label="Policy Matrix"
        title="이 흐름을 실제로 지배하는 운영 규칙 보기"
        description="추천 경제, 매칭 SLA, 채팅 종료 규칙, 안전 정책이 어떻게 플로우를 제한하는지 이어서 확인합니다."
      />
      <SourceBundles bundles={sourceBundles.slice(0, 2)} />
    </main>
  );
}
