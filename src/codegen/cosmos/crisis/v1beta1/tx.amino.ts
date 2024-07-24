import { MsgVerifyInvariant } from "./tx";
export const AminoConverter = {
  "/cosmos.crisis.v1beta1.MsgVerifyInvariant": {
    aminoType: "cosmos-sdk/MsgVerifyInvariant",
    toAmino: MsgVerifyInvariant.toAmino,
    fromAmino: MsgVerifyInvariant.fromAmino
  }
};