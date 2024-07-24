import { BinaryReader, BinaryWriter } from "../../../../binary";
import { bytesFromBase64, base64FromBytes } from "../../../../helpers";
/** Pairs defines a repeated slice of Pair objects. */
export interface Pairs {
  pairs: Pair[];
}
export interface PairsProtoMsg {
  typeUrl: "/cosmos.base.kv.v1beta1.Pairs";
  value: Uint8Array;
}
/** Pairs defines a repeated slice of Pair objects. */
export interface PairsAmino {
  pairs?: PairAmino[];
}
export interface PairsAminoMsg {
  type: "cosmos-sdk/Pairs";
  value: PairsAmino;
}
/** Pairs defines a repeated slice of Pair objects. */
export interface PairsSDKType {
  pairs: PairSDKType[];
}
/** Pair defines a key/value bytes tuple. */
export interface Pair {
  key: Uint8Array;
  value: Uint8Array;
}
export interface PairProtoMsg {
  typeUrl: "/cosmos.base.kv.v1beta1.Pair";
  value: Uint8Array;
}
/** Pair defines a key/value bytes tuple. */
export interface PairAmino {
  key?: string;
  value?: string;
}
export interface PairAminoMsg {
  type: "cosmos-sdk/Pair";
  value: PairAmino;
}
/** Pair defines a key/value bytes tuple. */
export interface PairSDKType {
  key: Uint8Array;
  value: Uint8Array;
}
function createBasePairs(): Pairs {
  return {
    pairs: []
  };
}
export const Pairs = {
  typeUrl: "/cosmos.base.kv.v1beta1.Pairs",
  encode(message: Pairs, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.pairs) {
      Pair.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Pairs {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePairs();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pairs.push(Pair.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Pairs>): Pairs {
    const message = createBasePairs();
    message.pairs = object.pairs?.map(e => Pair.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: PairsAmino): Pairs {
    const message = createBasePairs();
    message.pairs = object.pairs?.map(e => Pair.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: Pairs): PairsAmino {
    const obj: any = {};
    if (message.pairs) {
      obj.pairs = message.pairs.map(e => e ? Pair.toAmino(e) : undefined);
    } else {
      obj.pairs = message.pairs;
    }
    return obj;
  },
  fromAminoMsg(object: PairsAminoMsg): Pairs {
    return Pairs.fromAmino(object.value);
  },
  toAminoMsg(message: Pairs): PairsAminoMsg {
    return {
      type: "cosmos-sdk/Pairs",
      value: Pairs.toAmino(message)
    };
  },
  fromProtoMsg(message: PairsProtoMsg): Pairs {
    return Pairs.decode(message.value);
  },
  toProto(message: Pairs): Uint8Array {
    return Pairs.encode(message).finish();
  },
  toProtoMsg(message: Pairs): PairsProtoMsg {
    return {
      typeUrl: "/cosmos.base.kv.v1beta1.Pairs",
      value: Pairs.encode(message).finish()
    };
  }
};
function createBasePair(): Pair {
  return {
    key: new Uint8Array(),
    value: new Uint8Array()
  };
}
export const Pair = {
  typeUrl: "/cosmos.base.kv.v1beta1.Pair",
  encode(message: Pair, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Pair {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePair();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes();
          break;
        case 2:
          message.value = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Pair>): Pair {
    const message = createBasePair();
    message.key = object.key ?? new Uint8Array();
    message.value = object.value ?? new Uint8Array();
    return message;
  },
  fromAmino(object: PairAmino): Pair {
    const message = createBasePair();
    if (object.key !== undefined && object.key !== null) {
      message.key = bytesFromBase64(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = bytesFromBase64(object.value);
    }
    return message;
  },
  toAmino(message: Pair): PairAmino {
    const obj: any = {};
    obj.key = message.key ? base64FromBytes(message.key) : undefined;
    obj.value = message.value ? base64FromBytes(message.value) : undefined;
    return obj;
  },
  fromAminoMsg(object: PairAminoMsg): Pair {
    return Pair.fromAmino(object.value);
  },
  toAminoMsg(message: Pair): PairAminoMsg {
    return {
      type: "cosmos-sdk/Pair",
      value: Pair.toAmino(message)
    };
  },
  fromProtoMsg(message: PairProtoMsg): Pair {
    return Pair.decode(message.value);
  },
  toProto(message: Pair): Uint8Array {
    return Pair.encode(message).finish();
  },
  toProtoMsg(message: Pair): PairProtoMsg {
    return {
      typeUrl: "/cosmos.base.kv.v1beta1.Pair",
      value: Pair.encode(message).finish()
    };
  }
};