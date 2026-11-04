const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const runStartup = (adminKey) => {
  const env = { ...process.env };
  if (adminKey === undefined) delete env.ADMIN_KEY;
  else env.ADMIN_KEY = adminKey;
  return spawnSync(process.execPath, ['server.js'], {
    cwd: root,
    env,
    encoding: 'utf8'
  });
};

test('server startup reports missing ADMIN_KEY clearly', () => {
  const result = runStartup(undefined);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Startup configuration error: Required environment variable ADMIN_KEY is missing/);
  assert.doesNotMatch(result.stderr, /Error: Required environment variable ADMIN_KEY is missing/);
});

test('server startup rejects weak or whitespace-padded ADMIN_KEY values', () => {
  const weakKey = runStartup('short-key');
  assert.equal(weakKey.status, 1);
  assert.match(weakKey.stderr, /ADMIN_KEY must be at least 32 characters/);

  const paddedKey = runStartup(` ${'a'.repeat(32)}`);
  assert.equal(paddedKey.status, 1);
  assert.match(paddedKey.stderr, /ADMIN_KEY must not contain leading or trailing whitespace/);
});
