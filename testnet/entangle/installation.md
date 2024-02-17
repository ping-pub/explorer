# Installation

#### Install Dependencies

```
sudo apt update && sudo apt upgrade -y
sudo apt install curl git wget htop tmux build-essential jq make lz4 gcc unzip -y
```

#### Install GO

```
cd $HOME
VER="1.19.3"
wget "https://golang.org/dl/go$VER.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$VER.linux-amd64.tar.gz"
rm "go$VER.linux-amd64.tar.gz"
[ ! -f ~/.bash_profile ] && touch ~/.bash_profile
echo "export PATH=$PATH:/usr/local/go/bin:~/go/bin" >> ~/.bash_profile
source $HOME/.bash_profile
[ ! -d ~/go/bin ] && mkdir -p ~/go/bin
```

#### Set vars

```
echo "export WALLET="wallet"" >> $HOME/.bash_profile
echo "export MONIKER="test"" >> $HOME/.bash_profile
echo "export ENTANGLE_CHAIN_ID="entangle_33133-1"" >> $HOME/.bash_profile
echo "export ENTANGLE_PORT="29"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

#### Download binary

```
cd $HOME
rm -rf entangle-blockchain
git clone https://github.com/Entangle-Protocol/entangle-blockchain
cd entangle-blockchain
make install
```

## config and init app

```
entangled config node tcp://localhost:${ENTANGLE_PORT}657
entangled config keyring-backend os
entangled config chain-id entangle_33133-1
```

#### Config app

```
sed -i \
-e 's/timeout_broadcast_tx_commit = "10s"/timeout_broadcast_tx_commit = "1s"/g' \
-e 's/timeout_propose = "3s"/timeout_propose = "1s"/g' \
-e 's/timeout_propose_delta = "500ms"/timeout_propose_delta = "200ms"/g' \
-e 's/timeout_prevote = "1s"/timeout_prevote = "500ms"/g' \
-e 's/timeout_prevote_delta = "500ms"/timeout_prevote_delta = "200ms"/g' \
-e 's/timeout_precommit = "1s"/timeout_precommit = "500ms"/g' \
-e 's/timeout_precommit_delta = "500ms"/timeout_precommit_delta = "200ms"/g' \
-e 's/timeout_commit = "5s"/timeout_commit = "1s"/g' \
-e 's/create_empty_blocks = true/create_empty_blocks = false/g' \
-e 's/create_empty_blocks_interval = "0s"/create_empty_blocks_interval = "30s"/g' \
-e 's/namespace = "cometbft"/namespace = "tendermint"/g' "$HOME/.entangled/config/config.toml"
```

#### Download genesis and addrbook

```
wget -O $HOME/.entangled/config/genesis.json https://testnet-files.itrocket.net/entangle/genesis.json
wget -O $HOME/.entangled/config/addrbook.json https://testnet-files.itrocket.net/entangle/addrbook.json
```

#### Set seeds and peers

```
SEEDS="b65b6270a053b8a5b5bc037aa90d5790fcc555fa@entangle-testnet-seed.itrocket.net:29656"
PEERS="fe8c954ed37bfc3e5fc5eaf19b861d8a5947b2f5@entangle-testnet-peer.itrocket.net:29656,7bff324a17426a00731f425ae29fe6ef05eebbac@213.239.217.52:33656,741cb77bbbea6c2ec1a5b343be5f9144f9ca7e08@167.235.14.83:14656,6861da46371f8116dd82632fa9da662220d26259@164.68.105.202:26656,064d6b020651c38c52323e3c15f30064a77953e7@167.235.39.5:60856,9af19bfc29daf7e5535cf10d5f59c32406b69e05@213.133.100.172:27322,ff9ad488fc382d37e6ded72141ca4c1b5cf1df9b@43.130.242.83:656,4eef26949e7214cf122a5ef415c5f1db074772cb@43.133.161.82:656,94ab1432b3f3a4b81f7eb0e16e14924a805d8f05@65.109.154.182:15656,14efb053b613b0752638b2df8b12c4fff399c0bc@43.133.70.210:656,b4df229111486262d86c62256e4ac61c058ce5a8@43.131.251.94:656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.entangled/config/config.toml
```

#### Custom Port in app.toml

```
sed -i.bak -e "s%:1317%:${ENTANGLE_PORT}317%g;
s%:8080%:${ENTANGLE_PORT}080%g;
s%:9090%:${ENTANGLE_PORT}090%g;
s%:9091%:${ENTANGLE_PORT}091%g;
s%:8545%:${ENTANGLE_PORT}545%g;
s%:8546%:${ENTANGLE_PORT}546%g;
s%:6065%:${ENTANGLE_PORT}065%g" $HOME/.entangled/config/app.toml
```

#### Custom Port in config.toml

```
sed -i.bak -e "s%:26658%:${ENTANGLE_PORT}658%g;
s%:26657%:${ENTANGLE_PORT}657%g;
s%:6060%:${ENTANGLE_PORT}060%g;
s%:26656%:${ENTANGLE_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${ENTANGLE_PORT}656\"%;
s%:26660%:${ENTANGLE_PORT}660%g" $HOME/.entangled/config/config.toml
```

#### Config pruning

```
sed -i -e "s/^pruning *=.*/pruning = \"custom\"/" $HOME/.entangled/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"100\"/" $HOME/.entangled/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"50\"/" $HOME/.entangled/config/app.toml
```

#### Set minimum gas price

```
sed -i 's|minimum-gas-prices =.*|minimum-gas-prices = "0.0001aNGL"|g' $HOME/.entangled/config/app.toml
sed -i -e "s/prometheus = false/prometheus = true/" $HOME/.entangled/config/config.toml
sed -i -e "s/^indexer *=.*/indexer = \"null\"/" $HOME/.entangled/config/config.toml
```

#### Create Service

```
sudo tee /etc/systemd/system/entangled.service > /dev/null <<EOF
[Unit]
Description=Entangle node
After=network-online.target
[Service]
User=$USER
WorkingDirectory=$HOME/.entangled
ExecStart=$(which entangled) start --pruning=nothing --evm.tracer=json --minimum-gas-prices=0.0001aNGL --json-rpc.api eth,txpool,personal,net,debug,web3,miner --api.enable --api.enabled-unsafe-cors
Restart=on-failure
RestartSec=5
LimitNOFILE=65535
[Install]
WantedBy=multi-user.target
EOF
```

#### Download snapshot

```
entangled tendermint unsafe-reset-all --home $HOME/.entangled
if curl -s --head curl https://testnet-files.itrocket.net/entangle/snap_entangle.tar.lz4 | head -n 1 | grep "200" > /dev/null; then
  curl https://testnet-files.itrocket.net/entangle/snap_entangle.tar.lz4 | lz4 -dc - | tar -xf - -C $HOME/.entangled
    else
  echo no have snap
fi
```

#### RUN

```
sudo systemctl daemon-reload
sudo systemctl enable entangled
sudo systemctl restart entangled && sudo journalctl -u entangled -f
```

#### Create Wallet

```
entangled keys add $WALLET
```

#### Restore Wallet

```
entangled keys add $WALLET --recover
```

#### Save Wallet

```
WALLET_ADDRESS=$(entangled keys show $WALLET -a)
VALOPER_ADDRESS=$(entangled keys show $WALLET --bech val -a)
echo "export WALLET_ADDRESS="$WALLET_ADDRESS >> $HOME/.bash_profile
echo "export VALOPER_ADDRESS="$VALOPER_ADDRESS >> $HOME/.bash_profile
source $HOME/.bash_profile
```

#### Create validator

```
entangled tx staking create-validator \
--amount 1000000aNGL \
--from $WALLET \
--commission-rate 0.1 \
--commission-max-rate 0.2 \
--commission-max-change-rate 0.01 \
--min-self-delegation 1 \
--pubkey $(entangled tendermint show-validator) \
--moniker "test" \
--identity "" \
--details "I love blockchain ❤️" \
--chain-id entangle_33133-1 \
--gas=700000 --gas-prices="20aNGL" \
-y
```

#### Edit Validator

```
entangled tx staking edit-validator \
--commission-rate 0.1 \
--new-moniker "$MONIKER" \
--identity "" \
--details "I love blockchain ❤️" \
--from $WALLET \
--chain-id entangle_33133-1 \
--gas=700000 --gas-prices="20aNGL" \
-y
```

#### Vote

```
entangled tx gov vote 1 yes --from $WALLET --chain-id entangle_33133-1  --gas=700000 --gas-prices="20aNGL" -y
```

#### Unjail

```
entangled tx slashing unjail --from $WALLET --chain-id entangle_33133-1 --gas=700000 --gas-prices="20aNGL" -y
```

#### Cheat-Sheet

```
entangled status 2>&1 | jq .ValidatorInfo
```

```
entangled q staking validator $(entangled keys show $WALLET --bech val -a)

```

```
sudo journalctl -u entangled -f
```

```
sudo systemctl status entangled
```

```
entangled status 2>&1 | jq .SyncInfo
```

```
sudo systemctl start entangled
```

```
sudo systemctl daemon-reload
```

```
entangled status 2>&1 | jq .NodeInfo
```

```
sudo systemctl stop entangled
```

```
sudo systemctl enable entangled
```

```
sudo systemctl restart entangled
```

```
sudo systemctl disable entangled
```

#### Delete

```
sudo systemctl stop entangled
sudo systemctl disable entangled
sudo rm -rf /etc/systemd/system/entangled.service
sudo rm $(which entangled)
sudo rm -rf $HOME/.entangled
sed -i "/ENTANGLE_/d" $HOME/.bash_profile
```
