import Link from "next/link";

import { LayersIcon } from "@/components/icons";
import { SearchBox } from "@/components/search-box";
import type { SearchEntry } from "@/lib/docs";

type SiteHeaderProps = {
  searchEntries: SearchEntry[];
};

const NAV_ITEMS = [
  { href: "/docs", label: "Library" },
  { href: "/docs/01-product", label: "Product" },
  { href: "/docs/02-ux", label: "UX" },
  { href: "/docs/03-mobile", label: "Mobile" },
  { href: "/docs/04-backend", label: "Backend" },
  { href: "/docs/05-qa", label: "QA" },
  { href: "/docs/06-active-changes", label: "Changes" },
];

export function SiteHeader({ searchEntries }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand-link" href="/">
          <span className="brand-mark">
            <LayersIcon className="icon" />
          </span>
          <span className="brand-copy">
            <span className="brand-name">GraceLink PM</span>
            <span className="brand-caption">Planning documents in a maintainable web hub</span>
          </span>
        </Link>

        <nav className="top-nav" aria-label="주요 섹션">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-search-slot">
          <SearchBox entries={searchEntries} variant="header" />
        </div>
      </div>
    </header>
  );
}
