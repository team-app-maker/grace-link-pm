import { cache } from "react";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.join(/* turbopackIgnore: true */ process.cwd());
const ROOT_LEVEL_MARKDOWN = ["README.md"];
const CONTENT_ROOTS = [
  "00-index",
  "01-product",
  "02-ux",
  "03-mobile",
  "04-backend",
  "05-qa",
  "06-active-changes",
  "99-archive",
  "design-system",
] as const;

const SECTION_CONFIG = {
  README: {
    key: "general",
    title: "Overview",
    description: "레포 목적, 범위, 문서 구조를 설명하는 홈 문서",
    href: "/docs/README",
    icon: "general",
  },
  "00-index": {
    key: "general",
    title: "Index",
    description: "읽는 순서, migration matrix, canonical entrypoint 모음",
    href: "/docs/00-index",
    icon: "general",
  },
  "01-product": {
    key: "product",
    title: "Product",
    description: "통합 브리프, PRD, 정책, 로드맵을 모은 제품 섹션",
    href: "/docs/01-product",
    icon: "product",
  },
  "02-ux": {
    key: "ux",
    title: "UX",
    description: "화면 구조, IA, 와이어프레임, 카피 전략을 모은 UX 섹션",
    href: "/docs/02-ux",
    icon: "ux",
  },
  "03-mobile": {
    key: "mobile",
    title: "Mobile",
    description: "RN 기준 기획 문서, API 문서, 런타임 캡처, 계약 문서",
    href: "/docs/03-mobile",
    icon: "mobile",
  },
  "04-backend": {
    key: "backend",
    title: "Backend",
    description: "서버 SSOT, handoff, OpenSpec main specs를 모은 계약 섹션",
    href: "/docs/04-backend",
    icon: "backend",
  },
  "05-qa": {
    key: "qa",
    title: "QA",
    description: "QA traceability, test scenarios, 검증 기준 문서",
    href: "/docs/05-qa",
    icon: "qa",
  },
  "06-active-changes": {
    key: "changes",
    title: "Active Changes",
    description: "현재 살아 있는 OpenSpec change proposal 및 task 흐름",
    href: "/docs/06-active-changes",
    icon: "changes",
  },
  "99-archive": {
    key: "archive",
    title: "Archive",
    description: "레거시 기능명세와 구현 프롬프트 보관 영역",
    href: "/docs/99-archive",
    icon: "archive",
  },
  "design-system": {
    key: "ux",
    title: "Design System",
    description: "UI/UX Pro Max로 생성한 유지 기준 디자인 시스템 문서",
    href: "/docs/design-system",
    icon: "ux",
  },
} as const;

export const SECTION_ORDER = [
  SECTION_CONFIG["01-product"],
  SECTION_CONFIG["02-ux"],
  SECTION_CONFIG["03-mobile"],
  SECTION_CONFIG["04-backend"],
  SECTION_CONFIG["05-qa"],
  SECTION_CONFIG["06-active-changes"],
  SECTION_CONFIG["99-archive"],
] as const;

export const FEATURED_DOCS = [
  "01-product/unified-product-brief.md",
  "03-mobile/docs/SSOT.md",
  "03-mobile/docs/prd-reverse-engineered-current-app.md",
  "04-backend/docs/ssot/README.md",
  "05-qa/README.md",
  "06-active-changes/README.md",
] as const;

export type SearchEntry = {
  href: string;
  title: string;
  section: string;
  sectionTitle: string;
  relativePath: string;
  summary: string;
};

export type DocHeading = {
  id: string;
  text: string;
  level: 1 | 2 | 3;
};

export type ParsedDoc = {
  title: string;
  summary: string;
  content: string;
  relativePath: string;
  href: string;
  section: string;
  headings: DocHeading[];
  sourceMeta: {
    source?: string;
    migrated?: string;
    status?: string;
  };
};

export type NavNode = {
  kind: "file" | "directory";
  title: string;
  relativePath: string;
  href: string;
  section: string;
  children: NavNode[];
  summary: string;
};

export type DirectoryView = {
  kind: "directory";
  title: string;
  description: string;
  relativePath: string;
  href: string;
  section: string;
  sectionIcon: "general" | "product" | "ux" | "mobile" | "backend" | "qa" | "changes" | "archive";
  children: Array<{
    kind: "file" | "directory";
    title: string;
    summary: string;
    href: string;
  }>;
  readme: ParsedDoc | null;
};

export type FileRouteResult = {
  kind: "file";
  relativePath: string;
  section: string;
  doc: ParsedDoc;
};

export type DocRouteResult = FileRouteResult | DirectoryView;

function toPosix(value: string) {
  return value.split(path.sep).join("/");
}

function trimMd(value: string) {
  return value.replace(/\.md$/i, "");
}

