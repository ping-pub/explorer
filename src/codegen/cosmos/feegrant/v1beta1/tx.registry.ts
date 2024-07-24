import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgGrantAllowance, MsgRevokeAllowance } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cosmos.feegrant.v1beta1.MsgGrantAllowance", MsgGrantAllowance], ["/cosmos.feegrant.v1beta1.MsgRevokeAllowance", MsgRevokeAllowance]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    grantAllowance(value: MsgGrantAllowance) {
      return {
        typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowance",
        value: MsgGrantAllowance.encode(value).finish()
      };
    },
    revokeAllowance(value: MsgRevokeAllowance) {
      return {
        typeUrl: "/cosmos.feegrant.v1beta1.MsgRevokeAllowance",
        value: MsgRevokeAllowance.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    grantAllowance(value: MsgGrantAllowance) {
      return {
        typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowance",
        value
      };
    },
    revokeAllowance(value: MsgRevokeAllowance) {
      return {
        typeUrl: "/cosmos.feegrant.v1beta1.MsgRevokeAllowance",
        value
      };
    }
  },
  fromPartial: {
    grantAllowance(value: MsgGrantAllowance) {
      return {
        typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowance",
        value: MsgGrantAllowance.fromPartial(value)
      };
    },
    revokeAllowance(value: MsgRevokeAllowance) {
      return {
        typeUrl: "/cosmos.feegrant.v1beta1.MsgRevokeAllowance",
        value: MsgRevokeAllowance.fromPartial(value)
      };
    }
  }
};