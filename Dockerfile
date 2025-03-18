# ---- Base Node ----
FROM node:lts AS build

ARG VITE_DEPLOYMENT_ENV=mainnet

WORKDIR /app

COPY package*.json ./

RUN set -eux \
  && yarn install

COPY . .
RUN set -eux; \
  if [ "${VITE_DEPLOYMENT_ENV}" = "devnet" ]; then \
    rm -rf chains/mainnet && cp -a chains/devnet chains/mainnet; \
  fi \
  && yarn vite build

FROM node:lts AS runner

COPY --from=build /app/dist /app

RUN set -eux \
  && npm install -g wrangler@latest \
  && groupadd -g 1001 burnt \
  && useradd -u 1001 -g 1001 burnt \
  && chown -R burnt:burnt /app

WORKDIR /app
USER burnt

EXPOSE 3000

CMD [ "wrangler", "pages", "dev", "./", "--compatibility-flags", "nodejs_compat", "--show-interactive-dev-session", "false", "--ip", "0.0.0.0", "--port", "3000" ]
