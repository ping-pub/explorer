/// <reference types="long" />
import { GroupInfo, GroupInfoSDKType, GroupMember, GroupMemberSDKType, GroupPolicyInfo, GroupPolicyInfoSDKType, Proposal, ProposalSDKType, Vote, VoteSDKType } from "./types";
import { Long, DeepPartial } from "../../../helpers";
import * as _m0 from "protobufjs/minimal";
/** GenesisState defines the group module's genesis state. */
export interface GenesisState {
    /**
     * group_seq is the group table orm.Sequence,
     * it is used to get the next group ID.
     */
    groupSeq: Long;
    /** groups is the list of groups info. */
    groups: GroupInfo[];
    /** group_members is the list of groups members. */
    groupMembers: GroupMember[];
    /**
     * group_policy_seq is the group policy table orm.Sequence,
     * it is used to generate the next group policy account address.
     */
    groupPolicySeq: Long;
    /** group_policies is the list of group policies info. */
    groupPolicies: GroupPolicyInfo[];
    /**
     * proposal_seq is the proposal table orm.Sequence,
     * it is used to get the next proposal ID.
     */
    proposalSeq: Long;
    /** proposals is the list of proposals. */
    proposals: Proposal[];
    /** votes is the list of votes. */
    votes: Vote[];
}
/** GenesisState defines the group module's genesis state. */
export interface GenesisStateSDKType {
    group_seq: Long;
    groups: GroupInfoSDKType[];
    group_members: GroupMemberSDKType[];
    group_policy_seq: Long;
    group_policies: GroupPolicyInfoSDKType[];
    proposal_seq: Long;
    proposals: ProposalSDKType[];
    votes: VoteSDKType[];
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState;
    fromPartial(object: DeepPartial<GenesisState>): GenesisState;
};
