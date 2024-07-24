import { DenomTrace, DenomTraceAmino, DenomTraceSDKType, Params, ParamsAmino, ParamsSDKType } from "./transfer";
import { BinaryReader, BinaryWriter } from "../../../../binary";
/** GenesisState defines the ibc-transfer genesis state */
export interface GenesisState {
  portId: string;
  denomTraces: DenomTrace[];
  params: Params;
}
export interface GenesisStateProtoMsg {
  typeUrl: "/ibc.applications.transfer.v1.GenesisState";
  value: Uint8Array;
}
/** GenesisState defines the ibc-transfer genesis state */
export interface GenesisStateAmino {
  port_id?: string;
  denom_traces?: DenomTraceAmino[];
  params?: ParamsAmino;
}
export interface GenesisStateAminoMsg {
  type: "cosmos-sdk/GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines the ibc-transfer genesis state */
export interface GenesisStateSDKType {
  port_id: string;
  denom_traces: DenomTraceSDKType[];
  params: ParamsSDKType;
}
function createBaseGenesisState(): GenesisState {
  return {
    portId: "",
    denomTraces: [],
    params: Params.fromPartial({})
  };
}
export const GenesisState = {
  typeUrl: "/ibc.applications.transfer.v1.GenesisState",
  encode(message: GenesisState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    for (const v of message.denomTraces) {
      DenomTrace.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.denomTraces.push(DenomTrace.decode(reader, reader.uint32()));
          break;
        case 3:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.portId = object.portId ?? "";
    message.denomTraces = object.denomTraces?.map(e => DenomTrace.fromPartial(e)) || [];
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    message.denomTraces = object.denom_traces?.map(e => DenomTrace.fromAmino(e)) || [];
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    if (message.denomTraces) {
      obj.denom_traces = message.denomTraces.map(e => e ? DenomTrace.toAmino(e) : undefined);
    } else {
      obj.denom_traces = message.denomTraces;
    }
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: GenesisStateAminoMsg): GenesisState {
    return GenesisState.fromAmino(object.value);
  },
  toAminoMsg(message: GenesisState): GenesisStateAminoMsg {
    return {
      type: "cosmos-sdk/GenesisState",
      value: GenesisState.toAmino(message)
    };
  },
  fromProtoMsg(message: GenesisStateProtoMsg): GenesisState {
    return GenesisState.decode(message.value);
  },
  toProto(message: GenesisState): Uint8Array {
    return GenesisState.encode(message).finish();
  },
  toProtoMsg(message: GenesisState): GenesisStateProtoMsg {
    return {
      typeUrl: "/ibc.applications.transfer.v1.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};