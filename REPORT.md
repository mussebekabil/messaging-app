# Project 3 report

## Performance summary

`K6` test scripts run for main page, single message view and part of API endpoints as described in the `README.md` file. All tests are configured to run with stage like

For pages

```console
 stages: [
    { duration: '2s', target: 20 },
    { duration: '5s', target: 500 },
    { duration: '10s', target: 1000 },
    { duration: '2s', target: 20 },
  ]
```

For api `POST` endpoints

```console
stages: [
    { duration: '2s', target: 20 },
    { duration: '10s', target: 100 },
    { duration: '1m', target: 500 },
    { duration: '2s', target: 20 },
  ],
```

The table below summarizes the average results of the script outputs.

| Scripts              | Checks | Avg req/s | Median HTTP req | p(95) HTTP req | p(99) HTTP req |
| -------------------- | ------ | --------- | --------------- | -------------- | -------------- |
| api-create-message   | 100%   | 702.5/s   | 34.41ms         | 203.04ms       | 400.54ms       |
| (with auto scale)    |        |           |                 |                |                |
| api-create-reply     | 100%   | 646.1/s   | 85.07ms         | 302.69ms       | 484.12ms       |
| (with auto scale)    |        |           |                 |                |                |
| api-create-message   | 30%    | 708.3/s   | 29.05ms         | 779.12ms       | 998.46ms       |
| (w/o auto scale)     |        |           |                 |                |                |
| api-create-reply     | 48%    | 658.1/s   | 67.25ms         | 591.58ms       | 992.15ms       |
| (w/o auto scale)     |        |           |                 |                |                |
| api-get-all-messages | 100%   | 25.25/s   | 1.99s           | 3.09s          | 3.35s          |
| single-message-page  | 100%   | 67.93/s   | 9.12s           | 13.22s         | 13.98s         |
| main-page            | 100%   | 86.51/s   | 5.34s           | 14.37s         | 89.83ms        |

As all `GET` requests are served from the `api`, directly reading from the database takes longer time than `POST` requests. Create and update requests are published to the queue and a separate `messaging-service` (better named something like `message-consumer-service`) will do the database transaction. As this service is auto scaled, we achieved better performance on this. 

It is interesting to measure and see the real implication of autoscaling. Autoscaling is implemented for `api` and `messaging-service` which can handle the load to complete the task. However, when running the services with single instance, with the same `vu`, almost half of the request is failed to complete.

Serving the main page is performing good but not the best. As both pages mostly serve dynamic content from the backend, it calls `GET` request that causes a little bit delay. 

## Future performance improvements

Now both in the `api` and `messaging-service`, database client allows only two concurrent connections. Increasing the connections will boost the read operation which we encountered in `GET` requests. Moreover, the `ui` is running in one replica. Adding more instances will also improve the performance.

We haven't used any backend or frontend cache. As we have seen in `project 2` performance test results, some cache implementation will improve the performance. 

Finally, as I am new to Astro, I felt like I have not utilized all the benefits the framework offers. For instance, it could probably be more refactored to use more static contents with `Astro` components and use `React` components whenever necessary. 
 
## Google Lighthouse report

| Metrics                   | Main page | Single message page |
| ------------------------  | --------- | ------------------- |
| Over All Performance      | 91        | 90                  |
| First Contentful Paint    | 0.5s      | 0.7s                |
| Speed Index               | 0.5s      | 0.7s                |
| Largest Contentful Paint  | 2.0s      | 2.1s                |
| Time to Interactive       | 1.4s      | 0.7s                |
| Total Blocking Time       | 0 ms      | 0 ms                |
| Cumulative Layout Shift   | 0         | 0.003               |
