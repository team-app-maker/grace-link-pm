import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import { resolveAssetPath } from "@/lib/docs";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

type RouteProps = {
  params: Promise<{ slug: string[] }> | { slug: string[] };
};

export async function GET(_request: Request, { params }: RouteProps) {
  const resolvedParams = await params;
  const relativePath = resolveAssetPath(resolvedParams.slug);

  if (!relativePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const absolutePath = path.join(/* turbopackIgnore: true */ process.cwd(), relativePath);

  try {
    const file = await fs.readFile(absolutePath);
    const extension = path.extname(absolutePath).toLowerCase();

    return new NextResponse(file, {
      headers: {
        "Content-Type": MIME_TYPES[extension] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
