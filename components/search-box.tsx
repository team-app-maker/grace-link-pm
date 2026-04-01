"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { SearchIcon } from "@/components/icons";
import type { SearchEntry } from "@/lib/docs";

type SearchBoxProps = {
  entries: SearchEntry[];
  variant: "header" | "hero" | "sidebar";
};

function scoreEntry(entry: SearchEntry, query: string) {
  const normalizedQuery = query.toLowerCase();
  const title = entry.title.toLowerCase();
  const section = entry.sectionTitle.toLowerCase();
  const summary = entry.summary.toLowerCase();

  let score = 0;

  if (title.startsWith(normalizedQuery)) score += 8;
  if (title.includes(normalizedQuery)) score += 6;
  if (section.includes(normalizedQuery)) score += 3;
  if (summary.includes(normalizedQuery)) score += 2;
  if (entry.relativePath.toLowerCase().includes(normalizedQuery)) score += 1;

  return score;
}

export function SearchBox({ entries, variant }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const trimmed = query.trim();
    const base = trimmed
      ? entries
          .map((entry) => ({ entry, score: scoreEntry(entry, trimmed) }))
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, "ko"))
          .slice(0, 8)
          .map((item) => item.entry)
      : entries.slice(0, variant === "hero" ? 6 : 5);

    return base;
  }, [entries, query, variant]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    }

    if (event.key === "Enter") {
      const selected = results[activeIndex];
      if (selected) {
        window.location.href = selected.href;
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const showResults = isOpen && (query.trim().length > 0 || variant !== "header");

  return (
    <div className="searchbox" data-variant={variant} ref={rootRef}>
      <SearchIcon className="search-icon icon" />
      <input
        className="search-input"
        type="search"
        placeholder={variant === "hero" ? "문서 제목, SSOT, QA, websocket, roadmap 검색" : "문서 검색"}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={onKeyDown}
        aria-label="문서 검색"
        aria-controls={`search-results-${variant}`}
        aria-autocomplete="list"
      />

      {showResults ? (
        <div className="search-results" id={`search-results-${variant}`} role="listbox">
          {results.length ? (
            <ul>
              {results.map((entry, index) => (
                <li key={entry.href} role="option" aria-selected={activeIndex === index}>
                  <Link
                    href={entry.href}
                    className="search-result-link"
                    data-active={activeIndex === index}
                    onClick={() => setIsOpen(false)}
                  >
                    <strong>{entry.title}</strong>
                    <span>{entry.sectionTitle}</span>
                    <p>{entry.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-empty" role="status" aria-live="polite">
              <strong>검색 결과가 없습니다.</strong>
              <p>SSOT, PRD, roadmap, auth, websocket 같은 키워드로 다시 시도해 보세요.</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
