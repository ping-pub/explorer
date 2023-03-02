import { LCDClient } from "@osmonauts/lcd";
import { QueryGrantsRequest, QueryGrantsResponseSDKType, QueryGranterGrantsRequest, QueryGranterGrantsResponseSDKType, QueryGranteeGrantsRequest, QueryGranteeGrantsResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    grants(params: QueryGrantsRequest): Promise<QueryGrantsResponseSDKType>;
    granterGrants(params: QueryGranterGrantsRequest): Promise<QueryGranterGrantsResponseSDKType>;
    granteeGrants(params: QueryGranteeGrantsRequest): Promise<QueryGranteeGrantsResponseSDKType>;
}
