import Link from "next/link";

import { PortalHero, PortalMiniDiagram, SectionFooterCta, SourceBundles } from "@/components/portal";
import { IaExplorer } from "@/components/portal-workspace";
import {
  hiddenSurfaces,
  iaIssues,
  menuRecommendations,
  sourceBundles,
  visibleSurfaces,
} from "@/lib/portal-data";

export default function IaPage() {
  return (
    <main id="main-content" className="page-shell portal-subpage">
      <PortalHero
        eyebrow="IA / Menu Blueprint"
        title="무엇이 보이고, 무엇이 숨어 있으며, 왜 지금 메뉴 구조가 제품 전략을 가리고 있는가"
        description="탭에 드러난 표면과 실제 핵심 라우트를 분리해 보여주고, 지금 구조의 friction과 차기 메뉴 방향을 도식으로 읽게 만듭니다."
        actions={
          <>
            <Link className="button button-primary" href="/policy">
              정책 보기
            </Link>
            <Link className="button button-secondary" href="/docs/03-mobile/docs/ssot/ia-menu-structure/">
              IA 원문
            </Link>
          </>
        }
        aside={
          <PortalMiniDiagram
            title="IA split view"
            items={[
              { label: "Visible Tabs", detail: "사용자가 즉시 보는 4개 탭 표면" },
              { label: "Hidden Core", detail: "인박스·보관함·스토어 같은 핵심 동선" },
              { label: "Friction", detail: "행동 허브 부재와 메뉴 과밀이 문제" },
              { label: "Target", detail: "홈/소개/인박스/채팅/내 정보 구조로 재정렬" },
            ]}
          />
        }
      />
      <IaExplorer
        visible={visibleSurfaces}
        hidden={hiddenSurfaces}
        issues={iaIssues}
        recommendations={menuRecommendations}
      />
      <SectionFooterCta
        href="/docs/03-mobile/docs/ssot/home-redesign-and-copy-strategy/"
        label="Next Design Work"
        title="홈 개편과 카피 전략 원문 보기"
        description="행동 허브로 바꾸기 위한 상세 전략 문서를 바로 열 수 있습니다."
      />
      <SourceBundles bundles={sourceBundles.slice(1, 3)} />
    </main>
  );
}
