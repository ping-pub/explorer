# Installation

#### Manual installation

#### NOTE : 1 EPOCH ESTIMATE 6-10 HOURS

```
sudo apt update && sudo apt upgrade -y
sudo apt-get install -y make git-core libssl-dev pkg-config libclang-12-dev build-essential protobuf-compiler unzip jq
```

Install Go, if needed

```
cd $HOME
! [ -x "$(command -v go)" ] && {
VER="1.20.3"
wget "https://golang.org/dl/go$VER.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$VER.linux-amd64.tar.gz"
rm "go$VER.linux-amd64.tar.gz"
[ ! -f ~/.bash_profile ] && touch ~/.bash_profile
echo "export PATH=$PATH:/usr/local/go/bin:~/go/bin" >> ~/.bash_profile
source $HOME/.bash_profile
}
[ ! -d ~/go/bin ] && mkdir -p ~/go/bin
```

Install Rust & Cargo

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env
```

Replace your Validator and Wallet name

```
echo "export ALIAS="CHOOSE_A_NAME_FOR_YOUR_VALIDATOR"" >> $HOME/.bash_profile
echo "export MEMO="YOUR_tpknam1_ADDR"" >> $HOME/.bash_profile
echo "export WALLET="wallet"" >> $HOME/.bash_profile
echo "export PUBLIC_IP=$(wget -qO- eth0.me)" >> $HOME/.bash_profile
echo "export TM_HASH="v0.1.4-abciplus"" >> $HOME/.bash_profile
echo "export CHAIN_ID="shielded-expedition.b40d8e9055"" >> $HOME/.bash_profile
echo "export BASE_DIR="$HOME/.local/share/namada"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

Install CometBFT

```
cd $HOME
rm -rf cometbft
git clone https://github.com/cometbft/cometbft.git
cd cometbft
git checkout v0.37.2
make build
sudo cp $HOME/cometbft/build/cometbft /usr/local/bin/
cometbft version
```

Build Namada binaries

```
cd $HOME
rm -rf namada
git clone https://github.com/anoma/namada
cd namada
wget https://github.com/anoma/namada/releases/download/v0.31.1/namada-v0.31.1-Linux-x86_64.tar.gz
tar -xvf namada-v0.31.1-Linux-x86_64.tar.gz
rm namada-v0.31.1-Linux-x86_64.tar.gz
cd namada-v0.31.1-Linux-x86_64
sudo mv namad* /usr/local/bin/
if [ ! -d "$BASE_DIR" ]; then
    mkdir -p "$BASE_DIR"
fi
```

Check Namada version

```
namada --version
```

Join-network as Full node

```
namada client utils join-network --chain-id $CHAIN_ID
```

Create Service file

```
sudo tee /etc/systemd/system/namadad.service > /dev/null <<EOF
[Unit]
Description=namada
After=network-online.target

[Service]
User=YOUR_LINUX_USER
WorkingDirectory=$BASE_DIR
Environment="CMT_LOG_LEVEL=p2p:none,pex:error"
Environment="NAMADA_CMT_STDOUT=true"
ExecStart=$(which namada) node ledger run
StandardOutput=syslog
StandardError=syslog
Restart=always
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

Enable and start service

```
sudo systemctl daemon-reload
sudo systemctl enable namadad
sudo systemctl restart namadad && sudo journalctl -u namadad -f
```

Set Port

```
sudo ufw default allow outgoing 
sudo ufw default deny incoming 
sudo ufw allow ssh/tcp 
sudo ufw allow 26656/tcp
sudo ufw enable
```

Create wallet

```
namadaw gen --alias $WALLET
```

Restore wallet :

* _Make sure wallet address is on this_ [_list_](https://raw.githubusercontent.com/anoma/namada-shielded-expedition/main/balances.toml)
* _No Change Alias (`$WALLET`) & Skip Password (`Enter`)= `Default Address`_

```
namadaw derive --alias $WALLET
```

Find your wallet address

```
namadaw find --alias $WALLET
```

> Copy the implicit address (starts with tnam...) for the next step

* Fund your wallet from [faucet1](https://faucet.housefire.luminara.icu/)
* Fund your wallet from [faucet2](https://faucet.heliax.click/)

After a couple of minutes, the check the balance

```
namadac balance --owner $WALLET
```

List known keys and addresses in the wallet

```
namadaw list
```

Delete wallet

```
namadaw remove --alias $WALLET --do-it
```

Check Sync status, once your node is fully synced, the output from above will say `false`

```
curl http://127.0.0.1:26657/status | jq .result.sync_info.catching_up
```

### Initiate a validator

```
namadac init-validator --commission-rate 0.07 --max-commission-rate-change 1 --signing-keys $WALLET --alias $ALIAS --email <EMAIL_ADDRESS> --account-keys $WALLET --memo $MEMO
```

Find your `established` validator address

```
namadaw list | grep -A 1 "\"$ALIAS\"" | grep "Established"
```

Replace your Validator address, save and import variables into system

```
VALIDATOR_ADDRESS=$(namadaw list | grep -A 1 "\"$ALIAS\"" | grep "Established" | awk '{print $3}')
echo "export VALIDATOR_ADDRESS="$VALIDATOR_ADDRESS"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

