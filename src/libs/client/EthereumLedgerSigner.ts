
import { AccountData, AminoSignResponse, encodeSecp256k1Signature, OfflineAminoSigner, StdSignature, StdSignDoc } from "@cosmjs/amino";
import Transport from "@ledgerhq/hw-transport";

import Eth from "@ledgerhq/hw-app-eth";
import { LedgerEthTransactionResolution, LoadConfig } from "@ledgerhq/hw-app-eth/lib/services/types";
import { toHex } from "@cosmjs/encoding";

class EthereumLedgerSigner implements OfflineAminoSigner {
  app: Eth
  hdpath: string
  constructor(trasport: Transport, hdpath: string, scrambleKey?: string, loadConfig?: LoadConfig) {
    this.app = new Eth(trasport, scrambleKey, loadConfig)
  }
  async getAccounts(): Promise<readonly AccountData[]> {
    return this.app.getAddress(this.hdpath).then(x => {
      const x2: AccountData = {
        pubkey: new TextEncoder().encode(x.publicKey),
        address: x.address,
        algo: "secp256k1"
      }
      return [x2]
    })
  };

  async signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse> {
    return this.getAccounts().then(list => {
      const acc = list.find(x => x.address === signerAddress)
      if (acc) {
      const messageHex: string = toHex(new TextEncoder().encode(JSON.stringify(signDoc)))
      this.app.signPersonalMessage(this.hdpath, messageHex).then(r => {
        const signature: StdSignature = encodeSecp256k1Signature(acc.pubkey, new TextEncoder().encode(r['s']))
        const output: AminoSignResponse = {
          signed: signDoc,
          signature
        } 
        console.log(r)
        return output
      })
      }
      throw new Error('Account Does not exists!')
    })
  };

  signTransaction(rawTxHex: string, resolution: LedgerEthTransactionResolution) {
    return this.app.signTransaction(this.hdpath, rawTxHex, resolution )
  }
}
