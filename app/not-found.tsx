import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="page-shell not-found-shell">
      <div className="surface not-found-card">
        <span className="eyebrow">404</span>
        <h1>문서를 찾지 못했습니다</h1>
        <p>
          요청한 문서 경로나 자산이 현재 지식 허브에 없습니다. 검색으로 다시 찾아보거나
          인덱스에서 탐색해 주세요.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/docs">
            전체 문서 보기
          </Link>
          <Link className="button button-secondary" href="/">
            홈으로 가기
          </Link>
        </div>
      </div>
    </main>
  );
}
