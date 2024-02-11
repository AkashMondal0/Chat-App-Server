import client, { Counter, Histogram } from "prom-client"


// for prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'statusCode'],
  buckets: [0.1, 5, 15, 50, 100, 500, 1000, 2000, 3000]
});

const totalRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'statusCode']
});


export { httpRequestDurationMicroseconds, totalRequestCounter, client }