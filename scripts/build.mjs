/**
 * decks.json から静的サイトを組み立てる。
 *
 *  - 各デッキのラッパー  → decks/<id>/index.html
 *  - トップの一覧        → index.html の <!-- decks:start --> … <!-- decks:end -->
 *
 * スライド定義（島）とシーンの尺はコンポジション側が唯一の正で、ここでは読むだけ。
 * <hyperframes-slideshow> は自分の innerHTML から島を読むため複製が要るが、
 * 手で二重管理するとほぼ確実にズレるので生成に寄せている。
 *
 * トップに出すタイムライン図も同じソースから引くので、
 * 構成を変えれば図も勝手に追従する。
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

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? null;

/** コンポジションから島とシーンの時間割を取り出す */
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

  let manifest;
  try {
    manifest = JSON.parse(m[1].trim());
  } catch (e) {
    fail(`island in ${filePath} is not valid JSON — ${e.message}`);
  }
  if (!manifest.slides?.length) fail(`island in ${filePath} declares no slides`);

  // シーン要素をすべて拾う（ルートは尺の器なので除く）
  const scenes = new Map();
  let root = null;
  for (const tag of html.match(/<div\b[^>]*data-composition-id="[^"]*"[^>]*>/g) ?? []) {
    const id = attr(tag, "data-composition-id");
    const start = Number(attr(tag, "data-start"));
    const duration = Number(attr(tag, "data-duration"));
    if (!id || !Number.isFinite(start) || !Number.isFinite(duration)) continue;
    if (id === "root") {
      root = { start, duration };
      continue;
    }
    scenes.set(id, { id, start, duration, label: attr(tag, "data-label") ?? id });
  }
  if (!scenes.size) fail(`no scenes found in ${filePath}`);

  const need = (sceneId) => {
    const s = scenes.get(sceneId);
    if (!s) fail(`island references sceneId "${sceneId}" but no such scene exists in ${filePath}`);
    return s;
  };

  const main = manifest.slides.map((slide, i) => {
    const scene = need(slide.sceneId);
    const fragments = slide.fragments ?? [];
    return {
      ...scene,
      index: i,
      number: String(i + 1).padStart(2, "0"),
      // 段階表示はシーン内の相対位置（%）に直しておく
      ticks: fragments.map((t) =>
        Math.min(97, Math.max(3, ((t - scene.start) / scene.duration) * 100)),
      ),
      hotspots: slide.hotspots ?? [],
    };
  });

  const sequences = (manifest.slideSequences ?? []).map((seq) => ({
    id: seq.id,
    label: seq.label ?? seq.id,
    slides: (seq.slides ?? []).map((s) => need(s.sceneId)),
    // どの本線スライドから分岐するか
    parentIndex: main.findIndex((s) => s.hotspots.some((h) => h.target === seq.id)),
  }));

  return {
    island: m[1].trim(),
    main,
    sequences,
    fragments: main.reduce((n, s) => n + s.ticks.length, 0),
    branchSlides: sequences.reduce((n, q) => n + q.slides.length, 0),
    seconds: root?.duration ?? main.reduce((n, s) => n + s.duration, 0),
  };
}

