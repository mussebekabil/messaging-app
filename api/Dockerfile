FROM denoland/deno:alpine-1.26.2

RUN apk add --update docker openrc && apk add bash

EXPOSE 7777

WORKDIR /app

COPY . .

# Ensure rights
RUN chmod +x wait-for-it.sh

RUN deno cache app.js

CMD ["./wait-for-it.sh", "rabbitmq:5672", "-t", "90", "--", "deno","run", "--watch", "--allow-net", "--allow-read", "--allow-run", "--allow-env", "--allow-write", "--no-check", "app.js" ]
