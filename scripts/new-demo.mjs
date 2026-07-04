#!/usr/bin/env node
/**
 * Generate a personalised prospect demo from an existing demo template.
 *
 * Usage:
 *   node scripts/new-demo.mjs <base-slug> <new-slug> "Nama Bisnes" [whatsapp]
 *
 * Contoh:
 *   node scripts/new-demo.mjs restoran-tomyam tomyam-pakcik-man "Tom Yam Pak Cik Man" 60123456789
 *
 * Output: public/demos/leads/<new-slug>.html
 *   - Nama bisnes lama diganti dengan nama prospek.
 *   - Nombor WhatsApp diganti (kalau diberi) supaya butang WA demo mesej prospek sendiri.
 *   - Folder leads/ di-disallow dalam robots.txt (bukan untuk Google, untuk pitching sahaja).
 *
 * Lepas jana beberapa demo, commit + push untuk deploy, kemudian share link:
 *   https://adamsofi.com/demos/leads/<new-slug>.html
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [base, slug, name, phone] = process.argv.slice(2);

if (!base || !slug || !name) {
  console.error('Usage: node scripts/new-demo.mjs <base-slug> <new-slug> "Nama Bisnes" [whatsapp]');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error("new-slug mesti lowercase, nombor dan '-' sahaja.");
  process.exit(1);
}

const basePath = join(root, "public/demos", `${base}.html`);
if (!existsSync(basePath)) {
  console.error(`Template tidak dijumpai: public/demos/${base}.html`);
  process.exit(1);
}

// base slug -> business name, dibaca terus dari lib/demos.ts
const demosTs = readFileSync(join(root, "lib/demos.ts"), "utf8");
const m = demosTs.match(new RegExp(`slug:\\s*"${base}",\\s*name:\\s*"([^"]+)"`));
if (!m) {
  console.error(`Slug "${base}" tiada dalam lib/demos.ts.`);
  process.exit(1);
}
const baseName = m[1];

let html = readFileSync(basePath, "utf8");
const hits = html.split(baseName).length - 1;
html = html.replaceAll(baseName, name);
if (phone) html = html.replaceAll("60182399476", phone.replace(/\D/g, ""));

const outDir = join(root, "public/demos/leads");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `${slug}.html`);
writeFileSync(outPath, html);

console.log(`✅ ${outPath}`);
console.log(`   Nama diganti ${hits}x: "${baseName}" -> "${name}"`);
if (phone) console.log(`   WhatsApp -> ${phone.replace(/\D/g, "")}`);
console.log(`   Link selepas deploy: https://adamsofi.com/demos/leads/${slug}.html`);
