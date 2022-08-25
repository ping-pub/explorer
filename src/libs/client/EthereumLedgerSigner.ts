
import { AccountData, AminoSignResponse, OfflineAminoSigner, Pubkey, StdSignature, StdSignDoc } from "@cosmjs/amino";
import { AddressAndPubkey } from "@cosmjs/ledger-amino";
import Transport from "@ledgerhq/hw-transport";

import Eth from "@ledgerhq/hw-app-eth";
import { LedgerEthTransactionResolution, LoadConfig } from "@ledgerhq/hw-app-eth/lib/services/types";
import { fromBech32, fromHex, toBech32, toHex } from "@cosmjs/encoding";
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import { HdPath, keccak256, pathToString } from "@cosmjs/crypto";
import { ethToEvmos } from '@tharsis/address-converter'
import eth from "@tharsis/proto/dist/proto/ethermint/crypto/v1/ethsecp256k1/keys";

import { Secp256k1 } from "@cosmjs/crypto"
import EthCrypto from "eth-crypto"
import { MessageTypeProperty, SignTypedDataVersion, TypedDataUtils, TypedMessage, MessageTypes } from "@metamask/eth-sig-util";
import { EIPToSign } from "@tharsis/transactions";
// import { recoverPublicKey } from "@metamask/eth-sig-util/dist/utils";
// export type Algo = "secp256k1" | "ed25519" | "sr25519" | "ethsecp256k1";
// export interface AccountData {
//   /** A printable address (typically bech32 encoded) */
//   readonly address: string;
//   readonly algo: Algo;
//   readonly pubkey: Uint8Array;
// }


export class EthereumLedgerSigner implements OfflineAminoSigner{
  app: Eth
  hdpath: string = "44'/60'/0'/0/0"
  prefix: string = "evmos"

  static async create(protocol: string, hdpath: HdPath, scrambleKey = "w0w", loadConfig?: LoadConfig): Promise<EthereumLedgerSigner> {
    let transport: Promise<Transport> = protocol === 'ledgerBle' ? TransportWebBLE.create() : TransportWebUSB.create()
    return transport.then(t => {
      let instance = new EthereumLedgerSigner()
      instance.hdpath = pathToString(hdpath).replace('m/', '').replace('/60/', "/60'/")
      instance.app = new Eth(t, scrambleKey, loadConfig)
      return instance
    })
  }
  
  public async getAccounts(): Promise<readonly AccountData[]> {
    return this.app.getAddress(this.hdpath).then(x => {
      const x1: AccountData = {
        pubkey: fromHex(EthCrypto.publicKey.compress(x.publicKey)),
        address: x.address,
        algo: "secp256k1" // should be 'ethsecp256k1'
      }
      const x2: AccountData = {
        pubkey: fromHex(EthCrypto.publicKey.compress(x.publicKey)),
        address: toBech32(this.prefix, fromBech32(ethToEvmos(x.address)).data),
        algo: "secp256k1" // should be 'ethsecp256k1'
      }
      return [x2, x1]
    }).catch(e=> {
      if(e.toString().indexOf('0x6b0c')> 0) {
        throw new Error('Please unlock your Ledger first')
      } 
      if(e.toString().indexOf('0x6e00')> 0) {
        throw new Error('Please open Ethereum app on the Ledger!')
      } 
      if(e.toString().indexOf('0x6511')> 0) {
        throw new Error('Please open Ethereum app on the Ledger!')
      }
      throw e
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

  public async signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse> {
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
          return output
        })
      }
      throw new Error('Account Does not exists!')
    })
  };

  // async showAddress(path?: HdPath): Promise<AddressAndPubkey> {
  //   return new Promise((r, j) => { })
  // }

  // async signTransaction(rawTxHex: string, resolution?: LedgerEthTransactionResolution) {
  //   return this.app.signPersonalMessage(this.hdpath, rawTxHex)
  // }

  async sign712( eipToSign: EIPToSign ) {
    
    /// sign typed struct
    const types = eipToSign.types as Record<string, MessageTypeProperty[]>
    const domainSeparatorHex = TypedDataUtils.hashStruct('EIP712Domain', eipToSign.domain, types, SignTypedDataVersion.V4).toString('hex')
    // console.log('hex1: ', domainSeparatorHex)
    const hashStructMessageHex = toHex(keccak256(TypedDataUtils.encodeData('Tx', eipToSign.message as Record<string, unknown>, types, SignTypedDataVersion.V4)))
    // console.log('hex2:', hashStructMessageHex)
    const signature = await this.app.signEIP712HashedMessage(this.hdpath, domainSeparatorHex, hashStructMessageHex)
    let v: string = (signature.v - 27).toString(16);
    if (v.length < 2) {
      v = "0" + v;
    }
    const sig = "0x"+signature.r + signature.s + v

    return sig
  }
}
