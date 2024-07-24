import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { MsgVerifyInvariant, MsgVerifyInvariantResponse } from "./tx";
/** Msg defines the bank Msg service. */
export interface Msg {
  /** VerifyInvariant defines a method to verify a particular invariance. */
  verifyInvariant(request: MsgVerifyInvariant): Promise<MsgVerifyInvariantResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.verifyInvariant = this.verifyInvariant.bind(this);
  }
  verifyInvariant(request: MsgVerifyInvariant): Promise<MsgVerifyInvariantResponse> {
    const data = MsgVerifyInvariant.encode(request).finish();
    const promise = this.rpc.request("cosmos.crisis.v1beta1.Msg", "VerifyInvariant", data);
    return promise.then(data => MsgVerifyInvariantResponse.decode(new BinaryReader(data)));
  }
}