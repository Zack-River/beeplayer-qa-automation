import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Load the normalized API definition
const apiData = new SharedArray('normalized-api', function() {
  return JSON.parse(open('../../src/models/normalized-api.json'));
});

export const options = {
  scenarios: {
    baseline: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
  },
};

export default function () {
  // Select a safe GET endpoint (e.g. Health or /resellers list)
  // Ensure we don't hit DESTRUCTIVE endpoints (SR-03 implementation)
  const targetUrl = __ENV.BASE_URL || 'https://api.beeplayer1.com';
  
  // Baseline test against an unauthenticated public/safe endpoint to establish pure network/routing latency
  const res = http.get(`${targetUrl}/`);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}
