import { AccountData, encodeSecp256k1Pubkey, makeSignDoc as makeSignDocAmino, StdFee } from "@cosmjs/amino"
import { EncodeObject, encodePubkey, GeneratedType, isOfflineDirectSigner, makeAuthInfoBytes, OfflineSigner, Registry, TxBodyEncodeObject } from "@cosmjs/proto-signing";
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import Eth from "@ledgerhq/hw-app-eth";
import Transport from '@ledgerhq/hw-transport'
import { Int53 } from "@cosmjs/math";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { fromBase64 } from "@cosmjs/encoding";

import { SigningStargateClient } from '@cosmjs/stargate'
import { assert } from "@cosmjs/utils";
import { AminoTypes } from "./aminotypes";

export interface SignerData {
    readonly accountNumber: number;
    readonly sequence: number;
    readonly chainId: string;
}
export interface ClientOptions {
    readonly registry?: Registry;
    readonly aminoTypes?: AminoTypes;
    readonly prefix?: string;
  }

export default class PingWalletClient extends SigningStargateClient {

    
}
