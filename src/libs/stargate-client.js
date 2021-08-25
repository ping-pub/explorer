import {
  makeAuthInfoBytes, makeSignDoc, Registry,
  // makeSignBytes,
} from '@cosmjs/proto-signing'

export default class Client {
  async signDirect(signerAddress, messages, fee, memo, { accountNumber, sequence, chainId }) {
    //   const accountFromSigner = (await this.signer.getAccounts()).find(account => account.address === signerAddress)
    //   if (!accountFromSigner) {
    //     throw new Error('Failed to retrieve account from signer')
    //   }
    const pubkey = ''
    const txBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages,
        memo,
      },
    }
    const txBodyBytes = new Registry().encode(txBodyEncodeObject)
    const gasLimit = 1
    const authInfoBytes = makeAuthInfoBytes([pubkey], fee.amount, gasLimit, sequence)
    const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber)
    
    const { signature, signed } = await this.signer.signDirect(signerAddress, signDoc)
    return tx_4.TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [encoding_1.fromBase64(signature.signature)],
    })
  }
}
