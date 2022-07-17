<div align="center">

![Ping Wallet](./public/logo.svg)

<h1>Ping Explorer</h1>

**Ping explorer is not only an explorer but also a wallet and more ... 🛠**

[![version](https://img.shields.io/github/tag/ping-pub/explorer.svg)](https://github.com/ping-pub/explorer/releases/latest)
[![GitHub](https://img.shields.io/github/license/ping-pub/explorer.svg)](https://github.com/ping-pub/explorer/blob/master/LICENSE)
[![Ping Deploy](https://github.com/ping-pub/explorer/actions/workflows/mainnet-deploy.yaml/badge.svg)](https://github.com/ping-pub/explorer/actions/workflows/mainnet-deploy.yaml)
[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/bukotsunikki.svg?style=social&label=Follow%20%40ping_pub)](https://twitter.com/ping_pub)
[![https://discord.gg/CmjYVSr6GW](https://img.shields.io/badge/discord-join-7289DA.svg?logo=discord&longCache=true&style=flat)](https://discord.gg/CmjYVSr6GW)


</div>

Ping Explorer is a light explorer for Cosmos-based Blockchains.  https://ping.pub .

## What is the difference between Ping explorer and other explorers? 

Ping Explorer is designed to explore blockchain data as real as possible, therefore there is no cache, no pre-processing. Ping Explorer does not cache/save blockchain data on its server. Ping Explorer only fetch data from Cosmos full node via LCD/RPC endpoints. We call it "Light Explorer".

## Do you want to list your blockchain on ping.pub?

Pull your request [here](./src/chains), We will add your chains as soon as possible. It is **FREE** (You must have 10+ independent validators on your chain).

## Why Ping explorer use official/trusted third party public LCD/rpc server? 

We have two considerations: 1, Trust, In decentralize system, everything controlled by one single team/organization could be risks. So we decided to co-build with the community. 2. We will list hundreds cosmos-based blockchains in the future, it's impossible for our team to run validators or fullnodes for all of those chains.

# Installation:

1. Running with yarn
```
yarn && yarn serve
```

2. Building for web servers, like nginx, apache
```
yarn && yarn build
cp -r ./dist/* <ROOT_OF_WEB_SERVER>
```

# Enable LCD for Ping.pub (do this on the config for your chain)

1. Set `enable = true` in `./config/app.toml`
```
###############################################################################
###                           API Configuration                             ###
###############################################################################

[api]

# Enable defines if the API server should be enabled.
enable = true

# Swagger defines if swagger documentation should automatically be registered.
swagger = false

# Address defines the API server to listen on.
address = "tcp://0.0.0.0:1317"

# MaxOpenConnections defines the number of maximum open connections.
max-open-connections = 1000
```

2. add proxy server and enable CORS. NOTE: You must enable https as well.

```
server {
    server_name juno.api.ping.pub;
    listen 443;
    location / {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Max-Age 3600;
        add_header Access-Control-Expose-Headers Content-Length;

        proxy_pass http://<HOST>:1317;

    }
}
```
3. config your blockchain in [./src/chains]()




## Contributors

Developers: @liangping @dingyiming

