import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, SLEEP_DURATION } from './common.js';

// export const options = {
//   duration: "10s",
//   vus: 50,
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
  const authorId = `test-user-id`;
  // first create dummy user
  http.post(`${BASE_URL}:7777/users`, JSON.stringify({ userId: authorId }))
  const res = http.post(`${BASE_URL}:7777/messages`, JSON.stringify({
    authorId, 
    content: `
      some content posted from k6
    `
  }));

  check(res, { ['Create message Success'] : (r) => r.status === 200 });
  sleep(SLEEP_DURATION);
}
