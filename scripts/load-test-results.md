# Preliminary browsing measurement — 2026-09-20

Target: https://eventx-api.onrender.com/api/events

Hosting reported by the owner: Render Free and MongoDB Atlas Free. Actual
resource settings, Redis availability, CPU/RAM, and database metrics were not
independently inspected during this run.

Command: `node scripts/load-test.mjs https://eventx-api.onrender.com`

Workload: anonymous event listings and event details, one outstanding request
per simulated user, three seconds between requests. A warm-up request was
excluded from stage metrics. Initial connection attempts failed; a subsequent
attempt with a longer startup allowance succeeded. The cause was not established.

| Active users | Requests | Elapsed | Requests/sec | p50 | p95 | Errors | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5 | 81 | 60.0s | 1.35 | 693ms | 851ms | 0% | Complete; passed |
| 10 | 158 | 59.8s | 2.64 | 693ms | 934ms | 0% | Incomplete; request budget reached |

All measured requests returned HTTP 200 and the expected response shape. The
run stopped at its 240-request budget, including warm-up. No HTTP 429 was
observed. Stages with 25 and 50 users were not attempted.

Evidence supports five active browsing users for this one-minute workload.
Ten users also showed no failures in the observed interval, but that stage was
cut short. Neither result establishes the maximum sustainable capacity.
Login, checkout, payment processing, Socket.io, frontend assets, long-duration
stability, and behavior across different datasets were not measured.

Next measurement: an isolated staging deployment with matching resources and
an appropriate rate limit, longer stages, representative data, and API/database
resource monitoring. Test checkout separately using test or mocked payments.
