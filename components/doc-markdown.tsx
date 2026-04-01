import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { ParsedDoc } from "@/lib/docs";
import { resolveAssetHref, resolveDocHref } from "@/lib/docs";

/* eslint-disable @next/next/no-img-element */

type DocMarkdownProps = {
  doc: ParsedDoc;
};

export function DocMarkdown({ doc }: DocMarkdownProps) {
  const headingIndexes: Record<1 | 2 | 3, number> = {
    1: 0,
    2: 0,
    3: 0,
  };

  const takeHeadingId = (level: 1 | 2 | 3) => {
    const matches = doc.headings.filter((heading) => heading.level === level);
    const index = headingIndexes[level];
    const match = matches[index];
    headingIndexes[level] += 1;
    return match?.id;
  };

  return (
    <div className="doc-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, href = "", children, ...props }) => {
            if (href.startsWith("http://") || href.startsWith("https://")) {
              return (
                <a href={href} target="_blank" rel="noreferrer" {...props}>
                  {children}
                </a>
              );
            }

            const internal = resolveDocHref(doc.relativePath, href);
            if (internal) {
              return <Link href={internal}>{children}</Link>;
            }

            return (
              <a href={href} {...props}>
                {children}
              </a>
            );
          },
          img: ({ node: _node, src = "", alt = "" }) => {
            if (typeof src !== "string") {
              return null;
            }

            const resolvedSrc = resolveAssetHref(doc.relativePath, src);
            if (!resolvedSrc) {
              return null;
            }

            return <img className="doc-image" src={resolvedSrc} alt={alt} loading="lazy" />;
          },
          h1: ({ node: _node, children, ...props }) => {
            const id = takeHeadingId(1);
            return (
              <h1 id={id} {...props}>
                {children}
              </h1>
            );
          },
          h2: ({ node: _node, children, ...props }) => {
            const id = takeHeadingId(2);
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ node: _node, children, ...props }) => {
            const id = takeHeadingId(3);
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
        }}
      >
        {doc.content}
      </ReactMarkdown>
    </div>
  );
}
