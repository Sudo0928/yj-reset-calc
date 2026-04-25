/**
 * MHTML 추출 도구 (일회성 · 사이트에 포함 안 됨)
 *
 * 사용법:
 *   node tools/mhtml-extract/extract.mjs
 *
 * 출력: tools/mhtml-extract/out/<파일명>/{index.html, text.md, meta.json}
 *
 * 브라우저에서 열기: Chrome으로 out/<파일명>/index.html 직접 열면 렌더링됨.
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
    .replace(/=\r?\n/g, '')                                          // soft line break 제거
    .replace(/=([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

// ─── Subject 헤더 디코딩 (=?utf-8?Q?...?=) ─────────────────────────────────
function decodeSubject(raw) {
  const collapsed = raw.replace(/\r?\n\s+/g, ' ').trim();
  return collapsed.replace(/=\?utf-8\?Q\?(.*?)\?=/gi, (_, enc) =>
    Buffer.from(decodeQP(enc.replace(/_/g, ' ')), 'latin1').toString('utf8')
  ).replace(/\s+/g, ' ').trim();
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
  // boundary 추출
  const bm = raw.match(/boundary="([^"]+)"/);
  if (!bm) throw new Error('boundary를 찾을 수 없습니다');
  const boundary = bm[1];

  // 파트 분리 (앞에 \r?\n-- 또는 파일 시작 --)
  const sep = `--${boundary}`;
  const parts = raw.split(sep).slice(1); // 첫 요소(전역 헤더 이후)부터

  let htmlRaw = '';
  const imageUrls = [];

  for (const part of parts) {
    if (part.trimStart().startsWith('--')) continue; // 마지막 --

    // 헤더/바디 분리
    const bodyStart = part.search(/\r?\n\r?\n/);
    if (bodyStart === -1) continue;
    const headers = part.slice(0, bodyStart);
    const body = part.slice(bodyStart).replace(/^\r?\n\r?\n?/, '');

    const ct = (headers.match(/Content-Type:\s*([^\r\n;]+)/i) ?? [])[1]?.trim() ?? '';
    const enc = (headers.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i) ?? [])[1]?.trim().toLowerCase() ?? '';
    const loc = (headers.match(/Content-Location:\s*([^\r\n]+)/i) ?? [])[1]?.trim() ?? '';

    if (ct.startsWith('text/html') && !htmlRaw) {
      htmlRaw = enc === 'quoted-printable' ? decodeQP(body) : body;
    } else if (ct.startsWith('image/')) {
      imageUrls.push(loc);
    }
  }

  if (!htmlRaw) throw new Error('HTML 파트를 찾을 수 없습니다');

  // latin1 → UTF-8 변환 (QP 디코딩 후 바이트가 latin1 문자열로 들어있음)
  const htmlUtf8 = Buffer.from(htmlRaw, 'latin1').toString('utf8');
  return { html: htmlUtf8, imageUrls };
}

// ─── 파일 하나 처리 ────────────────────────────────────────────────────────
function processFile(mhtmlPath, outDir) {
  // latin1 으로 읽어야 바이너리 손실 없음
  const raw = fs.readFileSync(mhtmlPath, 'latin1');

  // 글로벌 헤더에서 메타 추출
  const urlMatch = raw.match(/Snapshot-Content-Location:\s*([^\r\n]+)/);
  const subjMatch = raw.match(/Subject:\s*([\s\S]*?)(?:\r?\nDate:|$)/m);
  const dateMatch = raw.match(/Date:\s*([^\r\n]+)/);

  const url = urlMatch?.[1]?.trim() ?? '';
  const title = subjMatch?.[1] ? decodeSubject(subjMatch[1]) : path.basename(mhtmlPath, '.mhtml');
  const date = dateMatch?.[1]?.trim() ?? '';

  const { html, imageUrls } = parseMHTML(raw);
  const text = htmlToText(html);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(outDir, 'text.md'), `# ${title}\n\n원본: ${url}\n날짜: ${date}\n\n---\n\n${text}`, 'utf8');
  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify({ url, title, date, imageUrls, extractedAt: new Date().toISOString() }, null, 2),
    'utf8',
  );

  return { url, title, chars: text.length };
}

// ─── 메인 ──────────────────────────────────────────────────────────────────
if (!fs.existsSync(INFO_DIR)) {
  console.error(`오류: Information/ 폴더를 찾을 수 없습니다.\n경로: ${INFO_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(INFO_DIR).filter(f => f.endsWith('.mhtml')).sort();
console.log(`\n여고리셋 MHTML 추출 도구`);
console.log(`총 ${files.length}개 파일 → ${OUT_BASE}\n`);

let ok = 0;
for (const file of files) {
  const safeName = path.basename(file, '.mhtml')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 80);
  const outDir = path.join(OUT_BASE, safeName);
  try {
    const { title, chars } = processFile(path.join(INFO_DIR, file), outDir);
    console.log(`✓ [${chars.toLocaleString()}자] ${title}`);
    ok++;
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log(`\n완료: ${ok}/${files.length} 성공`);
console.log(`출력: ${OUT_BASE}`);
console.log('\n사용법:');
console.log('  브라우저에서 열기    → out/<폴더>/index.html 을 Chrome으로 직접 열기');
console.log('  텍스트만 보기        → out/<폴더>/text.md 확인');
console.log('  Claude에 붙여넣기    → text.md 내용을 채팅에 복사');
