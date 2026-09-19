import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import test from 'node:test';

test('browsing runner handles successful stages, budgets, and throttling', async () => {
  let throttle = false;
  const paths = [];
  const id = '0123456789abcdef01234567';
  const server = http.createServer((req, res) => {
    paths.push(req.url);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = throttle && paths.length > 1 ? 429 : 200;
    res.end(JSON.stringify({ success: res.statusCode === 200, data: req.url === '/api/events' ? { events: [{ _id: id }] } : { event: { _id: id } } }));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  async function run(budget) {
    paths.length = 0;
    const child = spawn(process.execPath, ['scripts/load-test.mjs', `http://127.0.0.1:${server.address().port}`], {
      env: { ...process.env, LOAD_USERS: '1', LOAD_SECONDS: '1', LOAD_THINK_MS: '20', LOAD_MAX_REQUESTS: String(budget) },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { output += chunk; });
    const code = await new Promise((resolve, reject) => {
      child.on('error', reject);
      child.on('close', resolve);
    });
    return { code, output };
  }
  try {
    const passed = await run(100);
    assert.equal(passed.code, 0, passed.output);
    assert.match(passed.output, /"result":"PASS"/);
    assert.ok(paths.includes(`/api/events/${id}`));
    const capped = await run(3);
    assert.equal(capped.code, 1);
    assert.equal(paths.length, 3);
    assert.match(capped.output, /Request budget exhausted/);
    assert.match(capped.output, /"result":"INCOMPLETE"/);
    throttle = true;
    const limited = await run(100);
    assert.equal(limited.code, 1);
    assert.equal(paths.length, 2);
    assert.match(limited.output, /HTTP 429/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
