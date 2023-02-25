# Prerequisite
1. Node, https://nodejs.org 
2. Yarn,  https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable

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
