import { LCDClient } from "@osmonauts/lcd";
import { QueryParamsRequest, QueryParamsResponseSDKType, QuerySubspacesRequest, QuerySubspacesResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    params(params: QueryParamsRequest): Promise<QueryParamsResponseSDKType>;
    subspaces(_params?: QuerySubspacesRequest): Promise<QuerySubspacesResponseSDKType>;
}
