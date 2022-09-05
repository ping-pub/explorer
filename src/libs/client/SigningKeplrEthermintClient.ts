import { fromBase64 } from '@cosmjs/encoding'
import { Int53 } from '@cosmjs/math'
import {
  EncodeObject, makeAuthInfoBytes, makeSignDoc, OfflineSigner,
} from '@cosmjs/proto-signing'
import {
  SignerData, SigningStargateClient, SigningStargateClientOptions, StdFee,
} from '@cosmjs/stargate'
import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { Any } from 'cosmjs-types/google/protobuf/any'

export default class SigningKeplerEthermintClient {
  private signer

  private client

  static async offline(signer: OfflineSigner, options?: SigningStargateClientOptions): Promise<SigningKeplerEthermintClient> {
    const instance = new SigningKeplerEthermintClient()
    instance.client = await SigningStargateClient.offline(signer, options)
    instance.signer = signer
    return Promise.resolve(instance)
  }

  async sign(signerAddress: string, messages: readonly EncodeObject[], fee: StdFee, memo: string, explicitSignerData?: SignerData): Promise<Uint8Array> {
    const account = await this.signer.getAccounts()
    const acc = account.find(x => x.address === signerAddress)
    if (!acc) {
      throw new Error('The signer address dose not exsits in Ledger!')
    }
    // Custom typeUrl for EVMOS
    const pubk = Any.fromPartial({
      typeUrl: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
      value: PubKey.encode({
        key: acc.pubkey,
      }).finish(),
    })

    const txBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages,
        memo,
      },
    }
    const txBodyBytes = this.client.registry.encode(txBodyEncodeObject)
    const gasLimit = Int53.fromString(fee.gas).toNumber()
    const authInfoBytes = makeAuthInfoBytes([{ pubkey: pubk, sequence: explicitSignerData.sequence }], fee.amount, gasLimit)
    const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, explicitSignerData.chainId, explicitSignerData.accountNumber)
    const { signature, signed } = await this.signer.signDirect(signerAddress, signDoc)

    // returns txBytes for broadcast
    return Promise.resolve(TxRaw.encode({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    }).finish())
  }
}
