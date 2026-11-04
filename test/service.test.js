import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installationId, service } from '../src/service.js';

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('one installation keeps the same random ID', () => {
  const data = storage();
  const id = installationId(data);
  assert.match(id, /^[0-9a-f-]{36}$/);
  assert.equal(installationId(data), id);
  assert.notEqual(installationId(storage()), id);
});

test('generation sends the installation, prompt and action and surfaces errors', async () => {
  const previous = globalThis.localStorage;
  globalThis.localStorage = storage();
  try {
    let sent;
    const reply = await service('generations', { actionId: 'a', prompt: 'A to B' }, async (url, options) => {
      sent = { url, options };
      return { ok: true, json: async () => ({ svg: '<svg/>', remaining: 9 }) };
    });
    assert.equal(reply.remaining, 9);
    assert.match(sent.url, /\/framer\/generations$/);
    assert.deepEqual({ ...JSON.parse(sent.options.body), installationId: 'ID' }, { installationId: 'ID', actionId: 'a', prompt: 'A to B' });
    await assert.rejects(service('quota', {}, async () => ({ ok: false, status: 402, json: async () => ({ error: 'Used allowance', code: 'framer_trial_exhausted' }) })), { message: 'Used allowance', code: 'framer_trial_exhausted' });
    await assert.rejects(service('quota', {}, async () => { throw new Error('offline'); }), /unreachable/);
  } finally { if (previous === undefined) delete globalThis.localStorage; else globalThis.localStorage = previous; }
});
