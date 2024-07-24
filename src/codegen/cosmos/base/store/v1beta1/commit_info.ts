import { BinaryReader, BinaryWriter } from "../../../../binary";
import { bytesFromBase64, base64FromBytes } from "../../../../helpers";
/**
 * CommitInfo defines commit information used by the multi-store when committing
 * a version/height.
 */
export interface CommitInfo {
  version: bigint;
  storeInfos: StoreInfo[];
}
export interface CommitInfoProtoMsg {
  typeUrl: "/cosmos.base.store.v1beta1.CommitInfo";
  value: Uint8Array;
}
/**
 * CommitInfo defines commit information used by the multi-store when committing
 * a version/height.
 */
export interface CommitInfoAmino {
  version?: string;
  store_infos?: StoreInfoAmino[];
}
export interface CommitInfoAminoMsg {
  type: "cosmos-sdk/CommitInfo";
  value: CommitInfoAmino;
}
/**
 * CommitInfo defines commit information used by the multi-store when committing
 * a version/height.
 */
export interface CommitInfoSDKType {
  version: bigint;
  store_infos: StoreInfoSDKType[];
}
/**
 * StoreInfo defines store-specific commit information. It contains a reference
 * between a store name and the commit ID.
 */
export interface StoreInfo {
  name: string;
  commitId: CommitID;
}
export interface StoreInfoProtoMsg {
  typeUrl: "/cosmos.base.store.v1beta1.StoreInfo";
  value: Uint8Array;
}
/**
 * StoreInfo defines store-specific commit information. It contains a reference
 * between a store name and the commit ID.
 */
export interface StoreInfoAmino {
  name?: string;
  commit_id?: CommitIDAmino;
}
export interface StoreInfoAminoMsg {
  type: "cosmos-sdk/StoreInfo";
  value: StoreInfoAmino;
}
/**
 * StoreInfo defines store-specific commit information. It contains a reference
 * between a store name and the commit ID.
 */
export interface StoreInfoSDKType {
  name: string;
  commit_id: CommitIDSDKType;
}
/**
 * CommitID defines the committment information when a specific store is
 * committed.
 */
export interface CommitID {
  version: bigint;
  hash: Uint8Array;
}
export interface CommitIDProtoMsg {
  typeUrl: "/cosmos.base.store.v1beta1.CommitID";
  value: Uint8Array;
}
/**
 * CommitID defines the committment information when a specific store is
 * committed.
 */
export interface CommitIDAmino {
  version?: string;
  hash?: string;
}
export interface CommitIDAminoMsg {
  type: "cosmos-sdk/CommitID";
  value: CommitIDAmino;
}
/**
 * CommitID defines the committment information when a specific store is
 * committed.
 */
