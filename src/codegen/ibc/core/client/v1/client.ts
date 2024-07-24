import { Any, AnyAmino, AnySDKType } from "../../../../google/protobuf/any";
import { Plan, PlanAmino, PlanSDKType } from "../../../../cosmos/upgrade/v1beta1/upgrade";
import { BinaryReader, BinaryWriter } from "../../../../binary";
/**
 * IdentifiedClientState defines a client state with an additional client
 * identifier field.
 */
export interface IdentifiedClientState {
  /** client identifier */
  clientId: string;
  /** client state */
  clientState?: Any;
}
export interface IdentifiedClientStateProtoMsg {
  typeUrl: "/ibc.core.client.v1.IdentifiedClientState";
  value: Uint8Array;
}
/**
 * IdentifiedClientState defines a client state with an additional client
 * identifier field.
 */
export interface IdentifiedClientStateAmino {
  /** client identifier */
  client_id?: string;
  /** client state */
  client_state?: AnyAmino;
}
export interface IdentifiedClientStateAminoMsg {
  type: "cosmos-sdk/IdentifiedClientState";
  value: IdentifiedClientStateAmino;
}
/**
 * IdentifiedClientState defines a client state with an additional client
 * identifier field.
 */
export interface IdentifiedClientStateSDKType {
  client_id: string;
  client_state?: AnySDKType;
}
/**
 * ConsensusStateWithHeight defines a consensus state with an additional height
 * field.
 */
export interface ConsensusStateWithHeight {
  /** consensus state height */
  height: Height;
  /** consensus state */
  consensusState?: Any;
}
export interface ConsensusStateWithHeightProtoMsg {
  typeUrl: "/ibc.core.client.v1.ConsensusStateWithHeight";
  value: Uint8Array;
}
/**
 * ConsensusStateWithHeight defines a consensus state with an additional height
 * field.
 */
export interface ConsensusStateWithHeightAmino {
  /** consensus state height */
  height?: HeightAmino;
  /** consensus state */
  consensus_state?: AnyAmino;
}
export interface ConsensusStateWithHeightAminoMsg {
  type: "cosmos-sdk/ConsensusStateWithHeight";
  value: ConsensusStateWithHeightAmino;
}
/**
 * ConsensusStateWithHeight defines a consensus state with an additional height
 * field.
 */
export interface ConsensusStateWithHeightSDKType {
  height: HeightSDKType;
  consensus_state?: AnySDKType;
}
/**
 * ClientConsensusStates defines all the stored consensus states for a given
 * client.
 */
export interface ClientConsensusStates {
  /** client identifier */
  clientId: string;
  /** consensus states and their heights associated with the client */
  consensusStates: ConsensusStateWithHeight[];
}
export interface ClientConsensusStatesProtoMsg {
  typeUrl: "/ibc.core.client.v1.ClientConsensusStates";
  value: Uint8Array;
}
/**
 * ClientConsensusStates defines all the stored consensus states for a given
 * client.
 */
export interface ClientConsensusStatesAmino {
  /** client identifier */
  client_id?: string;
  /** consensus states and their heights associated with the client */
  consensus_states?: ConsensusStateWithHeightAmino[];
}
export interface ClientConsensusStatesAminoMsg {
  type: "cosmos-sdk/ClientConsensusStates";
  value: ClientConsensusStatesAmino;
}
/**
 * ClientConsensusStates defines all the stored consensus states for a given
 * client.
 */
export interface ClientConsensusStatesSDKType {
  client_id: string;
  consensus_states: ConsensusStateWithHeightSDKType[];
}
/**
 * ClientUpdateProposal is a governance proposal. If it passes, the substitute
 * client's latest consensus state is copied over to the subject client. The proposal
 * handler may fail if the subject and the substitute do not match in client and
 * chain parameters (with exception to latest height, frozen height, and chain-id).
 */
export interface ClientUpdateProposal {
  /** the title of the update proposal */
  title: string;
  /** the description of the proposal */
  description: string;
  /** the client identifier for the client to be updated if the proposal passes */
  subjectClientId: string;
  /**
   * the substitute client identifier for the client standing in for the subject
   * client
   */
  substituteClientId: string;
}
export interface ClientUpdateProposalProtoMsg {
  typeUrl: "/ibc.core.client.v1.ClientUpdateProposal";
  value: Uint8Array;
}
/**
 * ClientUpdateProposal is a governance proposal. If it passes, the substitute
 * client's latest consensus state is copied over to the subject client. The proposal
 * handler may fail if the subject and the substitute do not match in client and
 * chain parameters (with exception to latest height, frozen height, and chain-id).
 */
