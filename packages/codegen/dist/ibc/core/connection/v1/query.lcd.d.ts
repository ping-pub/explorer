import { LCDClient } from "@osmonauts/lcd";
import { QueryConnectionRequest, QueryConnectionResponseSDKType, QueryConnectionsRequest, QueryConnectionsResponseSDKType, QueryClientConnectionsRequest, QueryClientConnectionsResponseSDKType, QueryConnectionClientStateRequest, QueryConnectionClientStateResponseSDKType, QueryConnectionConsensusStateRequest, QueryConnectionConsensusStateResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    connection(params: QueryConnectionRequest): Promise<QueryConnectionResponseSDKType>;
    connections(params?: QueryConnectionsRequest): Promise<QueryConnectionsResponseSDKType>;
    clientConnections(params: QueryClientConnectionsRequest): Promise<QueryClientConnectionsResponseSDKType>;
    connectionClientState(params: QueryConnectionClientStateRequest): Promise<QueryConnectionClientStateResponseSDKType>;
    connectionConsensusState(params: QueryConnectionConsensusStateRequest): Promise<QueryConnectionConsensusStateResponseSDKType>;
}
