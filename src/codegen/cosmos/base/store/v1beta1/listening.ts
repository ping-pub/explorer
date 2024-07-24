import { RequestDeliverTx, RequestDeliverTxAmino, RequestDeliverTxSDKType, ResponseDeliverTx, ResponseDeliverTxAmino, ResponseDeliverTxSDKType, RequestBeginBlock, RequestBeginBlockAmino, RequestBeginBlockSDKType, ResponseBeginBlock, ResponseBeginBlockAmino, ResponseBeginBlockSDKType, RequestEndBlock, RequestEndBlockAmino, RequestEndBlockSDKType, ResponseEndBlock, ResponseEndBlockAmino, ResponseEndBlockSDKType, ResponseCommit, ResponseCommitAmino, ResponseCommitSDKType } from "../../../../tendermint/abci/types";
import { BinaryReader, BinaryWriter } from "../../../../binary";
import { bytesFromBase64, base64FromBytes } from "../../../../helpers";
/**
 * StoreKVPair is a KVStore KVPair used for listening to state changes (Sets and Deletes)
 * It optionally includes the StoreKey for the originating KVStore and a Boolean flag to distinguish between Sets and
 * Deletes
 * 
 * Since: cosmos-sdk 0.43
 */
export interface StoreKVPair {
  /** the store key for the KVStore this pair originates from */
  storeKey: string;
  /** true indicates a delete operation, false indicates a set operation */
  delete: boolean;
  key: Uint8Array;
  value: Uint8Array;
}
export interface StoreKVPairProtoMsg {
  typeUrl: "/cosmos.base.store.v1beta1.StoreKVPair";
  value: Uint8Array;
}
/**
 * StoreKVPair is a KVStore KVPair used for listening to state changes (Sets and Deletes)
 * It optionally includes the StoreKey for the originating KVStore and a Boolean flag to distinguish between Sets and
 * Deletes
 * 
 * Since: cosmos-sdk 0.43
 */
export interface StoreKVPairAmino {
  /** the store key for the KVStore this pair originates from */
  store_key?: string;
  /** true indicates a delete operation, false indicates a set operation */
  delete?: boolean;
  key?: string;
  value?: string;
}
export interface StoreKVPairAminoMsg {
  type: "cosmos-sdk/StoreKVPair";
  value: StoreKVPairAmino;
}
/**
 * StoreKVPair is a KVStore KVPair used for listening to state changes (Sets and Deletes)
 * It optionally includes the StoreKey for the originating KVStore and a Boolean flag to distinguish between Sets and
 * Deletes
 * 
 * Since: cosmos-sdk 0.43
 */
export interface StoreKVPairSDKType {
  store_key: string;
  delete: boolean;
  key: Uint8Array;
  value: Uint8Array;
}
/**
 * BlockMetadata contains all the abci event data of a block
 * the file streamer dump them into files together with the state changes.
 */
export interface BlockMetadata {
  requestBeginBlock?: RequestBeginBlock;
  responseBeginBlock?: ResponseBeginBlock;
  deliverTxs: BlockMetadata_DeliverTx[];
  requestEndBlock?: RequestEndBlock;
  responseEndBlock?: ResponseEndBlock;
  responseCommit?: ResponseCommit;
}
export interface BlockMetadataProtoMsg {
  typeUrl: "/cosmos.base.store.v1beta1.BlockMetadata";
  value: Uint8Array;
}
/**
 * BlockMetadata contains all the abci event data of a block
 * the file streamer dump them into files together with the state changes.
 */
export interface BlockMetadataAmino {
  request_begin_block?: RequestBeginBlockAmino;
  response_begin_block?: ResponseBeginBlockAmino;
  deliver_txs?: BlockMetadata_DeliverTxAmino[];
  request_end_block?: RequestEndBlockAmino;
  response_end_block?: ResponseEndBlockAmino;
  response_commit?: ResponseCommitAmino;
}
export interface BlockMetadataAminoMsg {
  type: "cosmos-sdk/BlockMetadata";
  value: BlockMetadataAmino;
}
/**
 * BlockMetadata contains all the abci event data of a block
 * the file streamer dump them into files together with the state changes.
 */
