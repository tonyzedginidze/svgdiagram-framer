import { test } from 'node:test';
import assert from 'node:assert/strict';
import { insertDiagram } from '../src/insert.js';

test('small SVGs are inserted directly', async () => {
  const calls = [];
  const framer = { addSVG: async value => calls.push(value), addImage: async () => { throw new Error('wrong insertion path'); } };
  assert.equal(await insertDiagram(framer, { svg: '<svg></svg>', name: 'Example' }), 'svg');
  assert.deepEqual(calls, [{ svg: '<svg></svg>', name: 'Example' }]);
});

test('SVGs at the conservative byte limit use the image asset path', async () => {
  let request;
  const framer = { addSVG: async () => { throw new Error('wrong insertion path'); }, addImage: async value => { request = value; } };
  const svg = 'é'.repeat(5000);
  assert.equal(await insertDiagram(framer, { svg, name: '' }), 'image');
  assert.equal(request.name, 'SVG Diagram');
  assert.equal(request.image.mimeType, 'image/svg+xml');
  assert.equal(request.image.bytes.byteLength, 10000);
  assert.equal(new TextDecoder().decode(request.image.bytes), svg);
});

test('empty input and Framer failures remain visible', async () => {
  await assert.rejects(insertDiagram({}, { svg: '', name: 'x' }), /no SVG/);
  await assert.rejects(insertDiagram({ addSVG: async () => { throw new Error('Insertion denied'); } }, { svg: '<svg/>' }), /Insertion denied/);
});
