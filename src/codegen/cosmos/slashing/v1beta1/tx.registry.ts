import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgUnjail } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cosmos.slashing.v1beta1.MsgUnjail", MsgUnjail]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    unjail(value: MsgUnjail) {
      return {
        typeUrl: "/cosmos.slashing.v1beta1.MsgUnjail",
        value: MsgUnjail.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    unjail(value: MsgUnjail) {
      return {
        typeUrl: "/cosmos.slashing.v1beta1.MsgUnjail",
        value
      };
    }
  },
  fromPartial: {
    unjail(value: MsgUnjail) {
      return {
        typeUrl: "/cosmos.slashing.v1beta1.MsgUnjail",
        value: MsgUnjail.fromPartial(value)
      };
    }
  }
};