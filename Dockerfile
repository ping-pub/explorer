FROM node:16-alpine AS builder

WORKDIR /build
COPY . ./
RUN yarn && yarn build
WORKDIR /dist
RUN mv /build/dist ./html && mv /build/ping.conf .


FROM nginx:alpine

COPY --from=builder /dist/ping.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /dist/html /usr/share/nginx/html
