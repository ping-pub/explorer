import * as _m0 from "protobufjs/minimal";
import { DeepPartial } from "../../helpers";
/** PublicKey defines the keys available for use with Tendermint Validators */

export interface PublicKey {
  ed25519?: Uint8Array;
  secp256k1?: Uint8Array;
}
/** PublicKey defines the keys available for use with Tendermint Validators */

export interface PublicKeySDKType {
  ed25519?: Uint8Array;
  secp256k1?: Uint8Array;
}

function createBasePublicKey(): PublicKey {
  return {
    ed25519: undefined,
    secp256k1: undefined
  };
}

export const PublicKey = {
  encode(message: PublicKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ed25519 !== undefined) {
      writer.uint32(10).bytes(message.ed25519);
    }

    if (message.secp256k1 !== undefined) {
      writer.uint32(18).bytes(message.secp256k1);
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PublicKey {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePublicKey();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.ed25519 = reader.bytes();
          break;

        case 2:
          message.secp256k1 = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<PublicKey>): PublicKey {
    const message = createBasePublicKey();
    message.ed25519 = object.ed25519 ?? undefined;
    message.secp256k1 = object.secp256k1 ?? undefined;
    return message;
  }

};