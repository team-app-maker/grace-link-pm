import type { DocHeading } from "@/lib/docs";

type TableOfContentsProps = {
  headings: DocHeading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  return (
    <nav className="toc-card surface-muted" aria-label="문서 목차">
      <h2>목차</h2>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a className={`toc-depth-${heading.level}`} href={`#${heading.id}`}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
