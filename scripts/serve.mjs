/**
 * Vercel と同じ「素の静的配信」でローカル確認するための最小サーバ。
 * hyperframes present は Node サーバなので、デプロイ後の挙動は再現できない。
 * 本番前の確認はこちらで行う。
 *
 *   node scripts/serve.mjs [port]
 */
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.argv[2] ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

function resolveFile(urlPath) {
  // ".." による ROOT 外への脱出を防ぐ
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  let target = join(ROOT, clean);
  if (!target.startsWith(ROOT)) return null;

  try {
    if (statSync(target).isDirectory()) target = join(target, "index.html");
  } catch {
    return null;
  }
  try {
    statSync(target);
  } catch {
    return null;
  }
  return target;
}

createServer((req, res) => {
  const file = resolveFile(req.url ?? "/");
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404");
    console.log(`404 ${req.url}`);
    return;
  }
  res.writeHead(200, {
    "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`static server (Vercel 相当)  http://localhost:${PORT}`);
});
