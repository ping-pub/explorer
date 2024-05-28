FROM node:lts-alpine as builder
  WORKDIR /app

  COPY package.json yarn.lock ./
  RUN set -eux \
    && yarn install

  COPY . .
  RUN set -eux \
    && yarn build

FROM nginx:stable-alpine as app
  COPY --from=builder /app/dist/ /usr/share/nginx/html/
  COPY ping.conf /etc/nginx/conf.d/default.conf