function safeResolve(relativePath: string) {
  const resolved = path.resolve(REPO_ROOT, relativePath);
  if (!resolved.startsWith(REPO_ROOT)) {
    return null;
  }
  return resolved;
}

function isIncluded(relativePath: string) {
  return (
    ROOT_LEVEL_MARKDOWN.includes(relativePath) ||
    CONTENT_ROOTS.some((root) => relativePath === root || relativePath.startsWith(`${root}/`))
  );
}

function getSectionRoot(relativePath: string) {
  if (relativePath === "README.md") {
    return "README";
  }
  return relativePath.split("/")[0] ?? "README";
}

function getSectionConfig(relativePath: string) {
  return SECTION_CONFIG[getSectionRoot(relativePath) as keyof typeof SECTION_CONFIG] ?? SECTION_CONFIG.README;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function humanizeSegment(segment: string) {
  return segment
    .replace(/\.md$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function fileHref(relativePath: string) {
  return `/docs/${trimMd(relativePath)}`;
}

function directoryHref(relativePath: string) {
  return relativePath ? `/docs/${relativePath}` : "/docs";
}

function parseTitle(rawContent: string, fallback: string) {
  const line = rawContent
    .split(/\r?\n/)
    .find((item) => item.startsWith("# ") || item.startsWith("## "));

  return line ? line.replace(/^#+\s+/, "").trim() : fallback;
}

function stripSourceMeta(rawContent: string) {
  const lines = rawContent.split(/\r?\n/);
  const sourceMeta: ParsedDoc["sourceMeta"] = {};
  let index = 0;

  while (index < lines.length && lines[index].startsWith("> ")) {
    const line = lines[index];
    if (line.startsWith("> Source:")) {
      sourceMeta.source = line.replace(/^> Source:\s*/, "").trim();
    }
    if (line.startsWith("> Migrated into")) {
      sourceMeta.migrated = line.replace(/^> /, "").trim();
    }
    if (line.startsWith("> Status:")) {
      sourceMeta.status = line.replace(/^> Status:\s*/, "").trim();
    }
    index += 1;
  }

  while (index < lines.length && lines[index].trim() === "") {
    index += 1;
  }

  return {
    sourceMeta,
    content: lines.slice(index).join("\n"),
  };
}

function parseSummary(content: string) {
  const lines = content.split(/\r?\n/);
  const summaryLine = lines.find((line) => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith("#") && !trimmed.startsWith(">") && !trimmed.startsWith("|") && !trimmed.startsWith("-");
  });

  return (summaryLine ?? "문서 요약이 아직 없습니다.").trim();
}

function extractHeadings(content: string) {
  return content
    .split(/\r?\n/)
    .flatMap((line) => {
      const match = /^(#{1,3})\s+(.+)$/.exec(line.trim());
      if (!match) {
        return [];
      }

      const level = Math.min(match[1].length, 3) as 1 | 2 | 3;
      const text = match[2].replace(/`/g, "").trim();
      return [
        {
          id: slugify(text),
          text,
          level,
        } satisfies DocHeading,
      ];
    });
}

function listMarkdownFiles(targetPath: string): string[] {
  const absolutePath = safeResolve(targetPath);
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    return [];
  }

  const stats = fs.statSync(absolutePath);

  if (stats.isFile()) {
    return targetPath.endsWith(".md") ? [targetPath] : [];
  }

  const entries = fs.readdirSync(absolutePath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const relativePath = targetPath ? `${targetPath}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      return listMarkdownFiles(relativePath);
    }
    return entry.name.endsWith(".md") ? [relativePath] : [];
  });
}

const getAllMarkdownFiles = cache(() => {
  const fromRoots = CONTENT_ROOTS.flatMap((root) => listMarkdownFiles(root));
  return [...ROOT_LEVEL_MARKDOWN, ...fromRoots]
    .filter((relativePath, index, list) => list.indexOf(relativePath) === index)
    .filter((relativePath) => isIncluded(relativePath));
});

export const getParsedDoc = cache((relativePath: string): ParsedDoc => {
  const absolutePath = safeResolve(relativePath);
  if (!absolutePath || !fs.existsSync(absolutePath) || !relativePath.endsWith(".md")) {
    throw new Error(`Document not found: ${relativePath}`);
  }

  const rawContent = fs.readFileSync(absolutePath, "utf8");
  const { sourceMeta, content } = stripSourceMeta(rawContent);
  const fallbackTitle = humanizeSegment(path.basename(relativePath));
  const title = parseTitle(content, fallbackTitle);
  const headings = extractHeadings(content);
  const summary = parseSummary(content);

  return {
    title,
    summary,
    content,
    relativePath,
    href: fileHref(relativePath),
    section: getSectionConfig(relativePath).key,
    headings,
    sourceMeta,
  };
});

function readDirectoryChildren(relativePath: string): NavNode[] {
  const absolutePath = safeResolve(relativePath);
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    return [];
  }

  const entries = fs.readdirSync(absolutePath, { withFileTypes: true });
  const nodes: NavNode[] = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") {
      continue;
    }

    const childRelativePath = toPosix(path.join(relativePath, entry.name));
    if (!isIncluded(childRelativePath) && !childRelativePath.endsWith(".md")) {
      continue;
    }

    if (entry.isDirectory()) {
      const children = readDirectoryChildren(childRelativePath);
      const sectionConfig = getSectionConfig(childRelativePath);
      nodes.push({
        kind: "directory",
        title: humanizeSegment(entry.name),
        relativePath: childRelativePath,
        href: directoryHref(childRelativePath),
        section: sectionConfig.key,
        children,
        summary: sectionConfig.description,
      });
      continue;
    }

    if (!entry.name.endsWith(".md")) {
      continue;
    }

    const doc = getParsedDoc(childRelativePath);
    nodes.push({
      kind: "file",
      title: doc.title,
      relativePath: childRelativePath,
      href: doc.href,
      section: doc.section,
      children: [],
      summary: doc.summary,
    });
  }

  return nodes.sort((left, right) => {
    if (left.kind !== right.kind) {
      return left.kind === "directory" ? -1 : 1;
    }
    return left.title.localeCompare(right.title, "ko");
  });
}

export const getNavigationTree = cache((): NavNode[] => {
  const rootNodes: NavNode[] = [];

  if (fs.existsSync(path.join(REPO_ROOT, "README.md"))) {
    const doc = getParsedDoc("README.md");
    rootNodes.push({
      kind: "file",
      title: doc.title,
      relativePath: "README.md",
      href: doc.href,
      section: doc.section,
      children: [],
      summary: doc.summary,
    });
  }

  for (const root of CONTENT_ROOTS) {
    const absolutePath = path.join(REPO_ROOT, root);
    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    const config = getSectionConfig(root);
    rootNodes.push({
      kind: "directory",
      title: config.title,
      relativePath: root,
      href: directoryHref(root),
      section: config.key,
      children: readDirectoryChildren(root),
      summary: config.description,
    });
  }

  return rootNodes;
});

function resolveRelativeTarget(baseRelativePath: string, target: string) {
  const [pathname, anchor] = target.split("#");
  const baseDirectory = baseRelativePath.endsWith(".md")
    ? path.dirname(baseRelativePath)
    : baseRelativePath;
  const resolvedPath = toPosix(path.normalize(path.join(baseDirectory, pathname)));

  if (!isIncluded(trimMd(resolvedPath)) && !isIncluded(resolvedPath) && !isIncluded(`${resolvedPath}.md`)) {
    const directAbsolute = safeResolve(resolvedPath);
    if (!directAbsolute || !fs.existsSync(directAbsolute)) {
      return null;
    }
  }

  return {
    resolvedPath,
    anchor,
  };
}

export function resolveDocHref(baseRelativePath: string, target: string) {
  if (!target || target.startsWith("http://") || target.startsWith("https://") || target.startsWith("mailto:")) {
    return null;
  }

  if (target.startsWith("#")) {
    return target;
  }

  const resolved = resolveRelativeTarget(baseRelativePath, target);
  if (!resolved) {
    return null;
  }

  const { resolvedPath, anchor } = resolved;
  const directAbsolute = safeResolve(resolvedPath);
  const markdownAbsolute = safeResolve(`${resolvedPath}.md`);
  const readmeAbsolute = safeResolve(path.join(resolvedPath, "README.md"));

  if (directAbsolute && fs.existsSync(directAbsolute) && fs.statSync(directAbsolute).isDirectory()) {
    return `${directoryHref(resolvedPath)}${anchor ? `#${anchor}` : ""}`;
  }

  if (directAbsolute && fs.existsSync(directAbsolute) && directAbsolute.endsWith(".md")) {
    return `${fileHref(resolvedPath)}${anchor ? `#${anchor}` : ""}`;
  }

  if (markdownAbsolute && fs.existsSync(markdownAbsolute)) {
    return `${fileHref(`${resolvedPath}.md`)}${anchor ? `#${anchor}` : ""}`;
  }

  if (readmeAbsolute && fs.existsSync(readmeAbsolute)) {
    return `${directoryHref(resolvedPath)}${anchor ? `#${anchor}` : ""}`;
  }

  return null;
}

export function resolveAssetHref(baseRelativePath: string, target: string) {
  if (!target || target.startsWith("http://") || target.startsWith("https://") || target.startsWith("mailto:")) {
    return target || null;
  }

  const resolved = resolveRelativeTarget(baseRelativePath, target);
  if (!resolved) {
    return null;
  }

  const absolutePath = safeResolve(resolved.resolvedPath);
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    return null;
  }

  if (fs.statSync(absolutePath).isDirectory()) {
    return null;
  }

  return `/asset/${resolved.resolvedPath}`;
}