export interface CommitIDSDKType {
  version: bigint;
  hash: Uint8Array;
}
function createBaseCommitInfo(): CommitInfo {
  return {
    version: BigInt(0),
    storeInfos: []
  };
}
export const CommitInfo = {
  typeUrl: "/cosmos.base.store.v1beta1.CommitInfo",
  encode(message: CommitInfo, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.version !== BigInt(0)) {
      writer.uint32(8).int64(message.version);
    }
    for (const v of message.storeInfos) {
      StoreInfo.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): CommitInfo {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommitInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.int64();
          break;
        case 2:
          message.storeInfos.push(StoreInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<CommitInfo>): CommitInfo {
    const message = createBaseCommitInfo();
    message.version = object.version !== undefined && object.version !== null ? BigInt(object.version.toString()) : BigInt(0);
    message.storeInfos = object.storeInfos?.map(e => StoreInfo.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: CommitInfoAmino): CommitInfo {
    const message = createBaseCommitInfo();
    if (object.version !== undefined && object.version !== null) {
      message.version = BigInt(object.version);
    }
    message.storeInfos = object.store_infos?.map(e => StoreInfo.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: CommitInfo): CommitInfoAmino {
    const obj: any = {};
    obj.version = message.version !== BigInt(0) ? message.version.toString() : undefined;
    if (message.storeInfos) {
      obj.store_infos = message.storeInfos.map(e => e ? StoreInfo.toAmino(e) : undefined);
    } else {
      obj.store_infos = message.storeInfos;
    }
    return obj;
  },
  fromAminoMsg(object: CommitInfoAminoMsg): CommitInfo {
    return CommitInfo.fromAmino(object.value);
  },
  toAminoMsg(message: CommitInfo): CommitInfoAminoMsg {
    return {
      type: "cosmos-sdk/CommitInfo",
      value: CommitInfo.toAmino(message)
    };
  },
  fromProtoMsg(message: CommitInfoProtoMsg): CommitInfo {
    return CommitInfo.decode(message.value);
  },
  toProto(message: CommitInfo): Uint8Array {
    return CommitInfo.encode(message).finish();
  },
  toProtoMsg(message: CommitInfo): CommitInfoProtoMsg {
    return {
      typeUrl: "/cosmos.base.store.v1beta1.CommitInfo",
      value: CommitInfo.encode(message).finish()
    };
  }
};
function createBaseStoreInfo(): StoreInfo {
  return {
    name: "",
    commitId: CommitID.fromPartial({})
  };
}
export const StoreInfo = {
  typeUrl: "/cosmos.base.store.v1beta1.StoreInfo",
  encode(message: StoreInfo, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.commitId !== undefined) {
      CommitID.encode(message.commitId, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StoreInfo {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStoreInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.commitId = CommitID.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StoreInfo>): StoreInfo {
    const message = createBaseStoreInfo();
    message.name = object.name ?? "";
    message.commitId = object.commitId !== undefined && object.commitId !== null ? CommitID.fromPartial(object.commitId) : undefined;
    return message;
  },
  fromAmino(object: StoreInfoAmino): StoreInfo {
    const message = createBaseStoreInfo();
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.commit_id !== undefined && object.commit_id !== null) {
      message.commitId = CommitID.fromAmino(object.commit_id);
    }
    return message;
  },
  toAmino(message: StoreInfo): StoreInfoAmino {
    const obj: any = {};
    obj.name = message.name === "" ? undefined : message.name;
    obj.commit_id = message.commitId ? CommitID.toAmino(message.commitId) : undefined;
    return obj;
  },
  fromAminoMsg(object: StoreInfoAminoMsg): StoreInfo {
    return StoreInfo.fromAmino(object.value);
  },
  toAminoMsg(message: StoreInfo): StoreInfoAminoMsg {
    return {
      type: "cosmos-sdk/StoreInfo",
      value: StoreInfo.toAmino(message)
    };
  },
  fromProtoMsg(message: StoreInfoProtoMsg): StoreInfo {
    return StoreInfo.decode(message.value);
  },
  toProto(message: StoreInfo): Uint8Array {
    return StoreInfo.encode(message).finish();
  },
  toProtoMsg(message: StoreInfo): StoreInfoProtoMsg {
    return {
      typeUrl: "/cosmos.base.store.v1beta1.StoreInfo",
      value: StoreInfo.encode(message).finish()
    };
  }
};
function createBaseCommitID(): CommitID {
  return {
    version: BigInt(0),
    hash: new Uint8Array()
  };
}
export const CommitID = {
  typeUrl: "/cosmos.base.store.v1beta1.CommitID",
  encode(message: CommitID, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.version !== BigInt(0)) {
      writer.uint32(8).int64(message.version);
    }
    if (message.hash.length !== 0) {
      writer.uint32(18).bytes(message.hash);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): CommitID {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommitID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.int64();
          break;
        case 2:
          message.hash = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<CommitID>): CommitID {
    const message = createBaseCommitID();
    message.version = object.version !== undefined && object.version !== null ? BigInt(object.version.toString()) : BigInt(0);
    message.hash = object.hash ?? new Uint8Array();
    return message;
  },
  fromAmino(object: CommitIDAmino): CommitID {
    const message = createBaseCommitID();
    if (object.version !== undefined && object.version !== null) {
      message.version = BigInt(object.version);
    }
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = bytesFromBase64(object.hash);
    }
    return message;
  },
  toAmino(message: CommitID): CommitIDAmino {
    const obj: any = {};
    obj.version = message.version !== BigInt(0) ? message.version.toString() : undefined;
    obj.hash = message.hash ? base64FromBytes(message.hash) : undefined;
    return obj;
  },
  fromAminoMsg(object: CommitIDAminoMsg): CommitID {
    return CommitID.fromAmino(object.value);
  },
  toAminoMsg(message: CommitID): CommitIDAminoMsg {
    return {
      type: "cosmos-sdk/CommitID",
      value: CommitID.toAmino(message)
    };
  },
  fromProtoMsg(message: CommitIDProtoMsg): CommitID {
    return CommitID.decode(message.value);
  },
  toProto(message: CommitID): Uint8Array {
    return CommitID.encode(message).finish();
  },
  toProtoMsg(message: CommitID): CommitIDProtoMsg {
    return {
      typeUrl: "/cosmos.base.store.v1beta1.CommitID",
      value: CommitID.encode(message).finish()
    };
  }
};