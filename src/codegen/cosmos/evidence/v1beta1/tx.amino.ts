import { MsgSubmitEvidence } from "./tx";
export const AminoConverter = {
  "/cosmos.evidence.v1beta1.MsgSubmitEvidence": {
    aminoType: "cosmos-sdk/MsgSubmitEvidence",
    toAmino: MsgSubmitEvidence.toAmino,
    fromAmino: MsgSubmitEvidence.fromAmino
  }
};