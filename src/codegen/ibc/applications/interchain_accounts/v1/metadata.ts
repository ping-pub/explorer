import { BinaryReader, BinaryWriter } from "../../../../binary";
/**
 * Metadata defines a set of protocol specific data encoded into the ICS27 channel version bytestring
 * See ICS004: https://github.com/cosmos/ibc/tree/master/spec/core/ics-004-channel-and-packet-semantics#Versioning
 */
export interface Metadata {
  /** version defines the ICS27 protocol version */
  version: string;
  /** controller_connection_id is the connection identifier associated with the controller chain */
  controllerConnectionId: string;
  /** host_connection_id is the connection identifier associated with the host chain */
  hostConnectionId: string;
  /**
   * address defines the interchain account address to be fulfilled upon the OnChanOpenTry handshake step
   * NOTE: the address field is empty on the OnChanOpenInit handshake step
   */
  address: string;
  /** encoding defines the supported codec format */
  encoding: string;
  /** tx_type defines the type of transactions the interchain account can execute */
  txType: string;
}
export interface MetadataProtoMsg {
  typeUrl: "/ibc.applications.interchain_accounts.v1.Metadata";
  value: Uint8Array;
}
/**
 * Metadata defines a set of protocol specific data encoded into the ICS27 channel version bytestring
 * See ICS004: https://github.com/cosmos/ibc/tree/master/spec/core/ics-004-channel-and-packet-semantics#Versioning
 */
export interface MetadataAmino {
  /** version defines the ICS27 protocol version */
  version?: string;
  /** controller_connection_id is the connection identifier associated with the controller chain */
  controller_connection_id?: string;
  /** host_connection_id is the connection identifier associated with the host chain */
  host_connection_id?: string;
  /**
   * address defines the interchain account address to be fulfilled upon the OnChanOpenTry handshake step
   * NOTE: the address field is empty on the OnChanOpenInit handshake step
   */
  address?: string;
  /** encoding defines the supported codec format */
  encoding?: string;
  /** tx_type defines the type of transactions the interchain account can execute */
  tx_type?: string;
}
export interface MetadataAminoMsg {
  type: "cosmos-sdk/Metadata";
  value: MetadataAmino;
}
/**
 * Metadata defines a set of protocol specific data encoded into the ICS27 channel version bytestring
 * See ICS004: https://github.com/cosmos/ibc/tree/master/spec/core/ics-004-channel-and-packet-semantics#Versioning
 */
export interface MetadataSDKType {
  version: string;
  controller_connection_id: string;
  host_connection_id: string;
  address: string;
  encoding: string;
  tx_type: string;
}
function createBaseMetadata(): Metadata {
  return {
    version: "",
    controllerConnectionId: "",
    hostConnectionId: "",
    address: "",
    encoding: "",
    txType: ""
  };
}
export const Metadata = {
  typeUrl: "/ibc.applications.interchain_accounts.v1.Metadata",
  encode(message: Metadata, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.version !== "") {
      writer.uint32(10).string(message.version);
    }
    if (message.controllerConnectionId !== "") {
      writer.uint32(18).string(message.controllerConnectionId);
    }
    if (message.hostConnectionId !== "") {
      writer.uint32(26).string(message.hostConnectionId);
    }
    if (message.address !== "") {
      writer.uint32(34).string(message.address);
    }
    if (message.encoding !== "") {
      writer.uint32(42).string(message.encoding);
    }
    if (message.txType !== "") {
      writer.uint32(50).string(message.txType);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Metadata {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.string();
          break;
        case 2:
          message.controllerConnectionId = reader.string();
          break;
        case 3:
          message.hostConnectionId = reader.string();
          break;
        case 4:
          message.address = reader.string();
          break;
        case 5:
          message.encoding = reader.string();
          break;
        case 6:
          message.txType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Metadata>): Metadata {
    const message = createBaseMetadata();
    message.version = object.version ?? "";
    message.controllerConnectionId = object.controllerConnectionId ?? "";
    message.hostConnectionId = object.hostConnectionId ?? "";
    message.address = object.address ?? "";
    message.encoding = object.encoding ?? "";
    message.txType = object.txType ?? "";
    return message;
  },
  fromAmino(object: MetadataAmino): Metadata {
    const message = createBaseMetadata();
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version;
    }
    if (object.controller_connection_id !== undefined && object.controller_connection_id !== null) {
      message.controllerConnectionId = object.controller_connection_id;
    }
    if (object.host_connection_id !== undefined && object.host_connection_id !== null) {
      message.hostConnectionId = object.host_connection_id;
    }
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    if (object.encoding !== undefined && object.encoding !== null) {
      message.encoding = object.encoding;
    }
    if (object.tx_type !== undefined && object.tx_type !== null) {
      message.txType = object.tx_type;
    }
    return message;
  },
  toAmino(message: Metadata): MetadataAmino {
    const obj: any = {};
    obj.version = message.version === "" ? undefined : message.version;
    obj.controller_connection_id = message.controllerConnectionId === "" ? undefined : message.controllerConnectionId;
    obj.host_connection_id = message.hostConnectionId === "" ? undefined : message.hostConnectionId;
    obj.address = message.address === "" ? undefined : message.address;
    obj.encoding = message.encoding === "" ? undefined : message.encoding;
    obj.tx_type = message.txType === "" ? undefined : message.txType;
    return obj;
  },
  fromAminoMsg(object: MetadataAminoMsg): Metadata {
    return Metadata.fromAmino(object.value);
  },
  toAminoMsg(message: Metadata): MetadataAminoMsg {
    return {
      type: "cosmos-sdk/Metadata",
      value: Metadata.toAmino(message)
    };
  },
  fromProtoMsg(message: MetadataProtoMsg): Metadata {
    return Metadata.decode(message.value);
  },
  toProto(message: Metadata): Uint8Array {
    return Metadata.encode(message).finish();
  },
  toProtoMsg(message: Metadata): MetadataProtoMsg {
    return {
      typeUrl: "/ibc.applications.interchain_accounts.v1.Metadata",
      value: Metadata.encode(message).finish()
    };
  }
};