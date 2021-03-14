import { getSigner } from "./getSigner";
import * as msgType from "./v1-msg";

export function getMsg() {
  return msgType;
}

export async function MsgSend({
  senderAddress,
  toAddress,
  memo,
  account_number,
  sequence,
  gas,
  amount,
  account,
  amounts,
  index
}) {
  const msg = msgType.MsgSend(senderAddress, {
    toAddress,
    amounts
  });
  return await getTx(
    {
      account,
      account_number,
      amount,
      gas,
      index,
      memo,
      sequence
    },
    msg
  );
}

export async function MsgDelegate({
  senderAddress,
  validatorAddress,
  memo,
  account_number,
  sequence,
  gas,
  amount,
  account,
  index,
  denom
}) {
  const msg = msgType.MsgDelegate(senderAddress, {
    validatorAddress,
    amount,
    denom
  });
  return await getTx(
    {
      account,
      account_number,
      amount,
      gas,
      index,
      memo,
      sequence
    },
    msg
  );
}

export async function getTx(
  { account, account_number, amount, gas, index, memo, sequence },
  msg
) {
  const msgs = [msg];
  const fee = {
    amount: [{ amount: gas + "", denom: "uatom" }],
    gas: gas + Number(amount) + ""
  };
  const sendMsg = {
    account_number,
    chain_id: "cosmoshub-3",
    fee,
    memo,
    msgs,
    sequence
  };
  let signer;
  try {
    signer = await getSigner("ledger", account, index);
  } catch (e) {
    console.log(e);
  }
  if (!signer) return;
  const { signature, publicKey } = await signer(JSON.stringify(sendMsg));
  const txSign = {
    signature: signature.toString(`base64`),
    account_number,
    sequence,
    pub_key: {
      type: `tendermint/PubKeySecp256k1`,
      value: publicKey.toString(`base64`)
    }
  };

  let txBroadcast = {
    tx: {
      msg: msgs,
      fee,
      memo,
      signatures: [txSign]
    },
    mode: "async"
  };

  return txBroadcast;
}
