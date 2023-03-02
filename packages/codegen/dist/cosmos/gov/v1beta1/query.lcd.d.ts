import { LCDClient } from "@osmonauts/lcd";
import { QueryProposalRequest, QueryProposalResponseSDKType, QueryProposalsRequest, QueryProposalsResponseSDKType, QueryVoteRequest, QueryVoteResponseSDKType, QueryVotesRequest, QueryVotesResponseSDKType, QueryParamsRequest, QueryParamsResponseSDKType, QueryDepositRequest, QueryDepositResponseSDKType, QueryDepositsRequest, QueryDepositsResponseSDKType, QueryTallyResultRequest, QueryTallyResultResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    proposal(params: QueryProposalRequest): Promise<QueryProposalResponseSDKType>;
    proposals(params: QueryProposalsRequest): Promise<QueryProposalsResponseSDKType>;
    vote(params: QueryVoteRequest): Promise<QueryVoteResponseSDKType>;
    votes(params: QueryVotesRequest): Promise<QueryVotesResponseSDKType>;
    params(params: QueryParamsRequest): Promise<QueryParamsResponseSDKType>;
    deposit(params: QueryDepositRequest): Promise<QueryDepositResponseSDKType>;
    deposits(params: QueryDepositsRequest): Promise<QueryDepositsResponseSDKType>;
    tallyResult(params: QueryTallyResultRequest): Promise<QueryTallyResultResponseSDKType>;
}
