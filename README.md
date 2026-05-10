<div align="center">

<img src="https://raw.githubusercontent.com/vultisig/vultisig-windows/refs/heads/main/core/ui/public/coins/qbtc.svg" alt="qBTC" width="120" />

<h1>qBTC Explorer</h1>

**A light block explorer and wallet for the qBTC chain.**

</div>

`qBTC Explorer` is a single-chain explorer for [qBTC](https://qbtcapi.odindex.io), built on top of [Ping Dashboard](https://github.com/ping-pub/explorer). It fetches data live from the qBTC LCD/RPC endpoints with no caching or pre-processing — what you see is the chain's actual state at the moment of query.

## Endpoints

| | URL |
|--|--|
| LCD (API) | https://qbtcapi.odindex.io |
| RPC | https://qbtcrpc.odindex.io |
| Address prefix | `qbtc` |

The chain config lives at [chains/mainnet/qbtc.json](chains/mainnet/qbtc.json).

## Local development

Requirements: Node.js and Yarn.

```bash
yarn install
yarn dev
```

The dev server runs on Vite. Edit [chains/mainnet/qbtc.json](chains/mainnet/qbtc.json) to change endpoints, logo, or other chain metadata — the app will pick up the change on reload.

## Production build

```bash
yarn build
yarn preview
```

The site is deployed on Vercel with a redirect from `/` to `/qbtc` (see [vercel.json](vercel.json)). Chain JSON is bundled into the JS at build time via Vite's `import.meta.glob`, so a change to `chains/mainnet/qbtc.json` requires a rebuild/redeploy to take effect.

## Upstream

This project is a fork of [ping-pub/explorer](https://github.com/ping-pub/explorer). The bulk of the UI, wallet integration, and indexing logic comes from there; this fork periodically syncs `ping-pub:master` into `master`.

## License

[GPL-2.0](LICENSE), inherited from the upstream Ping Dashboard project.