Restart the node and wait for 2 epochs

```
sudo systemctl restart namadad && sudo journalctl -u namadad -f
```

Check epoch

```
namada client epoch
```

### Delegate tokens

```
namadac bond --validator $ALIAS --source $WALLET --amount 1000 --memo $MEMO
```

Wait for 3 epochs and check validator is in the consensus set

```
namadac validator-state --validator $ALIAS
```

Check your validator bond status

```
namada client bonds --owner $WALLET
```

Find your validator status

```
namada client validator-state --validator $VALIDATOR_ADDRESS
```

### Add stake

```
namadac bond --source $WALLET --validator $VALIDATOR_ADDRESS --amount 1000
```

Query the set of validators

```
namadac bonded-stake
```

Unbond the tokens

```
namadac unbond --source $WALLET --validator $VALIDATOR_ADDRESS --amount 1000
```

Wait for 6 epochs, then check when the unbonded tokens can be withdrawed

```
namadac bonds --owner $WALLET
```

### Withdraw the unbonded tokens

```
namadac withdraw --source $WALLET --validator $VALIDATOR_ADDRESS
```

### Send Funds

namada transfer --target \<RECEIVER-KEY(tnam1..)> --source $WALLET> --amount 100 --token NAM

### Unjail validator

namadac unjail-validator --validator $VALIDATOR\_ADDRESS

### Claim rewards

namadac claim-rewards --validator $VALIDATOR\_ADDRESS

### Wallet operations

Create test wallets

```
namada wallet gen --alias ${WALLET}1
```

```
namada wallet gen --alias ${WALLET}2
```

Restore existing wallets

```
namada wallet derive --alias ${WALLET}1
```

Find your wallet address

```
namada wallet find --alias ${WALLET}1
```

* Fund your wallet from [faucet1](https://faucet.housefire.luminara.icu/)
* Fund your wallet from [faucet2](https://faucet.heliax.click/)

> After a couple of minutes, the check the balance

Check balance

```
namada client balance --owner ${WALLET}1
```

Check keys

```
namada wallet list
```

Send payment from your address to other address

```
namada client transfer --source ${WALLET}1 --target ${WALLET}2 --token NAM --amount 100 --signing-keys ${WALLET}1
```

### Vote

Check consensus state

```
curl -s localhost:26657/consensus_state | jq .result.round_state.height_vote_set[0].prevotes_bit_array
```

Full consensus state

```
curl -s localhost:26657/dump_consensus_state | jq
```

Your validator votes (prevote)

```
curl -s http://localhost:26657/dump_consensus_state | jq '.result.round_state.votes[0].prevotes' | grep $(curl -s http://localhost:26657/status | jq -r '.result.validator_info.address[:12]')
```

### Delete Node

```
cd $HOME && mkdir $HOME/namada_backup
cp -r $HOME/.local/share/namada/pre-genesis $HOME/namada_backup/
systemctl stop namadad && systemctl disable namadad
rm /etc/systemd/system/namada* -rf
rm $(which namada) -rf
rm /usr/local/bin/namada* /usr/local/bin/cometbft -rf
rm $HOME/.namada* -rf
rm $HOME/.local/share/namada -rf
rm $HOME/namada -rf
rm $HOME/cometbft -rf
```
