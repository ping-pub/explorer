# ---- Base Node ----
FROM node:lts AS build

ARG VITE_DEPLOYMENT_ENV=mainnet

WORKDIR /app

COPY package.json yarn.lock ./

RUN set -eux \
  && yarn install

COPY . .
RUN set -eux; \
  if [ "${VITE_DEPLOYMENT_ENV}" = "devnet" ]; then \
    cp chains/xion-devnet-1.json chains/xion; \
  fi \
  && yarn vite build

FROM node:lts AS runner

COPY --from=build /app/dist /app
COPY --from=build /app/wrangler.jsonc /app

RUN set -eux \
  && npm install -g wrangler@latest \
  && groupadd -g 1001 burnt \
  && useradd -m -u 1001 -g 1001 burnt \
  && chown -R burnt:burnt /app

WORKDIR /app
USER burnt

EXPOSE 3000

CMD [ "wrangler", "dev", "--assets=/app", "--show-interactive-dev-session", "false", "--ip", "0.0.0.0", "--port", "5173" ]
