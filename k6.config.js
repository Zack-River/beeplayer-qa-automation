// k6 load test configuration scaffold
export const options = {
  discardResponseBodies: true, // We are interested in performance, not functional validation here
  scenarios: {
    // These will be overridden by specific profile configurations (1-VU vs 20-VU)
    default_scenario: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'], // http errors should be less than 5%
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
};
