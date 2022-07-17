/* eslint-disable camelcase */

import { SigningStargateClient } from '@cosmjs/stargate'
// import { MsgTransfer } from './msg-transfer'
// import { createMessageSend } from '@tharsis/transactions'
import { AminoTypes } from './aminotypes'
import { MsgSwapExactAmountIn } from '../msg'

const amino_1 = require('@cosmjs/amino')
const encoding_1 = require('@cosmjs/encoding')
const math_1 = require('@cosmjs/math')
const proto_signing_1 = require('@cosmjs/proto-signing')
const tx_5 = require('cosmjs-types/cosmos/tx/v1beta1/tx')
const signing_1 = require('cosmjs-types/cosmos/tx/signing/v1beta1/signing')

export default class PingWalletClient extends SigningStargateClient {
  static async offline(signer, options = {}) {
    const instance = new PingWalletClient(undefined, signer, options)

    instance.registry.register('/osmosis.gamm.v1beta1.MsgSwapExactAmountIn', MsgSwapExactAmountIn)

    // console.log('registory:', instance.registry, AminoTypes)
    const { aminoTypes = new AminoTypes({ prefix: options.prefix }) } = options
    instance.aminoTypes = aminoTypes
    // console.log('aminoType:', instance.aminoTypes)
    return instance
  }

  // async signEthermintTransaction(signerAddress, messages, fee, memo, { accountNumber, sequence, chainId }) {
  //   // const msgs = messages.map(msg => this.aminoTypes.toAmino(msg))
  //   const tosign = createMessageSend(chainId, signerAddress, fee, memo, null)
  //   const { signature, signed } = await this.signer.signAmino(tosign.legacyAmino)
  //   // const { signature, signed } = await this.signer.signAmino(signerAddress, signDoc)
  //   const signedTxBody = {
  //     messages,
  //     memo: signed.memo,
  //   }
  //   const signedTxBodyEncodeObject = {
  //     typeUrl: '/cosmos.tx.v1beta1.TxBody',
  //     value: signedTxBody,
  //   }
  //   const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject)
  //   const signedGasLimit = math_1.Int53.fromString(signed.fee.gas).toNumber()
  //   const signedSequence = math_1.Int53.fromString(signed.sequence).toNumber()
  //   const signedAuthInfoBytes = proto_signing_1.makeAuthInfoBytes([{ pubkey: signature.pub_key, sequence: signedSequence }], signed.fee.amount, signedGasLimit, signMode)
  //   return tx_5.TxRaw.fromPartial({
  //     bodyBytes: signedTxBodyBytes,
  //     authInfoBytes: signedAuthInfoBytes,
  //     signatures: [encoding_1.fromBase64(signature.signature)],
  //   })
  // }

  async signAmino2(signerAddress, messages, fee, memo, { accountNumber, sequence, chainId }) {
    const accountFromSigner = (await this.signer.getAccounts()).find(account => account.address === signerAddress)
    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer')
    }
    const pubkey = proto_signing_1.encodePubkey(amino_1.encodeSecp256k1Pubkey(accountFromSigner.pubkey))
    const signMode = signing_1.SignMode.SIGN_MODE_LEGACY_AMINO_JSON
    const msgs = messages.map(msg => this.aminoTypes.toAmino(msg))
    const signDoc = amino_1.makeSignDoc(msgs, fee, chainId, memo, accountNumber, sequence)
    const { signature, signed } = await this.signer.signAmino(signerAddress, signDoc)
    const signedTxBody = {
      messages: signed.msgs.map(msg => this.aminoTypes.fromAmino(msg)),
      memo: signed.memo,
    }
    const signedTxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: signedTxBody,
    }
    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject)
    const signedGasLimit = math_1.Int53.fromString(signed.fee.gas).toNumber()
    const signedSequence = math_1.Int53.fromString(signed.sequence).toNumber()
    const signedAuthInfoBytes = proto_signing_1.makeAuthInfoBytes([{ pubkey, sequence: signedSequence }], signed.fee.amount, signedGasLimit, signMode)
    return tx_5.TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [encoding_1.fromBase64(signature.signature)],
    })
  }
}
