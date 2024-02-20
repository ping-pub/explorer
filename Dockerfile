FROM node:alpine as builder
  WORKDIR /app

  COPY package.json .
  RUN set -eux \
    && yarn

  COPY . .
  RUN set -eux \
    && yarn build

FROM nginx:alpine as app
  COPY --from=builder /app/dist/ /usr/share/nginx/html/
  COPY ping.conf /etc/nginx/conf.d/default.conf
