/**
 * decks.json から静的サイトを組み立てる。
 *
 *  - 各デッキのラッパー  → decks/<id>/index.html
 *  - ハブのカード一覧    → index.html の <!-- decks:start --> … <!-- decks:end -->
 *
 * スライド定義（島）はコンポジション側が唯一の正で、ここでは複製するだけ。
 * <hyperframes-slideshow> は自分の innerHTML から島を読むため複製が要るが、
 * 手で二重管理するとほぼ確実にズレるので、生成に寄せている。
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ISLAND_RE =
  /<script\s+type="application\/hyperframes-slideshow\+json"\s*>([\s\S]*?)<\/script>/;

const read = (p) => readFileSync(join(ROOT, p), "utf8");
const fail = (msg) => {
  console.error(`build: ${msg}`);
  process.exit(1);
};

const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

/** コンポジションから島と全体の尺を取り出す */
function readComposition(webPath) {
  const filePath = webPath.replace(/^\//, "");
  let html;
  try {
    html = read(filePath);
  } catch {
    fail(`composition not found: ${filePath}`);
  }

  const m = html.match(ISLAND_RE);
  if (!m) fail(`no slideshow island found in ${filePath}`);

  const raw = m[1].trim();
  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (e) {
    fail(`island in ${filePath} is not valid JSON — ${e.message}`);
  }

  const slides = manifest.slides ?? [];
  if (!slides.length) fail(`island in ${filePath} declares no slides`);

  const fragments = slides.reduce((n, s) => n + (s.fragments?.length ?? 0), 0);
  const sequences = manifest.slideSequences ?? [];
  const branchSlides = sequences.reduce((n, q) => n + (q.slides?.length ?? 0), 0);

  const durationMatch = html.match(
    /data-composition-id="root"[\s\S]{0,400}?data-duration="([\d.]+)"/,
  );
  const seconds = durationMatch ? Number(durationMatch[1]) : null;

  return { raw, slides: slides.length, fragments, sequences: sequences.length, branchSlides, seconds };
}

function buildDeck(deck, template) {
  const comp = readComposition(deck.composition);
  const html = template
    .replaceAll("{{TITLE}}", escapeHtml(deck.title))
    .replaceAll("{{DESCRIPTION}}", escapeHtml(deck.description))
    .replaceAll("{{COMPOSITION}}", deck.composition)
    .replace("{{ISLAND}}", comp.raw);

  const outDir = join(ROOT, "decks", deck.id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);

  return comp;
}

function card(deck, comp) {
  const meta = [`${comp.slides} スライド`];
  if (comp.fragments) meta.push(`${comp.fragments} 段階表示`);
  if (comp.branchSlides) meta.push(`分岐 ${comp.branchSlides} 枚`);

  const tags = (deck.tags ?? [])
    .map((t) => `            <li>${escapeHtml(t)}</li>`)
    .join("\n");

  return `        <a class="card" href="/decks/${deck.id}/" style="--accent: ${deck.accent ?? "#4fd6c0"}">
          <span class="card-rule" aria-hidden="true"></span>
          <p class="card-sub">${escapeHtml(deck.subtitle ?? "")}</p>
          <h2 class="card-title">${escapeHtml(deck.title)}</h2>
          <p class="card-desc">${escapeHtml(deck.description)}</p>
          <ul class="card-tags">
${tags}
          </ul>
          <p class="card-meta">${meta.map(escapeHtml).join(" · ")}</p>
          <span class="card-cta">開く <span aria-hidden="true">→</span></span>
        </a>`;
}

// ---- run ----

const config = JSON.parse(read("decks.json"));
const template = read("scripts/deck-template.html");
const decks = config.decks ?? [];
if (!decks.length) fail("decks.json declares no decks");

const seen = new Set();
const cards = [];

for (const deck of decks) {
  if (!deck.id) fail("a deck entry is missing `id`");
  if (seen.has(deck.id)) fail(`duplicate deck id: ${deck.id}`);
  seen.add(deck.id);

  const comp = buildDeck(deck, template);
  cards.push(card(deck, comp));
  console.log(
    `  decks/${deck.id}/index.html  ← ${deck.composition}  ` +
      `(${comp.slides} slides, ${comp.fragments} fragments, ${comp.branchSlides} branch)`,
  );
}

const hubPath = join(ROOT, "index.html");
const hub = readFileSync(hubPath, "utf8");
const START = "<!-- decks:start -->";
const END = "<!-- decks:end -->";
if (!hub.includes(START) || !hub.includes(END)) {
  fail("index.html is missing the decks:start / decks:end markers");
}

const next = hub.replace(
  new RegExp(`${START}[\\s\\S]*?${END}`),
  `${START}\n${cards.join("\n")}\n        ${END}`,
);
writeFileSync(hubPath, next);
console.log(`  index.html                   ← ${decks.length} deck(s)`);
