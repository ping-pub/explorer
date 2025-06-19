<div align="center">

![Ping Wallet](./public/logo.svg)

<h1>Ping Dashboard</h1>

**Ping Dashboard is not only an explorer but also a wallet and more ... 🛠**

[![version](https://img.shields.io/github/tag/ping-pub/explorer.svg)](https://github.com/ping-pub/explorer/releases/latest)
[![GitHub](https://img.shields.io/github/license/ping-pub/explorer.svg)](https://github.com/ping-pub/explorer/blob/master/LICENSE)
[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/bukotsunikki.svg?style=social&label=Follow%20%40ping_pub)](https://twitter.com/ping_pub)
[![https://discord.gg/CmjYVSr6GW](https://img.shields.io/badge/discord-join-7289DA.svg?logo=discord&longCache=true&style=flat)](https://discord.gg/CmjYVSr6GW)


</div>

`Ping Dashboard` is a light explorer for Cosmos-based Blockchains.  https://ping.pub .

## What sets Ping Dashboard apart from other explorers?
**Ping Dashboard** stands out by providing a real-time exploration of blockchain data without relying on caching or pre-processing. It exclusively fetches data from the Cosmos full node via LCD/RPC endpoints, ensuring a truly authentic experience. This approach is referred to as the "Light Explorer."

## Are you interested in listing your blockchain on https://ping.pub?

To make this repository clean, please submit your request to https://github.com/ping-pub/ping.pub.git


## Why does Ping Dashboard rely on official/trusted third-party public LCD/RPC servers?
There are two primary reasons for this choice:

 - Trust: In a decentralized system, it is crucial to avoid relying solely on a single entity. By utilizing official/trusted third-party public LCD/RPC servers, Ping Dashboard ensures that the data is sourced from a network of trusted participants.
 - Limited Resources: As Ping Dashboard plans to list hundreds of Cosmos-based blockchains in the future, it is impractical for the Ping team to operate validators or full nodes for all of them. Leveraging trusted third-party servers allows for more efficient resource allocation.

## Donation

Your donation will help us make better products. Thanks in advance.

 - Address for ERC20: USDC, USDT, ETH
```
0x88BFec573Dd3E4b7d2E6BfD4D0D6B11F843F8aa1
```

#### Donations from project

- Point Network: 1000USDC and $1000 worth of POINT
- Bitsong: 50k BTSG
- IRISnet: 100k IRIS

## Hire us

You can hire us by submitting an issue and fund the issue on [IssueHunter](https://issuehunt.io/r/ping-pub/explorer)


## Contributors

Developers: @liangping @dingyiming

## Changes from Original Ping.Pub

This version of Ping.Pub was forked from from commit https://github.com/ping-pub/explorer/commit/603d7ce2, with the following changes applied:

- `chains/mainnet/`:
  - Removed any existing chains.
  - Added `fuel.json`.
  - Added `fuel-testnet.json`.
- `src/libs/`
  - In `client.ts`, added `order_by=2` to `getTxsBySender` query, for DESC ordering.
  - In `client.ts`, added `getBankSpendableBalances` method for vesting account support.
- `src/libs/api/`:
  - In `index.ts`, added `bank_spendable_balances_address` endpoint mapping.
  - In `registry.ts`, added `bank_spendable_balances_address` type definition.
- `src/layouts/components/`:
  - Removed Sponsors from `DefaultLayout.vue`.
- `src/modules/[chain]`:
  - In `indexStore.ts` add **Initial Supply** card.
  - In `indexStore.ts` remove **Validators** card.
  - In `indexStore.ts` rename **Supply** card to **Supply on Sequencer**.
- `src/modules/[chain]/account`:
  - In `[address].vue`, added `order_by=2` to `receivedQuery` query, for DESC ordering.
  - In `[address].vue`, added Fuel's vesting accounts handling with detailed schedule breakdown.
- `src/modules/[chain]/supply`:
  - In `index.vue` add `fuel (initial_supply)`.
  - In `index.vue` change fuel supply to `fuel (supply_on_sequencer)`.
- `src/modules/[chain]/statesync`:
  - In `index.vue` use a height interval of 5000 blocks, i.e. `h = Math.round((h - 5000) / 5000) * 5000`.
- `src/stores/`:
  - In `useDashboard.ts` ensure `conf.logo = lc.logo;`.
  - In `useParamsStore.ts` add `initial_supply`.
  - In `useParamsStore.ts` change `bonded_and_supply` to `bonded_from_sequencer_supply`.
  - Added `govCache.ts` and `govFallback.ts` for governance proposal caching and fallback fetching when batch requests fail.
  - Enhanced `useGovStore.ts` with intelligent fallback mechanism and improved error handling for governance proposals.
- `src/types/`:
  - In `auth.ts`, added `VestingInfo` interface and extended `AuthAccount` for vesting account types.
- `public/logos/`:
  - Added `fuel.png`.
