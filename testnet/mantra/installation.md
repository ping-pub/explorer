# Installation

### 1. Automatic Installation

```
wget -O autoinstall.sh https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F6kqmm2W774JgeIp0vjq9%2Fuploads%2FWZ3ZuL6k2Hi6p3i1CFBr%2Fautoinstall.sh?alt=media&token=5abf9868-1fbe-48e6-8745-809a3acd80d2
```

### 2. Check Sync Log

```
journalctl -fu mantrachaind -o cat
```

### 3. Check Node Status

```
mantrachaind status 2>&1 | jq .SyncInfo
```

### 4. Load the System

```
source $HOME/.bash_profile
```

### 5. Create Wallet

```
mantrachaind keys add $WALLET
```

```
mantrachaind keys add $WALLET --recover
```

### 6. Save Wallet Info

```
MANTRA_WALLET_ADDRESS=$(mantrachaind keys show $WALLET -a)
MANTRA_VALOPER_ADDRESS=$(mantrachaind keys show $WALLET --bech val -a)
echo 'export MANTRA_WALLET_ADDRESS='${MANTRA_WALLET_ADDRESS} >> $HOME/.bash_profile
echo 'export MANTRA_VALOPER_ADDRESS='${MANTRA_VALOPER_ADDRESS} >> $HOME/.bash_profile
source $HOME/.bash_profile
```

### 7. Claim Faucet

* Open Link : https://faucet.testnet.mantrachain.io/
* Paste Address
* Done

### 8. Check Balance

```
mantrachaind q bank balances $MANTRA_WALLET_ADDRESS
```

### 9. Create Validator

```
mantrachaind tx staking create-validator \
  --amount 10000000uaum \
  --from $WALLET \
  --commission-max-change-rate "0.01" \
  --commission-max-rate "0.2" \
  --commission-rate "0.10" \
  --min-self-delegation "1" \
  --pubkey  $(mantrachaind tendermint show-validator) \
  --moniker $NODENAME \
  --chain-id $MANTRA_CHAIN_ID
  --gas-adjustment 1.4 \
  --gas=auto \
  -y
```

### 10. Update Node

```
mantrachaind tx staking edit-validator \
--new-moniker=$NODENAME \
--identity=<id> \
--website="<link>" \
--details="<desc>" \
--chain-id=$MANTRA_CHAIN_ID \
--from=$WALLET
```

### 11. Unjail

```
mantrachaind tx slashing unjail --broadcast-mode sync --from $WALLET --chain-id $MANTRA_CHAIN_ID --gas auto --gas-adjustment 1.4
```

### 12. Remove Node

```
sudo systemctl stop mantrachaind
sudo systemctl disable mantrachaind
sudo rm /etc/systemd/system/mantrachaind.service
sudo systemctl daemon-reload
rm -f $(which mantrachaind)
rm -rf .mantrachain
rm -rf mantrachaind
```
