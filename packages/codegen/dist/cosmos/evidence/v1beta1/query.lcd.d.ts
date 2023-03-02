import { LCDClient } from "@osmonauts/lcd";
import { QueryEvidenceRequest, QueryEvidenceResponseSDKType, QueryAllEvidenceRequest, QueryAllEvidenceResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    evidence(params: QueryEvidenceRequest): Promise<QueryEvidenceResponseSDKType>;
    allEvidence(params?: QueryAllEvidenceRequest): Promise<QueryAllEvidenceResponseSDKType>;
}
