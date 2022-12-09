FROM node:lts-alpine3.16

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . .

# install node dependencies
RUN echo "npm install in progress..." && npm ci

EXPOSE 7778

CMD [ "astro", "dev" ]
