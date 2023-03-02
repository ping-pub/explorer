import { LCDClient } from "@osmonauts/lcd";
import { QueryValidatorsRequest, QueryValidatorsResponseSDKType, QueryValidatorRequest, QueryValidatorResponseSDKType, QueryValidatorDelegationsRequest, QueryValidatorDelegationsResponseSDKType, QueryValidatorUnbondingDelegationsRequest, QueryValidatorUnbondingDelegationsResponseSDKType, QueryDelegationRequest, QueryDelegationResponseSDKType, QueryUnbondingDelegationRequest, QueryUnbondingDelegationResponseSDKType, QueryDelegatorDelegationsRequest, QueryDelegatorDelegationsResponseSDKType, QueryDelegatorUnbondingDelegationsRequest, QueryDelegatorUnbondingDelegationsResponseSDKType, QueryRedelegationsRequest, QueryRedelegationsResponseSDKType, QueryDelegatorValidatorsRequest, QueryDelegatorValidatorsResponseSDKType, QueryDelegatorValidatorRequest, QueryDelegatorValidatorResponseSDKType, QueryHistoricalInfoRequest, QueryHistoricalInfoResponseSDKType, QueryPoolRequest, QueryPoolResponseSDKType, QueryParamsRequest, QueryParamsResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    validators(params: QueryValidatorsRequest): Promise<QueryValidatorsResponseSDKType>;
    validator(params: QueryValidatorRequest): Promise<QueryValidatorResponseSDKType>;
    validatorDelegations(params: QueryValidatorDelegationsRequest): Promise<QueryValidatorDelegationsResponseSDKType>;
    validatorUnbondingDelegations(params: QueryValidatorUnbondingDelegationsRequest): Promise<QueryValidatorUnbondingDelegationsResponseSDKType>;
    delegation(params: QueryDelegationRequest): Promise<QueryDelegationResponseSDKType>;
    unbondingDelegation(params: QueryUnbondingDelegationRequest): Promise<QueryUnbondingDelegationResponseSDKType>;
    delegatorDelegations(params: QueryDelegatorDelegationsRequest): Promise<QueryDelegatorDelegationsResponseSDKType>;
    delegatorUnbondingDelegations(params: QueryDelegatorUnbondingDelegationsRequest): Promise<QueryDelegatorUnbondingDelegationsResponseSDKType>;
    redelegations(params: QueryRedelegationsRequest): Promise<QueryRedelegationsResponseSDKType>;
    delegatorValidators(params: QueryDelegatorValidatorsRequest): Promise<QueryDelegatorValidatorsResponseSDKType>;
    delegatorValidator(params: QueryDelegatorValidatorRequest): Promise<QueryDelegatorValidatorResponseSDKType>;
    historicalInfo(params: QueryHistoricalInfoRequest): Promise<QueryHistoricalInfoResponseSDKType>;
    pool(_params?: QueryPoolRequest): Promise<QueryPoolResponseSDKType>;
    params(_params?: QueryParamsRequest): Promise<QueryParamsResponseSDKType>;
}
