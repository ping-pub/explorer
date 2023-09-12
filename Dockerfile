FROM node:alpine as builder
  WORKDIR /app

  COPY package.json .
  RUN set -eux \
    && yarn --ignore-engines install

  COPY . .
  RUN set -eux \
    && yarn --ignore-engines build

FROM nginx:alpine as app
  COPY --from=builder /app/dist/ /usr/share/nginx/html/
  COPY ping.conf /etc/nginx/conf.d/default.conf
