import { MsgRegisterPayee, MsgRegisterCounterpartyPayee, MsgPayPacketFee, MsgPayPacketFeeAsync } from "./tx";
export const AminoConverter = {
  "/ibc.applications.fee.v1.MsgRegisterPayee": {
    aminoType: "cosmos-sdk/MsgRegisterPayee",
    toAmino: MsgRegisterPayee.toAmino,
    fromAmino: MsgRegisterPayee.fromAmino
  },
  "/ibc.applications.fee.v1.MsgRegisterCounterpartyPayee": {
    aminoType: "cosmos-sdk/MsgRegisterCounterpartyPayee",
    toAmino: MsgRegisterCounterpartyPayee.toAmino,
    fromAmino: MsgRegisterCounterpartyPayee.fromAmino
  },
  "/ibc.applications.fee.v1.MsgPayPacketFee": {
    aminoType: "cosmos-sdk/MsgPayPacketFee",
    toAmino: MsgPayPacketFee.toAmino,
    fromAmino: MsgPayPacketFee.fromAmino
  },
  "/ibc.applications.fee.v1.MsgPayPacketFeeAsync": {
    aminoType: "cosmos-sdk/MsgPayPacketFeeAsync",
    toAmino: MsgPayPacketFeeAsync.toAmino,
    fromAmino: MsgPayPacketFeeAsync.fromAmino
  }
};