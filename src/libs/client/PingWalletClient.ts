import {
    AminoTypes,
    SignerData,
    SigningStargateClient,
    SigningStargateClientOptions,
    StargateClient
} from '@cosmjs/stargate';
import { Registry, OfflineSigner, EncodeObject } from '@cosmjs/proto-signing';
import { defaultRegistryTypes } from '@cosmjs/stargate';
import { LedgerSigner } from '@cosmjs/ledger-amino';
import { EthereumLedgerSigner } from './EthereumLedgerSigner';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble'
import { HdPath, stringToPath } from '@cosmjs/crypto';
import { StdFee } from "@cosmjs/amino";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

// export async function sign(device, chainId, signerAddress, messages, fee, memo, signerData) {
//     // let transport
//     let signer
//     const hdpath = getHdPath(signerAddress)
//     const coinType = Number(hdpath[1])
//     switch (device) {
//       case 'ledgerBle':
//         signer = await getLedgerAppName(coinType, device, hdpath)
//         break
//       case 'ledgerUSB':
//         signer = await getLedgerAppName(coinType, device, hdpath)
//         break
//       case 'keplr':
//       default:
//         if (!window.getOfflineSigner || !window.keplr) {
//           throw new Error('Please install keplr extension')
//         }
//         await window.keplr.enable(chainId)
//         signer = window.getOfflineSignerOnlyAmino(chainId)
//     }

//     // Ensure the address has some tokens to spend
//     const client = await PingWalletClient.offline(signer)
//     return client.signAmino(device.startsWith('ledger') ? toSignAddress(signerAddress) : signerAddress, messages, fee, memo, signerData)
//   }


export declare type SigningClient = SigningStargateClient | SigningEthermintClient;

export async function getSigningClient(device, hdpath): Promise<SigningClient> {
    let ledgerAppName = 'Cosmos'
    let coinType = Number(hdpath[1])
    switch (coinType) {
        case 60:
            return new SigningEthermintClient(await EthereumLedgerSigner.create(device, hdpath)) // 'Ethereum'
        case 529:
            ledgerAppName = 'Secret' // 'Secret'
            break
        case 852:
            ledgerAppName = 'Desmos' // 'Desmos'
            break
        case 118:
        default:
    }
    const transport = await (device === 'ledgerBle' ? TransportWebBLE.create() : TransportWebUSB.create())
    const signer = new LedgerSigner(transport, { hdPaths: [hdpath], ledgerAppName })
    return SigningStargateClient.offline(signer)
}

export class SigningEthermintClient {
    readonly signer: OfflineSigner
    constructor(signer: OfflineSigner) {
        this.signer = signer
    }

    sign(signerAddress: string, messages: readonly EncodeObject[], fee: StdFee, memo: string, explicitSignerData?: SignerData): Promise<TxRaw> {
        return new Promise(() => { return TxRaw.decode(null) })
    }

}
