import Link from "next/link";
import { notFound } from "next/navigation";

import { DocMarkdown } from "@/components/doc-markdown";
import { DocSidebar } from "@/components/doc-sidebar";
import { SearchBox } from "@/components/search-box";
import { TableOfContents } from "@/components/table-of-contents";
import {
  BranchIcon,
  FolderIcon,
  InfoIcon,
  LayersIcon,
  SparkIcon,
} from "@/components/icons";
import {
  type DirectoryView,
  type DocRouteResult,
  getAllDocRouteSlugs,
  getNavigationTree,
  getSearchEntries,
  getSectionLabel,
  resolveDocRoute,
} from "@/lib/docs";

const directoryIconMap = {
  product: LayersIcon,
  ux: SparkIcon,
  mobile: FolderIcon,
  backend: FolderIcon,
  qa: InfoIcon,
  changes: BranchIcon,
  archive: FolderIcon,
  general: FolderIcon,
} as const;

type PageProps = {
  params: Promise<{ slug?: string[] }> | { slug?: string[] };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDocRouteSlugs().map((slug) => ({ slug }));
}

function DirectoryPanel({ view }: { view: DirectoryView }) {
  const Icon = directoryIconMap[view.sectionIcon];

  return (
    <section className="directory-panel surface">
      <div className="directory-heading">
        <div className="directory-heading-copy">
          <span className="eyebrow">Directory</span>
          <h1>{view.title}</h1>
          <p>{view.description}</p>
        </div>
        <div className="directory-summary-pill">
          <Icon className="icon" />
          <span>
            {view.children.length.toLocaleString("ko-KR")}개 항목 · {getSectionLabel(view.section)}
          </span>
        </div>
      </div>

      <div className="directory-card-grid">
        {view.children.map((child) => (
          <Link key={child.href} className="directory-card" href={child.href}>
            <div className="directory-card-top">
              {child.kind === "directory" ? <FolderIcon className="icon" /> : <InfoIcon className="icon" />}
              <span className="directory-card-kind">
                {child.kind === "directory" ? "Directory" : "Document"}
              </span>
            </div>
            <strong>{child.title}</strong>
            <p>{child.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SourceMeta({ route }: { route: DocRouteResult }) {
  const source = route.kind === "file" ? route.doc.sourceMeta.source : route.readme?.sourceMeta.source;
  const status = route.kind === "file" ? route.doc.sourceMeta.status : route.readme?.sourceMeta.status;
  const migrated = route.kind === "file" ? route.doc.sourceMeta.migrated : route.readme?.sourceMeta.migrated;

  if (!source && !status && !migrated) {
    return null;
  }

  return (
    <div className="meta-card surface-muted">
      <h2>문서 메타</h2>
      <dl className="meta-list">
        {source ? (
          <div>
            <dt>Source</dt>
            <dd><code>{source}</code></dd>
          </div>
        ) : null}
        {status ? (
          <div>
            <dt>Status</dt>
            <dd>{status}</dd>
          </div>
        ) : null}
        {migrated ? (
          <div>
            <dt>Migrated</dt>
            <dd>{migrated}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

export default async function DocsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ?? [];
  const route = resolveDocRoute(slug);

  if (!route) {
    notFound();
  }

  const navTree = getNavigationTree();
  const searchEntries = getSearchEntries();
  const pageTitle = route.kind === "file" ? route.doc.title : route.title;
  const pageSummary =
    route.kind === "file"
      ? route.doc.summary
      : route.readme?.summary ?? route.description;

  return (
    <main id="main-content" className="page-shell docs-shell">
      <div className="docs-layout">
        <aside className="docs-sidebar-column">
          <div className="sticky-frame">
            <div className="surface sidebar-surface">
              <div className="sidebar-search-header">
                <h2>문서 탐색</h2>
                <p>자동완성으로 문서를 바로 찾을 수 있습니다.</p>
              </div>
              <SearchBox entries={searchEntries} variant="sidebar" />
              <DocSidebar tree={navTree} currentPath={route.relativePath} />
            </div>
          </div>
        </aside>

        <section className="docs-main-column">
          <div className="docs-page-header surface">
            <span className="eyebrow">{getSectionLabel(route.section)}</span>
            <h1>{pageTitle}</h1>
            <p>{pageSummary}</p>
          </div>

          {route.kind === "directory" ? (
            <>
              <DirectoryPanel view={route} />
              {route.readme ? (
                <article className="doc-article surface">
                  <DocMarkdown doc={route.readme} />
                </article>
              ) : null}
            </>
          ) : (
            <article className="doc-article surface">
              <DocMarkdown doc={route.doc} />
            </article>
          )}
        </section>

        <aside className="docs-meta-column">
          <div className="sticky-frame meta-stack">
            <SourceMeta route={route} />
            {route.kind === "file" && route.doc.headings.length > 0 ? (
              <TableOfContents headings={route.doc.headings} />
            ) : route.kind === "directory" && route.readme?.headings.length ? (
              <TableOfContents headings={route.readme.headings} />
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
