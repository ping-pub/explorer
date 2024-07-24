import { MsgUnjail } from "./tx";
export const AminoConverter = {
  "/cosmos.slashing.v1beta1.MsgUnjail": {
    aminoType: "cosmos-sdk/MsgUnjail",
    toAmino: MsgUnjail.toAmino,
    fromAmino: MsgUnjail.fromAmino
  }
};