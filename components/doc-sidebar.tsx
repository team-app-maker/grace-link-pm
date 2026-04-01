import Link from "next/link";

import { FileIcon, FolderIcon } from "@/components/icons";
import type { NavNode } from "@/lib/docs";

type DocSidebarProps = {
  tree: NavNode[];
  currentPath: string;
};

type SidebarTreeProps = {
  nodes: NavNode[];
  currentPath: string;
  depth?: number;
};

function SidebarTree({ nodes, currentPath, depth = 0 }: SidebarTreeProps) {
  return (
    <ul className={depth === 0 ? "sidebar-group" : undefined}>
      {nodes.map((node) => {
        if (node.kind === "directory") {
          const isOpen = currentPath === node.relativePath || currentPath.startsWith(`${node.relativePath}/`);
          return (
            <li key={node.relativePath} className="sidebar-folder">
              <details open={isOpen}>
                <summary>
                  <FolderIcon className="icon" />
                  <span
                    className={`sidebar-link sidebar-link-depth-${Math.min(depth, 3)}`}
                    data-active={currentPath === node.relativePath}
                  >
                    {node.title}
                  </span>
                </summary>
                {node.children.length ? (
                  <SidebarTree nodes={node.children} currentPath={currentPath} depth={depth + 1} />
                ) : null}
              </details>
            </li>
          );
        }

        return (
          <li key={node.relativePath}>
            <Link
              className={`sidebar-link sidebar-link-depth-${Math.min(depth, 3)}`}
              href={node.href}
              data-active={currentPath === node.relativePath}
            >
              <FileIcon className="icon" />
              {node.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function DocSidebar({ tree, currentPath }: DocSidebarProps) {
  return (
    <nav className="docs-sidebar" aria-label="문서 사이드바">
      <SidebarTree nodes={tree} currentPath={currentPath} />
    </nav>
  );
}
