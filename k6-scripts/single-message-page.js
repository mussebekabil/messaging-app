import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, SLEEP_DURATION } from './common.js';

export const options = {
  stages: [
    { duration: '2s', target: 20 },
    { duration: '5s', target: 500 },
    { duration: '10s', target: 1000 },
    { duration: '2s', target: 20 },
  ],
  summaryTrendStats: ['avg', 'med', 'p(95)', 'p(99)']
}

export default function() {
  const res = http.get(`${BASE_URL}/messages/1`)
  check(res, { [`Load single message page success`]: (r) => r.status == 200 });
  sleep(SLEEP_DURATION);
}
