import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env");
const outDir = path.join(root, "public", "products");
const candidatesDir = path.join(outDir, "candidates");
const reportPath = path.join(root, "figma-assets-report.json");

const productSlugs = [
  "honor-x8a",
  "iphone-14-128gb",
  "iphone-15-pro",
  "samsung-galaxy-s24",
  "macbook-air-m3",
  "asus-zenbook-14",
  "ipad-air",
  "sony-wh1000xm5",
  "apple-watch-series-9",
  "jbl-charge-5"
];

async function readEnv() {
  const raw = await fs.readFile(envPath, "utf8");
  const env = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }

  return env;
}

async function figmaGet(url, token) {
  const response = await fetch(url, {
    headers: {
      "X-Figma-Token": token
    }
  });

  if (!response.ok) {
    throw new Error(`Figma API ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

function hasImageFill(node) {
  return Array.isArray(node.fills) && node.fills.some((fill) => fill?.type === "IMAGE");
}

function sizeOf(node) {
  const box = node.absoluteBoundingBox;
  if (!box) return { width: 0, height: 0 };
  return { width: Math.round(box.width), height: Math.round(box.height) };
}

function walk(node, parents = [], result = []) {
  const pathParts = [...parents, node.name].filter(Boolean);
  const name = node.name ?? "";
  const pathText = pathParts.join(" / ");
  const size = sizeOf(node);
  const looksUseful =
    hasImageFill(node) ||
    /(^|\s)(img|image|photo|product|card product|card)(\s|$)/i.test(name) ||
    /img|photo|card product|смартфон|iphone|honor|samsung|macbook|sony|jbl|watch|ipad/i.test(pathText);

  if (node.id && looksUseful && size.width >= 20 && size.height >= 20) {
    result.push({
      id: node.id,
      name,
      path: pathText,
      type: node.type,
      width: size.width,
      height: size.height,
      hasImageFill: hasImageFill(node)
    });
  }

  for (const child of node.children ?? []) {
    walk(child, pathParts, result);
  }

  return result;
}

function pickCandidates(candidates) {
  const imageFills = candidates
    .filter((item) => item.hasImageFill)
    .sort((a, b) => b.width * b.height - a.width * a.height);

  const likelyProducts = imageFills.filter((item) =>
    /iphone|honor|samsung|macbook|asus|ipad|sony|jbl|watch|смартфон|ноутбук|планшет|науш/i.test(item.path)
  );

  const picked = [];
  const source = likelyProducts.length ? likelyProducts : imageFills;

  for (const item of source) {
    if (picked.length >= productSlugs.length) break;
    const tooSimilar = picked.some((pickedItem) => pickedItem.id === item.id || pickedItem.path === item.path);
    if (!tooSimilar) picked.push(item);
  }

  return picked;
}

async function download(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download ${response.status}: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(filePath, bytes);
}

async function main() {
  const env = await readEnv();
  const token = env.FIGMA_TOKEN;
  const key = env.FIGMA_FILE_KEY ?? "bqFcYDmyrUBalope3fbKLV";

  if (!token) throw new Error("FIGMA_TOKEN is missing in .env");

  await fs.mkdir(outDir, { recursive: true });

  const file = await figmaGet(`https://api.figma.com/v1/files/${key}`, token);
  const candidates = walk(file.document).sort((a, b) => b.width * b.height - a.width * a.height);
  const picked = pickCandidates(candidates);

  const report = {
    file: file.name,
    totalCandidates: candidates.length,
    picked,
    candidates,
    firstCandidates: candidates.slice(0, 80)
  };

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`Found ${candidates.length} candidates. Picked ${picked.length}.`);
  console.log(`Report: ${reportPath}`);

  const candidateExports = candidates
    .filter((item) =>
      item.hasImageFill &&
      /десктоп каталог с товарами вид плитка|десктоп главная.*stocks|Каталог с товарами|card product \/ photo|product \/ foto/i.test(item.path)
    )
    .slice(0, 24);

  if (candidateExports.length) {
    await fs.mkdir(candidatesDir, { recursive: true });
    const candidateIds = candidateExports.map((item) => item.id).join(",");
    const candidateImages = await figmaGet(
      `https://api.figma.com/v1/images/${key}?ids=${encodeURIComponent(candidateIds)}&format=png&scale=4`,
      token
    );

    for (let index = 0; index < candidateExports.length; index += 1) {
      const node = candidateExports[index];
      const imageUrl = candidateImages.images?.[node.id];
      if (!imageUrl) continue;
      await download(imageUrl, path.join(candidatesDir, `candidate-${String(index).padStart(2, "0")}.png`));
    }

    console.log(`Candidate exports: ${candidatesDir}`);
  }

  if (!picked.length) return;

  const ids = picked.map((item) => item.id).join(",");
  const images = await figmaGet(
    `https://api.figma.com/v1/images/${key}?ids=${encodeURIComponent(ids)}&format=png&scale=3`,
    token
  );

  for (let index = 0; index < picked.length; index += 1) {
    const node = picked[index];
    const imageUrl = images.images?.[node.id];
    if (!imageUrl) continue;

    const slug = productSlugs[index] ?? `figma-product-${index + 1}`;
    const filePath = path.join(outDir, `${slug}.png`);
    await download(imageUrl, filePath);
    console.log(`${slug}.png <- ${node.path}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
