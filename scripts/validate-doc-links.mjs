import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const markdownFiles = [];
const includeRoots = [
  "README.md",
  "00-index",
  "01-product",
  "02-ux",
  "03-mobile",
  "04-backend",
  "05-qa",
  "06-active-changes",
  "99-archive",
  "design-system",
];

function walk(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) return;
  const stat = fs.statSync(absolutePath);

  if (stat.isFile()) {
    if (relativePath.endsWith(".md")) markdownFiles.push(relativePath);
    return;
  }

  for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
    if (["node_modules", ".git", ".next"].includes(entry.name)) continue;
    walk(path.posix.join(relativePath, entry.name));
  }
}

for (const target of includeRoots) {
  walk(target);
}

const issues = [];
const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

for (const relativePath of markdownFiles) {
  const absolutePath = path.join(root, relativePath);
  const content = fs.readFileSync(absolutePath, "utf8");
  const baseDirectory = path.posix.dirname(relativePath);

  for (const match of content.matchAll(linkPattern)) {
    const href = match[1];
    if (!href || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("#") || href.startsWith("/docs/") || href.startsWith("/asset/")) {
      continue;
    }

    const targetPath = href.split("#", 1)[0];
    const resolved = path.posix.normalize(path.posix.join(baseDirectory, targetPath));
    const candidates = [
      path.join(root, resolved),
      path.join(root, `${resolved}.md`),
      path.join(root, resolved, "README.md"),
    ];

    if (!candidates.some((candidate) => fs.existsSync(candidate))) {
      issues.push(`${relativePath} -> ${href}`);
    }
  }
}

if (issues.length) {
  console.error("Broken markdown links detected:\n");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Validated ${markdownFiles.length} markdown files with no broken local links.`);