export function resolveAssetPath(slug: string[]) {
  const relativePath = slug.join("/");
  const absolutePath = safeResolve(relativePath);
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    return null;
  }
  return relativePath;
}

export function getSearchEntries(): SearchEntry[] {
  return getAllMarkdownFiles().map((relativePath) => {
    const doc = getParsedDoc(relativePath);
    return {
      href: doc.href,
      title: doc.title,
      section: doc.section,
      sectionTitle: getSectionLabel(doc.section),
      relativePath,
      summary: doc.summary,
    } satisfies SearchEntry;
  });
}

export function getSectionLabel(section: string) {
  return Object.values(SECTION_CONFIG).find((item) => item.key === section)?.title ?? "General";
}

export function getSectionSummaries() {
  return SECTION_ORDER.map((section) => ({
    key: section.key,
    docCount: getSearchEntries().filter((entry) => entry.section === section.key).length,
  }));
}

export function getDocStats() {
  const entries = getSearchEntries();
  return {
    totalDocs: entries.length,
    totalSections: SECTION_ORDER.length,
    activeChangeCount: entries.filter((entry) => entry.relativePath.startsWith("06-active-changes/changes/")).length,
    runtimeCaptureCount: listFilesUnder("03-mobile/docs/runtime-captures").filter((file) => /\.(png|jpg|jpeg|webp|gif)$/i.test(file)).length,
  };
}

