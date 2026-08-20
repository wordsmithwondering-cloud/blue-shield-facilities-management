import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '15s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

const baseUrl = __ENV.BASE_URL || 'http://127.0.0.1:3000';

export default function () {
  const response = http.get(`${baseUrl}/api/health`, { tags: { endpoint: 'health' } });
  check(response, {
    'health returns 200': (result) => result.status === 200,
    'health reports ok': (result) => result.json('ok') === true,
  });
  sleep(1);
}
