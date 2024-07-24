import { Any, AnyAmino, AnySDKType } from "../../../../google/protobuf/any";
import { BinaryReader, BinaryWriter } from "../../../../binary";
import { bytesFromBase64, base64FromBytes } from "../../../../helpers";
/** MsgCreateClient defines a message to create an IBC client */
export interface MsgCreateClient {
  /** light client state */
  clientState?: Any;
  /**
   * consensus state associated with the client that corresponds to a given
   * height.
   */
  consensusState?: Any;
  /** signer address */
  signer: string;
}
export interface MsgCreateClientProtoMsg {
  typeUrl: "/ibc.core.client.v1.MsgCreateClient";
  value: Uint8Array;
}
/** MsgCreateClient defines a message to create an IBC client */
export interface MsgCreateClientAmino {
  /** light client state */
  client_state?: AnyAmino;
  /**
   * consensus state associated with the client that corresponds to a given
   * height.
   */
  consensus_state?: AnyAmino;
  /** signer address */
  signer?: string;
}
export interface MsgCreateClientAminoMsg {
  type: "cosmos-sdk/MsgCreateClient";
  value: MsgCreateClientAmino;
}
/** MsgCreateClient defines a message to create an IBC client */
export interface MsgCreateClientSDKType {
  client_state?: AnySDKType;
  consensus_state?: AnySDKType;
  signer: string;
}
/** MsgCreateClientResponse defines the Msg/CreateClient response type. */
export interface MsgCreateClientResponse {}
export interface MsgCreateClientResponseProtoMsg {
  typeUrl: "/ibc.core.client.v1.MsgCreateClientResponse";
  value: Uint8Array;
}
/** MsgCreateClientResponse defines the Msg/CreateClient response type. */
export interface MsgCreateClientResponseAmino {}
export interface MsgCreateClientResponseAminoMsg {
  type: "cosmos-sdk/MsgCreateClientResponse";
  value: MsgCreateClientResponseAmino;
}
/** MsgCreateClientResponse defines the Msg/CreateClient response type. */
export interface MsgCreateClientResponseSDKType {}
/**
 * MsgUpdateClient defines an sdk.Msg to update a IBC client state using
 * the given header.
 */
export interface MsgUpdateClient {
  /** client unique identifier */
  clientId: string;
  /** header to update the light client */
  header?: Any;
  /** signer address */
  signer: string;
}
export interface MsgUpdateClientProtoMsg {
  typeUrl: "/ibc.core.client.v1.MsgUpdateClient";
  value: Uint8Array;
}
/**
 * MsgUpdateClient defines an sdk.Msg to update a IBC client state using
 * the given header.
 */
export interface MsgUpdateClientAmino {
  /** client unique identifier */
  client_id?: string;
  /** header to update the light client */
  header?: AnyAmino;
  /** signer address */
  signer?: string;
}
export interface MsgUpdateClientAminoMsg {
  type: "cosmos-sdk/MsgUpdateClient";
  value: MsgUpdateClientAmino;
}
/**
 * MsgUpdateClient defines an sdk.Msg to update a IBC client state using
 * the given header.
 */
export interface MsgUpdateClientSDKType {
  client_id: string;
  header?: AnySDKType;
  signer: string;
}
/** MsgUpdateClientResponse defines the Msg/UpdateClient response type. */
export interface MsgUpdateClientResponse {}
export interface MsgUpdateClientResponseProtoMsg {
  typeUrl: "/ibc.core.client.v1.MsgUpdateClientResponse";
  value: Uint8Array;
}
/** MsgUpdateClientResponse defines the Msg/UpdateClient response type. */
export interface MsgUpdateClientResponseAmino {}
export interface MsgUpdateClientResponseAminoMsg {
  type: "cosmos-sdk/MsgUpdateClientResponse";
  value: MsgUpdateClientResponseAmino;
}
/** MsgUpdateClientResponse defines the Msg/UpdateClient response type. */
export interface MsgUpdateClientResponseSDKType {}
/**
 * MsgUpgradeClient defines an sdk.Msg to upgrade an IBC client to a new client
 * state
 */
