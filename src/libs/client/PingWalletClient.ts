import {
    AminoTypes,
    SignerData,
    SigningStargateClient,
    defaultRegistryTypes,
} from '@cosmjs/stargate';
import { Registry, EncodeObject, TxBodyEncodeObject, makeAuthInfoBytes, GeneratedType } from '@cosmjs/proto-signing';
import { LedgerSigner } from '@cosmjs/ledger-amino';
import { EthereumLedgerSigner } from './EthereumLedgerSigner';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble'
import { makeSignDoc, OfflineAminoSigner, Pubkey, pubkeyType, StdFee } from "@cosmjs/amino";
import { TxBody, TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {
    generateMessageWithMultipleTransactions,
    MSG_WITHDRAW_DELEGATOR_REWARD_TYPES,
    IBC_MSG_TRANSFER_TYPES,
    generateTypes,
    generateFee,
    createEIP712,
} from "@tharsis/eip712"
import {
    createTxRawEIP712, signatureToWeb3Extension, Chain,
    createMessageSend, createTxMsgWithdrawDelegatorReward, Fee, MsgWithdrawDelegatorRewardParams,
    createTxMsgMultipleWithdrawDelegatorReward,
    MsgMultipleWithdrawDelegatorRewardParams,
    EIPToSign,
} from '@tharsis/transactions'
import { 
    createTransactionWithMultipleMessages, 
    createMsgWithdrawDelegatorReward, 
    createIBCMsgTransfer 
} from '@tharsis/proto'
import { fromBase64, fromBech32, fromHex, toBase64, toHex } from '@cosmjs/encoding';
//import { generateEndpointBroadcast, generatePostBodyBroadcast } from '@tharsis/provider'
import { keccak256, Secp256k1 } from "@cosmjs/crypto"
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { MessageTypeProperty, MessageTypes, SignTypedDataVersion, TypedDataUtils, TypedMessage, } from '@metamask/eth-sig-util'
import MetaMaskSigner from './MetaMaskSigner.js'
import * as eth from '@tharsis/proto/dist/proto/ethermint/crypto/v1/ethsecp256k1/keys' // /ethermint/crypto/v1/ethsecp256k1/keys'
import {
    AminoConverters,
    createAuthzAminoConverters,
    createBankAminoConverters,
    createDistributionAminoConverters,
    createFreegrantAminoConverters,
    createGovAminoConverters,
    createIbcAminoConverters,
    createStakingAminoConverters,
} from "@cosmjs/stargate"
import { Int53 } from '@cosmjs/math';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { legacyToBuffer, recoverPublicKey } from '@metamask/eth-sig-util/dist/utils';
import { utils } from 'ethers'
import { signatureToPubkey } from '@hanchon/signature-to-pubkey'
import { defaultMessageAdapter } from './MessageAdapter';

export interface TypedDataField {
    name: string;
    type: string;
};

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

function createDefaultTypes(prefix: string): AminoConverters {
    return {
        ...createAuthzAminoConverters(),
        ...createBankAminoConverters(),
        ...createDistributionAminoConverters(),
        ...createGovAminoConverters(),
        ...createStakingAminoConverters(prefix),
        ...createIbcAminoConverters(),
        ...createFreegrantAminoConverters(),
        // ...createVestingAminoConverters(),
    };
}

function extractChainId(chainId: string) {
    const start = chainId.indexOf('_')
    const end = chainId.indexOf('-')
    if (end > start && start > 0) {
        return Number(chainId.substring(start + 1, end))
    }
    return 0
}
export class SigningEthermintClient {
    readonly signer: EthereumLedgerSigner
    aminoTypes: AminoTypes
    constructor(signer: EthereumLedgerSigner) {
        this.signer = signer
        this.aminoTypes = new AminoTypes(createDefaultTypes(""))
    }

    // async signEVM(signerAddress: string, messages: readonly EncodeObject[], stdfee: StdFee, memo: string, explicitSignerData?: SignerData): Promise<Uint8Array> {
    //     const chain: Chain = {
    //         chainId: extractChainId(explicitSignerData.chainId),
    //         cosmosChainId: explicitSignerData.chainId
    //     }
    //     this.signer.prefix = fromBech32(signerAddress).prefix
    //     const account = await this.signer.getAccounts()

    //     const sender = {
    //         accountAddress: signerAddress,
    //         sequence: explicitSignerData.sequence,
    //         accountNumber: explicitSignerData.accountNumber,
    //         pubkey: toBase64(account[0].pubkey),
    //     }
    //     const fee = {
    //         amount: stdfee.amount[0].amount,
    //         denom: stdfee.amount[0].denom,
    //         gas: stdfee.gas,
    //     }
    //     const validatorAddresses = messages.map(x => x.value.validatorAddress)

    //     let param: MsgMultipleWithdrawDelegatorRewardParams = {
    //         validatorAddresses
    //     }

    //     const msgs = createTxMsgMultipleWithdrawDelegatorReward(chain, sender, fee, memo, param)
    //     const sig = await this.signer.sign712(msgs.eipToSign)

    //     let extension = signatureToWeb3Extension(chain, sender, sig)

    //     // Create the txRaw
    //     let prototx = createTxRawEIP712(msgs.legacyAmino.body, msgs.legacyAmino.authInfo, extension)
    //     return Promise.resolve(prototx.message.serializeBinary())
    // }

    async sign(signerAddress: string, messages: readonly EncodeObject[], fee: StdFee, memo: string, explicitSignerData?: SignerData): Promise<Uint8Array> {

        const chain: Chain = {
            chainId: extractChainId(explicitSignerData.chainId),
            cosmosChainId: explicitSignerData.chainId
        }

        this.signer.prefix = fromBech32(signerAddress).prefix
        const account = await this.signer.getAccounts()

        const sender = {
            accountAddress: signerAddress,
            sequence: explicitSignerData.sequence,
            accountNumber: explicitSignerData.accountNumber,
            pubkey: toBase64(account[0].pubkey),
        }

        let fees = generateFee(fee.amount[0].amount, fee.amount[0].denom, fee.gas, signerAddress)

        const msgs = messages.map(x => this.aminoTypes.toAmino(x))
        const tx = generateMessageWithMultipleTransactions(
            sender.accountNumber.toString(),
            sender.sequence.toString(),
            explicitSignerData.chainId,
            memo,
            fees,
            msgs,
        )

        const types = generateTypes(defaultMessageAdapter[messages[0].typeUrl].getTypes())
        const eip = createEIP712(types, chain.chainId, tx )
        const sig = await this.signer.sign712(eip)

        const rawTx = makeRawTxEvmos(sender, messages, memo, fee, sig, chain)

        return Promise.resolve(rawTx)
    }
}

function makeRawTxEvmos(sender, messages, memo, fee, signature, chain): Uint8Array {
    /// evmos style
    ///*
    const protoMsgs = messages.map(x => {
        const adapter = defaultMessageAdapter[x.typeUrl]
        return adapter.toProto(x)
    })

    const evmos = createTransactionWithMultipleMessages(
        protoMsgs,
        memo,
        fee.amount[0].amount,
        fee.amount[0].denom,
        Number(fee.gas),
        'ethsecp256',
        sender.pubkey,
        sender.sequence,
        sender.accountNumber,
        chain.cosmosChainId
    )

    let extension = signatureToWeb3Extension(chain, sender, signature)

    // Create the txRaw
    let prototx = createTxRawEIP712(evmos.legacyAmino.body, evmos.legacyAmino.authInfo, extension)
    return prototx.message.serializeBinary()
    /// end of EVMOS style */
}

function makeRawTx(sender, messages, memo, fee, signature, registry): TxRaw {
    const pubkey = encodePubkey(sender.pubkey);

    const signedTxBody = {
        messages,
        memo,
    };
    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
        typeUrl: "/cosmos.tx.v1beta1.TxBody",
        value: signedTxBody,
    };
    const signedTxBodyBytes = registry.encode(signedTxBodyEncodeObject);
    const signedGasLimit = Int53.fromString(fee.gas).toNumber();
    const signedSequence = sender.sequence;
    const signedAuthInfoBytes = makeAuthInfoBytes(
        [{ pubkey, sequence: sender.sequence }],
        fee.amount,
        signedGasLimit,
        SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
    );
    const rawTx = TxRaw.fromPartial({
        bodyBytes: signedTxBodyBytes,
        authInfoBytes: signedAuthInfoBytes,
        signatures: [fromHex(signature)],
    });

    console.log("rawTx", rawTx)
    return rawTx
}

export function encodePubkey(pubkey: string): Any {
    const value = new eth.ethermint.crypto.v1.ethsecp256k1.PubKey({ key: fromBase64(pubkey) })
    return Any.fromPartial({
        typeUrl: "/ethermint.crypto.v1.ethsecp256k1.PubKey",
        value: value.serializeBinary(),
    });
}

// export function createAnyMessage(messages: readonly EncodeObject[]) {
//     return messages.map(x => x.)
// }
