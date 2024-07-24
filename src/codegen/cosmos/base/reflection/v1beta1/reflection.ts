import { BinaryReader, BinaryWriter } from "../../../../binary";
/** ListAllInterfacesRequest is the request type of the ListAllInterfaces RPC. */
export interface ListAllInterfacesRequest {}
export interface ListAllInterfacesRequestProtoMsg {
  typeUrl: "/cosmos.base.reflection.v1beta1.ListAllInterfacesRequest";
  value: Uint8Array;
}
/** ListAllInterfacesRequest is the request type of the ListAllInterfaces RPC. */
export interface ListAllInterfacesRequestAmino {}
export interface ListAllInterfacesRequestAminoMsg {
  type: "cosmos-sdk/ListAllInterfacesRequest";
  value: ListAllInterfacesRequestAmino;
}
/** ListAllInterfacesRequest is the request type of the ListAllInterfaces RPC. */
export interface ListAllInterfacesRequestSDKType {}
/** ListAllInterfacesResponse is the response type of the ListAllInterfaces RPC. */
export interface ListAllInterfacesResponse {
  /** interface_names is an array of all the registered interfaces. */
  interfaceNames: string[];
}
export interface ListAllInterfacesResponseProtoMsg {
  typeUrl: "/cosmos.base.reflection.v1beta1.ListAllInterfacesResponse";
  value: Uint8Array;
}
/** ListAllInterfacesResponse is the response type of the ListAllInterfaces RPC. */
export interface ListAllInterfacesResponseAmino {
  /** interface_names is an array of all the registered interfaces. */
  interface_names?: string[];
}
export interface ListAllInterfacesResponseAminoMsg {
  type: "cosmos-sdk/ListAllInterfacesResponse";
  value: ListAllInterfacesResponseAmino;
}
/** ListAllInterfacesResponse is the response type of the ListAllInterfaces RPC. */
export interface ListAllInterfacesResponseSDKType {
  interface_names: string[];
}
/**
 * ListImplementationsRequest is the request type of the ListImplementations
 * RPC.
 */
export interface ListImplementationsRequest {
  /** interface_name defines the interface to query the implementations for. */
  interfaceName: string;
}
export interface ListImplementationsRequestProtoMsg {
  typeUrl: "/cosmos.base.reflection.v1beta1.ListImplementationsRequest";
  value: Uint8Array;
}
/**
 * ListImplementationsRequest is the request type of the ListImplementations
 * RPC.
 */
export interface ListImplementationsRequestAmino {
  /** interface_name defines the interface to query the implementations for. */
  interface_name?: string;
}
export interface ListImplementationsRequestAminoMsg {
  type: "cosmos-sdk/ListImplementationsRequest";
  value: ListImplementationsRequestAmino;
}
/**
 * ListImplementationsRequest is the request type of the ListImplementations
 * RPC.
 */
export interface ListImplementationsRequestSDKType {
  interface_name: string;
}
/**
 * ListImplementationsResponse is the response type of the ListImplementations
 * RPC.
 */
export interface ListImplementationsResponse {
  implementationMessageNames: string[];
}
export interface ListImplementationsResponseProtoMsg {
  typeUrl: "/cosmos.base.reflection.v1beta1.ListImplementationsResponse";
  value: Uint8Array;
}
/**
 * ListImplementationsResponse is the response type of the ListImplementations
 * RPC.
 */
export interface ListImplementationsResponseAmino {
  implementation_message_names?: string[];
}
export interface ListImplementationsResponseAminoMsg {
  type: "cosmos-sdk/ListImplementationsResponse";
  value: ListImplementationsResponseAmino;
}
/**
 * ListImplementationsResponse is the response type of the ListImplementations
 * RPC.
 */
