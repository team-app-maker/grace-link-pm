import Link from "next/link";

import { PortalHero, PortalMiniDiagram, SectionFooterCta, SourceBundles } from "@/components/portal";
import { PolicyExplorer, SystemExplorer } from "@/components/portal-workspace";
import { blueprintColumns, policyGroups, sourceBundles } from "@/lib/portal-data";

export default function PolicyPage() {
  return (
    <main id="main-content" className="page-shell portal-subpage">
      <PortalHero
        eyebrow="Policy Matrix"
        title="GraceLink를 실제로 움직이는 운영 규칙과 계약 축"
        description="사용자 상태, 추천 경제, 매칭/채팅 SLA, 보상형 광고, 안전/운영, backend contract alignment를 정책 시스템으로 정리한 페이지입니다."
        actions={
          <>
            <Link className="button button-primary" href="/docs/03-mobile/docs/ssot/product-policy-spec/">
              정책 원문 보기
            </Link>
            <Link className="button button-secondary" href="/docs/04-backend/docs/ssot/02-user-stories/">
              backend user stories
            </Link>
          </>
        }
        aside={
          <PortalMiniDiagram
            title="Policy axes"
            items={[
              { label: "Access", detail: "APPROVED만 핵심 경험 진입 가능" },
              { label: "Economy", detail: "추천/매칭/재진입이 만나 정책과 연결" },
              { label: "SLA", detail: "48시간 응답, 24시간 채팅 종료 규칙" },
              { label: "Safety", detail: "신고·차단·운영 심사·권한 흐름" },
            ]}
          />
        }
      />
      <PolicyExplorer groups={policyGroups} />
      <SystemExplorer columns={blueprintColumns} bundles={sourceBundles} />
      <SectionFooterCta
        href="/docs/06-active-changes/README/"
        label="Execution Layer"
        title="활성 변경안과 QA 기준으로 이어 보기"
        description="정책 변경이 실제 실행 backlog에서 어떻게 관리되는지 active changes와 validation 문서에서 확인합니다."
      />
      <SourceBundles bundles={sourceBundles.slice(2)} />
    </main>
  );
}
