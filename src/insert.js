const SVG_INLINE_LIMIT = 10000;

export async function insertDiagram(framer, { svg, name }) {
  if (typeof svg !== 'string' || !svg.trim()) throw new Error('The diagram has no SVG to insert.');
  const bytes = new TextEncoder().encode(svg);
  const label = typeof name === 'string' && name.trim() ? name.trim() : 'SVG Diagram';
  if (bytes.byteLength < SVG_INLINE_LIMIT) {
    await framer.addSVG({ svg, name: label });
    return 'svg';
  }
  await framer.addImage({ image: { type: 'bytes', bytes, mimeType: 'image/svg+xml' }, name: label });
  return 'image';
}
