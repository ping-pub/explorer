import { LCDClient } from "@osmonauts/lcd";
import { QueryContractInfoRequest, QueryContractInfoResponseSDKType, QueryContractHistoryRequest, QueryContractHistoryResponseSDKType, QueryContractsByCodeRequest, QueryContractsByCodeResponseSDKType, QueryAllContractStateRequest, QueryAllContractStateResponseSDKType, QueryRawContractStateRequest, QueryRawContractStateResponseSDKType, QuerySmartContractStateRequest, QuerySmartContractStateResponseSDKType, QueryCodeRequest, QueryCodeResponseSDKType, QueryCodesRequest, QueryCodesResponseSDKType, QueryPinnedCodesRequest, QueryPinnedCodesResponseSDKType, QueryParamsRequest, QueryParamsResponseSDKType, QueryContractsByCreatorRequest, QueryContractsByCreatorResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    contractInfo(params: QueryContractInfoRequest): Promise<QueryContractInfoResponseSDKType>;
    contractHistory(params: QueryContractHistoryRequest): Promise<QueryContractHistoryResponseSDKType>;
    contractsByCode(params: QueryContractsByCodeRequest): Promise<QueryContractsByCodeResponseSDKType>;
    allContractState(params: QueryAllContractStateRequest): Promise<QueryAllContractStateResponseSDKType>;
    rawContractState(params: QueryRawContractStateRequest): Promise<QueryRawContractStateResponseSDKType>;
    smartContractState(params: QuerySmartContractStateRequest): Promise<QuerySmartContractStateResponseSDKType>;
    code(params: QueryCodeRequest): Promise<QueryCodeResponseSDKType>;
    codes(params?: QueryCodesRequest): Promise<QueryCodesResponseSDKType>;
    pinnedCodes(params?: QueryPinnedCodesRequest): Promise<QueryPinnedCodesResponseSDKType>;
    params(_params?: QueryParamsRequest): Promise<QueryParamsResponseSDKType>;
    contractsByCreator(params: QueryContractsByCreatorRequest): Promise<QueryContractsByCreatorResponseSDKType>;
}
