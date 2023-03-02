import * as _m0 from "protobufjs/minimal";
import { DeepPartial } from "../../../../helpers";
/** BIP44Params is used as path field in ledger item in Record. */

export interface BIP44Params {
  /** purpose is a constant set to 44' (or 0x8000002C) following the BIP43 recommendation */
  purpose: number;
  /** coin_type is a constant that improves privacy */

  coinType: number;
  /** account splits the key space into independent user identities */

  account: number;
  /**
   * change is a constant used for public derivation. Constant 0 is used for external chain and constant 1 for internal
   * chain.
   */

  change: boolean;
  /** address_index is used as child index in BIP32 derivation */

  addressIndex: number;
}
/** BIP44Params is used as path field in ledger item in Record. */

export interface BIP44ParamsSDKType {
  purpose: number;
  coin_type: number;
  account: number;
  change: boolean;
  address_index: number;
}

function createBaseBIP44Params(): BIP44Params {
  return {
    purpose: 0,
    coinType: 0,
    account: 0,
    change: false,
    addressIndex: 0
  };
}

export const BIP44Params = {
  encode(message: BIP44Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.purpose !== 0) {
      writer.uint32(8).uint32(message.purpose);
    }

    if (message.coinType !== 0) {
      writer.uint32(16).uint32(message.coinType);
    }

    if (message.account !== 0) {
      writer.uint32(24).uint32(message.account);
    }

    if (message.change === true) {
      writer.uint32(32).bool(message.change);
    }

    if (message.addressIndex !== 0) {
      writer.uint32(40).uint32(message.addressIndex);
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BIP44Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBIP44Params();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.purpose = reader.uint32();
          break;

        case 2:
          message.coinType = reader.uint32();
          break;

        case 3:
          message.account = reader.uint32();
          break;

        case 4:
          message.change = reader.bool();
          break;

        case 5:
          message.addressIndex = reader.uint32();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<BIP44Params>): BIP44Params {
    const message = createBaseBIP44Params();
    message.purpose = object.purpose ?? 0;
    message.coinType = object.coinType ?? 0;
    message.account = object.account ?? 0;
    message.change = object.change ?? false;
    message.addressIndex = object.addressIndex ?? 0;
    return message;
  }

};