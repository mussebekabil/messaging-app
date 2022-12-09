FROM denoland/deno:alpine-1.26.2

RUN apk add --update docker openrc && apk add bash

WORKDIR /app

COPY . .

RUN deno cache app.js

# Ensure rights
# RUN chmod +x wait-for-it.sh

RUN deno cache app.js

# "./wait-for-it.sh", "rabbitmq:5672", "-t", "90", "--", "deno",
CMD ["run", "--watch", "--allow-net", "--allow-read", "--allow-run", "--allow-env", "--allow-write", "--no-check", "--unstable", "app.js" ]
