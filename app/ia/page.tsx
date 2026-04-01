import Link from "next/link";

import { IaBoard, PortalHero, SectionFooterCta, SourceBundles } from "@/components/portal";
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
      />
      <IaBoard
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
