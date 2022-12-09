import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, SLEEP_DURATION } from './common.js';

export const options = {
  stages: [
    { duration: '2s', target: 20 },
    { duration: '10s', target: 100 },
    { duration: '1m', target: 500 },
    { duration: '2s', target: 20 },
  ],
  summaryTrendStats: ['avg', 'med', 'p(95)', 'p(99)']
}

export default function() {
  const res = http.post(`${BASE_URL}/api/replies`, JSON.stringify({
    authorId: 'test-user-id', 
    messageId: 1,
    content: `
      some content posted from k6
    `
  }));

  check(res, { ['Create message Success'] : (r) => r.status === 200 });
  sleep(SLEEP_DURATION);
}
