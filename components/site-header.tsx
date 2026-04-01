"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LayersIcon } from "@/components/icons";
import { SearchBox } from "@/components/search-box";
import type { SearchEntry } from "@/lib/docs";

type SiteHeaderProps = {
  searchEntries: SearchEntry[];
};

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/journey", label: "Journey" },
  { href: "/ia", label: "IA" },
  { href: "/policy", label: "Policy" },
  { href: "/docs", label: "Sources" },
];

export function SiteHeader({ searchEntries }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand-link" href="/">
          <span className="brand-mark">
            <LayersIcon className="icon" />
          </span>
          <span className="brand-copy">
            <span className="brand-name">GraceLink PM Portal</span>
            <span className="brand-caption">Journey · IA · Policy · Source of Truth</span>
          </span>
        </Link>

        <nav className="top-nav" aria-label="주요 섹션">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} data-active={active}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-search-slot">
          <SearchBox entries={searchEntries} variant="header" />
        </div>
      </div>
    </header>
  );
}
