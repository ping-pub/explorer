# Cheat Sheet

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
