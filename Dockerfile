# ---- Base Node ----
FROM node:lts AS build

ARG VITE_DEPLOYMENT_ENV=mainnet
ARG VITE_REFRESH_INTERVAL=1500
ARG VITE_FETCH_ALL_BLOCKS=true
ARG VITE_RECENT_BLOCK_LIMIT=100
ARG VITE_COINGECKO_URL=https://api.coingecko.com
ARG VITE_GITHUB_API_URL=https://api.github.com/repos/cosmos/chain-registry/contents
ARG VITE_PINGPUB_API_URL=https://registry.ping.pub
ARG VITE_IBC_USE_GITHUB_API=true

ENV VITE_DEPLOYMENT_ENV=${VITE_DEPLOYMENT_ENV} \
    VITE_REFRESH_INTERVAL=${VITE_REFRESH_INTERVAL} \
    VITE_FETCH_ALL_BLOCKS=${VITE_FETCH_ALL_BLOCKS} \
    VITE_RECENT_BLOCK_LIMIT=${VITE_RECENT_BLOCK_LIMIT} \
    VITE_COINGECKO_URL=${VITE_COINGECKO_URL} \
    VITE_GITHUB_API_URL=${VITE_GITHUB_API_URL} \
    VITE_PINGPUB_API_URL=${VITE_PINGPUB_API_URL} \
    VITE_IBC_USE_GITHUB_API=${VITE_IBC_USE_GITHUB_API}

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
