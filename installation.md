# Prerequisites

1. Node and Yarn - Acquired using Node Version Manager (https://github.com/nvm-sh/nvm)

# Quick Install for Prerequisites

1. Install Node Version Manager
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
```
2. Install the latest version of NodeJS
```sh
nvm install node # "node" is an alias for the latest version
```
3. Install the latest version of NPM for Node
```sh
nvm install-latest-npm # get the latest supported npm version on the current node version
```
4. Install Yarn
```sh
npm install --global yarn
```

# Installation:

1. Running with yarn
```sh
yarn --ignore-engines && yarn serve
```

2. Building for web servers, like nginx, apache
```sh
yarn --ignore-engines && yarn build
cp -r ./dist/* <ROOT_OF_WEB_SERVER>
```

3. Running with docker
```sh
./docker.sh
docker run -d -p 8088:80 ping.pub/dashboard
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
