import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { getSearchEntries } from "@/lib/docs";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GraceLink PM",
  description:
    "GraceLink planning, SSOT, UX, backend contract, QA, and active change documents in a maintainable Next.js knowledge hub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchEntries = getSearchEntries();

  return (
    <html lang="ko">
      <body className={inter.className}>
        <a className="skip-link" href="#main-content">
          본문으로 바로가기
        </a>
        <SiteHeader searchEntries={searchEntries} />
        {children}
      </body>
    </html>
  );
}
