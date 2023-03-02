import { Rpc } from "../../../helpers";
import { QueryClient } from "@cosmjs/stargate";
import { QueryEvidenceRequest, QueryEvidenceResponse, QueryAllEvidenceRequest, QueryAllEvidenceResponse } from "./query";
/** Query defines the gRPC querier service. */
export interface Query {
    /** Evidence queries evidence based on evidence hash. */
    evidence(request: QueryEvidenceRequest): Promise<QueryEvidenceResponse>;
    /** AllEvidence queries all evidence. */
    allEvidence(request?: QueryAllEvidenceRequest): Promise<QueryAllEvidenceResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    evidence(request: QueryEvidenceRequest): Promise<QueryEvidenceResponse>;
    allEvidence(request?: QueryAllEvidenceRequest): Promise<QueryAllEvidenceResponse>;
}
export declare const createRpcQueryExtension: (base: QueryClient) => {
    evidence(request: QueryEvidenceRequest): Promise<QueryEvidenceResponse>;
    allEvidence(request?: QueryAllEvidenceRequest): Promise<QueryAllEvidenceResponse>;
};
