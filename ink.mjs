/* The ink engine, PORTED from Giga (gigastudyapp lib/ink-path.js — the engine behind its sketch blocks and
   whiteboard), for the Chart Sim's handwriting. The two functions below are Giga's, byte for byte, except that
   `getStroke` is not imported: it comes from the vendored perfect-freehand 1.2.3 build (vendor/), inlined ahead
   of this file. build-chart.mjs checks both functions against ../gigastudyapp/lib/ink-path.js whenever that
   repo is checked out beside this one (port, don't re-implement). */

// Turn a perfect-freehand outline (array of [x,y] points) into a filled SVG
// path. From the perfect-freehand README (it is NOT a package export). Returns
// '' for a degenerate stroke so callers render nothing.
export function inkPathFromOutline(outline) {
  if (!outline || outline.length < 2) return '';
  const d = outline.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...outline[0], 'Q'],
  );
  d.push('Z');
  return d.join(' ');
}

// Build the filled SVG path for ONE stored sketch stroke (the inline drawing
// block in course notes). Shared so the editor (SketchNodeView) and the canvas
// node preview (MindMapNode) render identical ink. Points are [x,y,p] in the
// sketch's virtual coordinate space; highlighter is flat (thinning:0), pen
// tapers by velocity/pressure (simulate when drawn with a mouse). Returns '' for
// a degenerate stroke.
export function sketchStrokePath(stroke) {
  const pts = stroke?.pts;
  if (!Array.isArray(pts) || pts.length < 2) return '';
  const outline = getStroke(pts, {
    size: stroke.size || 6,
    thinning: stroke.tool === 'highlighter' ? 0 : 0.6,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: !!stroke.simulate,
    last: true,
  });
  return inkPathFromOutline(outline);
}

/* ── Chart Sim additions (not in Giga) ── */

/* Giga's pressure rule (SketchNodeView toV): a real pen pressure is used; 0 and the 0.5 that a mouse reports
   become the neutral 0.5, and the stroke is marked `simulate` so width follows velocity instead. */
export const inkPressure = e => (e.pressure > 0 && e.pressure !== 0.5 ? e.pressure : 0.5);

/* Which cell a stroke was written in: the cell holding most of its points (a stroke that strays over a line
   still belongs to the box it was mostly in). rects: [{id, x, y, w, h}] in the page's own coordinates.
   Returns the id, or null when no cell holds at least a third of the points. */
export function strokeCell(stroke, rects) {
  const pts = stroke.pts || [];
  if (!pts.length) return null;
  let best = null, bestN = 0;
  for (const r of rects) {
    let n = 0;
    for (const [x, y] of pts) if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) n++;
    if (n > bestN) { bestN = n; best = r.id; }
  }
  return bestN >= pts.length / 3 ? best : null;
}

/* Giga's eraser (SketchNodeView eraseAt): removes WHOLE strokes that pass within r of the point. */
export function eraseStrokes(strokes, x, y, r) {
  const r2 = r * r;
  return strokes.filter(s => !(s.pts || []).some(([px, py]) => (px - x) ** 2 + (py - y) ** 2 <= r2));
}
