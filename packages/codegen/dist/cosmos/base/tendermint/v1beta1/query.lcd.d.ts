import { LCDClient } from "@osmonauts/lcd";
import { GetNodeInfoRequest, GetNodeInfoResponseSDKType, GetSyncingRequest, GetSyncingResponseSDKType, GetLatestBlockRequest, GetLatestBlockResponseSDKType, GetBlockByHeightRequest, GetBlockByHeightResponseSDKType, GetLatestValidatorSetRequest, GetLatestValidatorSetResponseSDKType, GetValidatorSetByHeightRequest, GetValidatorSetByHeightResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    getNodeInfo(_params?: GetNodeInfoRequest): Promise<GetNodeInfoResponseSDKType>;
    getSyncing(_params?: GetSyncingRequest): Promise<GetSyncingResponseSDKType>;
    getLatestBlock(_params?: GetLatestBlockRequest): Promise<GetLatestBlockResponseSDKType>;
    getBlockByHeight(params: GetBlockByHeightRequest): Promise<GetBlockByHeightResponseSDKType>;
    getLatestValidatorSet(params?: GetLatestValidatorSetRequest): Promise<GetLatestValidatorSetResponseSDKType>;
    getValidatorSetByHeight(params: GetValidatorSetByHeightRequest): Promise<GetValidatorSetByHeightResponseSDKType>;
}