export interface BlockMetadataSDKType {
  request_begin_block?: RequestBeginBlockSDKType;
  response_begin_block?: ResponseBeginBlockSDKType;
  deliver_txs: BlockMetadata_DeliverTxSDKType[];
  request_end_block?: RequestEndBlockSDKType;
  response_end_block?: ResponseEndBlockSDKType;
  response_commit?: ResponseCommitSDKType;
}
/** DeliverTx encapulate deliver tx request and response. */
export interface BlockMetadata_DeliverTx {
  request?: RequestDeliverTx;
  response?: ResponseDeliverTx;
}
export interface BlockMetadata_DeliverTxProtoMsg {
  typeUrl: "/cosmos.base.store.v1beta1.DeliverTx";
  value: Uint8Array;
}
/** DeliverTx encapulate deliver tx request and response. */
export interface BlockMetadata_DeliverTxAmino {
  request?: RequestDeliverTxAmino;
  response?: ResponseDeliverTxAmino;
}
export interface BlockMetadata_DeliverTxAminoMsg {
  type: "cosmos-sdk/DeliverTx";
  value: BlockMetadata_DeliverTxAmino;
}
/** DeliverTx encapulate deliver tx request and response. */
export interface BlockMetadata_DeliverTxSDKType {
  request?: RequestDeliverTxSDKType;
  response?: ResponseDeliverTxSDKType;
}
function createBaseStoreKVPair(): StoreKVPair {
  return {
    storeKey: "",
    delete: false,
    key: new Uint8Array(),
    value: new Uint8Array()
  };
}
export const StoreKVPair = {
  typeUrl: "/cosmos.base.store.v1beta1.StoreKVPair",
  encode(message: StoreKVPair, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.storeKey !== "") {
      writer.uint32(10).string(message.storeKey);
    }
    if (message.delete === true) {
      writer.uint32(16).bool(message.delete);
    }
    if (message.key.length !== 0) {
      writer.uint32(26).bytes(message.key);
    }
    if (message.value.length !== 0) {
      writer.uint32(34).bytes(message.value);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StoreKVPair {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStoreKVPair();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.storeKey = reader.string();
          break;
        case 2:
          message.delete = reader.bool();
          break;
        case 3:
          message.key = reader.bytes();
          break;
        case 4:
          message.value = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StoreKVPair>): StoreKVPair {
    const message = createBaseStoreKVPair();
    message.storeKey = object.storeKey ?? "";
    message.delete = object.delete ?? false;
    message.key = object.key ?? new Uint8Array();
    message.value = object.value ?? new Uint8Array();
    return message;
  },
  fromAmino(object: StoreKVPairAmino): StoreKVPair {
    const message = createBaseStoreKVPair();
    if (object.store_key !== undefined && object.store_key !== null) {
      message.storeKey = object.store_key;
    }
    if (object.delete !== undefined && object.delete !== null) {
      message.delete = object.delete;
    }
    if (object.key !== undefined && object.key !== null) {
      message.key = bytesFromBase64(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = bytesFromBase64(object.value);
    }
    return message;
  },
  toAmino(message: StoreKVPair): StoreKVPairAmino {
    const obj: any = {};
    obj.store_key = message.storeKey === "" ? undefined : message.storeKey;
    obj.delete = message.delete === false ? undefined : message.delete;
    obj.key = message.key ? base64FromBytes(message.key) : undefined;
    obj.value = message.value ? base64FromBytes(message.value) : undefined;
    return obj;
  },
  fromAminoMsg(object: StoreKVPairAminoMsg): StoreKVPair {
    return StoreKVPair.fromAmino(object.value);
  },
  toAminoMsg(message: StoreKVPair): StoreKVPairAminoMsg {
    return {
      type: "cosmos-sdk/StoreKVPair",
      value: StoreKVPair.toAmino(message)
    };
  },
  fromProtoMsg(message: StoreKVPairProtoMsg): StoreKVPair {
    return StoreKVPair.decode(message.value);
  },
  toProto(message: StoreKVPair): Uint8Array {
    return StoreKVPair.encode(message).finish();
  },
  toProtoMsg(message: StoreKVPair): StoreKVPairProtoMsg {
    return {
      typeUrl: "/cosmos.base.store.v1beta1.StoreKVPair",
      value: StoreKVPair.encode(message).finish()
    };
  }
};
function createBaseBlockMetadata(): BlockMetadata {
  return {
    requestBeginBlock: undefined,
    responseBeginBlock: undefined,
    deliverTxs: [],
    requestEndBlock: undefined,
    responseEndBlock: undefined,
    responseCommit: undefined
  };
}
export const BlockMetadata = {
  typeUrl: "/cosmos.base.store.v1beta1.BlockMetadata",
  encode(message: BlockMetadata, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.requestBeginBlock !== undefined) {
      RequestBeginBlock.encode(message.requestBeginBlock, writer.uint32(10).fork()).ldelim();
    }
    if (message.responseBeginBlock !== undefined) {
      ResponseBeginBlock.encode(message.responseBeginBlock, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.deliverTxs) {
      BlockMetadata_DeliverTx.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.requestEndBlock !== undefined) {
      RequestEndBlock.encode(message.requestEndBlock, writer.uint32(34).fork()).ldelim();
    }
    if (message.responseEndBlock !== undefined) {
      ResponseEndBlock.encode(message.responseEndBlock, writer.uint32(42).fork()).ldelim();
    }
    if (message.responseCommit !== undefined) {
      ResponseCommit.encode(message.responseCommit, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): BlockMetadata {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBlockMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requestBeginBlock = RequestBeginBlock.decode(reader, reader.uint32());
          break;
        case 2:
          message.responseBeginBlock = ResponseBeginBlock.decode(reader, reader.uint32());
          break;
        case 3:
          message.deliverTxs.push(BlockMetadata_DeliverTx.decode(reader, reader.uint32()));
          break;
        case 4:
          message.requestEndBlock = RequestEndBlock.decode(reader, reader.uint32());
          break;
        case 5:
          message.responseEndBlock = ResponseEndBlock.decode(reader, reader.uint32());
          break;
        case 6:
          message.responseCommit = ResponseCommit.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<BlockMetadata>): BlockMetadata {
    const message = createBaseBlockMetadata();
    message.requestBeginBlock = object.requestBeginBlock !== undefined && object.requestBeginBlock !== null ? RequestBeginBlock.fromPartial(object.requestBeginBlock) : undefined;
    message.responseBeginBlock = object.responseBeginBlock !== undefined && object.responseBeginBlock !== null ? ResponseBeginBlock.fromPartial(object.responseBeginBlock) : undefined;
    message.deliverTxs = object.deliverTxs?.map(e => BlockMetadata_DeliverTx.fromPartial(e)) || [];
    message.requestEndBlock = object.requestEndBlock !== undefined && object.requestEndBlock !== null ? RequestEndBlock.fromPartial(object.requestEndBlock) : undefined;
    message.responseEndBlock = object.responseEndBlock !== undefined && object.responseEndBlock !== null ? ResponseEndBlock.fromPartial(object.responseEndBlock) : undefined;
    message.responseCommit = object.responseCommit !== undefined && object.responseCommit !== null ? ResponseCommit.fromPartial(object.responseCommit) : undefined;
    return message;
  },
  fromAmino(object: BlockMetadataAmino): BlockMetadata {
    const message = createBaseBlockMetadata();
    if (object.request_begin_block !== undefined && object.request_begin_block !== null) {
      message.requestBeginBlock = RequestBeginBlock.fromAmino(object.request_begin_block);
    }
    if (object.response_begin_block !== undefined && object.response_begin_block !== null) {
      message.responseBeginBlock = ResponseBeginBlock.fromAmino(object.response_begin_block);
    }
    message.deliverTxs = object.deliver_txs?.map(e => BlockMetadata_DeliverTx.fromAmino(e)) || [];
    if (object.request_end_block !== undefined && object.request_end_block !== null) {
      message.requestEndBlock = RequestEndBlock.fromAmino(object.request_end_block);
    }
    if (object.response_end_block !== undefined && object.response_end_block !== null) {
      message.responseEndBlock = ResponseEndBlock.fromAmino(object.response_end_block);
    }
    if (object.response_commit !== undefined && object.response_commit !== null) {
      message.responseCommit = ResponseCommit.fromAmino(object.response_commit);
    }
    return message;
  },
  toAmino(message: BlockMetadata): BlockMetadataAmino {
    const obj: any = {};
    obj.request_begin_block = message.requestBeginBlock ? RequestBeginBlock.toAmino(message.requestBeginBlock) : undefined;
    obj.response_begin_block = message.responseBeginBlock ? ResponseBeginBlock.toAmino(message.responseBeginBlock) : undefined;
    if (message.deliverTxs) {
      obj.deliver_txs = message.deliverTxs.map(e => e ? BlockMetadata_DeliverTx.toAmino(e) : undefined);
    } else {
      obj.deliver_txs = message.deliverTxs;
    }
    obj.request_end_block = message.requestEndBlock ? RequestEndBlock.toAmino(message.requestEndBlock) : undefined;
    obj.response_end_block = message.responseEndBlock ? ResponseEndBlock.toAmino(message.responseEndBlock) : undefined;
    obj.response_commit = message.responseCommit ? ResponseCommit.toAmino(message.responseCommit) : undefined;
    return obj;
  },
  fromAminoMsg(object: BlockMetadataAminoMsg): BlockMetadata {
    return BlockMetadata.fromAmino(object.value);
  },
  toAminoMsg(message: BlockMetadata): BlockMetadataAminoMsg {
    return {
      type: "cosmos-sdk/BlockMetadata",
      value: BlockMetadata.toAmino(message)
    };
  },
  fromProtoMsg(message: BlockMetadataProtoMsg): BlockMetadata {
    return BlockMetadata.decode(message.value);
  },
  toProto(message: BlockMetadata): Uint8Array {
    return BlockMetadata.encode(message).finish();
  },
  toProtoMsg(message: BlockMetadata): BlockMetadataProtoMsg {
    return {
      typeUrl: "/cosmos.base.store.v1beta1.BlockMetadata",
      value: BlockMetadata.encode(message).finish()
    };
  }
};
function createBaseBlockMetadata_DeliverTx(): BlockMetadata_DeliverTx {
  return {
    request: undefined,
    response: undefined
  };
}
export const BlockMetadata_DeliverTx = {
  typeUrl: "/cosmos.base.store.v1beta1.DeliverTx",
  encode(message: BlockMetadata_DeliverTx, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.request !== undefined) {
      RequestDeliverTx.encode(message.request, writer.uint32(10).fork()).ldelim();
    }
    if (message.response !== undefined) {
      ResponseDeliverTx.encode(message.response, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): BlockMetadata_DeliverTx {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBlockMetadata_DeliverTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.request = RequestDeliverTx.decode(reader, reader.uint32());
          break;
        case 2:
          message.response = ResponseDeliverTx.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<BlockMetadata_DeliverTx>): BlockMetadata_DeliverTx {
    const message = createBaseBlockMetadata_DeliverTx();
    message.request = object.request !== undefined && object.request !== null ? RequestDeliverTx.fromPartial(object.request) : undefined;
    message.response = object.response !== undefined && object.response !== null ? ResponseDeliverTx.fromPartial(object.response) : undefined;
    return message;
  },
  fromAmino(object: BlockMetadata_DeliverTxAmino): BlockMetadata_DeliverTx {
    const message = createBaseBlockMetadata_DeliverTx();
    if (object.request !== undefined && object.request !== null) {
      message.request = RequestDeliverTx.fromAmino(object.request);
    }
    if (object.response !== undefined && object.response !== null) {
      message.response = ResponseDeliverTx.fromAmino(object.response);
    }
    return message;
  },
  toAmino(message: BlockMetadata_DeliverTx): BlockMetadata_DeliverTxAmino {
    const obj: any = {};
    obj.request = message.request ? RequestDeliverTx.toAmino(message.request) : undefined;
    obj.response = message.response ? ResponseDeliverTx.toAmino(message.response) : undefined;
    return obj;
  },
  fromAminoMsg(object: BlockMetadata_DeliverTxAminoMsg): BlockMetadata_DeliverTx {
    return BlockMetadata_DeliverTx.fromAmino(object.value);
  },
  toAminoMsg(message: BlockMetadata_DeliverTx): BlockMetadata_DeliverTxAminoMsg {
    return {
      type: "cosmos-sdk/DeliverTx",
      value: BlockMetadata_DeliverTx.toAmino(message)
    };
  },
  fromProtoMsg(message: BlockMetadata_DeliverTxProtoMsg): BlockMetadata_DeliverTx {
    return BlockMetadata_DeliverTx.decode(message.value);
  },
  toProto(message: BlockMetadata_DeliverTx): Uint8Array {
    return BlockMetadata_DeliverTx.encode(message).finish();
  },
  toProtoMsg(message: BlockMetadata_DeliverTx): BlockMetadata_DeliverTxProtoMsg {
    return {
      typeUrl: "/cosmos.base.store.v1beta1.DeliverTx",
      value: BlockMetadata_DeliverTx.encode(message).finish()
    };
  }
};