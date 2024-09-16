FROM node:lts-alpine3.20 as base

# install chromium
RUN apk update \
    && apk add chromium \
    && rm -rf /var/cache/apk/*

# copy source code
COPY ../ /app
RUN cd /app \
    && npm install --omit=dev

WORKDIR /app

ENTRYPOINT ["node", "/app/index.js"]