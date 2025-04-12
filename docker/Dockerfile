FROM node:lts-alpine3.21 AS base

# install chromium
RUN apk add chromium --no-cache \
    && rm -rf /var/cache/apk/*

# copy source code
COPY ../ /app
RUN cd /app \
    && npm install --omit=dev

WORKDIR /app

ENTRYPOINT ["node", "/app/index.js"]
