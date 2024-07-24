import { Any, AnyAmino, AnySDKType } from "../../../../google/protobuf/any";
import { BinaryReader, BinaryWriter } from "../../../../binary";
import { bytesFromBase64, base64FromBytes } from "../../../../helpers";
/**
 * Type defines a classification of message issued from a controller chain to its associated interchain accounts
 * host
 */
export enum Type {
  /** TYPE_UNSPECIFIED - Default zero value enumeration */
  TYPE_UNSPECIFIED = 0,
  /** TYPE_EXECUTE_TX - Execute a transaction on an interchain accounts host chain */
  TYPE_EXECUTE_TX = 1,
  UNRECOGNIZED = -1,
}
export const TypeSDKType = Type;
export const TypeAmino = Type;
export function typeFromJSON(object: any): Type {
  switch (object) {
    case 0:
    case "TYPE_UNSPECIFIED":
      return Type.TYPE_UNSPECIFIED;
    case 1:
    case "TYPE_EXECUTE_TX":
      return Type.TYPE_EXECUTE_TX;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Type.UNRECOGNIZED;
  }
}
export function typeToJSON(object: Type): string {
  switch (object) {
    case Type.TYPE_UNSPECIFIED:
      return "TYPE_UNSPECIFIED";
    case Type.TYPE_EXECUTE_TX:
      return "TYPE_EXECUTE_TX";
    case Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
/** InterchainAccountPacketData is comprised of a raw transaction, type of transaction and optional memo field. */
export interface InterchainAccountPacketData {
  type: Type;
  data: Uint8Array;
  memo: string;
}
export interface InterchainAccountPacketDataProtoMsg {
  typeUrl: "/ibc.applications.interchain_accounts.v1.InterchainAccountPacketData";
  value: Uint8Array;
}
/** InterchainAccountPacketData is comprised of a raw transaction, type of transaction and optional memo field. */
export interface InterchainAccountPacketDataAmino {
  type?: Type;
  data?: string;
  memo?: string;
}
export interface InterchainAccountPacketDataAminoMsg {
  type: "cosmos-sdk/InterchainAccountPacketData";
  value: InterchainAccountPacketDataAmino;
}
/** InterchainAccountPacketData is comprised of a raw transaction, type of transaction and optional memo field. */
export interface InterchainAccountPacketDataSDKType {
  type: Type;
  data: Uint8Array;
  memo: string;
}
/** CosmosTx contains a list of sdk.Msg's. It should be used when sending transactions to an SDK host chain. */
export interface CosmosTx {
  messages: Any[];
}
export interface CosmosTxProtoMsg {
  typeUrl: "/ibc.applications.interchain_accounts.v1.CosmosTx";
  value: Uint8Array;
}
/** CosmosTx contains a list of sdk.Msg's. It should be used when sending transactions to an SDK host chain. */
export interface CosmosTxAmino {
  messages?: AnyAmino[];
}
export interface CosmosTxAminoMsg {
  type: "cosmos-sdk/CosmosTx";
  value: CosmosTxAmino;
}
/** CosmosTx contains a list of sdk.Msg's. It should be used when sending transactions to an SDK host chain. */
export interface CosmosTxSDKType {
  messages: AnySDKType[];
}
function createBaseInterchainAccountPacketData(): InterchainAccountPacketData {
  return {
    type: 0,
    data: new Uint8Array(),
    memo: ""
  };
}
export const InterchainAccountPacketData = {
  typeUrl: "/ibc.applications.interchain_accounts.v1.InterchainAccountPacketData",
  encode(message: InterchainAccountPacketData, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.data.length !== 0) {
      writer.uint32(18).bytes(message.data);
    }
    if (message.memo !== "") {
      writer.uint32(26).string(message.memo);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): InterchainAccountPacketData {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInterchainAccountPacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = (reader.int32() as any);
          break;
        case 2:
          message.data = reader.bytes();
          break;
        case 3:
          message.memo = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<InterchainAccountPacketData>): InterchainAccountPacketData {
    const message = createBaseInterchainAccountPacketData();
    message.type = object.type ?? 0;
    message.data = object.data ?? new Uint8Array();
    message.memo = object.memo ?? "";
    return message;
  },
  fromAmino(object: InterchainAccountPacketDataAmino): InterchainAccountPacketData {
    const message = createBaseInterchainAccountPacketData();
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = bytesFromBase64(object.data);
    }
    if (object.memo !== undefined && object.memo !== null) {
      message.memo = object.memo;
    }
    return message;
  },
  toAmino(message: InterchainAccountPacketData): InterchainAccountPacketDataAmino {
    const obj: any = {};
    obj.type = message.type === 0 ? undefined : message.type;
    obj.data = message.data ? base64FromBytes(message.data) : undefined;
    obj.memo = message.memo === "" ? undefined : message.memo;
    return obj;
  },
  fromAminoMsg(object: InterchainAccountPacketDataAminoMsg): InterchainAccountPacketData {
    return InterchainAccountPacketData.fromAmino(object.value);
  },
  toAminoMsg(message: InterchainAccountPacketData): InterchainAccountPacketDataAminoMsg {
    return {
      type: "cosmos-sdk/InterchainAccountPacketData",
      value: InterchainAccountPacketData.toAmino(message)
    };
  },
  fromProtoMsg(message: InterchainAccountPacketDataProtoMsg): InterchainAccountPacketData {
    return InterchainAccountPacketData.decode(message.value);
  },
  toProto(message: InterchainAccountPacketData): Uint8Array {
    return InterchainAccountPacketData.encode(message).finish();
  },
  toProtoMsg(message: InterchainAccountPacketData): InterchainAccountPacketDataProtoMsg {
    return {
      typeUrl: "/ibc.applications.interchain_accounts.v1.InterchainAccountPacketData",
      value: InterchainAccountPacketData.encode(message).finish()
    };
  }
};
function createBaseCosmosTx(): CosmosTx {
  return {
    messages: []
  };
}
export const CosmosTx = {
  typeUrl: "/ibc.applications.interchain_accounts.v1.CosmosTx",
  encode(message: CosmosTx, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.messages) {
      Any.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): CosmosTx {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCosmosTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.messages.push(Any.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<CosmosTx>): CosmosTx {
    const message = createBaseCosmosTx();
    message.messages = object.messages?.map(e => Any.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: CosmosTxAmino): CosmosTx {
    const message = createBaseCosmosTx();
    message.messages = object.messages?.map(e => Any.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: CosmosTx): CosmosTxAmino {
    const obj: any = {};
    if (message.messages) {
      obj.messages = message.messages.map(e => e ? Any.toAmino(e) : undefined);
    } else {
      obj.messages = message.messages;
    }
    return obj;
  },
  fromAminoMsg(object: CosmosTxAminoMsg): CosmosTx {
    return CosmosTx.fromAmino(object.value);
  },
  toAminoMsg(message: CosmosTx): CosmosTxAminoMsg {
    return {
      type: "cosmos-sdk/CosmosTx",
      value: CosmosTx.toAmino(message)
    };
  },
  fromProtoMsg(message: CosmosTxProtoMsg): CosmosTx {
    return CosmosTx.decode(message.value);
  },
  toProto(message: CosmosTx): Uint8Array {
    return CosmosTx.encode(message).finish();
  },
  toProtoMsg(message: CosmosTx): CosmosTxProtoMsg {
    return {
      typeUrl: "/ibc.applications.interchain_accounts.v1.CosmosTx",
      value: CosmosTx.encode(message).finish()
    };
  }
};