export interface ClientUpdateProposalAmino {
  /** the title of the update proposal */
  title?: string;
  /** the description of the proposal */
  description?: string;
  /** the client identifier for the client to be updated if the proposal passes */
  subject_client_id?: string;
  /**
   * the substitute client identifier for the client standing in for the subject
   * client
   */
  substitute_client_id?: string;
}
export interface ClientUpdateProposalAminoMsg {
  type: "cosmos-sdk/ClientUpdateProposal";
  value: ClientUpdateProposalAmino;
}
/**
 * ClientUpdateProposal is a governance proposal. If it passes, the substitute
 * client's latest consensus state is copied over to the subject client. The proposal
 * handler may fail if the subject and the substitute do not match in client and
 * chain parameters (with exception to latest height, frozen height, and chain-id).
 */
export interface ClientUpdateProposalSDKType {
  title: string;
  description: string;
  subject_client_id: string;
  substitute_client_id: string;
}
/**
 * UpgradeProposal is a gov Content type for initiating an IBC breaking
 * upgrade.
 */
export interface UpgradeProposal {
  title: string;
  description: string;
  plan: Plan;
  /**
   * An UpgradedClientState must be provided to perform an IBC breaking upgrade.
   * This will make the chain commit to the correct upgraded (self) client state
   * before the upgrade occurs, so that connecting chains can verify that the
   * new upgraded client is valid by verifying a proof on the previous version
   * of the chain. This will allow IBC connections to persist smoothly across
   * planned chain upgrades
   */
  upgradedClientState?: Any;
}
export interface UpgradeProposalProtoMsg {
  typeUrl: "/ibc.core.client.v1.UpgradeProposal";
  value: Uint8Array;
}
/**
 * UpgradeProposal is a gov Content type for initiating an IBC breaking
 * upgrade.
 */
export interface UpgradeProposalAmino {
  title?: string;
  description?: string;
  plan?: PlanAmino;
  /**
   * An UpgradedClientState must be provided to perform an IBC breaking upgrade.
   * This will make the chain commit to the correct upgraded (self) client state
   * before the upgrade occurs, so that connecting chains can verify that the
   * new upgraded client is valid by verifying a proof on the previous version
   * of the chain. This will allow IBC connections to persist smoothly across
   * planned chain upgrades
   */
  upgraded_client_state?: AnyAmino;
}
export interface UpgradeProposalAminoMsg {
  type: "cosmos-sdk/UpgradeProposal";
  value: UpgradeProposalAmino;
}
/**
 * UpgradeProposal is a gov Content type for initiating an IBC breaking
 * upgrade.
 */
export interface UpgradeProposalSDKType {
  title: string;
  description: string;
  plan: PlanSDKType;
  upgraded_client_state?: AnySDKType;
}
/**
 * Height is a monotonically increasing data type
 * that can be compared against another Height for the purposes of updating and
 * freezing clients
 * 
 * Normally the RevisionHeight is incremented at each height while keeping
 * RevisionNumber the same. However some consensus algorithms may choose to
 * reset the height in certain conditions e.g. hard forks, state-machine
 * breaking changes In these cases, the RevisionNumber is incremented so that
 * height continues to be monitonically increasing even as the RevisionHeight
 * gets reset
 */
export interface Height {
  /** the revision that the client is currently on */
  revisionNumber: bigint;
  /** the height within the given revision */
  revisionHeight: bigint;
}
export interface HeightProtoMsg {
  typeUrl: "/ibc.core.client.v1.Height";
  value: Uint8Array;
}
/**
 * Height is a monotonically increasing data type
 * that can be compared against another Height for the purposes of updating and
 * freezing clients
 * 
 * Normally the RevisionHeight is incremented at each height while keeping
 * RevisionNumber the same. However some consensus algorithms may choose to
 * reset the height in certain conditions e.g. hard forks, state-machine
 * breaking changes In these cases, the RevisionNumber is incremented so that
 * height continues to be monitonically increasing even as the RevisionHeight
 * gets reset
 */
