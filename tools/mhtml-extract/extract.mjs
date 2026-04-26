/**
 * MHTML 추출 도구 (일회성 · 사이트에 포함 안 됨)
 *
 * 사용법:
 *   node tools/mhtml-extract/extract.mjs
 *
 * 출력: tools/mhtml-extract/out/<파일명>/
 *   - index.html  (이미지 src가 images/ 로 치환됨)
 *   - text.md     (이미지 자리에 → images/<file> 표기)
 *   - meta.json   (images: [{ id, file, contentType, sizeKB }])
 *   - images/     (PNG/JPG/GIF — base64 디코딩 결과)
 *
 * 브라우저에서 열기: Chrome으로 out/<폴더>/index.html 직접 열면 이미지 포함 렌더링.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INFO_DIR = path.resolve(__dirname, '../../Information');
const OUT_BASE = path.resolve(__dirname, 'out');

// ─── Quoted-Printable 디코딩 ───────────────────────────────────────────────
function decodeQP(str) {
  return str
    .replace(/=\r?\n/g, '')
    .replace(/=([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

// ─── Subject 헤더 디코딩 (=?utf-8?Q?...?=) ─────────────────────────────────
function decodeSubject(raw) {
  const collapsed = raw.replace(/\r?\n\s+/g, ' ').trim();
  return collapsed
    .replace(/=\?utf-8\?Q\?(.*?)\?=/gi, (_, enc) =>
      Buffer.from(decodeQP(enc.replace(/_/g, ' ')), 'latin1').toString('utf8'),
    )
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Content-Type → 확장자 ─────────────────────────────────────────────────
function extFromContentType(ct) {
  const m = ct.match(/image\/(\w+)/i);
  if (!m) return 'bin';
  const sub = m[1].toLowerCase();
  if (sub === 'jpeg') return 'jpg';
  if (sub === 'svg+xml') return 'svg';
  return sub;
}

// ─── 이미지 location → 안전 파일명 ─────────────────────────────────────────
function safeImageName(idx, location, ext) {
  const last = location.split(/[/\\]/).pop() || '';
  const cleaned = last.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-40);
  const base = cleaned ? `${idx.toString().padStart(3, '0')}_${cleaned}` : `${idx.toString().padStart(3, '0')}`;
  return /\.[a-z0-9]{2,5}$/i.test(base) ? base : `${base}.${ext}`;
}

// ─── HTML → 마크다운 텍스트 ────────────────────────────────────────────────
function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/?(html|head|body|meta|link)[^>]*>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, '\t')
    .replace(/<img[^>]*\bsrc="(images\/[^"]+)"[^>]*\balt="([^"]*)"[^>]*>/gi, '[이미지: $2 → $1]')
    .replace(/<img[^>]*\balt="([^"]*)"[^>]*\bsrc="(images\/[^"]+)"[^>]*>/gi, '[이미지: $1 → $2]')
    .replace(/<img[^>]*\bsrc="(images\/[^"]+)"[^>]*>/gi, '[이미지 → $1]')
    .replace(/<img[^>]*\balt="([^"]*)"[^>]*>/gi, '[이미지: $1]')
    .replace(/<img[^>]*>/gi, '[이미지]')
    .replace(/<a[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
      const t = text.replace(/<[^>]+>/g, '').trim();
      return t ? `${t} (${href})` : href;
    })
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── MHTML 파싱 ────────────────────────────────────────────────────────────
function parseMHTML(raw) {
  const bm = raw.match(/boundary="([^"]+)"/);
  if (!bm) throw new Error('boundary를 찾을 수 없습니다');
  const boundary = bm[1];

  const sep = `--${boundary}`;
  const parts = raw.split(sep).slice(1);

  let htmlRaw = '';
  /** @type {{ location: string, contentId: string, contentType: string, buffer: Buffer }[]} */
  const images = [];

  for (const part of parts) {
    if (part.trimStart().startsWith('--')) continue;

    const bodyStart = part.search(/\r?\n\r?\n/);
    if (bodyStart === -1) continue;
    const headers = part.slice(0, bodyStart);
    const body = part.slice(bodyStart).replace(/^\r?\n\r?\n?/, '');

    const ct = (headers.match(/Content-Type:\s*([^\r\n;]+)/i) ?? [])[1]?.trim() ?? '';
    const enc = (headers.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i) ?? [])[1]?.trim().toLowerCase() ?? '';
    const loc = (headers.match(/Content-Location:\s*([^\r\n]+)/i) ?? [])[1]?.trim() ?? '';
    const cid = (headers.match(/Content-ID:\s*<?([^>\r\n]+)>?/i) ?? [])[1]?.trim() ?? '';

    if (ct.startsWith('text/html') && !htmlRaw) {
      htmlRaw = enc === 'quoted-printable' ? decodeQP(body) : body;
    } else if (ct.startsWith('image/')) {
      // body는 base64 (latin1로 읽혔으므로 줄바꿈 제거 후 디코딩)
      const b64 = body.replace(/[\r\n]/g, '').trim();
      let buffer;
      try {
        buffer = Buffer.from(b64, 'base64');
      } catch {
        continue;
      }
      if (buffer.length === 0) continue;
      images.push({ location: loc, contentId: cid, contentType: ct, buffer });
    }
  }

  if (!htmlRaw) throw new Error('HTML 파트를 찾을 수 없습니다');

  const htmlUtf8 = Buffer.from(htmlRaw, 'latin1').toString('utf8');
  return { html: htmlUtf8, images };
}

