import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgVerifyInvariant } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cosmos.crisis.v1beta1.MsgVerifyInvariant", MsgVerifyInvariant]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    verifyInvariant(value: MsgVerifyInvariant) {
      return {
        typeUrl: "/cosmos.crisis.v1beta1.MsgVerifyInvariant",
        value: MsgVerifyInvariant.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    verifyInvariant(value: MsgVerifyInvariant) {
      return {
        typeUrl: "/cosmos.crisis.v1beta1.MsgVerifyInvariant",
        value
      };
    }
  },
  fromPartial: {
    verifyInvariant(value: MsgVerifyInvariant) {
      return {
        typeUrl: "/cosmos.crisis.v1beta1.MsgVerifyInvariant",
        value: MsgVerifyInvariant.fromPartial(value)
      };
    }
  }
};