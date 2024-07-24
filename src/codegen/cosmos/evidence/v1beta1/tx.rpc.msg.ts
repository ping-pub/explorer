import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { MsgSubmitEvidence, MsgSubmitEvidenceResponse } from "./tx";
/** Msg defines the evidence Msg service. */
export interface Msg {
  /**
   * SubmitEvidence submits an arbitrary Evidence of misbehavior such as equivocation or
   * counterfactual signing.
   */
  submitEvidence(request: MsgSubmitEvidence): Promise<MsgSubmitEvidenceResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.submitEvidence = this.submitEvidence.bind(this);
  }
  submitEvidence(request: MsgSubmitEvidence): Promise<MsgSubmitEvidenceResponse> {
    const data = MsgSubmitEvidence.encode(request).finish();
    const promise = this.rpc.request("cosmos.evidence.v1beta1.Msg", "SubmitEvidence", data);
    return promise.then(data => MsgSubmitEvidenceResponse.decode(new BinaryReader(data)));
  }
}