/* Walk each HS2CAP capture; for the i-th display_question block emit the image
   FILE NAMES it should carry — canvas-hosted files via images/manifest.json,
   external images via images/ext-manifest.json (fetched directly; one dead
   domain is unrecoverable and its question stays held). */
import fs from 'node:fs';
import path from 'node:path';
import { writeDataImg } from './stem-html.mjs';
import { fileURLToPath } from 'node:url';
import { PATHS } from './sim.config.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const CAP = path.resolve(HERE, PATHS.cap);
/* a full-page-save capture inlines every figure as a data: URI, so it has no manifests */
const readJSON = (p, d) => fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : d;
const manifest = readJSON(path.join(CAP, 'images/manifest.json'), {});
const ext = readJSON(path.join(CAP, 'images/ext-manifest.json'), {});
fs.mkdirSync(path.join(CAP, 'images'), { recursive: true });
const out = {};
for (const f of fs.readdirSync(CAP).filter(x => /^\w*CAP-.*\.html$/.test(x))) {
  const html = fs.readFileSync(path.join(CAP, f), 'utf8');
  const re = /<div[^>]*class="[^"]*\bdisplay_question\b[^"]*"[^>]*>/g;
  const starts = []; let m;
  while ((m = re.exec(html))) starts.push(m.index);
  const per = {};
  starts.forEach((s, i) => {
    const seg = html.slice(s, i + 1 < starts.length ? starts[i + 1] : html.length);
    const names = new Set();
    /* SingleFile leaves an attribute unquoted whenever its value allows it — a base64
       data: URI with no "=" padding qualifies — so src is read quoted OR bare */
    for (const im of seg.matchAll(/<img[^>]*?\ssrc=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/g)) {
      const u = im[1] ?? im[2] ?? im[3];
      if (u.startsWith('data:image/')) {          // full-page save inlined the figure
        const file = writeDataImg(u, path.join(CAP, 'images'));
        if (file) names.add(file);
      } else if (/canvas\.manukau/.test(u)) {
        const id = (u.match(/files\/(\d+)/) || [])[1];
        if (id && manifest[id]) names.add(manifest[id]);
      } else if (ext[u]) names.add(ext[u]);
    }
    if (names.size) per[i] = [...names];
  });
  if (Object.keys(per).length) out[f] = per;
}
fs.writeFileSync('images.json', JSON.stringify(out, null, 1));
const n = Object.values(out).reduce((s, p) => s + Object.keys(p).length, 0);
console.log('files:', Object.keys(out).length, 'questions with images:', n);
