const SVG_INLINE_LIMIT = 10000;

export async function insertDiagram(framer, { svg, name }) {
  if (typeof svg !== 'string' || !svg.trim()) throw new Error('The diagram has no SVG to insert.');
  const bytes = new TextEncoder().encode(svg);
  const label = typeof name === 'string' && name.trim() ? name.trim() : 'SVG Diagram';
  const method = bytes.byteLength < SVG_INLINE_LIMIT ? 'addSVG' : 'addImage';
  if (!framer.isAllowedTo(method)) throw new Error('You need edit access to insert a diagram into this Framer project.');
  if (method === 'addSVG') {
    await framer.addSVG({ svg, name: label });
    return 'svg';
  }
  await framer.addImage({ image: { type: 'bytes', bytes, mimeType: 'image/svg+xml' }, name: label });
  return 'image';
}
