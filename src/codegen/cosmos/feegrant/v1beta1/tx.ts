import { Any, AnyAmino, AnySDKType } from "../../../google/protobuf/any";
import { BinaryReader, BinaryWriter } from "../../../binary";
/**
 * MsgGrantAllowance adds permission for Grantee to spend up to Allowance
 * of fees from the account of Granter.
 */
export interface MsgGrantAllowance {
  /** granter is the address of the user granting an allowance of their funds. */
  granter: string;
  /** grantee is the address of the user being granted an allowance of another user's funds. */
  grantee: string;
  /** allowance can be any of basic and filtered fee allowance. */
  allowance?: Any;
}
export interface MsgGrantAllowanceProtoMsg {
  typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowance";
  value: Uint8Array;
}
/**
 * MsgGrantAllowance adds permission for Grantee to spend up to Allowance
 * of fees from the account of Granter.
 */
export interface MsgGrantAllowanceAmino {
  /** granter is the address of the user granting an allowance of their funds. */
  granter?: string;
  /** grantee is the address of the user being granted an allowance of another user's funds. */
  grantee?: string;
  /** allowance can be any of basic and filtered fee allowance. */
  allowance?: AnyAmino;
}
export interface MsgGrantAllowanceAminoMsg {
  type: "cosmos-sdk/MsgGrantAllowance";
  value: MsgGrantAllowanceAmino;
}
/**
 * MsgGrantAllowance adds permission for Grantee to spend up to Allowance
 * of fees from the account of Granter.
 */
