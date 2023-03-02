import { LCDClient } from "@osmonauts/lcd";
import { QueryGroupInfoRequest, QueryGroupInfoResponseSDKType, QueryGroupPolicyInfoRequest, QueryGroupPolicyInfoResponseSDKType, QueryGroupMembersRequest, QueryGroupMembersResponseSDKType, QueryGroupsByAdminRequest, QueryGroupsByAdminResponseSDKType, QueryGroupPoliciesByGroupRequest, QueryGroupPoliciesByGroupResponseSDKType, QueryGroupPoliciesByAdminRequest, QueryGroupPoliciesByAdminResponseSDKType, QueryProposalRequest, QueryProposalResponseSDKType, QueryProposalsByGroupPolicyRequest, QueryProposalsByGroupPolicyResponseSDKType, QueryVoteByProposalVoterRequest, QueryVoteByProposalVoterResponseSDKType, QueryVotesByProposalRequest, QueryVotesByProposalResponseSDKType, QueryVotesByVoterRequest, QueryVotesByVoterResponseSDKType, QueryGroupsByMemberRequest, QueryGroupsByMemberResponseSDKType, QueryTallyResultRequest, QueryTallyResultResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    groupInfo(params: QueryGroupInfoRequest): Promise<QueryGroupInfoResponseSDKType>;
    groupPolicyInfo(params: QueryGroupPolicyInfoRequest): Promise<QueryGroupPolicyInfoResponseSDKType>;
    groupMembers(params: QueryGroupMembersRequest): Promise<QueryGroupMembersResponseSDKType>;
    groupsByAdmin(params: QueryGroupsByAdminRequest): Promise<QueryGroupsByAdminResponseSDKType>;
    groupPoliciesByGroup(params: QueryGroupPoliciesByGroupRequest): Promise<QueryGroupPoliciesByGroupResponseSDKType>;
    groupPoliciesByAdmin(params: QueryGroupPoliciesByAdminRequest): Promise<QueryGroupPoliciesByAdminResponseSDKType>;
    proposal(params: QueryProposalRequest): Promise<QueryProposalResponseSDKType>;
    proposalsByGroupPolicy(params: QueryProposalsByGroupPolicyRequest): Promise<QueryProposalsByGroupPolicyResponseSDKType>;
    voteByProposalVoter(params: QueryVoteByProposalVoterRequest): Promise<QueryVoteByProposalVoterResponseSDKType>;
    votesByProposal(params: QueryVotesByProposalRequest): Promise<QueryVotesByProposalResponseSDKType>;
    votesByVoter(params: QueryVotesByVoterRequest): Promise<QueryVotesByVoterResponseSDKType>;
    groupsByMember(params: QueryGroupsByMemberRequest): Promise<QueryGroupsByMemberResponseSDKType>;
    tallyResult(params: QueryTallyResultRequest): Promise<QueryTallyResultResponseSDKType>;
}
