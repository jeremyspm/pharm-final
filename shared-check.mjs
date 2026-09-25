/* The Paper Sim pipeline is ONE set of files copied into every META-driven sim. A sim is
   template + bank + sim.config.mjs + content/; the files below must be byte-identical
   everywhere, so a fix lands once and is copied, never re-typed (estate rule: port, don't
   re-implement — enforced by a diff, not by good intentions).
   Run from any sim: `node shared-check.mjs`. It compares this repo against every sibling
   directory that has a sim.config.mjs and exits 1 on the first difference. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SHARED = ['template.html', 'build.mjs', 'stem-html.mjs', 'bind-images.mjs', 'resplice.mjs',
  'shared-check.mjs', 'shorts.mjs', 'content/explain.mjs'];

const HERE = path.dirname(fileURLToPath(import.meta.url));
const parent = path.dirname(HERE);
const sims = fs.readdirSync(parent, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== path.basename(HERE) && fs.existsSync(path.join(parent, d.name, 'sim.config.mjs')))
  .map(d => d.name);
let bad = 0;
for (const sim of sims) for (const f of SHARED) {
  const a = path.join(HERE, f), b = path.join(parent, sim, f);
  if (!fs.existsSync(b)) { console.log(`MISSING  ${sim}/${f}`); bad++; continue; }
  if (!fs.readFileSync(a).equals(fs.readFileSync(b))) { console.log(`DIFFERS  ${sim}/${f}`); bad++; }
}
console.log(bad ? `${bad} shared file(s) out of step — copy the newer one across, then rebuild/resplice both`
  : `shared pipeline identical across ${path.basename(HERE)} + ${sims.join(', ') || '(no sibling sims found)'}`);
process.exit(bad ? 1 : 0);
