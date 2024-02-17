# Installation

#### Update system package and install build tools

```
sudo apt -q update
sudo apt -qy install curl git jq lz4 build-essential fail2ban ufw
sudo apt -qy upgrade
```

#### Configure Moniker

```
MONIKER="<your-moniker-name>"
```

#### Install Go

```
sudo rm -rf /usr/local/go
curl -Ls https://go.dev/dl/go1.20.3.linux-amd64.tar.gz | sudo tar -xzf - -C /usr/local
eval $(echo 'export PATH=$PATH:/usr/local/go/bin' | sudo tee /etc/profile.d/golang.sh)
eval $(echo 'export PATH=$PATH:$HOME/go/bin' | tee -a $HOME/.profile)
```

#### Download Binaries

```
cd $HOME
wget https://storage.googleapis.com/pryzm-zone/core/0.11.1/pryzmd-0.11.1-linux-amd64
sudo mv pryzmd-0.11.1-linux-amd64 pryzmd
sudo chmod +x pryzmd
```

#### Prepare binaries for cosmovisor

```
mkdir -p $HOME/.pryzm/cosmovisor/genesis/bin
mv pryzmd $HOME/.pryzm/cosmovisor/genesis/bin/
```

#### Create symlinks

```
sudo ln -s $HOME/.pryzm/cosmovisor/genesis $HOME/.pryzm/cosmovisor/current -f
sudo ln -s $HOME/.pryzm/cosmovisor/current/bin/pryzmd /usr/local/bin/pryzmd -f
```

#### Cosmovisor Setup

```
go install cosmossdk.io/tools/cosmovisor/cmd/cosmovisor@v1.5.0
```

#### Create Service

```
sudo tee /etc/systemd/system/pryzm.service > /dev/null << EOF
[Unit]
Description=pryzm node service
After=network-online.target
 
[Service]
User=$USER
ExecStart=$(which cosmovisor) run start
Restart=on-failure
RestartSec=10
LimitNOFILE=65535
Environment="DAEMON_HOME=$HOME/.pryzm"
Environment="DAEMON_NAME=pryzmd"
Environment="UNSAFE_SKIP_BACKUP=true"
 
[Install]
WantedBy=multi-user.target
EOF
```

#### Enable Service

```
sudo systemctl daemon-reload
sudo systemctl enable pryzm
```

#### Initialize Node

```
pryzmd config chain-id indigo-1
pryzmd config keyring-backend test
pryzmd config node tcp://localhost:23257
```

```
pryzmd init $MONIKER --chain-id indigo-1
```

#### Download Genesis & Addrbook

```
curl -Ls https://snap.nodex.one/pryzm-testnet/genesis.json > $HOME/.pryzm/config/genesis.json
curl -Ls https://snap.nodex.one/pryzm-testnet/addrbook.json > $HOME/.pryzm/config/addrbook.json
```

#### Configure Seeds

```
sed -i -e "s|^seeds *=.*|seeds = \"d1d43cc7c7aef715957289fd96a114ecaa7ba756@testnet-seeds.nodex.one:23210\"|" $HOME/.pryzm/config/config.toml
```

#### Configure Gas Prices

```
sed -i -e "s|^minimum-gas-prices *=.*|minimum-gas-prices = \"0.015upryzm,0.01factory/pryzm15k9s9p0ar0cx27nayrgk6vmhyec3lj7vkry7rx/uusdsim\"|" $HOME/.pryzm/config/app.toml
```

#### Pruning Setting

```
sed -i \
  -e 's|^pruning *=.*|pruning = "custom"|' \
  -e 's|^pruning-keep-recent *=.*|pruning-keep-recent = "100"|' \
  -e 's|^pruning-keep-every *=.*|pruning-keep-every = "0"|' \
  -e 's|^pruning-interval *=.*|pruning-interval = "19"|' \
  $HOME/.pryzm/config/app.toml
```

#### Custom Port

```
sed -i -e "s%^proxy_app = \"tcp://127.0.0.1:26658\"%proxy_app = \"tcp://127.0.0.1:23258\"%; s%^laddr = \"tcp://127.0.0.1:26657\"%laddr = \"tcp://127.0.0.1:23257\"%; s%^pprof_laddr = \"localhost:6060\"%pprof_laddr = \"localhost:23260\"%; s%^laddr = \"tcp://0.0.0.0:26656\"%laddr = \"tcp://0.0.0.0:23256\"%; s%^prometheus_listen_addr = \":26660\"%prometheus_listen_addr = \":23266\"%" $HOME/.pryzm/config/config.toml
sed -i -e "s%^address = \"tcp://0.0.0.0:1317\"%address = \"tcp://0.0.0.0:23217\"%; s%^address = \":8080\"%address = \":23280\"%; s%^address = \"0.0.0.0:9090\"%address = \"0.0.0.0:23290\"%; s%^address = \"0.0.0.0:9091\"%address = \"0.0.0.0:23291\"%; s%:8545%:23245%; s%:8546%:23246%; s%:6065%:23265%" $HOME/.pryzm/config/app.toml
```

#### Download Snapshots

```
curl https://snapshots-testnet.nodejumper.io/pryzm-testnet/pryzm-testnet_latest.tar.lz4 | lz4 -dc - | tar -xf - -C $HOME/.pryzm
```

```
[[ -f $HOME/.pryzm/data/upgrade-info.json ]] && cp $HOME/.pryzm/data/upgrade-info.json $HOME/.pryzm/cosmovisor/genesis/upgrade-info.json
```

#### Start Service

```
sudo systemctl start pryzm
```

#### Add Wallet

```
pryzmd keys add wallet
```

#### Restore Wallet

```
pryzmd keys add wallet --recover
```

#### List Wallet

```
pryzmd keys list

```

#### Delete Wallet

```
pryzmd keys delete wallet
```

#### Query wallet balances

```
pryzmd q bank balances $(pryzmd keys show wallet -a)

```

#### Create validator

```
pryzmd tx staking create-validator \
--amount 1000000upryzm \
--pubkey $(pryzmd tendermint show-validator) \
--moniker "your-moniker-name" \
--identity "your-keybase-id" \
--details "your-details" \
--website "your-website" \
--security-contact "your-email" \
--chain-id indigo-1 \
--commission-rate 0.05 \
--commission-max-rate 0.20 \
--commission-max-change-rate 0.01 \
--min-self-delegation 1 \
--from wallet \
--gas-adjustment 1.4 \
--gas auto \
--gas-prices 0.015upryzm \
-y
```

#### Edit validator

```
pryzmd tx staking edit-validator \
--new-moniker "your-moniker-name" \
--identity "your-keybase-id" \
--details "your-details" \
--website "your-website" \
--security-contact "your-email" \
--chain-id indigo-1 \
--commission-rate 0.05 \
--from wallet \
--gas-adjustment 1.4 \
--gas auto \
--gas-prices 0.015upryzm \
-y
```

#### Unjail validator

```
pryzmd tx slashing unjail --from wallet --chain-id indigo-1 --gas-adjustment 1.4 --gas auto --gas-prices 0.015upryzm -y
```

#### Validator jail reason

```
pryzmd query slashing signing-info $(pryzmd tendermint show-validator)
```

#### List active validator

```
pryzmd q staking validators -oj --limit=3000 | jq '.validators[] | select(.status=="BOND_STATUS_BONDED")' | jq -r '(.tokens|tonumber/pow(10; 6)|floor|tostring) + " \t " + .description.moniker' | sort -gr | nl
```

#### View validator details

```
pryzmd q staking validator $(pryzmd keys show wallet --bech val -a)
```