export interface MsgUpgradeClient {
  /** client unique identifier */
  clientId: string;
  /** upgraded client state */
  clientState?: Any;
  /**
   * upgraded consensus state, only contains enough information to serve as a
   * basis of trust in update logic
   */
  consensusState?: Any;
  /** proof that old chain committed to new client */
  proofUpgradeClient: Uint8Array;
  /** proof that old chain committed to new consensus state */
  proofUpgradeConsensusState: Uint8Array;
  /** signer address */
  signer: string;
}
export interface MsgUpgradeClientProtoMsg {
  typeUrl: "/ibc.core.client.v1.MsgUpgradeClient";
  value: Uint8Array;
}
/**
 * MsgUpgradeClient defines an sdk.Msg to upgrade an IBC client to a new client
 * state
 */
export interface MsgUpgradeClientAmino {
  /** client unique identifier */
  client_id?: string;
  /** upgraded client state */
  client_state?: AnyAmino;
  /**
   * upgraded consensus state, only contains enough information to serve as a
   * basis of trust in update logic
   */
  consensus_state?: AnyAmino;
  /** proof that old chain committed to new client */
  proof_upgrade_client?: string;
  /** proof that old chain committed to new consensus state */
  proof_upgrade_consensus_state?: string;
  /** signer address */
  signer?: string;
}
export interface MsgUpgradeClientAminoMsg {
  type: "cosmos-sdk/MsgUpgradeClient";
  value: MsgUpgradeClientAmino;
}
/**
 * MsgUpgradeClient defines an sdk.Msg to upgrade an IBC client to a new client
 * state
 */
export interface MsgUpgradeClientSDKType {
  client_id: string;
  client_state?: AnySDKType;
  consensus_state?: AnySDKType;
  proof_upgrade_client: Uint8Array;
  proof_upgrade_consensus_state: Uint8Array;
  signer: string;
}
/** MsgUpgradeClientResponse defines the Msg/UpgradeClient response type. */
export interface MsgUpgradeClientResponse {}
export interface MsgUpgradeClientResponseProtoMsg {
  typeUrl: "/ibc.core.client.v1.MsgUpgradeClientResponse";
  value: Uint8Array;
}
/** MsgUpgradeClientResponse defines the Msg/UpgradeClient response type. */
export interface MsgUpgradeClientResponseAmino {}
export interface MsgUpgradeClientResponseAminoMsg {
  type: "cosmos-sdk/MsgUpgradeClientResponse";
  value: MsgUpgradeClientResponseAmino;
}
/** MsgUpgradeClientResponse defines the Msg/UpgradeClient response type. */
export interface MsgUpgradeClientResponseSDKType {}
/**
 * MsgSubmitMisbehaviour defines an sdk.Msg type that submits Evidence for
 * light client misbehaviour.
 */
export interface MsgSubmitMisbehaviour {
  /** client unique identifier */
  clientId: string;
  /** misbehaviour used for freezing the light client */
  misbehaviour?: Any;
  /** signer address */
  signer: string;
}
export interface MsgSubmitMisbehaviourProtoMsg {
  typeUrl: "/ibc.core.client.v1.MsgSubmitMisbehaviour";
  value: Uint8Array;
}
/**
 * MsgSubmitMisbehaviour defines an sdk.Msg type that submits Evidence for
 * light client misbehaviour.
 */
export interface MsgSubmitMisbehaviourAmino {
  /** client unique identifier */
  client_id?: string;
  /** misbehaviour used for freezing the light client */
  misbehaviour?: AnyAmino;
  /** signer address */
  signer?: string;
}
export interface MsgSubmitMisbehaviourAminoMsg {
  type: "cosmos-sdk/MsgSubmitMisbehaviour";
  value: MsgSubmitMisbehaviourAmino;
}
/**
 * MsgSubmitMisbehaviour defines an sdk.Msg type that submits Evidence for
 * light client misbehaviour.
 */
