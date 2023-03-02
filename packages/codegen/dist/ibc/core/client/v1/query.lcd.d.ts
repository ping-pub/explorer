import { LCDClient } from "@osmonauts/lcd";
import { QueryClientStateRequest, QueryClientStateResponseSDKType, QueryClientStatesRequest, QueryClientStatesResponseSDKType, QueryConsensusStateRequest, QueryConsensusStateResponseSDKType, QueryConsensusStatesRequest, QueryConsensusStatesResponseSDKType, QueryClientStatusRequest, QueryClientStatusResponseSDKType, QueryClientParamsRequest, QueryClientParamsResponseSDKType, QueryUpgradedClientStateRequest, QueryUpgradedClientStateResponseSDKType, QueryUpgradedConsensusStateRequest, QueryUpgradedConsensusStateResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    clientState(params: QueryClientStateRequest): Promise<QueryClientStateResponseSDKType>;
    clientStates(params?: QueryClientStatesRequest): Promise<QueryClientStatesResponseSDKType>;
    consensusState(params: QueryConsensusStateRequest): Promise<QueryConsensusStateResponseSDKType>;
    consensusStates(params: QueryConsensusStatesRequest): Promise<QueryConsensusStatesResponseSDKType>;
    clientStatus(params: QueryClientStatusRequest): Promise<QueryClientStatusResponseSDKType>;
    clientParams(_params?: QueryClientParamsRequest): Promise<QueryClientParamsResponseSDKType>;
    upgradedClientState(_params?: QueryUpgradedClientStateRequest): Promise<QueryUpgradedClientStateResponseSDKType>;
    upgradedConsensusState(_params?: QueryUpgradedConsensusStateRequest): Promise<QueryUpgradedConsensusStateResponseSDKType>;
}
