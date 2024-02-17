# Cheat Sheet

#### USE COMMAND

```
sudo systemctl start pryzm
```

```
sudo systemctl restart pryzm
```

```
sudo systemctl stop pryzm
```

```
sudo systemctl enable pryzm
```

```
sudo systemctl disable pryzm
```

```
pryzmd status 2>&1 | jq .SyncInfo

```

```
pryzmd status 2>&1 | jq .ValidatorInfo
```

#### Snapshot 4H

```
sudo systemctl stop pryzm
cp $HOME/.pryzm/data/priv_validator_state.json $HOME/.pryzm/priv_validator_state.json.backup
rm -rf $HOME/.pryzm/data $HOME/.pryzm/wasmPath
curl https://testnet-files.itrocket.net/pryzm/snap_pryzm.tar.lz4 | lz4 -dc - | tar -xf - -C $HOME/.pryzm
mv $HOME/.pryzm/priv_validator_state.json.backup $HOME/.pryzm/data/priv_validator_state.json
sudo systemctl restart pryzm && sudo journalctl -u pryzm -f
```

#### DELETE

```
cd $HOME
sudo systemctl stop pryzm
sudo systemctl disable pryzm
sudo rm /etc/systemd/system/pryzm.service
sudo systemctl daemon-reload
sudo rm -f $(which pryzmd)
sudo rm -rf $HOME/.pryzm
sudo rm -rf $HOME/go
```
