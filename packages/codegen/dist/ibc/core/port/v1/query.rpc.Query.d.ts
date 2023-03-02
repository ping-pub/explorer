import { Rpc } from "../../../../helpers";
import { QueryClient } from "@cosmjs/stargate";
import { QueryAppVersionRequest, QueryAppVersionResponse } from "./query";
/** Query defines the gRPC querier service */
export interface Query {
    /** AppVersion queries an IBC Port and determines the appropriate application version to be used */
    appVersion(request: QueryAppVersionRequest): Promise<QueryAppVersionResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    appVersion(request: QueryAppVersionRequest): Promise<QueryAppVersionResponse>;
}
export declare const createRpcQueryExtension: (base: QueryClient) => {
    appVersion(request: QueryAppVersionRequest): Promise<QueryAppVersionResponse>;
};
