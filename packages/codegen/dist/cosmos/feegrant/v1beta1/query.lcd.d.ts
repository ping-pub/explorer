import { LCDClient } from "@osmonauts/lcd";
import { QueryAllowanceRequest, QueryAllowanceResponseSDKType, QueryAllowancesRequest, QueryAllowancesResponseSDKType, QueryAllowancesByGranterRequest, QueryAllowancesByGranterResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    allowance(params: QueryAllowanceRequest): Promise<QueryAllowanceResponseSDKType>;
    allowances(params: QueryAllowancesRequest): Promise<QueryAllowancesResponseSDKType>;
    allowancesByGranter(params: QueryAllowancesByGranterRequest): Promise<QueryAllowancesByGranterResponseSDKType>;
}