function buildDeck(deck, template) {
  const comp = readComposition(deck.composition);
  const html = template
    .replaceAll("{{TITLE}}", escapeHtml(deck.title))
    .replaceAll("{{DESCRIPTION}}", escapeHtml(deck.description))
    .replaceAll("{{COMPOSITION}}", deck.composition)
    .replace("{{ISLAND}}", comp.island);

  const outDir = join(ROOT, "decks", deck.id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  return comp;
}

/** デッキの実際の構成を、尺に比例した帯として描く */
function timeline(comp) {
  const segs = comp.main
    .map((s) => {
      const ticks = s.ticks
        .map((p) => `<i class="tick" style="left:${p.toFixed(1)}%"></i>`)
        .join("");
      const branch = comp.sequences.some((q) => q.parentIndex === s.index)
        ? '<i class="fork" aria-hidden="true"></i>'
        : "";
      return (
        `<span class="seg" style="flex:${s.duration}" title="${escapeHtml(s.label)}">` +
        `<b>${s.number}</b>${ticks}${branch}</span>`
      );
    })
    .join("");

  // 分岐は本線の該当スロットの真下に置く（ズレないよう本線と同じ列数で組む）
  const withBranch = comp.sequences.filter((q) => q.parentIndex >= 0);
  const under = withBranch.length
    ? `<div class="track sub" aria-hidden="true">` +
      comp.main
        .map((s) => {
          const q = withBranch.find((x) => x.parentIndex === s.index);
          return q
            ? `<span class="slot" style="flex:${s.duration}"><span class="bseg">↳ ${q.slides.length}</span></span>`
            : `<span class="slot" style="flex:${s.duration}"></span>`;
        })
        .join("") +
      `</div>`
    : "";

  const label =
    `${comp.main.length} スライド` +
    (comp.branchSlides ? `、分岐 ${comp.branchSlides} 枚` : "") +
    `のタイムライン`;

  return (
    `<div class="timeline" role="img" aria-label="${escapeHtml(label)}">` +
    `<div class="track">${segs}</div>${under}</div>`
  );
}

/** 動画プロジェクトの STORYBOARD.md から尺とフレーム数を読む */
function readVideoProject(projectPath) {
  const p = projectPath.replace(/^\//, "").replace(/\/$/, "");
  let md;
  try {
    md = read(join(p, "STORYBOARD.md"));
  } catch {
    fail(`video project storyboard not found: ${p}/STORYBOARD.md`);
  }
  const frames = (md.match(/^##\s+Frame\s+\d+/gm) ?? []).length;
  const seconds = [...md.matchAll(/^-\s*duration:\s*([\d.]+)s/gm)].reduce(
    (n, m) => n + Number(m[1]),
    0,
  );
  const silent = /^music:\s*none\s*$/m.test(md);
  return { frames, seconds, silent };
}

function buildVideo(video, template) {
  const meta = readVideoProject(video.project);
  const stats = [
    [`${meta.frames}`, "シーン"],
    [`${Math.round(meta.seconds)}s`, "尺"],
    ["1920×1080", "解像度"],
    [meta.silent ? "なし" : "あり", "音声"],
  ]
    .map(([v, k]) => `<div><dt>${k}</dt><dd>${escapeHtml(v)}</dd></div>`)
    .join("");

  const html = template
    .replaceAll("{{TITLE}}", escapeHtml(video.title))
    .replaceAll("{{SUBTITLE}}", escapeHtml(video.subtitle ?? ""))
    .replaceAll("{{DESCRIPTION}}", escapeHtml(video.description))
    .replaceAll("{{ACCENT}}", video.accent ?? "#cc785c")
    .replaceAll("{{SRC}}", video.src)
    .replaceAll("{{POSTER}}", video.poster ?? "")
    .replaceAll("{{NOTE}}", escapeHtml(video.note ?? ""))
    .replace("{{STATS}}", stats);

  const outDir = join(ROOT, "watch", video.id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  return meta;
}

function videoRow(video, meta, i) {
  const bits = [`${meta.frames} シーン`, `${Math.round(meta.seconds)}s`, "MP4"];
  if (meta.silent) bits.push("無音");

  const tags = (video.tags ?? [])
    .map((t) => `            <li>${escapeHtml(t)}</li>`)
    .join("\n");

  return `        <li class="row" style="--accent:${video.accent ?? "#cc785c"}">
          <a class="row-link" href="/watch/${video.id}/">
            <span class="row-num">${String(i + 1).padStart(2, "0")}</span>
            <span class="row-body">
              <span class="row-kicker">${escapeHtml(video.subtitle ?? "")}</span>
              <h2 class="row-title">${escapeHtml(video.title)}</h2>
              <p class="row-desc">${escapeHtml(video.description)}</p>
              <ul class="tags">
${tags}
              </ul>
              <dl class="row-stats"><div><dt>形式</dt><dd>${escapeHtml(bits.join(" · "))}</dd></div></dl>
              <span class="row-cta">再生<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7"/></svg></span>
            </span>
          </a>
        </li>`;
}

function row(deck, comp, i) {
  const stats = [
    [`${comp.main.length}`, "スライド"],
    [`${comp.fragments}`, "段階表示"],
    [`${comp.branchSlides || "—"}`, "分岐"],
    [`${Math.round(comp.seconds)}s`, "尺"],
  ]
    .map(([v, k]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("");

  return `        <li class="row" style="--accent:${deck.accent ?? "#4fd6c0"}">
          <a class="row-link" href="/decks/${deck.id}/">
            <span class="row-num">${String(i + 1).padStart(2, "0")}</span>
            <span class="row-body">
              <span class="row-kicker">${escapeHtml(deck.subtitle ?? "")}</span>
              <h2 class="row-title">${escapeHtml(deck.title)}</h2>
              <p class="row-desc">${escapeHtml(deck.description)}</p>
              ${timeline(comp)}
              <dl class="row-stats">${stats}</dl>
              <span class="row-cta">開く<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7"/></svg></span>
            </span>
          </a>
        </li>`;
}

// ---- run ----

const config = JSON.parse(read("decks.json"));
const template = read("scripts/deck-template.html");
const decks = config.decks ?? [];
if (!decks.length) fail("decks.json declares no decks");

const seen = new Set();
const rows = [];

decks.forEach((deck, i) => {
  if (!deck.id) fail("a deck entry is missing `id`");
  if (seen.has(deck.id)) fail(`duplicate deck id: ${deck.id}`);
  seen.add(deck.id);

  const comp = buildDeck(deck, template);
  rows.push(row(deck, comp, i));
  console.log(
    `  decks/${deck.id}/index.html  ← ${deck.composition}  ` +
      `(${comp.main.length} slides, ${comp.fragments} fragments, ${comp.branchSlides} branch, ${comp.seconds}s)`,
  );
});

const videos = config.videos ?? [];
const videoRows = [];

if (videos.length) {
  const videoTemplate = read("scripts/video-template.html");
  videos.forEach((video, i) => {
    if (!video.id) fail("a video entry is missing `id`");
    if (seen.has(video.id)) fail(`duplicate entry id: ${video.id}`);
    seen.add(video.id);

    const meta = buildVideo(video, videoTemplate);
    videoRows.push(videoRow(video, meta, i));
    console.log(
      `  watch/${video.id}/index.html   ← ${video.project}  ` +
        `(${meta.frames} scenes, ${meta.seconds}s, ${meta.silent ? "silent" : "with audio"})`,
    );
  });
}

const hubPath = join(ROOT, "index.html");
let hub = readFileSync(hubPath, "utf8");

function inject(html, name, body) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  if (!html.includes(start) || !html.includes(end)) {
    fail(`index.html is missing the ${name}:start / ${name}:end markers`);
  }
  return html.replace(
    new RegExp(`${start}[\\s\\S]*?${end}`),
    `${start}\n${body}\n        ${end}`,
  );
}

hub = inject(hub, "decks", rows.join("\n"));
hub = inject(hub, "videos", videoRows.join("\n"));
writeFileSync(hubPath, hub);
console.log(`  index.html                   ← ${decks.length} deck(s), ${videos.length} video(s)`);
