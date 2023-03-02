import { LCDClient } from "@osmonauts/lcd";
import { QueryBalanceRequest, QueryBalanceResponseSDKType, QueryOwnerRequest, QueryOwnerResponseSDKType, QuerySupplyRequest, QuerySupplyResponseSDKType, QueryNFTsRequest, QueryNFTsResponseSDKType, QueryNFTRequest, QueryNFTResponseSDKType, QueryClassRequest, QueryClassResponseSDKType, QueryClassesRequest, QueryClassesResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    balance(params: QueryBalanceRequest): Promise<QueryBalanceResponseSDKType>;
    owner(params: QueryOwnerRequest): Promise<QueryOwnerResponseSDKType>;
    supply(params: QuerySupplyRequest): Promise<QuerySupplyResponseSDKType>;
    nFTs(params: QueryNFTsRequest): Promise<QueryNFTsResponseSDKType>;
    nFT(params: QueryNFTRequest): Promise<QueryNFTResponseSDKType>;
    class(params: QueryClassRequest): Promise<QueryClassResponseSDKType>;
    classes(params?: QueryClassesRequest): Promise<QueryClassesResponseSDKType>;
}
