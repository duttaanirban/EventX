import { performance } from 'node:perf_hooks';
import { setTimeout as sleep } from 'node:timers/promises';

const args = process.argv.slice(2);
if (args.includes('--help') || !args.length) {
  console.log('Usage: npm run test:load -- https://your-api.onrender.com');
  console.log('Optional environment variables: LOAD_USERS=5,10,25,50 LOAD_SECONDS=60 LOAD_THINK_MS=3000 LOAD_MAX_REQUESTS=240');
  console.log('Read-only event browsing. Stops on HTTP 429, failed thresholds, or request budget.');
  process.exit(args.length ? 0 : 1);
}

const target = new URL(args[0]);
if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password) {
  throw new Error('Supply an HTTP(S) API URL without credentials.');
}
const base = `${target.origin}/api/events`;
function integer(name, fallback, min, max) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`Invalid ${name}: expected ${min}–${max}`);
  return value;
}
const stages = (process.env.LOAD_USERS || '5,10,25,50').split(',').map(Number);
if (stages.some((n) => !Number.isInteger(n) || n < 1 || n > 200)) throw new Error('LOAD_USERS must contain integers from 1 to 200.');
const seconds = integer('LOAD_SECONDS', 60, 1, 1800);
const thinkMs = integer('LOAD_THINK_MS', 3000, 0, 60000);
const budget = integer('LOAD_MAX_REQUESTS', 240, 1, 100000);
let sent = 0;
let stopReason = '';
const ids = new Set();

async function request(url, timeoutMs = 15000) {
  if (stopReason) return null;
  if (sent >= budget) {
    stopReason = 'Request budget exhausted; capacity is inconclusive.';
    return null;
  }
  sent++;
  const start = performance.now();
  let status = 0;
  let ok = false;
  let error;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), redirect: 'error' });
    status = response.status;
    if (status === 429) stopReason = 'HTTP 429: IP rate limit reached; capacity is inconclusive.';
    const body = await response.json();
    ok = response.ok && body.success === true && (
      url === base ? Array.isArray(body.data?.events) : Boolean(body.data?.event?._id)
    );
    if (ok && url === base) {
      for (const event of body.data.events) {
        if (/^[a-f\d]{24}$/i.test(event._id)) ids.add(event._id);
      }
    }
  } catch (cause) {
    error = cause.cause?.code || cause.name;
    // Network errors, timeouts, and invalid responses count as failures.
  }
  return { status, ok, ms: performance.now() - start, error };
}

console.log(`Target: ${base}\nStages: ${stages.join(', ')} users; ${seconds}s each; ${thinkMs}ms think time; total request budget ${budget}.`);
console.log('The default budget limits traffic below the configured 300/IP/15min allowance only if that IP has no other traffic.');
console.log('Warm-up request (excluded from stage timings)...');
const warmup = await request(base, 120000);
if (!warmup?.ok) {
  console.error(stopReason || 'Warm-up failed. Check deployment readiness and the API URL.');
  console.error(JSON.stringify(warmup));
  process.exit(1);
}
if (!ids.size) console.log('No events found: this run will only measure empty event listings.');

for (const users of stages) {
  const results = [];
  const started = performance.now();
  const deadline = started + seconds * 1000;
  await Promise.all(Array.from({ length: users }, async (_, worker) => {
    // Spread the initial requests across the first second.
    await sleep(worker * Math.min(1000, seconds * 100) / users);
    let iteration = 0;
    while (!stopReason && performance.now() < deadline) {
      const available = [...ids];
      const detail = iteration++ % 2 === 1 && available.length;
      const url = detail ? `${base}/${available[Math.floor(Math.random() * available.length)]}` : base;
      const result = await request(url);
      if (result) results.push(result);
      if (!stopReason) await sleep(Math.max(0, Math.min(thinkMs, deadline - performance.now())));
    }
  }));
  const elapsed = (performance.now() - started) / 1000;
  const latencies = results.map((r) => r.ms).sort((a, b) => a - b);
  const percentile = (p) => latencies[Math.max(0, Math.ceil(latencies.length * p) - 1)] ?? 0;
  const errors = results.filter((r) => !r.ok).length;
  const errorRate = results.length ? errors / results.length : 1;
  const statuses = {};
  for (const r of results) statuses[r.status || 'network_error'] = (statuses[r.status || 'network_error'] || 0) + 1;
  const passed = results.length > 0 && errorRate < 0.01 && percentile(0.95) <= 1000;
  console.log(JSON.stringify({ users, requests: results.length, elapsedSeconds: +elapsed.toFixed(1), requestsPerSecond: +(results.length / elapsed).toFixed(2), p50Ms: Math.round(percentile(0.5)), p95Ms: Math.round(percentile(0.95)), errorPercent: +(errorRate * 100).toFixed(2), statuses, result: stopReason ? 'INCOMPLETE' : passed ? 'PASS' : 'FAIL' }));
  if (!passed && !stopReason) stopReason = 'Stage exceeded the browsing target (p95 ≤ 1000ms, errors < 1%). Higher stages were skipped.';
  if (stopReason) break;
}
console.log(stopReason || 'All configured browsing stages passed. This is not a maximum capacity or checkout measurement.');
console.log(`Total requests including warm-up: ${sent}. Short runs need longer confirmation on staging with an appropriate IP rate limit.`);
if (stopReason) process.exitCode = 1;
