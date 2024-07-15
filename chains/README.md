# Directory Layout

Note: the host name used in the user's browser (displayed in the address bar) to load the explorer app determines which of the chain configuration directories is used.
If the host name contains the substring "testnet" (for example: "https://mytestnetwork.example.com") then chain configuration files in the `testnet` directory (only) are loaded. Conversely if the host name does not contain that substring then chain configuration files in the `mainnet` directory (only) are loaded.
Remember to bear this behavior in mind when selecting a DNS host name for self hosting the explorer.

** if you want to list your blockchain on ping.pub, please submit your configuration on https://github.com/ping-pub/ping.pub.git **

- Submit configs for mainnet, go to https://github.com/ping-pub/explorer/tree/master/chains/mainnet

- Submit configs for testnet, go to https://github.com/ping-pub/explorer/tree/master/chains/testnet, these configs will be enabled when you visit the domain that starts with `testnet.*`, for example `https://testnet.ping.pub`

# Sample of Config

```json
{
    "chain_name": "cosmos",
    "api": [
        {
            "address": "https://cosmos.api.ping.pub", 
            "provider": "Ping"
        }
    ], 
    "rpc": [
        {
            "address": "https://cosmos.api.ping.pub", 
            "provider": "Ping"
        }
    ],
    "sdk_version": "0.42.6",
    "coin_type": "118",
    "min_tx_fee": "800",
    "assets": [{
        "base": "uatom",
        "symbol": "ATOM",
        "exponent": "6",
        "coingecko_id": "cosmos", 
        "logo": "https://dl.airtable.com/.attachments/e54f814bba8c0f9af8a3056020210de0/2d1155fb/cosmos-hub.svg"
    }],
    "addr_prefix": "cosmos",
    "theme_color": "#ce4747",
    "logo": "https://dl.airtable.com/.attachments/e54f814bba8c0f9af8a3056020210de0/2d1155fb/cosmos-hub.svg"
}
```
- **chain_name** the name to identify the chain on ping.pub, would be better to use the same one as registry
- **api** the rest api endpoint.(make sure that CORS is enabled: `Allow-Control-Allow-Origin: *`)
- **rpc** the rpc endpoint, make sure that the port is added. rpc endpoint is only used for state sync. it's optional.
- **assets** Native Assets on blockchain. 

Endpoint providers will be listed in the "Popular" tab of the staking.

# Token Unit conversion

We have two methods to load token metadata for token unit conversion:

## Loading from a REST endpoint (recommended).
   
you can define the metadata in the `bank` -> `metadata` section of the blockchain's genesis file. if you don't define, the `[]` will return.

```json
{
  "name": "atom",
  "description": "The native staking token of the Cosmos Hub.",
  "denom_units": [
    {
      "denom": "uatom",
      "exponent": 0,
      "aliases": [
        "microatom"
      ],
    },
    {
      "denom": "matom",
      "exponent": 3,
      "aliases": [
        "milliatom"
      ]
    },
    {
      "denom": "atom",
      "exponent": 6,
    }
  ],
  "base": "uatom",
  "display": "atom",
}
```
you can see more details here:
https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-024-coin-metadata.md

## Loading from Cosmos Registry:

https://github.com/cosmos/chain-registry

# Test 

please add these check points in comments with your PR, and adding your test result by clicking the checkbox of each line
```
Test Result:
- [ ] Connect wallet, check if address is correct? 
- [ ] Transfer
- [ ] Delegate
- [ ] Redelegate
- [ ] Unbond
- [ ] withdraw Validator's Commission
- [ ] withdraw Rewards
```
Test is very important for us and our users. 