function listFilesUnder(relativePath: string): string[] {
  const absolutePath = safeResolve(relativePath);
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    return [];
  }

  return fs.readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    const childRelativePath = toPosix(path.join(relativePath, entry.name));
    if (entry.isDirectory()) {
      return listFilesUnder(childRelativePath);
    }
    return [childRelativePath];
  });
}

export function getFeaturedDocCards(paths: readonly string[]) {
  return paths.map((relativePath) => {
    const doc = getParsedDoc(relativePath);
    return {
      href: doc.href,
      title: doc.title,
      summary: doc.summary,
      sectionTitle: getSectionLabel(doc.section),
    };
  });
}

export function resolveDocRoute(slug: string[]): DocRouteResult | null {
  if (slug.length === 0) {
    return getDirectoryView("");
  }

  const joined = slug.join("/");
  const exactAbsolute = safeResolve(joined);
  const markdownAbsolute = safeResolve(`${joined}.md`);

  if (exactAbsolute && fs.existsSync(exactAbsolute) && fs.statSync(exactAbsolute).isDirectory() && isIncluded(joined)) {
    return getDirectoryView(joined);
  }

  if (exactAbsolute && fs.existsSync(exactAbsolute) && joined.endsWith(".md") && isIncluded(joined)) {
    return {
      kind: "file",
      relativePath: joined,
      section: getSectionConfig(joined).key,
      doc: getParsedDoc(joined),
    };
  }

  if (markdownAbsolute && fs.existsSync(markdownAbsolute) && isIncluded(`${joined}.md`)) {
    return {
      kind: "file",
      relativePath: `${joined}.md`,
      section: getSectionConfig(`${joined}.md`).key,
      doc: getParsedDoc(`${joined}.md`),
    };
  }

  return null;
}

function getDirectoryView(relativePath: string): DirectoryView {
  const sectionConfig = getSectionConfig(relativePath || "README.md");
  const absolutePath = relativePath ? safeResolve(relativePath) : REPO_ROOT;
  const readmeRelativePath = relativePath ? `${relativePath}/README.md` : "README.md";
  const readme = isIncluded(readmeRelativePath) && fs.existsSync(path.join(REPO_ROOT, readmeRelativePath))
    ? getParsedDoc(readmeRelativePath)
    : null;

  const children =
    relativePath === ""
      ? getNavigationTree().filter((node) => node.relativePath !== readmeRelativePath)
      : readDirectoryChildren(relativePath).filter((node) => node.relativePath !== readmeRelativePath);

  return {
    kind: "directory",
    title: readme?.title ?? sectionConfig.title ?? humanizeSegment(path.basename(relativePath || "docs")),
    description: readme?.summary ?? sectionConfig.description,
    relativePath,
    href: directoryHref(relativePath),
    section: sectionConfig.key,
    sectionIcon: sectionConfig.icon,
    children: children.map((child) => ({
      kind: child.kind,
      title: child.title,
      summary: child.summary,
      href: child.href,
    })),
    readme,
  };
}
