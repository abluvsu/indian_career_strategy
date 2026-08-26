import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = process.cwd();
const rootDocuments = [
  "README.md",
  "AGENTS.md",
  "ANTIGRAVITY.md",
  "CLAUDE.md",
  "CODEX.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
];

function markdownFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
  });
}

const files = [
  ...rootDocuments.map((file) => join(root, file)),
  ...markdownFiles(join(root, "docs")),
  ...markdownFiles(join(root, "integrations")),
].filter(existsSync);

const failures = [];
const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;

for (const file of files) {
  const content = readFileSync(file, "utf8");
  for (const match of content.matchAll(linkPattern)) {
    const destination = match[1].trim().replace(/^<|>$/g, "");
    if (/^(https?:|mailto:|#)/i.test(destination)) continue;
    const localPath = decodeURIComponent(destination.split("#")[0]);
    if (!localPath) continue;
    const target = resolve(dirname(file), localPath);
    if (!existsSync(target)) failures.push(`${file}: ${destination}`);
  }
}

if (failures.length > 0) {
  console.error("Broken local documentation links:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Documentation links verified across ${files.length} files.`);
}