export interface ListImplementationsResponseSDKType {
  implementation_message_names: string[];
}
function createBaseListAllInterfacesRequest(): ListAllInterfacesRequest {
  return {};
}
export const ListAllInterfacesRequest = {
  typeUrl: "/cosmos.base.reflection.v1beta1.ListAllInterfacesRequest",
  encode(_: ListAllInterfacesRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ListAllInterfacesRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListAllInterfacesRequest();
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
  fromPartial(_: Partial<ListAllInterfacesRequest>): ListAllInterfacesRequest {
    const message = createBaseListAllInterfacesRequest();
    return message;
  },
  fromAmino(_: ListAllInterfacesRequestAmino): ListAllInterfacesRequest {
    const message = createBaseListAllInterfacesRequest();
    return message;
  },
  toAmino(_: ListAllInterfacesRequest): ListAllInterfacesRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: ListAllInterfacesRequestAminoMsg): ListAllInterfacesRequest {
    return ListAllInterfacesRequest.fromAmino(object.value);
  },
  toAminoMsg(message: ListAllInterfacesRequest): ListAllInterfacesRequestAminoMsg {
    return {
      type: "cosmos-sdk/ListAllInterfacesRequest",
      value: ListAllInterfacesRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: ListAllInterfacesRequestProtoMsg): ListAllInterfacesRequest {
    return ListAllInterfacesRequest.decode(message.value);
  },
  toProto(message: ListAllInterfacesRequest): Uint8Array {
    return ListAllInterfacesRequest.encode(message).finish();
  },
  toProtoMsg(message: ListAllInterfacesRequest): ListAllInterfacesRequestProtoMsg {
    return {
      typeUrl: "/cosmos.base.reflection.v1beta1.ListAllInterfacesRequest",
      value: ListAllInterfacesRequest.encode(message).finish()
    };
  }
};
function createBaseListAllInterfacesResponse(): ListAllInterfacesResponse {
  return {
    interfaceNames: []
  };
}
export const ListAllInterfacesResponse = {
  typeUrl: "/cosmos.base.reflection.v1beta1.ListAllInterfacesResponse",
  encode(message: ListAllInterfacesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.interfaceNames) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ListAllInterfacesResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListAllInterfacesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.interfaceNames.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ListAllInterfacesResponse>): ListAllInterfacesResponse {
    const message = createBaseListAllInterfacesResponse();
    message.interfaceNames = object.interfaceNames?.map(e => e) || [];
    return message;
  },
  fromAmino(object: ListAllInterfacesResponseAmino): ListAllInterfacesResponse {
    const message = createBaseListAllInterfacesResponse();
    message.interfaceNames = object.interface_names?.map(e => e) || [];
    return message;
  },
  toAmino(message: ListAllInterfacesResponse): ListAllInterfacesResponseAmino {
    const obj: any = {};
    if (message.interfaceNames) {
      obj.interface_names = message.interfaceNames.map(e => e);
    } else {
      obj.interface_names = message.interfaceNames;
    }
    return obj;
  },
  fromAminoMsg(object: ListAllInterfacesResponseAminoMsg): ListAllInterfacesResponse {
    return ListAllInterfacesResponse.fromAmino(object.value);
  },
  toAminoMsg(message: ListAllInterfacesResponse): ListAllInterfacesResponseAminoMsg {
    return {
      type: "cosmos-sdk/ListAllInterfacesResponse",
      value: ListAllInterfacesResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: ListAllInterfacesResponseProtoMsg): ListAllInterfacesResponse {
    return ListAllInterfacesResponse.decode(message.value);
  },
  toProto(message: ListAllInterfacesResponse): Uint8Array {
    return ListAllInterfacesResponse.encode(message).finish();
  },
  toProtoMsg(message: ListAllInterfacesResponse): ListAllInterfacesResponseProtoMsg {
    return {
      typeUrl: "/cosmos.base.reflection.v1beta1.ListAllInterfacesResponse",
      value: ListAllInterfacesResponse.encode(message).finish()
    };
  }
};
function createBaseListImplementationsRequest(): ListImplementationsRequest {
  return {
    interfaceName: ""
  };
}
export const ListImplementationsRequest = {
  typeUrl: "/cosmos.base.reflection.v1beta1.ListImplementationsRequest",
  encode(message: ListImplementationsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.interfaceName !== "") {
      writer.uint32(10).string(message.interfaceName);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ListImplementationsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListImplementationsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.interfaceName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ListImplementationsRequest>): ListImplementationsRequest {
    const message = createBaseListImplementationsRequest();
    message.interfaceName = object.interfaceName ?? "";
    return message;
  },
  fromAmino(object: ListImplementationsRequestAmino): ListImplementationsRequest {
    const message = createBaseListImplementationsRequest();
    if (object.interface_name !== undefined && object.interface_name !== null) {
      message.interfaceName = object.interface_name;
    }
    return message;
  },
  toAmino(message: ListImplementationsRequest): ListImplementationsRequestAmino {
    const obj: any = {};
    obj.interface_name = message.interfaceName === "" ? undefined : message.interfaceName;
    return obj;
  },
  fromAminoMsg(object: ListImplementationsRequestAminoMsg): ListImplementationsRequest {
    return ListImplementationsRequest.fromAmino(object.value);
  },
  toAminoMsg(message: ListImplementationsRequest): ListImplementationsRequestAminoMsg {
    return {
      type: "cosmos-sdk/ListImplementationsRequest",
      value: ListImplementationsRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: ListImplementationsRequestProtoMsg): ListImplementationsRequest {
    return ListImplementationsRequest.decode(message.value);
  },
  toProto(message: ListImplementationsRequest): Uint8Array {
    return ListImplementationsRequest.encode(message).finish();
  },
  toProtoMsg(message: ListImplementationsRequest): ListImplementationsRequestProtoMsg {
    return {
      typeUrl: "/cosmos.base.reflection.v1beta1.ListImplementationsRequest",
      value: ListImplementationsRequest.encode(message).finish()
    };
  }
};
function createBaseListImplementationsResponse(): ListImplementationsResponse {
  return {
    implementationMessageNames: []
  };
}
export const ListImplementationsResponse = {
  typeUrl: "/cosmos.base.reflection.v1beta1.ListImplementationsResponse",
  encode(message: ListImplementationsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.implementationMessageNames) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ListImplementationsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListImplementationsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.implementationMessageNames.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ListImplementationsResponse>): ListImplementationsResponse {
    const message = createBaseListImplementationsResponse();
    message.implementationMessageNames = object.implementationMessageNames?.map(e => e) || [];
    return message;
  },
  fromAmino(object: ListImplementationsResponseAmino): ListImplementationsResponse {
    const message = createBaseListImplementationsResponse();
    message.implementationMessageNames = object.implementation_message_names?.map(e => e) || [];
    return message;
  },
  toAmino(message: ListImplementationsResponse): ListImplementationsResponseAmino {
    const obj: any = {};
    if (message.implementationMessageNames) {
      obj.implementation_message_names = message.implementationMessageNames.map(e => e);
    } else {
      obj.implementation_message_names = message.implementationMessageNames;
    }
    return obj;
  },
  fromAminoMsg(object: ListImplementationsResponseAminoMsg): ListImplementationsResponse {
    return ListImplementationsResponse.fromAmino(object.value);
  },
  toAminoMsg(message: ListImplementationsResponse): ListImplementationsResponseAminoMsg {
    return {
      type: "cosmos-sdk/ListImplementationsResponse",
      value: ListImplementationsResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: ListImplementationsResponseProtoMsg): ListImplementationsResponse {
    return ListImplementationsResponse.decode(message.value);
  },
  toProto(message: ListImplementationsResponse): Uint8Array {
    return ListImplementationsResponse.encode(message).finish();
  },
  toProtoMsg(message: ListImplementationsResponse): ListImplementationsResponseProtoMsg {
    return {
      typeUrl: "/cosmos.base.reflection.v1beta1.ListImplementationsResponse",
      value: ListImplementationsResponse.encode(message).finish()
    };
  }
};