export interface MsgSubmitMisbehaviourSDKType {
  client_id: string;
  misbehaviour?: AnySDKType;
  signer: string;
}
/**
 * MsgSubmitMisbehaviourResponse defines the Msg/SubmitMisbehaviour response
 * type.
 */
export interface MsgSubmitMisbehaviourResponse {}
export interface MsgSubmitMisbehaviourResponseProtoMsg {
  typeUrl: "/ibc.core.client.v1.MsgSubmitMisbehaviourResponse";
  value: Uint8Array;
}
/**
 * MsgSubmitMisbehaviourResponse defines the Msg/SubmitMisbehaviour response
 * type.
 */
export interface MsgSubmitMisbehaviourResponseAmino {}
export interface MsgSubmitMisbehaviourResponseAminoMsg {
  type: "cosmos-sdk/MsgSubmitMisbehaviourResponse";
  value: MsgSubmitMisbehaviourResponseAmino;
}
/**
 * MsgSubmitMisbehaviourResponse defines the Msg/SubmitMisbehaviour response
 * type.
 */
export interface MsgSubmitMisbehaviourResponseSDKType {}
function createBaseMsgCreateClient(): MsgCreateClient {
  return {
    clientState: undefined,
    consensusState: undefined,
    signer: ""
  };
}
export const MsgCreateClient = {
  typeUrl: "/ibc.core.client.v1.MsgCreateClient",
  encode(message: MsgCreateClient, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.clientState !== undefined) {
      Any.encode(message.clientState, writer.uint32(10).fork()).ldelim();
    }
    if (message.consensusState !== undefined) {
      Any.encode(message.consensusState, writer.uint32(18).fork()).ldelim();
    }
    if (message.signer !== "") {
      writer.uint32(26).string(message.signer);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateClient {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateClient();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientState = Any.decode(reader, reader.uint32());
          break;
        case 2:
          message.consensusState = Any.decode(reader, reader.uint32());
          break;
        case 3:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgCreateClient>): MsgCreateClient {
    const message = createBaseMsgCreateClient();
    message.clientState = object.clientState !== undefined && object.clientState !== null ? Any.fromPartial(object.clientState) : undefined;
    message.consensusState = object.consensusState !== undefined && object.consensusState !== null ? Any.fromPartial(object.consensusState) : undefined;
    message.signer = object.signer ?? "";
    return message;
  },
  fromAmino(object: MsgCreateClientAmino): MsgCreateClient {
    const message = createBaseMsgCreateClient();
    if (object.client_state !== undefined && object.client_state !== null) {
      message.clientState = Any.fromAmino(object.client_state);
    }
    if (object.consensus_state !== undefined && object.consensus_state !== null) {
      message.consensusState = Any.fromAmino(object.consensus_state);
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    }
    return message;
  },
  toAmino(message: MsgCreateClient): MsgCreateClientAmino {
    const obj: any = {};
    obj.client_state = message.clientState ? Any.toAmino(message.clientState) : undefined;
    obj.consensus_state = message.consensusState ? Any.toAmino(message.consensusState) : undefined;
    obj.signer = message.signer === "" ? undefined : message.signer;
    return obj;
  },
  fromAminoMsg(object: MsgCreateClientAminoMsg): MsgCreateClient {
    return MsgCreateClient.fromAmino(object.value);
  },
  toAminoMsg(message: MsgCreateClient): MsgCreateClientAminoMsg {
    return {
      type: "cosmos-sdk/MsgCreateClient",
      value: MsgCreateClient.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgCreateClientProtoMsg): MsgCreateClient {
    return MsgCreateClient.decode(message.value);
  },
  toProto(message: MsgCreateClient): Uint8Array {
    return MsgCreateClient.encode(message).finish();
  },
  toProtoMsg(message: MsgCreateClient): MsgCreateClientProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.MsgCreateClient",
      value: MsgCreateClient.encode(message).finish()
    };
  }
};
function createBaseMsgCreateClientResponse(): MsgCreateClientResponse {
  return {};
}
export const MsgCreateClientResponse = {
  typeUrl: "/ibc.core.client.v1.MsgCreateClientResponse",
  encode(_: MsgCreateClientResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateClientResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateClientResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(_: Partial<MsgCreateClientResponse>): MsgCreateClientResponse {
    const message = createBaseMsgCreateClientResponse();
    return message;
  },
  fromAmino(_: MsgCreateClientResponseAmino): MsgCreateClientResponse {
    const message = createBaseMsgCreateClientResponse();
    return message;
  },
  toAmino(_: MsgCreateClientResponse): MsgCreateClientResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgCreateClientResponseAminoMsg): MsgCreateClientResponse {
    return MsgCreateClientResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgCreateClientResponse): MsgCreateClientResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgCreateClientResponse",
      value: MsgCreateClientResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgCreateClientResponseProtoMsg): MsgCreateClientResponse {
    return MsgCreateClientResponse.decode(message.value);
  },
  toProto(message: MsgCreateClientResponse): Uint8Array {
    return MsgCreateClientResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgCreateClientResponse): MsgCreateClientResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.MsgCreateClientResponse",
      value: MsgCreateClientResponse.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateClient(): MsgUpdateClient {
  return {
    clientId: "",
    header: undefined,
    signer: ""
  };
}
export const MsgUpdateClient = {
  typeUrl: "/ibc.core.client.v1.MsgUpdateClient",
  encode(message: MsgUpdateClient, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    if (message.header !== undefined) {
      Any.encode(message.header, writer.uint32(18).fork()).ldelim();
    }
    if (message.signer !== "") {
      writer.uint32(26).string(message.signer);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateClient {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateClient();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientId = reader.string();
          break;
        case 2:
          message.header = Any.decode(reader, reader.uint32());
          break;
        case 3:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgUpdateClient>): MsgUpdateClient {
    const message = createBaseMsgUpdateClient();
    message.clientId = object.clientId ?? "";
    message.header = object.header !== undefined && object.header !== null ? Any.fromPartial(object.header) : undefined;
    message.signer = object.signer ?? "";
    return message;
  },
  fromAmino(object: MsgUpdateClientAmino): MsgUpdateClient {
    const message = createBaseMsgUpdateClient();
    if (object.client_id !== undefined && object.client_id !== null) {
      message.clientId = object.client_id;
    }
    if (object.header !== undefined && object.header !== null) {
      message.header = Any.fromAmino(object.header);
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    }
    return message;
  },
  toAmino(message: MsgUpdateClient): MsgUpdateClientAmino {
    const obj: any = {};
    obj.client_id = message.clientId === "" ? undefined : message.clientId;
    obj.header = message.header ? Any.toAmino(message.header) : undefined;
    obj.signer = message.signer === "" ? undefined : message.signer;
    return obj;
  },
  fromAminoMsg(object: MsgUpdateClientAminoMsg): MsgUpdateClient {
    return MsgUpdateClient.fromAmino(object.value);
  },
  toAminoMsg(message: MsgUpdateClient): MsgUpdateClientAminoMsg {
    return {
      type: "cosmos-sdk/MsgUpdateClient",
      value: MsgUpdateClient.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgUpdateClientProtoMsg): MsgUpdateClient {
    return MsgUpdateClient.decode(message.value);
  },
  toProto(message: MsgUpdateClient): Uint8Array {
    return MsgUpdateClient.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateClient): MsgUpdateClientProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.MsgUpdateClient",
      value: MsgUpdateClient.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateClientResponse(): MsgUpdateClientResponse {
  return {};
}
export const MsgUpdateClientResponse = {
  typeUrl: "/ibc.core.client.v1.MsgUpdateClientResponse",
  encode(_: MsgUpdateClientResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateClientResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateClientResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(_: Partial<MsgUpdateClientResponse>): MsgUpdateClientResponse {
    const message = createBaseMsgUpdateClientResponse();
    return message;
  },
  fromAmino(_: MsgUpdateClientResponseAmino): MsgUpdateClientResponse {
    const message = createBaseMsgUpdateClientResponse();
    return message;
  },
  toAmino(_: MsgUpdateClientResponse): MsgUpdateClientResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgUpdateClientResponseAminoMsg): MsgUpdateClientResponse {
    return MsgUpdateClientResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgUpdateClientResponse): MsgUpdateClientResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgUpdateClientResponse",
      value: MsgUpdateClientResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgUpdateClientResponseProtoMsg): MsgUpdateClientResponse {
    return MsgUpdateClientResponse.decode(message.value);
  },
  toProto(message: MsgUpdateClientResponse): Uint8Array {
    return MsgUpdateClientResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateClientResponse): MsgUpdateClientResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.MsgUpdateClientResponse",
      value: MsgUpdateClientResponse.encode(message).finish()
    };
  }
};
function createBaseMsgUpgradeClient(): MsgUpgradeClient {
  return {
    clientId: "",
    clientState: undefined,
    consensusState: undefined,
    proofUpgradeClient: new Uint8Array(),
    proofUpgradeConsensusState: new Uint8Array(),
    signer: ""
  };
}
export const MsgUpgradeClient = {
  typeUrl: "/ibc.core.client.v1.MsgUpgradeClient",
  encode(message: MsgUpgradeClient, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    if (message.clientState !== undefined) {
      Any.encode(message.clientState, writer.uint32(18).fork()).ldelim();
    }
    if (message.consensusState !== undefined) {
      Any.encode(message.consensusState, writer.uint32(26).fork()).ldelim();
    }
    if (message.proofUpgradeClient.length !== 0) {
      writer.uint32(34).bytes(message.proofUpgradeClient);
    }
    if (message.proofUpgradeConsensusState.length !== 0) {
      writer.uint32(42).bytes(message.proofUpgradeConsensusState);
    }
    if (message.signer !== "") {
      writer.uint32(50).string(message.signer);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpgradeClient {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpgradeClient();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientId = reader.string();
          break;
        case 2:
          message.clientState = Any.decode(reader, reader.uint32());
          break;
        case 3:
          message.consensusState = Any.decode(reader, reader.uint32());
          break;
        case 4:
          message.proofUpgradeClient = reader.bytes();
          break;
        case 5:
          message.proofUpgradeConsensusState = reader.bytes();
          break;
        case 6:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgUpgradeClient>): MsgUpgradeClient {
    const message = createBaseMsgUpgradeClient();
    message.clientId = object.clientId ?? "";
    message.clientState = object.clientState !== undefined && object.clientState !== null ? Any.fromPartial(object.clientState) : undefined;
    message.consensusState = object.consensusState !== undefined && object.consensusState !== null ? Any.fromPartial(object.consensusState) : undefined;
    message.proofUpgradeClient = object.proofUpgradeClient ?? new Uint8Array();
    message.proofUpgradeConsensusState = object.proofUpgradeConsensusState ?? new Uint8Array();
    message.signer = object.signer ?? "";
    return message;
  },
  fromAmino(object: MsgUpgradeClientAmino): MsgUpgradeClient {
    const message = createBaseMsgUpgradeClient();
    if (object.client_id !== undefined && object.client_id !== null) {
      message.clientId = object.client_id;
    }
    if (object.client_state !== undefined && object.client_state !== null) {
      message.clientState = Any.fromAmino(object.client_state);
    }
    if (object.consensus_state !== undefined && object.consensus_state !== null) {
      message.consensusState = Any.fromAmino(object.consensus_state);
    }
    if (object.proof_upgrade_client !== undefined && object.proof_upgrade_client !== null) {
      message.proofUpgradeClient = bytesFromBase64(object.proof_upgrade_client);
    }
    if (object.proof_upgrade_consensus_state !== undefined && object.proof_upgrade_consensus_state !== null) {
      message.proofUpgradeConsensusState = bytesFromBase64(object.proof_upgrade_consensus_state);
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    }
    return message;
  },
  toAmino(message: MsgUpgradeClient): MsgUpgradeClientAmino {
    const obj: any = {};
    obj.client_id = message.clientId === "" ? undefined : message.clientId;
    obj.client_state = message.clientState ? Any.toAmino(message.clientState) : undefined;
    obj.consensus_state = message.consensusState ? Any.toAmino(message.consensusState) : undefined;
    obj.proof_upgrade_client = message.proofUpgradeClient ? base64FromBytes(message.proofUpgradeClient) : undefined;
    obj.proof_upgrade_consensus_state = message.proofUpgradeConsensusState ? base64FromBytes(message.proofUpgradeConsensusState) : undefined;
    obj.signer = message.signer === "" ? undefined : message.signer;
    return obj;
  },
  fromAminoMsg(object: MsgUpgradeClientAminoMsg): MsgUpgradeClient {
    return MsgUpgradeClient.fromAmino(object.value);
  },
  toAminoMsg(message: MsgUpgradeClient): MsgUpgradeClientAminoMsg {
    return {
      type: "cosmos-sdk/MsgUpgradeClient",
      value: MsgUpgradeClient.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgUpgradeClientProtoMsg): MsgUpgradeClient {
    return MsgUpgradeClient.decode(message.value);
  },
  toProto(message: MsgUpgradeClient): Uint8Array {
    return MsgUpgradeClient.encode(message).finish();
  },
  toProtoMsg(message: MsgUpgradeClient): MsgUpgradeClientProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.MsgUpgradeClient",
      value: MsgUpgradeClient.encode(message).finish()
    };
  }
};
function createBaseMsgUpgradeClientResponse(): MsgUpgradeClientResponse {
  return {};
}
export const MsgUpgradeClientResponse = {
  typeUrl: "/ibc.core.client.v1.MsgUpgradeClientResponse",
  encode(_: MsgUpgradeClientResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpgradeClientResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpgradeClientResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(_: Partial<MsgUpgradeClientResponse>): MsgUpgradeClientResponse {
    const message = createBaseMsgUpgradeClientResponse();
    return message;
  },
  fromAmino(_: MsgUpgradeClientResponseAmino): MsgUpgradeClientResponse {
    const message = createBaseMsgUpgradeClientResponse();
    return message;
  },
  toAmino(_: MsgUpgradeClientResponse): MsgUpgradeClientResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgUpgradeClientResponseAminoMsg): MsgUpgradeClientResponse {
    return MsgUpgradeClientResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgUpgradeClientResponse): MsgUpgradeClientResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgUpgradeClientResponse",
      value: MsgUpgradeClientResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgUpgradeClientResponseProtoMsg): MsgUpgradeClientResponse {
    return MsgUpgradeClientResponse.decode(message.value);
  },
  toProto(message: MsgUpgradeClientResponse): Uint8Array {
    return MsgUpgradeClientResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUpgradeClientResponse): MsgUpgradeClientResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.MsgUpgradeClientResponse",
      value: MsgUpgradeClientResponse.encode(message).finish()
    };
  }
};
function createBaseMsgSubmitMisbehaviour(): MsgSubmitMisbehaviour {
  return {
    clientId: "",
    misbehaviour: undefined,
    signer: ""
  };
}
export const MsgSubmitMisbehaviour = {
  typeUrl: "/ibc.core.client.v1.MsgSubmitMisbehaviour",
  encode(message: MsgSubmitMisbehaviour, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    if (message.misbehaviour !== undefined) {
      Any.encode(message.misbehaviour, writer.uint32(18).fork()).ldelim();
    }
    if (message.signer !== "") {
      writer.uint32(26).string(message.signer);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSubmitMisbehaviour {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitMisbehaviour();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientId = reader.string();
          break;
        case 2:
          message.misbehaviour = Any.decode(reader, reader.uint32());
          break;
        case 3:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSubmitMisbehaviour>): MsgSubmitMisbehaviour {
    const message = createBaseMsgSubmitMisbehaviour();
    message.clientId = object.clientId ?? "";
    message.misbehaviour = object.misbehaviour !== undefined && object.misbehaviour !== null ? Any.fromPartial(object.misbehaviour) : undefined;
    message.signer = object.signer ?? "";
    return message;
  },
  fromAmino(object: MsgSubmitMisbehaviourAmino): MsgSubmitMisbehaviour {
    const message = createBaseMsgSubmitMisbehaviour();
    if (object.client_id !== undefined && object.client_id !== null) {
      message.clientId = object.client_id;
    }
    if (object.misbehaviour !== undefined && object.misbehaviour !== null) {
      message.misbehaviour = Any.fromAmino(object.misbehaviour);
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    }
    return message;
  },
  toAmino(message: MsgSubmitMisbehaviour): MsgSubmitMisbehaviourAmino {
    const obj: any = {};
    obj.client_id = message.clientId === "" ? undefined : message.clientId;
    obj.misbehaviour = message.misbehaviour ? Any.toAmino(message.misbehaviour) : undefined;
    obj.signer = message.signer === "" ? undefined : message.signer;
    return obj;
  },
  fromAminoMsg(object: MsgSubmitMisbehaviourAminoMsg): MsgSubmitMisbehaviour {
    return MsgSubmitMisbehaviour.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSubmitMisbehaviour): MsgSubmitMisbehaviourAminoMsg {
    return {
      type: "cosmos-sdk/MsgSubmitMisbehaviour",
      value: MsgSubmitMisbehaviour.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSubmitMisbehaviourProtoMsg): MsgSubmitMisbehaviour {
    return MsgSubmitMisbehaviour.decode(message.value);
  },
  toProto(message: MsgSubmitMisbehaviour): Uint8Array {
    return MsgSubmitMisbehaviour.encode(message).finish();
  },
  toProtoMsg(message: MsgSubmitMisbehaviour): MsgSubmitMisbehaviourProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.MsgSubmitMisbehaviour",
      value: MsgSubmitMisbehaviour.encode(message).finish()
    };
  }
};
function createBaseMsgSubmitMisbehaviourResponse(): MsgSubmitMisbehaviourResponse {
  return {};
}
export const MsgSubmitMisbehaviourResponse = {
  typeUrl: "/ibc.core.client.v1.MsgSubmitMisbehaviourResponse",
  encode(_: MsgSubmitMisbehaviourResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSubmitMisbehaviourResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitMisbehaviourResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(_: Partial<MsgSubmitMisbehaviourResponse>): MsgSubmitMisbehaviourResponse {
    const message = createBaseMsgSubmitMisbehaviourResponse();
    return message;
  },
  fromAmino(_: MsgSubmitMisbehaviourResponseAmino): MsgSubmitMisbehaviourResponse {
    const message = createBaseMsgSubmitMisbehaviourResponse();
    return message;
  },
  toAmino(_: MsgSubmitMisbehaviourResponse): MsgSubmitMisbehaviourResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgSubmitMisbehaviourResponseAminoMsg): MsgSubmitMisbehaviourResponse {
    return MsgSubmitMisbehaviourResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSubmitMisbehaviourResponse): MsgSubmitMisbehaviourResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgSubmitMisbehaviourResponse",
      value: MsgSubmitMisbehaviourResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSubmitMisbehaviourResponseProtoMsg): MsgSubmitMisbehaviourResponse {
    return MsgSubmitMisbehaviourResponse.decode(message.value);
  },
  toProto(message: MsgSubmitMisbehaviourResponse): Uint8Array {
    return MsgSubmitMisbehaviourResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSubmitMisbehaviourResponse): MsgSubmitMisbehaviourResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.MsgSubmitMisbehaviourResponse",
      value: MsgSubmitMisbehaviourResponse.encode(message).finish()
    };
  }
};