// ─── HTML 안의 이미지 src를 로컬 경로로 치환 ──────────────────────────────
function rewriteImageSrcs(html, imageMap) {
  return html.replace(/\b(src|data-src)="([^"]+)"/gi, (full, attr, url) => {
    const local = imageMap.get(url) || imageMap.get(`cid:${url}`);
    if (local) return `${attr}="images/${local}"`;
    return full;
  });
}

// ─── 파일 하나 처리 ────────────────────────────────────────────────────────
function processFile(mhtmlPath, outDir) {
  const raw = fs.readFileSync(mhtmlPath, 'latin1');

  const urlMatch = raw.match(/Snapshot-Content-Location:\s*([^\r\n]+)/);
  const subjMatch = raw.match(/Subject:\s*([\s\S]*?)(?:\r?\nDate:|$)/m);
  const dateMatch = raw.match(/Date:\s*([^\r\n]+)/);

  const url = urlMatch?.[1]?.trim() ?? '';
  const title = subjMatch?.[1] ? decodeSubject(subjMatch[1]) : path.basename(mhtmlPath, '.mhtml');
  const date = dateMatch?.[1]?.trim() ?? '';

  const { html: htmlRaw, images } = parseMHTML(raw);

  // 이미지 저장 + 매핑
  const imagesDir = path.join(outDir, 'images');
  fs.mkdirSync(imagesDir, { recursive: true });

  /** @type {Map<string, string>} location/cid → fileName */
  const imageMap = new Map();
  /** @type {{ id: number, file: string, contentType: string, sizeKB: number, location: string }[]} */
  const imageManifest = [];

  images.forEach((img, idx) => {
    const ext = extFromContentType(img.contentType);
    const fileName = safeImageName(idx + 1, img.location || img.contentId || `img${idx + 1}`, ext);
    fs.writeFileSync(path.join(imagesDir, fileName), img.buffer);
    if (img.location) imageMap.set(img.location, fileName);
    if (img.contentId) {
      imageMap.set(img.contentId, fileName);
      imageMap.set(`cid:${img.contentId}`, fileName);
    }
    imageManifest.push({
      id: idx + 1,
      file: fileName,
      contentType: img.contentType,
      sizeKB: Math.round(img.buffer.length / 1024),
      location: img.location,
    });
  });

  // 빈 디렉토리 정리
  if (imageManifest.length === 0) {
    try { fs.rmdirSync(imagesDir); } catch { /* ignore */ }
  }

  // HTML 안의 src 치환
  const htmlRewritten = rewriteImageSrcs(htmlRaw, imageMap);

  // 텍스트 변환
  const text = htmlToText(htmlRewritten);

  fs.writeFileSync(path.join(outDir, 'index.html'), htmlRewritten, 'utf8');
  fs.writeFileSync(
    path.join(outDir, 'text.md'),
    `# ${title}\n\n원본: ${url}\n날짜: ${date}\n\n---\n\n${text}`,
    'utf8',
  );
  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify({
      url, title, date,
      images: imageManifest,
      extractedAt: new Date().toISOString(),
    }, null, 2),
    'utf8',
  );

  return { url, title, chars: text.length, imageCount: imageManifest.length };
}

// ─── 메인 ──────────────────────────────────────────────────────────────────
if (!fs.existsSync(INFO_DIR)) {
  console.error(`오류: Information/ 폴더를 찾을 수 없습니다.\n경로: ${INFO_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(INFO_DIR).filter((f) => f.endsWith('.mhtml')).sort();
console.log(`\n여고리셋 MHTML 추출 도구`);
console.log(`총 ${files.length}개 파일 → ${OUT_BASE}\n`);

let ok = 0;
let totalImages = 0;
for (const file of files) {
  const safeName = path.basename(file, '.mhtml')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 80);
  const outDir = path.join(OUT_BASE, safeName);
  try {
    const { title, chars, imageCount } = processFile(path.join(INFO_DIR, file), outDir);
    console.log(`✓ [${chars.toLocaleString()}자, 이미지 ${imageCount}개] ${title}`);
    ok++;
    totalImages += imageCount;
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log(`\n완료: ${ok}/${files.length} 성공 · 총 이미지 ${totalImages}개`);
console.log(`출력: ${OUT_BASE}`);
