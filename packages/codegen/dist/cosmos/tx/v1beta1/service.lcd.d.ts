import { LCDClient } from "@osmonauts/lcd";
import { GetTxRequest, GetTxResponseSDKType, GetTxsEventRequest, GetTxsEventResponseSDKType, GetBlockWithTxsRequest, GetBlockWithTxsResponseSDKType } from "./service";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    getTx(params: GetTxRequest): Promise<GetTxResponseSDKType>;
    getTxsEvent(params: GetTxsEventRequest): Promise<GetTxsEventResponseSDKType>;
    getBlockWithTxs(params: GetBlockWithTxsRequest): Promise<GetBlockWithTxsResponseSDKType>;
}
