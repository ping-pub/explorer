# Cheat Sheet

### Cheat-Sheet

Check Sync status and node info

```
curl http://127.0.0.1:26657/status | jq
```

Sync status

```
curl -s localhost:26657/status | jq 
```

Check logs

```
sudo journalctl -u namadad -f
```

Sync status (false = node synced)

```
curl -s localhost:26657/status | jq .result.sync_info.catching_up
```

Create Wallet

```
namadaw gen --alias $WALLET
```

Restore Wallet

```
namadaw derive --alias $WALLET
```

Find Wallet

```
namadaw find --alias $WALLET
```

List Wallet

```
namadaw  list
```

Delete wallet

```
namadaw remove --alias $WALLET --do-it
```

Check Balance

```
namadac balance --owner $WALLET
```

Check List Wallet Validator

```
namadac bonded-stake
```

### Snapshot

```
sudo systemctl stop namadad.service
cd $HOME/.local/share/namada
wget http://winnode.site/snapshot/namada/namada-snapshot.tar.lz4
cp $HOME/.local/share/namada/shielded-expedition.b40d8e9055/cometbft/data/priv_validator_state.json /$HOME
rm -rf shielded-expedition.b40d8e9055/db/
rm -rf shielded-expedition.b40d8e9055/cometbft/data/
lz4 -d data.tar.lz4 | tar -xvf -
cp $HOME/priv_validator_state.json $HOME/.local/share/namada/shielded-expedition.b40d8e9055/cometbft/data/
sudo systemctl start namadad.service
sudo journalctl -u namadad.service -f --output cat
```

### Grafana

```
wget https://raw.githubusercontent.com/Winnode/Validator-Testnet-main/main/Namada%20Shielded%20Epedition/grafana.sh
```

```
chmod +x grafana.sh
```

```
./grafana.sh
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
