import { BinaryReader, BinaryWriter } from "../../../binary";
/** MsgVerifyInvariant represents a message to verify a particular invariance. */
export interface MsgVerifyInvariant {
  sender: string;
  invariantModuleName: string;
  invariantRoute: string;
}
export interface MsgVerifyInvariantProtoMsg {
  typeUrl: "/cosmos.crisis.v1beta1.MsgVerifyInvariant";
  value: Uint8Array;
}
/** MsgVerifyInvariant represents a message to verify a particular invariance. */
export interface MsgVerifyInvariantAmino {
  sender?: string;
  invariant_module_name?: string;
  invariant_route?: string;
}
export interface MsgVerifyInvariantAminoMsg {
  type: "cosmos-sdk/MsgVerifyInvariant";
  value: MsgVerifyInvariantAmino;
}
/** MsgVerifyInvariant represents a message to verify a particular invariance. */
export interface MsgVerifyInvariantSDKType {
  sender: string;
  invariant_module_name: string;
  invariant_route: string;
}
/** MsgVerifyInvariantResponse defines the Msg/VerifyInvariant response type. */
export interface MsgVerifyInvariantResponse {}
export interface MsgVerifyInvariantResponseProtoMsg {
  typeUrl: "/cosmos.crisis.v1beta1.MsgVerifyInvariantResponse";
  value: Uint8Array;
}
/** MsgVerifyInvariantResponse defines the Msg/VerifyInvariant response type. */
export interface MsgVerifyInvariantResponseAmino {}
export interface MsgVerifyInvariantResponseAminoMsg {
  type: "cosmos-sdk/MsgVerifyInvariantResponse";
  value: MsgVerifyInvariantResponseAmino;
}
/** MsgVerifyInvariantResponse defines the Msg/VerifyInvariant response type. */
export interface MsgVerifyInvariantResponseSDKType {}
function createBaseMsgVerifyInvariant(): MsgVerifyInvariant {
  return {
    sender: "",
    invariantModuleName: "",
    invariantRoute: ""
  };
}
export const MsgVerifyInvariant = {
  typeUrl: "/cosmos.crisis.v1beta1.MsgVerifyInvariant",
  encode(message: MsgVerifyInvariant, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.invariantModuleName !== "") {
      writer.uint32(18).string(message.invariantModuleName);
    }
    if (message.invariantRoute !== "") {
      writer.uint32(26).string(message.invariantRoute);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgVerifyInvariant {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgVerifyInvariant();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.invariantModuleName = reader.string();
          break;
        case 3:
          message.invariantRoute = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgVerifyInvariant>): MsgVerifyInvariant {
    const message = createBaseMsgVerifyInvariant();
    message.sender = object.sender ?? "";
    message.invariantModuleName = object.invariantModuleName ?? "";
    message.invariantRoute = object.invariantRoute ?? "";
    return message;
  },
  fromAmino(object: MsgVerifyInvariantAmino): MsgVerifyInvariant {
    const message = createBaseMsgVerifyInvariant();
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender;
    }
    if (object.invariant_module_name !== undefined && object.invariant_module_name !== null) {
      message.invariantModuleName = object.invariant_module_name;
    }
    if (object.invariant_route !== undefined && object.invariant_route !== null) {
      message.invariantRoute = object.invariant_route;
    }
    return message;
  },
  toAmino(message: MsgVerifyInvariant): MsgVerifyInvariantAmino {
    const obj: any = {};
    obj.sender = message.sender === "" ? undefined : message.sender;
    obj.invariant_module_name = message.invariantModuleName === "" ? undefined : message.invariantModuleName;
    obj.invariant_route = message.invariantRoute === "" ? undefined : message.invariantRoute;
    return obj;
  },
  fromAminoMsg(object: MsgVerifyInvariantAminoMsg): MsgVerifyInvariant {
    return MsgVerifyInvariant.fromAmino(object.value);
  },
  toAminoMsg(message: MsgVerifyInvariant): MsgVerifyInvariantAminoMsg {
    return {
      type: "cosmos-sdk/MsgVerifyInvariant",
      value: MsgVerifyInvariant.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgVerifyInvariantProtoMsg): MsgVerifyInvariant {
    return MsgVerifyInvariant.decode(message.value);
  },
  toProto(message: MsgVerifyInvariant): Uint8Array {
    return MsgVerifyInvariant.encode(message).finish();
  },
  toProtoMsg(message: MsgVerifyInvariant): MsgVerifyInvariantProtoMsg {
    return {
      typeUrl: "/cosmos.crisis.v1beta1.MsgVerifyInvariant",
      value: MsgVerifyInvariant.encode(message).finish()
    };
  }
};
function createBaseMsgVerifyInvariantResponse(): MsgVerifyInvariantResponse {
  return {};
}
export const MsgVerifyInvariantResponse = {
  typeUrl: "/cosmos.crisis.v1beta1.MsgVerifyInvariantResponse",
  encode(_: MsgVerifyInvariantResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgVerifyInvariantResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgVerifyInvariantResponse();
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
  fromPartial(_: Partial<MsgVerifyInvariantResponse>): MsgVerifyInvariantResponse {
    const message = createBaseMsgVerifyInvariantResponse();
    return message;
  },
  fromAmino(_: MsgVerifyInvariantResponseAmino): MsgVerifyInvariantResponse {
    const message = createBaseMsgVerifyInvariantResponse();
    return message;
  },
  toAmino(_: MsgVerifyInvariantResponse): MsgVerifyInvariantResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgVerifyInvariantResponseAminoMsg): MsgVerifyInvariantResponse {
    return MsgVerifyInvariantResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgVerifyInvariantResponse): MsgVerifyInvariantResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgVerifyInvariantResponse",
      value: MsgVerifyInvariantResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgVerifyInvariantResponseProtoMsg): MsgVerifyInvariantResponse {
    return MsgVerifyInvariantResponse.decode(message.value);
  },
  toProto(message: MsgVerifyInvariantResponse): Uint8Array {
    return MsgVerifyInvariantResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgVerifyInvariantResponse): MsgVerifyInvariantResponseProtoMsg {
    return {
      typeUrl: "/cosmos.crisis.v1beta1.MsgVerifyInvariantResponse",
      value: MsgVerifyInvariantResponse.encode(message).finish()
    };
  }
};