import { Rpc } from "../../../helpers";
import { QueryClient } from "@cosmjs/stargate";
import { QueryProposalRequest, QueryProposalResponse, QueryProposalsRequest, QueryProposalsResponse, QueryVoteRequest, QueryVoteResponse, QueryVotesRequest, QueryVotesResponse, QueryParamsRequest, QueryParamsResponse, QueryDepositRequest, QueryDepositResponse, QueryDepositsRequest, QueryDepositsResponse, QueryTallyResultRequest, QueryTallyResultResponse } from "./query";
/** Query defines the gRPC querier service for gov module */
export interface Query {
    /** Proposal queries proposal details based on ProposalID. */
    proposal(request: QueryProposalRequest): Promise<QueryProposalResponse>;
    /** Proposals queries all proposals based on given status. */
    proposals(request: QueryProposalsRequest): Promise<QueryProposalsResponse>;
    /** Vote queries voted information based on proposalID, voterAddr. */
    vote(request: QueryVoteRequest): Promise<QueryVoteResponse>;
    /** Votes queries votes of a given proposal. */
    votes(request: QueryVotesRequest): Promise<QueryVotesResponse>;
    /** Params queries all parameters of the gov module. */
    params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
    /** Deposit queries single deposit information based proposalID, depositAddr. */
    deposit(request: QueryDepositRequest): Promise<QueryDepositResponse>;
    /** Deposits queries all deposits of a single proposal. */
    deposits(request: QueryDepositsRequest): Promise<QueryDepositsResponse>;
    /** TallyResult queries the tally of a proposal vote. */
    tallyResult(request: QueryTallyResultRequest): Promise<QueryTallyResultResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    proposal(request: QueryProposalRequest): Promise<QueryProposalResponse>;
    proposals(request: QueryProposalsRequest): Promise<QueryProposalsResponse>;
    vote(request: QueryVoteRequest): Promise<QueryVoteResponse>;
    votes(request: QueryVotesRequest): Promise<QueryVotesResponse>;
    params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
    deposit(request: QueryDepositRequest): Promise<QueryDepositResponse>;
    deposits(request: QueryDepositsRequest): Promise<QueryDepositsResponse>;
    tallyResult(request: QueryTallyResultRequest): Promise<QueryTallyResultResponse>;
}
export declare const createRpcQueryExtension: (base: QueryClient) => {
    proposal(request: QueryProposalRequest): Promise<QueryProposalResponse>;
    proposals(request: QueryProposalsRequest): Promise<QueryProposalsResponse>;
    vote(request: QueryVoteRequest): Promise<QueryVoteResponse>;
    votes(request: QueryVotesRequest): Promise<QueryVotesResponse>;
    params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
    deposit(request: QueryDepositRequest): Promise<QueryDepositResponse>;
    deposits(request: QueryDepositsRequest): Promise<QueryDepositsResponse>;
    tallyResult(request: QueryTallyResultRequest): Promise<QueryTallyResultResponse>;
};
