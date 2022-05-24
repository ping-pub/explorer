
import { AminoSignResponse, OfflineAminoSigner, Pubkey, StdSignature, StdSignDoc } from "@cosmjs/amino";
import { AddressAndPubkey } from "@cosmjs/ledger-amino";
import Transport from "@ledgerhq/hw-transport";

import Eth from "@ledgerhq/hw-app-eth";
import { LedgerEthTransactionResolution, LoadConfig } from "@ledgerhq/hw-app-eth/lib/services/types";
import { fromBech32, toHex } from "@cosmjs/encoding";
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import { HdPath } from "@cosmjs/crypto";
import { ethToCosmos } from '@tharsis/address-converter'
import eth from "@tharsis/proto/dist/proto/ethermint/crypto/v1/ethsecp256k1/keys";

export type Algo = "secp256k1" | "ed25519" | "sr25519" | "ethsecp256k1";
export interface AccountData {
  /** A printable address (typically bech32 encoded) */
  readonly address: string;
  readonly algo: Algo;
  readonly pubkey: Uint8Array;
}

export class EthereumLedgerSigner {
  app: Eth
  hdpath: string

  static async create(protocol: string, hdpath: string, scrambleKey = "w0w", loadConfig?: LoadConfig): Promise<EthereumLedgerSigner> {
    let transport: Promise<Transport> = protocol === 'ledgerBle' ? TransportWebBLE.create() : TransportWebUSB.create()
    return transport.then(t => {
      let instance = new EthereumLedgerSigner()
      instance.hdpath = hdpath
      instance.app = new Eth(t, scrambleKey, loadConfig)
      return instance
    })
  }
  async getAccounts(): Promise<readonly AccountData[]> {
    console.log('eth:', this.app, this.hdpath)

    return this.app.getAddress("44'/60'/0'/0/0").then(x => {
      const x1: AccountData = {
        pubkey: new TextEncoder().encode(x.publicKey),
        address: x.address,
        algo: "ethsecp256k1" // should be 'ethsecp256k1'
      }
      const x2: AccountData = {
        pubkey: new TextEncoder().encode(x.publicKey),
        address: ethToCosmos(x.address),
        algo: "ethsecp256k1" // // should be 'ethsecp256k1'
      }
      return [x1, x2]
    })
  };

  goEthAddress(address) {
    return `0x${toHex(fromBech32(address).data)}`
  }

  toPubkey(keyBytes: Uint8Array): Pubkey {
    return {
      "type": "ethermint.crypto.v1.ethsecp256k1.PubKey",
      value: new eth.ethermint.crypto.v1.ethsecp256k1.PubKey({
        key: keyBytes,
      })
    }
  }

  async signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse> {
    const ethAddr = this.goEthAddress(signerAddress)
    return this.getAccounts().then(list => {
      const acc = list.find(x => x.address === ethAddr)
      if (acc) {
        const messageHex: string = toHex(new TextEncoder().encode(JSON.stringify(signDoc)))
        this.app.signPersonalMessage(this.hdpath, messageHex).then(result => {
          const signature: StdSignature = {
            pub_key: this.toPubkey(acc.pubkey),
            signature: result['s']
          }
          const output: AminoSignResponse = {
            signed: signDoc,
            signature
          }
          console.log(result, output)
          return output
        })
      }
      throw new Error('Account Does not exists!')
    })
  };

  async showAddress(path?: HdPath): Promise<AddressAndPubkey> {
    return new Promise((r, j) => { })
  }

  async signTransaction(rawTxHex: string, resolution: LedgerEthTransactionResolution) {
    return this.app.signTransaction(this.hdpath, rawTxHex, resolution)
  }
}