export interface MsgGrantAllowanceSDKType {
  granter: string;
  grantee: string;
  allowance?: AnySDKType;
}
/** MsgGrantAllowanceResponse defines the Msg/GrantAllowanceResponse response type. */
export interface MsgGrantAllowanceResponse {}
export interface MsgGrantAllowanceResponseProtoMsg {
  typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowanceResponse";
  value: Uint8Array;
}
/** MsgGrantAllowanceResponse defines the Msg/GrantAllowanceResponse response type. */
export interface MsgGrantAllowanceResponseAmino {}
export interface MsgGrantAllowanceResponseAminoMsg {
  type: "cosmos-sdk/MsgGrantAllowanceResponse";
  value: MsgGrantAllowanceResponseAmino;
}
/** MsgGrantAllowanceResponse defines the Msg/GrantAllowanceResponse response type. */
export interface MsgGrantAllowanceResponseSDKType {}
/** MsgRevokeAllowance removes any existing Allowance from Granter to Grantee. */
export interface MsgRevokeAllowance {
  /** granter is the address of the user granting an allowance of their funds. */
  granter: string;
  /** grantee is the address of the user being granted an allowance of another user's funds. */
  grantee: string;
}
export interface MsgRevokeAllowanceProtoMsg {
  typeUrl: "/cosmos.feegrant.v1beta1.MsgRevokeAllowance";
  value: Uint8Array;
}
/** MsgRevokeAllowance removes any existing Allowance from Granter to Grantee. */
export interface MsgRevokeAllowanceAmino {
  /** granter is the address of the user granting an allowance of their funds. */
  granter?: string;
  /** grantee is the address of the user being granted an allowance of another user's funds. */
  grantee?: string;
}
export interface MsgRevokeAllowanceAminoMsg {
  type: "cosmos-sdk/MsgRevokeAllowance";
  value: MsgRevokeAllowanceAmino;
}
/** MsgRevokeAllowance removes any existing Allowance from Granter to Grantee. */
export interface MsgRevokeAllowanceSDKType {
  granter: string;
  grantee: string;
}
/** MsgRevokeAllowanceResponse defines the Msg/RevokeAllowanceResponse response type. */
export interface MsgRevokeAllowanceResponse {}
export interface MsgRevokeAllowanceResponseProtoMsg {
  typeUrl: "/cosmos.feegrant.v1beta1.MsgRevokeAllowanceResponse";
  value: Uint8Array;
}
/** MsgRevokeAllowanceResponse defines the Msg/RevokeAllowanceResponse response type. */
export interface MsgRevokeAllowanceResponseAmino {}
export interface MsgRevokeAllowanceResponseAminoMsg {
  type: "cosmos-sdk/MsgRevokeAllowanceResponse";
  value: MsgRevokeAllowanceResponseAmino;
}
/** MsgRevokeAllowanceResponse defines the Msg/RevokeAllowanceResponse response type. */
export interface MsgRevokeAllowanceResponseSDKType {}
function createBaseMsgGrantAllowance(): MsgGrantAllowance {
  return {
    granter: "",
    grantee: "",
    allowance: undefined
  };
}
export const MsgGrantAllowance = {
  typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowance",
  encode(message: MsgGrantAllowance, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.granter !== "") {
      writer.uint32(10).string(message.granter);
    }
    if (message.grantee !== "") {
      writer.uint32(18).string(message.grantee);
    }
    if (message.allowance !== undefined) {
      Any.encode(message.allowance, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgGrantAllowance {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgGrantAllowance();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.granter = reader.string();
          break;
        case 2:
          message.grantee = reader.string();
          break;
        case 3:
          message.allowance = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgGrantAllowance>): MsgGrantAllowance {
    const message = createBaseMsgGrantAllowance();
    message.granter = object.granter ?? "";
    message.grantee = object.grantee ?? "";
    message.allowance = object.allowance !== undefined && object.allowance !== null ? Any.fromPartial(object.allowance) : undefined;
    return message;
  },
  fromAmino(object: MsgGrantAllowanceAmino): MsgGrantAllowance {
    const message = createBaseMsgGrantAllowance();
    if (object.granter !== undefined && object.granter !== null) {
      message.granter = object.granter;
    }
    if (object.grantee !== undefined && object.grantee !== null) {
      message.grantee = object.grantee;
    }
    if (object.allowance !== undefined && object.allowance !== null) {
      message.allowance = Any.fromAmino(object.allowance);
    }
    return message;
  },
  toAmino(message: MsgGrantAllowance): MsgGrantAllowanceAmino {
    const obj: any = {};
    obj.granter = message.granter === "" ? undefined : message.granter;
    obj.grantee = message.grantee === "" ? undefined : message.grantee;
    obj.allowance = message.allowance ? Any.toAmino(message.allowance) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgGrantAllowanceAminoMsg): MsgGrantAllowance {
    return MsgGrantAllowance.fromAmino(object.value);
  },
  toAminoMsg(message: MsgGrantAllowance): MsgGrantAllowanceAminoMsg {
    return {
      type: "cosmos-sdk/MsgGrantAllowance",
      value: MsgGrantAllowance.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgGrantAllowanceProtoMsg): MsgGrantAllowance {
    return MsgGrantAllowance.decode(message.value);
  },
  toProto(message: MsgGrantAllowance): Uint8Array {
    return MsgGrantAllowance.encode(message).finish();
  },
  toProtoMsg(message: MsgGrantAllowance): MsgGrantAllowanceProtoMsg {
    return {
      typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowance",
      value: MsgGrantAllowance.encode(message).finish()
    };
  }
};
function createBaseMsgGrantAllowanceResponse(): MsgGrantAllowanceResponse {
  return {};
}
export const MsgGrantAllowanceResponse = {
  typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowanceResponse",
  encode(_: MsgGrantAllowanceResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgGrantAllowanceResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgGrantAllowanceResponse();
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
  fromPartial(_: Partial<MsgGrantAllowanceResponse>): MsgGrantAllowanceResponse {
    const message = createBaseMsgGrantAllowanceResponse();
    return message;
  },
  fromAmino(_: MsgGrantAllowanceResponseAmino): MsgGrantAllowanceResponse {
    const message = createBaseMsgGrantAllowanceResponse();
    return message;
  },
  toAmino(_: MsgGrantAllowanceResponse): MsgGrantAllowanceResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgGrantAllowanceResponseAminoMsg): MsgGrantAllowanceResponse {
    return MsgGrantAllowanceResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgGrantAllowanceResponse): MsgGrantAllowanceResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgGrantAllowanceResponse",
      value: MsgGrantAllowanceResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgGrantAllowanceResponseProtoMsg): MsgGrantAllowanceResponse {
    return MsgGrantAllowanceResponse.decode(message.value);
  },
  toProto(message: MsgGrantAllowanceResponse): Uint8Array {
    return MsgGrantAllowanceResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgGrantAllowanceResponse): MsgGrantAllowanceResponseProtoMsg {
    return {
      typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowanceResponse",
      value: MsgGrantAllowanceResponse.encode(message).finish()
    };
  }
};
function createBaseMsgRevokeAllowance(): MsgRevokeAllowance {
  return {
    granter: "",
    grantee: ""
  };
}
export const MsgRevokeAllowance = {
  typeUrl: "/cosmos.feegrant.v1beta1.MsgRevokeAllowance",
  encode(message: MsgRevokeAllowance, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.granter !== "") {
      writer.uint32(10).string(message.granter);
    }
    if (message.grantee !== "") {
      writer.uint32(18).string(message.grantee);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgRevokeAllowance {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRevokeAllowance();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.granter = reader.string();
          break;
        case 2:
          message.grantee = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgRevokeAllowance>): MsgRevokeAllowance {
    const message = createBaseMsgRevokeAllowance();
    message.granter = object.granter ?? "";
    message.grantee = object.grantee ?? "";
    return message;
  },
  fromAmino(object: MsgRevokeAllowanceAmino): MsgRevokeAllowance {
    const message = createBaseMsgRevokeAllowance();
    if (object.granter !== undefined && object.granter !== null) {
      message.granter = object.granter;
    }
    if (object.grantee !== undefined && object.grantee !== null) {
      message.grantee = object.grantee;
    }
    return message;
  },
  toAmino(message: MsgRevokeAllowance): MsgRevokeAllowanceAmino {
    const obj: any = {};
    obj.granter = message.granter === "" ? undefined : message.granter;
    obj.grantee = message.grantee === "" ? undefined : message.grantee;
    return obj;
  },
  fromAminoMsg(object: MsgRevokeAllowanceAminoMsg): MsgRevokeAllowance {
    return MsgRevokeAllowance.fromAmino(object.value);
  },
  toAminoMsg(message: MsgRevokeAllowance): MsgRevokeAllowanceAminoMsg {
    return {
      type: "cosmos-sdk/MsgRevokeAllowance",
      value: MsgRevokeAllowance.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgRevokeAllowanceProtoMsg): MsgRevokeAllowance {
    return MsgRevokeAllowance.decode(message.value);
  },
  toProto(message: MsgRevokeAllowance): Uint8Array {
    return MsgRevokeAllowance.encode(message).finish();
  },
  toProtoMsg(message: MsgRevokeAllowance): MsgRevokeAllowanceProtoMsg {
    return {
      typeUrl: "/cosmos.feegrant.v1beta1.MsgRevokeAllowance",
      value: MsgRevokeAllowance.encode(message).finish()
    };
  }
};
function createBaseMsgRevokeAllowanceResponse(): MsgRevokeAllowanceResponse {
  return {};
}
export const MsgRevokeAllowanceResponse = {
  typeUrl: "/cosmos.feegrant.v1beta1.MsgRevokeAllowanceResponse",
  encode(_: MsgRevokeAllowanceResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgRevokeAllowanceResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRevokeAllowanceResponse();
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
  fromPartial(_: Partial<MsgRevokeAllowanceResponse>): MsgRevokeAllowanceResponse {
    const message = createBaseMsgRevokeAllowanceResponse();
    return message;
  },
  fromAmino(_: MsgRevokeAllowanceResponseAmino): MsgRevokeAllowanceResponse {
    const message = createBaseMsgRevokeAllowanceResponse();
    return message;
  },
  toAmino(_: MsgRevokeAllowanceResponse): MsgRevokeAllowanceResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgRevokeAllowanceResponseAminoMsg): MsgRevokeAllowanceResponse {
    return MsgRevokeAllowanceResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgRevokeAllowanceResponse): MsgRevokeAllowanceResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgRevokeAllowanceResponse",
      value: MsgRevokeAllowanceResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgRevokeAllowanceResponseProtoMsg): MsgRevokeAllowanceResponse {
    return MsgRevokeAllowanceResponse.decode(message.value);
  },
  toProto(message: MsgRevokeAllowanceResponse): Uint8Array {
    return MsgRevokeAllowanceResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgRevokeAllowanceResponse): MsgRevokeAllowanceResponseProtoMsg {
    return {
      typeUrl: "/cosmos.feegrant.v1beta1.MsgRevokeAllowanceResponse",
      value: MsgRevokeAllowanceResponse.encode(message).finish()
    };
  }
};