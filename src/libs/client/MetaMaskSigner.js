import { pathToString } from '@cosmjs/crypto'
import { fromHex } from '@cosmjs/encoding'
import { ethToEvmos } from '@tharsis/address-converter'

export default class MetaMaskSigner {
  static create(hdpath) {
    const signer = new MetaMaskSigner()
    signer.hdpath = pathToString(hdpath).replace('m/', '').replace('/60/', "/60'/")
    signer.ethereum = window.ethereum
    return signer
  }

  async getAccounts() {
    // eth_accounts, eth_requestAccounts
    return this.ethereum.request({ method: 'eth_accounts' }).then(data => data.map(x => ({
      pubkey: fromHex(x.substring(2)), // should set to public key
      address: ethToEvmos(x),
      algo: 'ethsecp256k1',
    })))
  }

  async sign(signer, eipToSign) {
    return this.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [signer, JSON.stringify(eipToSign)],
    })
  }
  // signAmino: (signerAddress: string, signDoc: StdSignDoc) => Promise<AminoSignResponse>;
}
