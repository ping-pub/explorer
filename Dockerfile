# Stage 1
FROM node:lts as builder
WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider

# Get the source
COPY . .

RUN yarn --ignore-engines && yarn build

# Stage 2
FROM ubuntu:latest
RUN apt-get -y update && apt-get install ca-certificates apache2 net-tools iproute2 -y
WORKDIR /var/www/html
RUN rm -rf *
COPY --from=builder /app/dist/ .
RUN chmod -R 777 *
EXPOSE 80

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
