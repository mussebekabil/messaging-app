import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, SLEEP_DURATION } from './common.js';

// export const options = {
//   duration: "10s",
//   vus: 5000,
//   summaryTrendStats: ['avg', 'med', 'p(95)', 'p(99)']
// }
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
  const res = http.get(`${BASE_URL}:7778`)
  check(res, { [`Load main page success`]: (r) => r.status == 200 });
  sleep(SLEEP_DURATION);
}
