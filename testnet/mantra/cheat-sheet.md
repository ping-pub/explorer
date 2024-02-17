# Cheat Sheet

Delegate

```
mantrachaind tx staking delegate $VALOPER_ADDRESS 10000000uaum --from $WALLET --chain-id $MANTRA_CHAIN_ID --fees 5000uaum
```

Redelegate

```
mantrachaind tx staking redelegate $VALOPER_ADDRESS <dst-validator-operator-addr> 100000000uaum --from=$WALLET --chain-id=$MANTRA_CHAIN_ID
```

Withdraw

```
mantrachaind tx distribution withdraw-all-rewards --from=$WALLET --chain-id=$MANTRA_CHAIN_ID
```
