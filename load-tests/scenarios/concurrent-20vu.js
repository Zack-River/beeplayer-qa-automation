import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Load the normalized API definition
const apiData = new SharedArray('normalized-api', function() {
  return JSON.parse(open('../../src/models/normalized-api.json'));
});

// Phase 12 Distribution: 50% Scenario A, 30% Scenario B, 20% Scenario C
export const options = {
  scenarios: {
    scenario_a_browse: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '60s', target: 10 }, // 50% of 20
        { duration: '10m', target: 10 }, // Steady state
        { duration: '30s', target: 0 },  // Ramp down
      ],
      exec: 'customerBrowse',
    },
    scenario_b_vod: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '60s', target: 6 }, // 30% of 20
        { duration: '10m', target: 6 }, // Steady state
        { duration: '30s', target: 0 }, // Ramp down
      ],
      exec: 'customerVOD',
    },
    scenario_c_admin: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '60s', target: 4 }, // 20% of 20
        { duration: '10m', target: 4 }, // Steady state
        { duration: '30s', target: 0 }, // Ramp down
      ],
      exec: 'resellerAdmin',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'], // Sustained 5xx error rate abort criteria
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
  },
};

const targetUrl = __ENV.BASE_URL || 'https://api.beeplayer1.com';

// -------------------------------------------------------------
// Note: We use safe GET endpoints to avoid mutating state
// and violating SR-03 (DESTRUCTIVE operations during load).
// -------------------------------------------------------------

export function customerBrowse() {
  const res = http.get(`${targetUrl}/`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}

export function customerVOD() {
  const res = http.get(`${targetUrl}/`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}

export function resellerAdmin() {
  const res = http.get(`${targetUrl}/`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
