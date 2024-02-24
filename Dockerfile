FROM node:21-bookworm-slim as builder

WORKDIR /app
COPY . /app
RUN cd /app && yarn

FROM node:21-bookworm-slim 
WORKDIR /app

COPY --from=builder /app/ /app/

ENTRYPOINT ["yarn", "serve", "--host"]