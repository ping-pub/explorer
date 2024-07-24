import { BinaryReader, BinaryWriter } from "../../../../binary";
import { bytesFromBase64, base64FromBytes } from "../../../../helpers";
/** IncentivizedAcknowledgement is the acknowledgement format to be used by applications wrapped in the fee middleware */
export interface IncentivizedAcknowledgement {
  /** the underlying app acknowledgement bytes */
  appAcknowledgement: Uint8Array;
  /** the relayer address which submits the recv packet message */
  forwardRelayerAddress: string;
  /** success flag of the base application callback */
  underlyingAppSuccess: boolean;
}
export interface IncentivizedAcknowledgementProtoMsg {
  typeUrl: "/ibc.applications.fee.v1.IncentivizedAcknowledgement";
  value: Uint8Array;
}
/** IncentivizedAcknowledgement is the acknowledgement format to be used by applications wrapped in the fee middleware */
export interface IncentivizedAcknowledgementAmino {
  /** the underlying app acknowledgement bytes */
  app_acknowledgement?: string;
  /** the relayer address which submits the recv packet message */
  forward_relayer_address?: string;
  /** success flag of the base application callback */
  underlying_app_success?: boolean;
}
export interface IncentivizedAcknowledgementAminoMsg {
  type: "cosmos-sdk/IncentivizedAcknowledgement";
  value: IncentivizedAcknowledgementAmino;
}
/** IncentivizedAcknowledgement is the acknowledgement format to be used by applications wrapped in the fee middleware */
export interface IncentivizedAcknowledgementSDKType {
  app_acknowledgement: Uint8Array;
  forward_relayer_address: string;
  underlying_app_success: boolean;
}
function createBaseIncentivizedAcknowledgement(): IncentivizedAcknowledgement {
  return {
    appAcknowledgement: new Uint8Array(),
    forwardRelayerAddress: "",
    underlyingAppSuccess: false
  };
}
export const IncentivizedAcknowledgement = {
  typeUrl: "/ibc.applications.fee.v1.IncentivizedAcknowledgement",
  encode(message: IncentivizedAcknowledgement, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.appAcknowledgement.length !== 0) {
      writer.uint32(10).bytes(message.appAcknowledgement);
    }
    if (message.forwardRelayerAddress !== "") {
      writer.uint32(18).string(message.forwardRelayerAddress);
    }
    if (message.underlyingAppSuccess === true) {
      writer.uint32(24).bool(message.underlyingAppSuccess);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): IncentivizedAcknowledgement {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncentivizedAcknowledgement();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.appAcknowledgement = reader.bytes();
          break;
        case 2:
          message.forwardRelayerAddress = reader.string();
          break;
        case 3:
          message.underlyingAppSuccess = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<IncentivizedAcknowledgement>): IncentivizedAcknowledgement {
    const message = createBaseIncentivizedAcknowledgement();
    message.appAcknowledgement = object.appAcknowledgement ?? new Uint8Array();
    message.forwardRelayerAddress = object.forwardRelayerAddress ?? "";
    message.underlyingAppSuccess = object.underlyingAppSuccess ?? false;
    return message;
  },
  fromAmino(object: IncentivizedAcknowledgementAmino): IncentivizedAcknowledgement {
    const message = createBaseIncentivizedAcknowledgement();
    if (object.app_acknowledgement !== undefined && object.app_acknowledgement !== null) {
      message.appAcknowledgement = bytesFromBase64(object.app_acknowledgement);
    }
    if (object.forward_relayer_address !== undefined && object.forward_relayer_address !== null) {
      message.forwardRelayerAddress = object.forward_relayer_address;
    }
    if (object.underlying_app_success !== undefined && object.underlying_app_success !== null) {
      message.underlyingAppSuccess = object.underlying_app_success;
    }
    return message;
  },
  toAmino(message: IncentivizedAcknowledgement): IncentivizedAcknowledgementAmino {
    const obj: any = {};
    obj.app_acknowledgement = message.appAcknowledgement ? base64FromBytes(message.appAcknowledgement) : undefined;
    obj.forward_relayer_address = message.forwardRelayerAddress === "" ? undefined : message.forwardRelayerAddress;
    obj.underlying_app_success = message.underlyingAppSuccess === false ? undefined : message.underlyingAppSuccess;
    return obj;
  },
  fromAminoMsg(object: IncentivizedAcknowledgementAminoMsg): IncentivizedAcknowledgement {
    return IncentivizedAcknowledgement.fromAmino(object.value);
  },
  toAminoMsg(message: IncentivizedAcknowledgement): IncentivizedAcknowledgementAminoMsg {
    return {
      type: "cosmos-sdk/IncentivizedAcknowledgement",
      value: IncentivizedAcknowledgement.toAmino(message)
    };
  },
  fromProtoMsg(message: IncentivizedAcknowledgementProtoMsg): IncentivizedAcknowledgement {
    return IncentivizedAcknowledgement.decode(message.value);
  },
  toProto(message: IncentivizedAcknowledgement): Uint8Array {
    return IncentivizedAcknowledgement.encode(message).finish();
  },
  toProtoMsg(message: IncentivizedAcknowledgement): IncentivizedAcknowledgementProtoMsg {
    return {
      typeUrl: "/ibc.applications.fee.v1.IncentivizedAcknowledgement",
      value: IncentivizedAcknowledgement.encode(message).finish()
    };
  }
};