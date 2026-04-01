import Link from "next/link";

import {
  PortalHero,
  PortalMiniDiagram,
  SectionFooterCta,
  SourceBundles,
} from "@/components/portal";
import { JourneyExplorer } from "@/components/portal-workspace";
import { journeyLanes, sourceBundles } from "@/lib/portal-data";

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
        aside={
          <PortalMiniDiagram
            title="Journey map preview"
            items={[
              { label: "Trust Gate", detail: "로그인 이후에도 승인 전까지 추천 경험은 닫혀 있습니다." },
              { label: "Discovery", detail: "오늘의 소개와 인박스가 실제 전환 중심입니다." },
              { label: "Conversation", detail: "수락 후에만 채팅이 열리고 24시간 규칙이 붙습니다." },
              { label: "Moderation", detail: "안전 이슈는 운영 심사와 권한 정책으로 연결됩니다." },
            ]}
          />
        }
      />
      <JourneyExplorer lanes={journeyLanes} />
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
