import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgSubmitEvidence } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cosmos.evidence.v1beta1.MsgSubmitEvidence", MsgSubmitEvidence]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    submitEvidence(value: MsgSubmitEvidence) {
      return {
        typeUrl: "/cosmos.evidence.v1beta1.MsgSubmitEvidence",
        value: MsgSubmitEvidence.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    submitEvidence(value: MsgSubmitEvidence) {
      return {
        typeUrl: "/cosmos.evidence.v1beta1.MsgSubmitEvidence",
        value
      };
    }
  },
  fromPartial: {
    submitEvidence(value: MsgSubmitEvidence) {
      return {
        typeUrl: "/cosmos.evidence.v1beta1.MsgSubmitEvidence",
        value: MsgSubmitEvidence.fromPartial(value)
      };
    }
  }
};