export interface HeightAmino {
  /** the revision that the client is currently on */
  revision_number?: string;
  /** the height within the given revision */
  revision_height?: string;
}
export interface HeightAminoMsg {
  type: "cosmos-sdk/Height";
  value: HeightAmino;
}
/**
 * Height is a monotonically increasing data type
 * that can be compared against another Height for the purposes of updating and
 * freezing clients
 * 
 * Normally the RevisionHeight is incremented at each height while keeping
 * RevisionNumber the same. However some consensus algorithms may choose to
 * reset the height in certain conditions e.g. hard forks, state-machine
 * breaking changes In these cases, the RevisionNumber is incremented so that
 * height continues to be monitonically increasing even as the RevisionHeight
 * gets reset
 */
export interface HeightSDKType {
  revision_number: bigint;
  revision_height: bigint;
}
/** Params defines the set of IBC light client parameters. */
export interface Params {
  /** allowed_clients defines the list of allowed client state types. */
  allowedClients: string[];
}
export interface ParamsProtoMsg {
  typeUrl: "/ibc.core.client.v1.Params";
  value: Uint8Array;
}
/** Params defines the set of IBC light client parameters. */
export interface ParamsAmino {
  /** allowed_clients defines the list of allowed client state types. */
  allowed_clients?: string[];
}
export interface ParamsAminoMsg {
  type: "cosmos-sdk/Params";
  value: ParamsAmino;
}
/** Params defines the set of IBC light client parameters. */
export interface ParamsSDKType {
  allowed_clients: string[];
}
function createBaseIdentifiedClientState(): IdentifiedClientState {
  return {
    clientId: "",
    clientState: undefined
  };
}
export const IdentifiedClientState = {
  typeUrl: "/ibc.core.client.v1.IdentifiedClientState",
  encode(message: IdentifiedClientState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    if (message.clientState !== undefined) {
      Any.encode(message.clientState, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): IdentifiedClientState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIdentifiedClientState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientId = reader.string();
          break;
        case 2:
          message.clientState = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<IdentifiedClientState>): IdentifiedClientState {
    const message = createBaseIdentifiedClientState();
    message.clientId = object.clientId ?? "";
    message.clientState = object.clientState !== undefined && object.clientState !== null ? Any.fromPartial(object.clientState) : undefined;
    return message;
  },
  fromAmino(object: IdentifiedClientStateAmino): IdentifiedClientState {
    const message = createBaseIdentifiedClientState();
    if (object.client_id !== undefined && object.client_id !== null) {
      message.clientId = object.client_id;
    }
    if (object.client_state !== undefined && object.client_state !== null) {
      message.clientState = Any.fromAmino(object.client_state);
    }
    return message;
  },
  toAmino(message: IdentifiedClientState): IdentifiedClientStateAmino {
    const obj: any = {};
    obj.client_id = message.clientId === "" ? undefined : message.clientId;
    obj.client_state = message.clientState ? Any.toAmino(message.clientState) : undefined;
    return obj;
  },
  fromAminoMsg(object: IdentifiedClientStateAminoMsg): IdentifiedClientState {
    return IdentifiedClientState.fromAmino(object.value);
  },
  toAminoMsg(message: IdentifiedClientState): IdentifiedClientStateAminoMsg {
    return {
      type: "cosmos-sdk/IdentifiedClientState",
      value: IdentifiedClientState.toAmino(message)
    };
  },
  fromProtoMsg(message: IdentifiedClientStateProtoMsg): IdentifiedClientState {
    return IdentifiedClientState.decode(message.value);
  },
  toProto(message: IdentifiedClientState): Uint8Array {
    return IdentifiedClientState.encode(message).finish();
  },
  toProtoMsg(message: IdentifiedClientState): IdentifiedClientStateProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.IdentifiedClientState",
      value: IdentifiedClientState.encode(message).finish()
    };
  }
};
function createBaseConsensusStateWithHeight(): ConsensusStateWithHeight {
  return {
    height: Height.fromPartial({}),
    consensusState: undefined
  };
}
export const ConsensusStateWithHeight = {
  typeUrl: "/ibc.core.client.v1.ConsensusStateWithHeight",
  encode(message: ConsensusStateWithHeight, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.height !== undefined) {
      Height.encode(message.height, writer.uint32(10).fork()).ldelim();
    }
    if (message.consensusState !== undefined) {
      Any.encode(message.consensusState, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ConsensusStateWithHeight {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsensusStateWithHeight();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.height = Height.decode(reader, reader.uint32());
          break;
        case 2:
          message.consensusState = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ConsensusStateWithHeight>): ConsensusStateWithHeight {
    const message = createBaseConsensusStateWithHeight();
    message.height = object.height !== undefined && object.height !== null ? Height.fromPartial(object.height) : undefined;
    message.consensusState = object.consensusState !== undefined && object.consensusState !== null ? Any.fromPartial(object.consensusState) : undefined;
    return message;
  },
  fromAmino(object: ConsensusStateWithHeightAmino): ConsensusStateWithHeight {
    const message = createBaseConsensusStateWithHeight();
    if (object.height !== undefined && object.height !== null) {
      message.height = Height.fromAmino(object.height);
    }
    if (object.consensus_state !== undefined && object.consensus_state !== null) {
      message.consensusState = Any.fromAmino(object.consensus_state);
    }
    return message;
  },
  toAmino(message: ConsensusStateWithHeight): ConsensusStateWithHeightAmino {
    const obj: any = {};
    obj.height = message.height ? Height.toAmino(message.height) : undefined;
    obj.consensus_state = message.consensusState ? Any.toAmino(message.consensusState) : undefined;
    return obj;
  },
  fromAminoMsg(object: ConsensusStateWithHeightAminoMsg): ConsensusStateWithHeight {
    return ConsensusStateWithHeight.fromAmino(object.value);
  },
  toAminoMsg(message: ConsensusStateWithHeight): ConsensusStateWithHeightAminoMsg {
    return {
      type: "cosmos-sdk/ConsensusStateWithHeight",
      value: ConsensusStateWithHeight.toAmino(message)
    };
  },
  fromProtoMsg(message: ConsensusStateWithHeightProtoMsg): ConsensusStateWithHeight {
    return ConsensusStateWithHeight.decode(message.value);
  },
  toProto(message: ConsensusStateWithHeight): Uint8Array {
    return ConsensusStateWithHeight.encode(message).finish();
  },
  toProtoMsg(message: ConsensusStateWithHeight): ConsensusStateWithHeightProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.ConsensusStateWithHeight",
      value: ConsensusStateWithHeight.encode(message).finish()
    };
  }
};
function createBaseClientConsensusStates(): ClientConsensusStates {
  return {
    clientId: "",
    consensusStates: []
  };
}
export const ClientConsensusStates = {
  typeUrl: "/ibc.core.client.v1.ClientConsensusStates",
  encode(message: ClientConsensusStates, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    for (const v of message.consensusStates) {
      ConsensusStateWithHeight.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ClientConsensusStates {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClientConsensusStates();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientId = reader.string();
          break;
        case 2:
          message.consensusStates.push(ConsensusStateWithHeight.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ClientConsensusStates>): ClientConsensusStates {
    const message = createBaseClientConsensusStates();
    message.clientId = object.clientId ?? "";
    message.consensusStates = object.consensusStates?.map(e => ConsensusStateWithHeight.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: ClientConsensusStatesAmino): ClientConsensusStates {
    const message = createBaseClientConsensusStates();
    if (object.client_id !== undefined && object.client_id !== null) {
      message.clientId = object.client_id;
    }
    message.consensusStates = object.consensus_states?.map(e => ConsensusStateWithHeight.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: ClientConsensusStates): ClientConsensusStatesAmino {
    const obj: any = {};
    obj.client_id = message.clientId === "" ? undefined : message.clientId;
    if (message.consensusStates) {
      obj.consensus_states = message.consensusStates.map(e => e ? ConsensusStateWithHeight.toAmino(e) : undefined);
    } else {
      obj.consensus_states = message.consensusStates;
    }
    return obj;
  },
  fromAminoMsg(object: ClientConsensusStatesAminoMsg): ClientConsensusStates {
    return ClientConsensusStates.fromAmino(object.value);
  },
  toAminoMsg(message: ClientConsensusStates): ClientConsensusStatesAminoMsg {
    return {
      type: "cosmos-sdk/ClientConsensusStates",
      value: ClientConsensusStates.toAmino(message)
    };
  },
  fromProtoMsg(message: ClientConsensusStatesProtoMsg): ClientConsensusStates {
    return ClientConsensusStates.decode(message.value);
  },
  toProto(message: ClientConsensusStates): Uint8Array {
    return ClientConsensusStates.encode(message).finish();
  },
  toProtoMsg(message: ClientConsensusStates): ClientConsensusStatesProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.ClientConsensusStates",
      value: ClientConsensusStates.encode(message).finish()
    };
  }
};
function createBaseClientUpdateProposal(): ClientUpdateProposal {
  return {
    title: "",
    description: "",
    subjectClientId: "",
    substituteClientId: ""
  };
}
export const ClientUpdateProposal = {
  typeUrl: "/ibc.core.client.v1.ClientUpdateProposal",
  encode(message: ClientUpdateProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.subjectClientId !== "") {
      writer.uint32(26).string(message.subjectClientId);
    }
    if (message.substituteClientId !== "") {
      writer.uint32(34).string(message.substituteClientId);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ClientUpdateProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClientUpdateProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.subjectClientId = reader.string();
          break;
        case 4:
          message.substituteClientId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ClientUpdateProposal>): ClientUpdateProposal {
    const message = createBaseClientUpdateProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.subjectClientId = object.subjectClientId ?? "";
    message.substituteClientId = object.substituteClientId ?? "";
    return message;
  },
  fromAmino(object: ClientUpdateProposalAmino): ClientUpdateProposal {
    const message = createBaseClientUpdateProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.subject_client_id !== undefined && object.subject_client_id !== null) {
      message.subjectClientId = object.subject_client_id;
    }
    if (object.substitute_client_id !== undefined && object.substitute_client_id !== null) {
      message.substituteClientId = object.substitute_client_id;
    }
    return message;
  },
  toAmino(message: ClientUpdateProposal): ClientUpdateProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.subject_client_id = message.subjectClientId === "" ? undefined : message.subjectClientId;
    obj.substitute_client_id = message.substituteClientId === "" ? undefined : message.substituteClientId;
    return obj;
  },
  fromAminoMsg(object: ClientUpdateProposalAminoMsg): ClientUpdateProposal {
    return ClientUpdateProposal.fromAmino(object.value);
  },
  toAminoMsg(message: ClientUpdateProposal): ClientUpdateProposalAminoMsg {
    return {
      type: "cosmos-sdk/ClientUpdateProposal",
      value: ClientUpdateProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: ClientUpdateProposalProtoMsg): ClientUpdateProposal {
    return ClientUpdateProposal.decode(message.value);
  },
  toProto(message: ClientUpdateProposal): Uint8Array {
    return ClientUpdateProposal.encode(message).finish();
  },
  toProtoMsg(message: ClientUpdateProposal): ClientUpdateProposalProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.ClientUpdateProposal",
      value: ClientUpdateProposal.encode(message).finish()
    };
  }
};
function createBaseUpgradeProposal(): UpgradeProposal {
  return {
    title: "",
    description: "",
    plan: Plan.fromPartial({}),
    upgradedClientState: undefined
  };
}
export const UpgradeProposal = {
  typeUrl: "/ibc.core.client.v1.UpgradeProposal",
  encode(message: UpgradeProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.plan !== undefined) {
      Plan.encode(message.plan, writer.uint32(26).fork()).ldelim();
    }
    if (message.upgradedClientState !== undefined) {
      Any.encode(message.upgradedClientState, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): UpgradeProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpgradeProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.plan = Plan.decode(reader, reader.uint32());
          break;
        case 4:
          message.upgradedClientState = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<UpgradeProposal>): UpgradeProposal {
    const message = createBaseUpgradeProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.plan = object.plan !== undefined && object.plan !== null ? Plan.fromPartial(object.plan) : undefined;
    message.upgradedClientState = object.upgradedClientState !== undefined && object.upgradedClientState !== null ? Any.fromPartial(object.upgradedClientState) : undefined;
    return message;
  },
  fromAmino(object: UpgradeProposalAmino): UpgradeProposal {
    const message = createBaseUpgradeProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.plan !== undefined && object.plan !== null) {
      message.plan = Plan.fromAmino(object.plan);
    }
    if (object.upgraded_client_state !== undefined && object.upgraded_client_state !== null) {
      message.upgradedClientState = Any.fromAmino(object.upgraded_client_state);
    }
    return message;
  },
  toAmino(message: UpgradeProposal): UpgradeProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.plan = message.plan ? Plan.toAmino(message.plan) : undefined;
    obj.upgraded_client_state = message.upgradedClientState ? Any.toAmino(message.upgradedClientState) : undefined;
    return obj;
  },
  fromAminoMsg(object: UpgradeProposalAminoMsg): UpgradeProposal {
    return UpgradeProposal.fromAmino(object.value);
  },
  toAminoMsg(message: UpgradeProposal): UpgradeProposalAminoMsg {
    return {
      type: "cosmos-sdk/UpgradeProposal",
      value: UpgradeProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: UpgradeProposalProtoMsg): UpgradeProposal {
    return UpgradeProposal.decode(message.value);
  },
  toProto(message: UpgradeProposal): Uint8Array {
    return UpgradeProposal.encode(message).finish();
  },
  toProtoMsg(message: UpgradeProposal): UpgradeProposalProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.UpgradeProposal",
      value: UpgradeProposal.encode(message).finish()
    };
  }
};
function createBaseHeight(): Height {
  return {
    revisionNumber: BigInt(0),
    revisionHeight: BigInt(0)
  };
}
export const Height = {
  typeUrl: "/ibc.core.client.v1.Height",
  encode(message: Height, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.revisionNumber !== BigInt(0)) {
      writer.uint32(8).uint64(message.revisionNumber);
    }
    if (message.revisionHeight !== BigInt(0)) {
      writer.uint32(16).uint64(message.revisionHeight);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Height {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeight();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.revisionNumber = reader.uint64();
          break;
        case 2:
          message.revisionHeight = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Height>): Height {
    const message = createBaseHeight();
    message.revisionNumber = object.revisionNumber !== undefined && object.revisionNumber !== null ? BigInt(object.revisionNumber.toString()) : BigInt(0);
    message.revisionHeight = object.revisionHeight !== undefined && object.revisionHeight !== null ? BigInt(object.revisionHeight.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: HeightAmino): Height {
    return {
      revisionNumber: BigInt(object.revision_number || "0"),
      revisionHeight: BigInt(object.revision_height || "0")
    };
  },
  toAmino(message: Height): HeightAmino {
    const obj: any = {};
    obj.revision_number = message.revisionNumber !== BigInt(0) ? message.revisionNumber.toString() : undefined;
    obj.revision_height = message.revisionHeight !== BigInt(0) ? message.revisionHeight.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: HeightAminoMsg): Height {
    return Height.fromAmino(object.value);
  },
  toAminoMsg(message: Height): HeightAminoMsg {
    return {
      type: "cosmos-sdk/Height",
      value: Height.toAmino(message)
    };
  },
  fromProtoMsg(message: HeightProtoMsg): Height {
    return Height.decode(message.value);
  },
  toProto(message: Height): Uint8Array {
    return Height.encode(message).finish();
  },
  toProtoMsg(message: Height): HeightProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.Height",
      value: Height.encode(message).finish()
    };
  }
};
function createBaseParams(): Params {
  return {
    allowedClients: []
  };
}
export const Params = {
  typeUrl: "/ibc.core.client.v1.Params",
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.allowedClients) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Params {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.allowedClients.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.allowedClients = object.allowedClients?.map(e => e) || [];
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    message.allowedClients = object.allowed_clients?.map(e => e) || [];
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    if (message.allowedClients) {
      obj.allowed_clients = message.allowedClients.map(e => e);
    } else {
      obj.allowed_clients = message.allowedClients;
    }
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  toAminoMsg(message: Params): ParamsAminoMsg {
    return {
      type: "cosmos-sdk/Params",
      value: Params.toAmino(message)
    };
  },
  fromProtoMsg(message: ParamsProtoMsg): Params {
    return Params.decode(message.value);
  },
  toProto(message: Params): Uint8Array {
    return Params.encode(message).finish();
  },
  toProtoMsg(message: Params): ParamsProtoMsg {
    return {
      typeUrl: "/ibc.core.client.v1.Params",
      value: Params.encode(message).finish()
    };
  }
};