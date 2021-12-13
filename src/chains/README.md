# Directory Layout

**We accept all blockchains which have 10+ independent validators.**

- Submit configs for mainnet, go to https://github.com/ping-pub/explorer/tree/master/src/chains/mainnet

- Submit configs for testnet, go to https://github.com/ping-pub/explorer/tree/testnet/src/chains/testnet

# Sample of Config

```json
{
    "chain_name": "cosmos",
    "coingecko": "cosmos", 
    "api":"https://cosmos.api.ping.pub", 
    "sdk_version": "0.42.6",
    "addr_prefix": "cosmos",
    "logo": "https://dl.airtable.com/.attachments/e54f814bba8c0f9af8a3056020210de0/2d1155fb/cosmos-hub.svg"
}
```
- **chain_name** the name to identify the chain on ping.pub
- **coingecko**  the id of the token on chain. if there multi-tokens, using `["tokenA","tokenB"]
- **api** the rest api endpoint. make sure CORS is enabled: `Allow-Control-Allow-Origin: *`


