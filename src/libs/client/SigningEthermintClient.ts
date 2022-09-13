import {
  AminoTypes,
  SignerData,
  SigningStargateClient,
  AminoConverters,
  createAuthzAminoConverters,
  createBankAminoConverters,
  createDistributionAminoConverters,
  createFreegrantAminoConverters,
  createGovAminoConverters,
  createIbcAminoConverters,
  createStakingAminoConverters,
} from '@cosmjs/stargate'
import { EncodeObject } from '@cosmjs/proto-signing'
import { LedgerSigner } from '@cosmjs/ledger-amino'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble'
import {
  StdFee,
} from '@cosmjs/amino'
import {
  generateMessageWithMultipleTransactions,
  generateTypes,
  generateFee,
  createEIP712,
} from '@tharsis/eip712'
import { createTxRawEIP712, signatureToWeb3Extension, Chain } from '@tharsis/transactions'
import { createTransactionWithMultipleMessages } from '@tharsis/proto'
import { fromBech32, toBase64 } from '@cosmjs/encoding'
import EthereumLedgerSigner from './EthereumLedgerSigner'
import { defaultMessageAdapter } from './MessageAdapter'

export interface TypedDataField {
    name: string;
    type: string;
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
  }
}

function extractChainId(chainId: string) {
  const start = chainId.indexOf('_')
  const end = chainId.indexOf('-')
  if (end > start && start > 0) {
    return Number(chainId.substring(start + 1, end))
  }
  return 0
}

function makeRawTxEvmos(sender, messages, memo, fee, signature, chain): Uint8Array {
  /// evmos style
  /// *
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
    chain.cosmosChainId,
  )

  const extension = signatureToWeb3Extension(chain, sender, signature)

  // Create the txRaw
  const prototx = createTxRawEIP712(evmos.legacyAmino.body, evmos.legacyAmino.authInfo, extension)
  return prototx.message.serializeBinary()
  /// end of EVMOS style */
}

export class SigningEthermintClient {
  readonly signer: EthereumLedgerSigner

  aminoTypes: AminoTypes

  constructor(signer: EthereumLedgerSigner) {
    this.signer = signer
    this.aminoTypes = new AminoTypes(createDefaultTypes(''))
  }

  async sign(signerAddress: string, messages: readonly EncodeObject[], fee: StdFee, memo: string, explicitSignerData?: SignerData): Promise<Uint8Array> {
    const chain: Chain = {
      chainId: extractChainId(explicitSignerData.chainId),
      cosmosChainId: explicitSignerData.chainId,
    }

    this.signer.prefix = fromBech32(signerAddress).prefix
    const account = await this.signer.getAccounts()

    const acc = account.find(x => x.address === signerAddress)
    if (!acc) {
      throw new Error('The signer address dose not exsits in Ledger!')
    }
    const sender = {
      accountAddress: signerAddress,
      sequence: explicitSignerData.sequence,
      accountNumber: explicitSignerData.accountNumber,
      pubkey: toBase64(account[0].pubkey),
    }

    const fees = generateFee(fee.amount[0].amount, fee.amount[0].denom, fee.gas, signerAddress)

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
    const eip = createEIP712(types, chain.chainId, tx)
    const sig = await this.signer.sign712(eip)

    const rawTx = makeRawTxEvmos(sender, messages, memo, fee, sig, chain)

    return Promise.resolve(rawTx)
  }
}

export declare type SigningClient = SigningStargateClient | SigningEthermintClient;

export async function getSigningClient(device, hdpath): Promise<SigningClient> {
  let ledgerAppName = 'Cosmos'
  const coinType = Number(hdpath[1])
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
