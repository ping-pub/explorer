import { PageRequest, PageRequestAmino, PageRequestSDKType, PageResponse, PageResponseAmino, PageResponseSDKType } from "../../../../cosmos/base/query/v1beta1/pagination";
import { Channel, ChannelAmino, ChannelSDKType, IdentifiedChannel, IdentifiedChannelAmino, IdentifiedChannelSDKType, PacketState, PacketStateAmino, PacketStateSDKType } from "./channel";
import { Height, HeightAmino, HeightSDKType, IdentifiedClientState, IdentifiedClientStateAmino, IdentifiedClientStateSDKType } from "../../client/v1/client";
import { Any, AnyAmino, AnySDKType } from "../../../../google/protobuf/any";
import { BinaryReader, BinaryWriter } from "../../../../binary";
import { bytesFromBase64, base64FromBytes } from "../../../../helpers";
/** QueryChannelRequest is the request type for the Query/Channel RPC method */
export interface QueryChannelRequest {
  /** port unique identifier */
  portId: string;
  /** channel unique identifier */
  channelId: string;
}
export interface QueryChannelRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryChannelRequest";
  value: Uint8Array;
}
/** QueryChannelRequest is the request type for the Query/Channel RPC method */
export interface QueryChannelRequestAmino {
  /** port unique identifier */
  port_id?: string;
  /** channel unique identifier */
  channel_id?: string;
}
export interface QueryChannelRequestAminoMsg {
  type: "cosmos-sdk/QueryChannelRequest";
  value: QueryChannelRequestAmino;
}
/** QueryChannelRequest is the request type for the Query/Channel RPC method */
export interface QueryChannelRequestSDKType {
  port_id: string;
  channel_id: string;
}
/**
 * QueryChannelResponse is the response type for the Query/Channel RPC method.
 * Besides the Channel end, it includes a proof and the height from which the
 * proof was retrieved.
 */
export interface QueryChannelResponse {
  /** channel associated with the request identifiers */
  channel?: Channel;
  /** merkle proof of existence */
  proof: Uint8Array;
  /** height at which the proof was retrieved */
  proofHeight: Height;
}
export interface QueryChannelResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryChannelResponse";
  value: Uint8Array;
}
/**
 * QueryChannelResponse is the response type for the Query/Channel RPC method.
 * Besides the Channel end, it includes a proof and the height from which the
 * proof was retrieved.
 */
export interface QueryChannelResponseAmino {
  /** channel associated with the request identifiers */
  channel?: ChannelAmino;
  /** merkle proof of existence */
  proof?: string;
  /** height at which the proof was retrieved */
  proof_height?: HeightAmino;
}
export interface QueryChannelResponseAminoMsg {
  type: "cosmos-sdk/QueryChannelResponse";
  value: QueryChannelResponseAmino;
}
/**
 * QueryChannelResponse is the response type for the Query/Channel RPC method.
 * Besides the Channel end, it includes a proof and the height from which the
 * proof was retrieved.
 */
export interface QueryChannelResponseSDKType {
  channel?: ChannelSDKType;
  proof: Uint8Array;
  proof_height: HeightSDKType;
}
/** QueryChannelsRequest is the request type for the Query/Channels RPC method */
export interface QueryChannelsRequest {
  /** pagination request */
  pagination?: PageRequest;
}
export interface QueryChannelsRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryChannelsRequest";
  value: Uint8Array;
}
/** QueryChannelsRequest is the request type for the Query/Channels RPC method */
export interface QueryChannelsRequestAmino {
  /** pagination request */
  pagination?: PageRequestAmino;
}
export interface QueryChannelsRequestAminoMsg {
  type: "cosmos-sdk/QueryChannelsRequest";
  value: QueryChannelsRequestAmino;
}
/** QueryChannelsRequest is the request type for the Query/Channels RPC method */
export interface QueryChannelsRequestSDKType {
  pagination?: PageRequestSDKType;
}
/** QueryChannelsResponse is the response type for the Query/Channels RPC method. */
export interface QueryChannelsResponse {
  /** list of stored channels of the chain. */
  channels: IdentifiedChannel[];
  /** pagination response */
  pagination?: PageResponse;
  /** query block height */
  height: Height;
}
export interface QueryChannelsResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryChannelsResponse";
  value: Uint8Array;
}
/** QueryChannelsResponse is the response type for the Query/Channels RPC method. */
export interface QueryChannelsResponseAmino {
  /** list of stored channels of the chain. */
  channels?: IdentifiedChannelAmino[];
  /** pagination response */
  pagination?: PageResponseAmino;
  /** query block height */
  height?: HeightAmino;
}
export interface QueryChannelsResponseAminoMsg {
  type: "cosmos-sdk/QueryChannelsResponse";
  value: QueryChannelsResponseAmino;
}
/** QueryChannelsResponse is the response type for the Query/Channels RPC method. */
export interface QueryChannelsResponseSDKType {
  channels: IdentifiedChannelSDKType[];
  pagination?: PageResponseSDKType;
  height: HeightSDKType;
}
/**
 * QueryConnectionChannelsRequest is the request type for the
 * Query/QueryConnectionChannels RPC method
 */
export interface QueryConnectionChannelsRequest {
  /** connection unique identifier */
  connection: string;
  /** pagination request */
  pagination?: PageRequest;
}
export interface QueryConnectionChannelsRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryConnectionChannelsRequest";
  value: Uint8Array;
}
/**
 * QueryConnectionChannelsRequest is the request type for the
 * Query/QueryConnectionChannels RPC method
 */
export interface QueryConnectionChannelsRequestAmino {
  /** connection unique identifier */
  connection?: string;
  /** pagination request */
  pagination?: PageRequestAmino;
}
export interface QueryConnectionChannelsRequestAminoMsg {
  type: "cosmos-sdk/QueryConnectionChannelsRequest";
  value: QueryConnectionChannelsRequestAmino;
}
/**
 * QueryConnectionChannelsRequest is the request type for the
 * Query/QueryConnectionChannels RPC method
 */
export interface QueryConnectionChannelsRequestSDKType {
  connection: string;
  pagination?: PageRequestSDKType;
}
/**
 * QueryConnectionChannelsResponse is the Response type for the
 * Query/QueryConnectionChannels RPC method
 */
export interface QueryConnectionChannelsResponse {
  /** list of channels associated with a connection. */
  channels: IdentifiedChannel[];
  /** pagination response */
  pagination?: PageResponse;
  /** query block height */
  height: Height;
}
export interface QueryConnectionChannelsResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryConnectionChannelsResponse";
  value: Uint8Array;
}
/**
 * QueryConnectionChannelsResponse is the Response type for the
 * Query/QueryConnectionChannels RPC method
 */
export interface QueryConnectionChannelsResponseAmino {
  /** list of channels associated with a connection. */
  channels?: IdentifiedChannelAmino[];
  /** pagination response */
  pagination?: PageResponseAmino;
  /** query block height */
  height?: HeightAmino;
}
export interface QueryConnectionChannelsResponseAminoMsg {
  type: "cosmos-sdk/QueryConnectionChannelsResponse";
  value: QueryConnectionChannelsResponseAmino;
}
/**
 * QueryConnectionChannelsResponse is the Response type for the
 * Query/QueryConnectionChannels RPC method
 */
export interface QueryConnectionChannelsResponseSDKType {
  channels: IdentifiedChannelSDKType[];
  pagination?: PageResponseSDKType;
  height: HeightSDKType;
}
/**
 * QueryChannelClientStateRequest is the request type for the Query/ClientState
 * RPC method
 */
export interface QueryChannelClientStateRequest {
  /** port unique identifier */
  portId: string;
  /** channel unique identifier */
  channelId: string;
}
export interface QueryChannelClientStateRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryChannelClientStateRequest";
  value: Uint8Array;
}
/**
 * QueryChannelClientStateRequest is the request type for the Query/ClientState
 * RPC method
 */
export interface QueryChannelClientStateRequestAmino {
  /** port unique identifier */
  port_id?: string;
  /** channel unique identifier */
  channel_id?: string;
}
export interface QueryChannelClientStateRequestAminoMsg {
  type: "cosmos-sdk/QueryChannelClientStateRequest";
  value: QueryChannelClientStateRequestAmino;
}
/**
 * QueryChannelClientStateRequest is the request type for the Query/ClientState
 * RPC method
 */
export interface QueryChannelClientStateRequestSDKType {
  port_id: string;
  channel_id: string;
}
/**
 * QueryChannelClientStateResponse is the Response type for the
 * Query/QueryChannelClientState RPC method
 */
export interface QueryChannelClientStateResponse {
  /** client state associated with the channel */
  identifiedClientState?: IdentifiedClientState;
  /** merkle proof of existence */
  proof: Uint8Array;
  /** height at which the proof was retrieved */
  proofHeight: Height;
}
export interface QueryChannelClientStateResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryChannelClientStateResponse";
  value: Uint8Array;
}
/**
 * QueryChannelClientStateResponse is the Response type for the
 * Query/QueryChannelClientState RPC method
 */
export interface QueryChannelClientStateResponseAmino {
  /** client state associated with the channel */
  identified_client_state?: IdentifiedClientStateAmino;
  /** merkle proof of existence */
  proof?: string;
  /** height at which the proof was retrieved */
  proof_height?: HeightAmino;
}
export interface QueryChannelClientStateResponseAminoMsg {
  type: "cosmos-sdk/QueryChannelClientStateResponse";
  value: QueryChannelClientStateResponseAmino;
}
/**
 * QueryChannelClientStateResponse is the Response type for the
 * Query/QueryChannelClientState RPC method
 */
export interface QueryChannelClientStateResponseSDKType {
  identified_client_state?: IdentifiedClientStateSDKType;
  proof: Uint8Array;
  proof_height: HeightSDKType;
}
/**
 * QueryChannelConsensusStateRequest is the request type for the
 * Query/ConsensusState RPC method
 */
export interface QueryChannelConsensusStateRequest {
  /** port unique identifier */
  portId: string;
  /** channel unique identifier */
  channelId: string;
  /** revision number of the consensus state */
  revisionNumber: bigint;
  /** revision height of the consensus state */
  revisionHeight: bigint;
}
export interface QueryChannelConsensusStateRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryChannelConsensusStateRequest";
  value: Uint8Array;
}
/**
 * QueryChannelConsensusStateRequest is the request type for the
 * Query/ConsensusState RPC method
 */
export interface QueryChannelConsensusStateRequestAmino {
  /** port unique identifier */
  port_id?: string;
  /** channel unique identifier */
  channel_id?: string;
  /** revision number of the consensus state */
  revision_number?: string;
  /** revision height of the consensus state */
  revision_height?: string;
}
export interface QueryChannelConsensusStateRequestAminoMsg {
  type: "cosmos-sdk/QueryChannelConsensusStateRequest";
  value: QueryChannelConsensusStateRequestAmino;
}
/**
 * QueryChannelConsensusStateRequest is the request type for the
 * Query/ConsensusState RPC method
 */
export interface QueryChannelConsensusStateRequestSDKType {
  port_id: string;
  channel_id: string;
  revision_number: bigint;
  revision_height: bigint;
}
/**
 * QueryChannelClientStateResponse is the Response type for the
 * Query/QueryChannelClientState RPC method
 */
export interface QueryChannelConsensusStateResponse {
  /** consensus state associated with the channel */
  consensusState?: Any;
  /** client ID associated with the consensus state */
  clientId: string;
  /** merkle proof of existence */
  proof: Uint8Array;
  /** height at which the proof was retrieved */
  proofHeight: Height;
}
export interface QueryChannelConsensusStateResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryChannelConsensusStateResponse";
  value: Uint8Array;
}
/**
 * QueryChannelClientStateResponse is the Response type for the
 * Query/QueryChannelClientState RPC method
 */
export interface QueryChannelConsensusStateResponseAmino {
  /** consensus state associated with the channel */
  consensus_state?: AnyAmino;
  /** client ID associated with the consensus state */
  client_id?: string;
  /** merkle proof of existence */
  proof?: string;
  /** height at which the proof was retrieved */
  proof_height?: HeightAmino;
}
export interface QueryChannelConsensusStateResponseAminoMsg {
  type: "cosmos-sdk/QueryChannelConsensusStateResponse";
  value: QueryChannelConsensusStateResponseAmino;
}
/**
 * QueryChannelClientStateResponse is the Response type for the
 * Query/QueryChannelClientState RPC method
 */
export interface QueryChannelConsensusStateResponseSDKType {
  consensus_state?: AnySDKType;
  client_id: string;
  proof: Uint8Array;
  proof_height: HeightSDKType;
}
/**
 * QueryPacketCommitmentRequest is the request type for the
 * Query/PacketCommitment RPC method
 */
export interface QueryPacketCommitmentRequest {
  /** port unique identifier */
  portId: string;
  /** channel unique identifier */
  channelId: string;
  /** packet sequence */
  sequence: bigint;
}
export interface QueryPacketCommitmentRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentRequest";
  value: Uint8Array;
}
/**
 * QueryPacketCommitmentRequest is the request type for the
 * Query/PacketCommitment RPC method
 */
export interface QueryPacketCommitmentRequestAmino {
  /** port unique identifier */
  port_id?: string;
  /** channel unique identifier */
  channel_id?: string;
  /** packet sequence */
  sequence?: string;
}
export interface QueryPacketCommitmentRequestAminoMsg {
  type: "cosmos-sdk/QueryPacketCommitmentRequest";
  value: QueryPacketCommitmentRequestAmino;
}
/**
 * QueryPacketCommitmentRequest is the request type for the
 * Query/PacketCommitment RPC method
 */
export interface QueryPacketCommitmentRequestSDKType {
  port_id: string;
  channel_id: string;
  sequence: bigint;
}
/**
 * QueryPacketCommitmentResponse defines the client query response for a packet
 * which also includes a proof and the height from which the proof was
 * retrieved
 */
export interface QueryPacketCommitmentResponse {
  /** packet associated with the request fields */
  commitment: Uint8Array;
  /** merkle proof of existence */
  proof: Uint8Array;
  /** height at which the proof was retrieved */
  proofHeight: Height;
}
export interface QueryPacketCommitmentResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentResponse";
  value: Uint8Array;
}
/**
 * QueryPacketCommitmentResponse defines the client query response for a packet
 * which also includes a proof and the height from which the proof was
 * retrieved
 */
export interface QueryPacketCommitmentResponseAmino {
  /** packet associated with the request fields */
  commitment?: string;
  /** merkle proof of existence */
  proof?: string;
  /** height at which the proof was retrieved */
  proof_height?: HeightAmino;
}
export interface QueryPacketCommitmentResponseAminoMsg {
  type: "cosmos-sdk/QueryPacketCommitmentResponse";
  value: QueryPacketCommitmentResponseAmino;
}
/**
 * QueryPacketCommitmentResponse defines the client query response for a packet
 * which also includes a proof and the height from which the proof was
 * retrieved
 */
export interface QueryPacketCommitmentResponseSDKType {
  commitment: Uint8Array;
  proof: Uint8Array;
  proof_height: HeightSDKType;
}
/**
 * QueryPacketCommitmentsRequest is the request type for the
 * Query/QueryPacketCommitments RPC method
 */
export interface QueryPacketCommitmentsRequest {
  /** port unique identifier */
  portId: string;
  /** channel unique identifier */
  channelId: string;
  /** pagination request */
  pagination?: PageRequest;
}
export interface QueryPacketCommitmentsRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentsRequest";
  value: Uint8Array;
}
/**
 * QueryPacketCommitmentsRequest is the request type for the
 * Query/QueryPacketCommitments RPC method
 */
export interface QueryPacketCommitmentsRequestAmino {
  /** port unique identifier */
  port_id?: string;
  /** channel unique identifier */
  channel_id?: string;
  /** pagination request */
  pagination?: PageRequestAmino;
}
export interface QueryPacketCommitmentsRequestAminoMsg {
  type: "cosmos-sdk/QueryPacketCommitmentsRequest";
  value: QueryPacketCommitmentsRequestAmino;
}
/**
 * QueryPacketCommitmentsRequest is the request type for the
 * Query/QueryPacketCommitments RPC method
 */
export interface QueryPacketCommitmentsRequestSDKType {
  port_id: string;
  channel_id: string;
  pagination?: PageRequestSDKType;
}
/**
 * QueryPacketCommitmentsResponse is the request type for the
 * Query/QueryPacketCommitments RPC method
 */
export interface QueryPacketCommitmentsResponse {
  commitments: PacketState[];
  /** pagination response */
  pagination?: PageResponse;
  /** query block height */
  height: Height;
}
export interface QueryPacketCommitmentsResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentsResponse";
  value: Uint8Array;
}
/**
 * QueryPacketCommitmentsResponse is the request type for the
 * Query/QueryPacketCommitments RPC method
 */
export interface QueryPacketCommitmentsResponseAmino {
  commitments?: PacketStateAmino[];
  /** pagination response */
  pagination?: PageResponseAmino;
  /** query block height */
  height?: HeightAmino;
}
export interface QueryPacketCommitmentsResponseAminoMsg {
  type: "cosmos-sdk/QueryPacketCommitmentsResponse";
  value: QueryPacketCommitmentsResponseAmino;
}
/**
 * QueryPacketCommitmentsResponse is the request type for the
 * Query/QueryPacketCommitments RPC method
 */
export interface QueryPacketCommitmentsResponseSDKType {
  commitments: PacketStateSDKType[];
  pagination?: PageResponseSDKType;
  height: HeightSDKType;
}
/**
 * QueryPacketReceiptRequest is the request type for the
 * Query/PacketReceipt RPC method
 */
export interface QueryPacketReceiptRequest {
  /** port unique identifier */
  portId: string;
  /** channel unique identifier */
  channelId: string;
  /** packet sequence */
  sequence: bigint;
}
export interface QueryPacketReceiptRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryPacketReceiptRequest";
  value: Uint8Array;
}
/**
 * QueryPacketReceiptRequest is the request type for the
 * Query/PacketReceipt RPC method
 */
export interface QueryPacketReceiptRequestAmino {
  /** port unique identifier */
  port_id?: string;
  /** channel unique identifier */
  channel_id?: string;
  /** packet sequence */
  sequence?: string;
}
export interface QueryPacketReceiptRequestAminoMsg {
  type: "cosmos-sdk/QueryPacketReceiptRequest";
  value: QueryPacketReceiptRequestAmino;
}
/**
 * QueryPacketReceiptRequest is the request type for the
 * Query/PacketReceipt RPC method
 */
export interface QueryPacketReceiptRequestSDKType {
  port_id: string;
  channel_id: string;
  sequence: bigint;
}
/**
 * QueryPacketReceiptResponse defines the client query response for a packet
 * receipt which also includes a proof, and the height from which the proof was
 * retrieved
 */
export interface QueryPacketReceiptResponse {
  /** success flag for if receipt exists */
  received: boolean;
  /** merkle proof of existence */
  proof: Uint8Array;
  /** height at which the proof was retrieved */
  proofHeight: Height;
}
export interface QueryPacketReceiptResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryPacketReceiptResponse";
  value: Uint8Array;
}
/**
 * QueryPacketReceiptResponse defines the client query response for a packet
 * receipt which also includes a proof, and the height from which the proof was
 * retrieved
 */
export interface QueryPacketReceiptResponseAmino {
  /** success flag for if receipt exists */
  received?: boolean;
  /** merkle proof of existence */
  proof?: string;
  /** height at which the proof was retrieved */
  proof_height?: HeightAmino;
}
export interface QueryPacketReceiptResponseAminoMsg {
  type: "cosmos-sdk/QueryPacketReceiptResponse";
  value: QueryPacketReceiptResponseAmino;
}
/**
 * QueryPacketReceiptResponse defines the client query response for a packet
 * receipt which also includes a proof, and the height from which the proof was
 * retrieved
 */
export interface QueryPacketReceiptResponseSDKType {
  received: boolean;
  proof: Uint8Array;
  proof_height: HeightSDKType;
}
/**
 * QueryPacketAcknowledgementRequest is the request type for the
 * Query/PacketAcknowledgement RPC method
 */
export interface QueryPacketAcknowledgementRequest {
  /** port unique identifier */
  portId: string;
  /** channel unique identifier */
  channelId: string;
  /** packet sequence */
  sequence: bigint;
}
export interface QueryPacketAcknowledgementRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementRequest";
  value: Uint8Array;
}
/**
 * QueryPacketAcknowledgementRequest is the request type for the
 * Query/PacketAcknowledgement RPC method
 */
export interface QueryPacketAcknowledgementRequestAmino {
  /** port unique identifier */
  port_id?: string;
  /** channel unique identifier */
  channel_id?: string;
  /** packet sequence */
  sequence?: string;
}
export interface QueryPacketAcknowledgementRequestAminoMsg {
  type: "cosmos-sdk/QueryPacketAcknowledgementRequest";
  value: QueryPacketAcknowledgementRequestAmino;
}
/**
 * QueryPacketAcknowledgementRequest is the request type for the
 * Query/PacketAcknowledgement RPC method
 */
export interface QueryPacketAcknowledgementRequestSDKType {
  port_id: string;
  channel_id: string;
  sequence: bigint;
}
/**
 * QueryPacketAcknowledgementResponse defines the client query response for a
 * packet which also includes a proof and the height from which the
 * proof was retrieved
 */
export interface QueryPacketAcknowledgementResponse {
  /** packet associated with the request fields */
  acknowledgement: Uint8Array;
  /** merkle proof of existence */
  proof: Uint8Array;
  /** height at which the proof was retrieved */
  proofHeight: Height;
}
export interface QueryPacketAcknowledgementResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementResponse";
  value: Uint8Array;
}
/**
 * QueryPacketAcknowledgementResponse defines the client query response for a
 * packet which also includes a proof and the height from which the
 * proof was retrieved
 */
export interface QueryPacketAcknowledgementResponseAmino {
  /** packet associated with the request fields */
  acknowledgement?: string;
  /** merkle proof of existence */
  proof?: string;
  /** height at which the proof was retrieved */
  proof_height?: HeightAmino;
}
export interface QueryPacketAcknowledgementResponseAminoMsg {
  type: "cosmos-sdk/QueryPacketAcknowledgementResponse";
  value: QueryPacketAcknowledgementResponseAmino;
}
/**
 * QueryPacketAcknowledgementResponse defines the client query response for a
 * packet which also includes a proof and the height from which the
 * proof was retrieved
 */
export interface QueryPacketAcknowledgementResponseSDKType {
  acknowledgement: Uint8Array;
  proof: Uint8Array;
  proof_height: HeightSDKType;
}
/**
 * QueryPacketAcknowledgementsRequest is the request type for the
 * Query/QueryPacketCommitments RPC method
 */
export interface QueryPacketAcknowledgementsRequest {
  /** port unique identifier */
  portId: string;
  /** channel unique identifier */
  channelId: string;
  /** pagination request */
  pagination?: PageRequest;
  /** list of packet sequences */
  packetCommitmentSequences: bigint[];
}
export interface QueryPacketAcknowledgementsRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementsRequest";
  value: Uint8Array;
}
/**
 * QueryPacketAcknowledgementsRequest is the request type for the
 * Query/QueryPacketCommitments RPC method
 */
export interface QueryPacketAcknowledgementsRequestAmino {
  /** port unique identifier */
  port_id?: string;
  /** channel unique identifier */
  channel_id?: string;
  /** pagination request */
  pagination?: PageRequestAmino;
  /** list of packet sequences */
  packet_commitment_sequences?: string[];
}
export interface QueryPacketAcknowledgementsRequestAminoMsg {
  type: "cosmos-sdk/QueryPacketAcknowledgementsRequest";
  value: QueryPacketAcknowledgementsRequestAmino;
}
/**
 * QueryPacketAcknowledgementsRequest is the request type for the
 * Query/QueryPacketCommitments RPC method
 */
export interface QueryPacketAcknowledgementsRequestSDKType {
  port_id: string;
  channel_id: string;
  pagination?: PageRequestSDKType;
  packet_commitment_sequences: bigint[];
}
/**
 * QueryPacketAcknowledgemetsResponse is the request type for the
 * Query/QueryPacketAcknowledgements RPC method
 */
export interface QueryPacketAcknowledgementsResponse {
  acknowledgements: PacketState[];
  /** pagination response */
  pagination?: PageResponse;
  /** query block height */
  height: Height;
}
export interface QueryPacketAcknowledgementsResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementsResponse";
  value: Uint8Array;
}
/**
 * QueryPacketAcknowledgemetsResponse is the request type for the
 * Query/QueryPacketAcknowledgements RPC method
 */
export interface QueryPacketAcknowledgementsResponseAmino {
  acknowledgements?: PacketStateAmino[];
  /** pagination response */
  pagination?: PageResponseAmino;
  /** query block height */
  height?: HeightAmino;
}
export interface QueryPacketAcknowledgementsResponseAminoMsg {
  type: "cosmos-sdk/QueryPacketAcknowledgementsResponse";
  value: QueryPacketAcknowledgementsResponseAmino;
}
/**
 * QueryPacketAcknowledgemetsResponse is the request type for the
 * Query/QueryPacketAcknowledgements RPC method
 */
export interface QueryPacketAcknowledgementsResponseSDKType {
  acknowledgements: PacketStateSDKType[];
  pagination?: PageResponseSDKType;
  height: HeightSDKType;
}
/**
 * QueryUnreceivedPacketsRequest is the request type for the
 * Query/UnreceivedPackets RPC method
 */
export interface QueryUnreceivedPacketsRequest {
  /** port unique identifier */
  portId: string;
  /** channel unique identifier */
  channelId: string;
  /** list of packet sequences */
  packetCommitmentSequences: bigint[];
}
export interface QueryUnreceivedPacketsRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryUnreceivedPacketsRequest";
  value: Uint8Array;
}
/**
 * QueryUnreceivedPacketsRequest is the request type for the
 * Query/UnreceivedPackets RPC method
 */
export interface QueryUnreceivedPacketsRequestAmino {
  /** port unique identifier */
  port_id?: string;
  /** channel unique identifier */
  channel_id?: string;
  /** list of packet sequences */
  packet_commitment_sequences?: string[];
}
export interface QueryUnreceivedPacketsRequestAminoMsg {
  type: "cosmos-sdk/QueryUnreceivedPacketsRequest";
  value: QueryUnreceivedPacketsRequestAmino;
}
/**
 * QueryUnreceivedPacketsRequest is the request type for the
 * Query/UnreceivedPackets RPC method
 */
export interface QueryUnreceivedPacketsRequestSDKType {
  port_id: string;
  channel_id: string;
  packet_commitment_sequences: bigint[];
}
/**
 * QueryUnreceivedPacketsResponse is the response type for the
 * Query/UnreceivedPacketCommitments RPC method
 */
export interface QueryUnreceivedPacketsResponse {
  /** list of unreceived packet sequences */
  sequences: bigint[];
  /** query block height */
  height: Height;
}
export interface QueryUnreceivedPacketsResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryUnreceivedPacketsResponse";
  value: Uint8Array;
}
/**
 * QueryUnreceivedPacketsResponse is the response type for the
 * Query/UnreceivedPacketCommitments RPC method
 */
export interface QueryUnreceivedPacketsResponseAmino {
  /** list of unreceived packet sequences */
  sequences?: string[];
  /** query block height */
  height?: HeightAmino;
}
export interface QueryUnreceivedPacketsResponseAminoMsg {
  type: "cosmos-sdk/QueryUnreceivedPacketsResponse";
  value: QueryUnreceivedPacketsResponseAmino;
}
/**
 * QueryUnreceivedPacketsResponse is the response type for the
 * Query/UnreceivedPacketCommitments RPC method
 */
export interface QueryUnreceivedPacketsResponseSDKType {
  sequences: bigint[];
  height: HeightSDKType;
}
/**
 * QueryUnreceivedAcks is the request type for the
 * Query/UnreceivedAcks RPC method
 */
export interface QueryUnreceivedAcksRequest {
  /** port unique identifier */
  portId: string;
  /** channel unique identifier */
  channelId: string;
  /** list of acknowledgement sequences */
  packetAckSequences: bigint[];
}
export interface QueryUnreceivedAcksRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryUnreceivedAcksRequest";
  value: Uint8Array;
}
/**
 * QueryUnreceivedAcks is the request type for the
 * Query/UnreceivedAcks RPC method
 */
export interface QueryUnreceivedAcksRequestAmino {
  /** port unique identifier */
  port_id?: string;
  /** channel unique identifier */
  channel_id?: string;
  /** list of acknowledgement sequences */
  packet_ack_sequences?: string[];
}
export interface QueryUnreceivedAcksRequestAminoMsg {
  type: "cosmos-sdk/QueryUnreceivedAcksRequest";
  value: QueryUnreceivedAcksRequestAmino;
}
/**
 * QueryUnreceivedAcks is the request type for the
 * Query/UnreceivedAcks RPC method
 */
export interface QueryUnreceivedAcksRequestSDKType {
  port_id: string;
  channel_id: string;
  packet_ack_sequences: bigint[];
}
/**
 * QueryUnreceivedAcksResponse is the response type for the
 * Query/UnreceivedAcks RPC method
 */
export interface QueryUnreceivedAcksResponse {
  /** list of unreceived acknowledgement sequences */
  sequences: bigint[];
  /** query block height */
  height: Height;
}
export interface QueryUnreceivedAcksResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryUnreceivedAcksResponse";
  value: Uint8Array;
}
/**
 * QueryUnreceivedAcksResponse is the response type for the
 * Query/UnreceivedAcks RPC method
 */
export interface QueryUnreceivedAcksResponseAmino {
  /** list of unreceived acknowledgement sequences */
  sequences?: string[];
  /** query block height */
  height?: HeightAmino;
}
export interface QueryUnreceivedAcksResponseAminoMsg {
  type: "cosmos-sdk/QueryUnreceivedAcksResponse";
  value: QueryUnreceivedAcksResponseAmino;
}
/**
 * QueryUnreceivedAcksResponse is the response type for the
 * Query/UnreceivedAcks RPC method
 */
export interface QueryUnreceivedAcksResponseSDKType {
  sequences: bigint[];
  height: HeightSDKType;
}
/**
 * QueryNextSequenceReceiveRequest is the request type for the
 * Query/QueryNextSequenceReceiveRequest RPC method
 */
export interface QueryNextSequenceReceiveRequest {
  /** port unique identifier */
  portId: string;
  /** channel unique identifier */
  channelId: string;
}
export interface QueryNextSequenceReceiveRequestProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryNextSequenceReceiveRequest";
  value: Uint8Array;
}
/**
 * QueryNextSequenceReceiveRequest is the request type for the
 * Query/QueryNextSequenceReceiveRequest RPC method
 */
export interface QueryNextSequenceReceiveRequestAmino {
  /** port unique identifier */
  port_id?: string;
  /** channel unique identifier */
  channel_id?: string;
}
export interface QueryNextSequenceReceiveRequestAminoMsg {
  type: "cosmos-sdk/QueryNextSequenceReceiveRequest";
  value: QueryNextSequenceReceiveRequestAmino;
}
/**
 * QueryNextSequenceReceiveRequest is the request type for the
 * Query/QueryNextSequenceReceiveRequest RPC method
 */
export interface QueryNextSequenceReceiveRequestSDKType {
  port_id: string;
  channel_id: string;
}
/**
 * QuerySequenceResponse is the request type for the
 * Query/QueryNextSequenceReceiveResponse RPC method
 */
export interface QueryNextSequenceReceiveResponse {
  /** next sequence receive number */
  nextSequenceReceive: bigint;
  /** merkle proof of existence */
  proof: Uint8Array;
  /** height at which the proof was retrieved */
  proofHeight: Height;
}
export interface QueryNextSequenceReceiveResponseProtoMsg {
  typeUrl: "/ibc.core.channel.v1.QueryNextSequenceReceiveResponse";
  value: Uint8Array;
}
/**
 * QuerySequenceResponse is the request type for the
 * Query/QueryNextSequenceReceiveResponse RPC method
 */
export interface QueryNextSequenceReceiveResponseAmino {
  /** next sequence receive number */
  next_sequence_receive?: string;
  /** merkle proof of existence */
  proof?: string;
  /** height at which the proof was retrieved */
  proof_height?: HeightAmino;
}
export interface QueryNextSequenceReceiveResponseAminoMsg {
  type: "cosmos-sdk/QueryNextSequenceReceiveResponse";
  value: QueryNextSequenceReceiveResponseAmino;
}
/**
 * QuerySequenceResponse is the request type for the
 * Query/QueryNextSequenceReceiveResponse RPC method
 */
export interface QueryNextSequenceReceiveResponseSDKType {
  next_sequence_receive: bigint;
  proof: Uint8Array;
  proof_height: HeightSDKType;
}
function createBaseQueryChannelRequest(): QueryChannelRequest {
  return {
    portId: "",
    channelId: ""
  };
}
export const QueryChannelRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryChannelRequest",
  encode(message: QueryChannelRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryChannelRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChannelRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryChannelRequest>): QueryChannelRequest {
    const message = createBaseQueryChannelRequest();
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    return message;
  },
  fromAmino(object: QueryChannelRequestAmino): QueryChannelRequest {
    const message = createBaseQueryChannelRequest();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    return message;
  },
  toAmino(message: QueryChannelRequest): QueryChannelRequestAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    return obj;
  },
  fromAminoMsg(object: QueryChannelRequestAminoMsg): QueryChannelRequest {
    return QueryChannelRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryChannelRequest): QueryChannelRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryChannelRequest",
      value: QueryChannelRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryChannelRequestProtoMsg): QueryChannelRequest {
    return QueryChannelRequest.decode(message.value);
  },
  toProto(message: QueryChannelRequest): Uint8Array {
    return QueryChannelRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryChannelRequest): QueryChannelRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryChannelRequest",
      value: QueryChannelRequest.encode(message).finish()
    };
  }
};
function createBaseQueryChannelResponse(): QueryChannelResponse {
  return {
    channel: undefined,
    proof: new Uint8Array(),
    proofHeight: Height.fromPartial({})
  };
}
export const QueryChannelResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryChannelResponse",
  encode(message: QueryChannelResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.channel !== undefined) {
      Channel.encode(message.channel, writer.uint32(10).fork()).ldelim();
    }
    if (message.proof.length !== 0) {
      writer.uint32(18).bytes(message.proof);
    }
    if (message.proofHeight !== undefined) {
      Height.encode(message.proofHeight, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryChannelResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChannelResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channel = Channel.decode(reader, reader.uint32());
          break;
        case 2:
          message.proof = reader.bytes();
          break;
        case 3:
          message.proofHeight = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryChannelResponse>): QueryChannelResponse {
    const message = createBaseQueryChannelResponse();
    message.channel = object.channel !== undefined && object.channel !== null ? Channel.fromPartial(object.channel) : undefined;
    message.proof = object.proof ?? new Uint8Array();
    message.proofHeight = object.proofHeight !== undefined && object.proofHeight !== null ? Height.fromPartial(object.proofHeight) : undefined;
    return message;
  },
  fromAmino(object: QueryChannelResponseAmino): QueryChannelResponse {
    const message = createBaseQueryChannelResponse();
    if (object.channel !== undefined && object.channel !== null) {
      message.channel = Channel.fromAmino(object.channel);
    }
    if (object.proof !== undefined && object.proof !== null) {
      message.proof = bytesFromBase64(object.proof);
    }
    if (object.proof_height !== undefined && object.proof_height !== null) {
      message.proofHeight = Height.fromAmino(object.proof_height);
    }
    return message;
  },
  toAmino(message: QueryChannelResponse): QueryChannelResponseAmino {
    const obj: any = {};
    obj.channel = message.channel ? Channel.toAmino(message.channel) : undefined;
    obj.proof = message.proof ? base64FromBytes(message.proof) : undefined;
    obj.proof_height = message.proofHeight ? Height.toAmino(message.proofHeight) : {};
    return obj;
  },
  fromAminoMsg(object: QueryChannelResponseAminoMsg): QueryChannelResponse {
    return QueryChannelResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryChannelResponse): QueryChannelResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryChannelResponse",
      value: QueryChannelResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryChannelResponseProtoMsg): QueryChannelResponse {
    return QueryChannelResponse.decode(message.value);
  },
  toProto(message: QueryChannelResponse): Uint8Array {
    return QueryChannelResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryChannelResponse): QueryChannelResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryChannelResponse",
      value: QueryChannelResponse.encode(message).finish()
    };
  }
};
function createBaseQueryChannelsRequest(): QueryChannelsRequest {
  return {
    pagination: undefined
  };
}
export const QueryChannelsRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryChannelsRequest",
  encode(message: QueryChannelsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryChannelsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChannelsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryChannelsRequest>): QueryChannelsRequest {
    const message = createBaseQueryChannelsRequest();
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryChannelsRequestAmino): QueryChannelsRequest {
    const message = createBaseQueryChannelsRequest();
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryChannelsRequest): QueryChannelsRequestAmino {
    const obj: any = {};
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryChannelsRequestAminoMsg): QueryChannelsRequest {
    return QueryChannelsRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryChannelsRequest): QueryChannelsRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryChannelsRequest",
      value: QueryChannelsRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryChannelsRequestProtoMsg): QueryChannelsRequest {
    return QueryChannelsRequest.decode(message.value);
  },
  toProto(message: QueryChannelsRequest): Uint8Array {
    return QueryChannelsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryChannelsRequest): QueryChannelsRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryChannelsRequest",
      value: QueryChannelsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryChannelsResponse(): QueryChannelsResponse {
  return {
    channels: [],
    pagination: undefined,
    height: Height.fromPartial({})
  };
}
export const QueryChannelsResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryChannelsResponse",
  encode(message: QueryChannelsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.channels) {
      IdentifiedChannel.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    if (message.height !== undefined) {
      Height.encode(message.height, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryChannelsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChannelsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channels.push(IdentifiedChannel.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        case 3:
          message.height = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryChannelsResponse>): QueryChannelsResponse {
    const message = createBaseQueryChannelsResponse();
    message.channels = object.channels?.map(e => IdentifiedChannel.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    message.height = object.height !== undefined && object.height !== null ? Height.fromPartial(object.height) : undefined;
    return message;
  },
  fromAmino(object: QueryChannelsResponseAmino): QueryChannelsResponse {
    const message = createBaseQueryChannelsResponse();
    message.channels = object.channels?.map(e => IdentifiedChannel.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Height.fromAmino(object.height);
    }
    return message;
  },
  toAmino(message: QueryChannelsResponse): QueryChannelsResponseAmino {
    const obj: any = {};
    if (message.channels) {
      obj.channels = message.channels.map(e => e ? IdentifiedChannel.toAmino(e) : undefined);
    } else {
      obj.channels = message.channels;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    obj.height = message.height ? Height.toAmino(message.height) : {};
    return obj;
  },
  fromAminoMsg(object: QueryChannelsResponseAminoMsg): QueryChannelsResponse {
    return QueryChannelsResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryChannelsResponse): QueryChannelsResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryChannelsResponse",
      value: QueryChannelsResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryChannelsResponseProtoMsg): QueryChannelsResponse {
    return QueryChannelsResponse.decode(message.value);
  },
  toProto(message: QueryChannelsResponse): Uint8Array {
    return QueryChannelsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryChannelsResponse): QueryChannelsResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryChannelsResponse",
      value: QueryChannelsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryConnectionChannelsRequest(): QueryConnectionChannelsRequest {
  return {
    connection: "",
    pagination: undefined
  };
}
export const QueryConnectionChannelsRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryConnectionChannelsRequest",
  encode(message: QueryConnectionChannelsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.connection !== "") {
      writer.uint32(10).string(message.connection);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryConnectionChannelsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryConnectionChannelsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.connection = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryConnectionChannelsRequest>): QueryConnectionChannelsRequest {
    const message = createBaseQueryConnectionChannelsRequest();
    message.connection = object.connection ?? "";
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryConnectionChannelsRequestAmino): QueryConnectionChannelsRequest {
    const message = createBaseQueryConnectionChannelsRequest();
    if (object.connection !== undefined && object.connection !== null) {
      message.connection = object.connection;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryConnectionChannelsRequest): QueryConnectionChannelsRequestAmino {
    const obj: any = {};
    obj.connection = message.connection === "" ? undefined : message.connection;
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryConnectionChannelsRequestAminoMsg): QueryConnectionChannelsRequest {
    return QueryConnectionChannelsRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryConnectionChannelsRequest): QueryConnectionChannelsRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryConnectionChannelsRequest",
      value: QueryConnectionChannelsRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryConnectionChannelsRequestProtoMsg): QueryConnectionChannelsRequest {
    return QueryConnectionChannelsRequest.decode(message.value);
  },
  toProto(message: QueryConnectionChannelsRequest): Uint8Array {
    return QueryConnectionChannelsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryConnectionChannelsRequest): QueryConnectionChannelsRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryConnectionChannelsRequest",
      value: QueryConnectionChannelsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryConnectionChannelsResponse(): QueryConnectionChannelsResponse {
  return {
    channels: [],
    pagination: undefined,
    height: Height.fromPartial({})
  };
}
export const QueryConnectionChannelsResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryConnectionChannelsResponse",
  encode(message: QueryConnectionChannelsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.channels) {
      IdentifiedChannel.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    if (message.height !== undefined) {
      Height.encode(message.height, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryConnectionChannelsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryConnectionChannelsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channels.push(IdentifiedChannel.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        case 3:
          message.height = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryConnectionChannelsResponse>): QueryConnectionChannelsResponse {
    const message = createBaseQueryConnectionChannelsResponse();
    message.channels = object.channels?.map(e => IdentifiedChannel.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    message.height = object.height !== undefined && object.height !== null ? Height.fromPartial(object.height) : undefined;
    return message;
  },
  fromAmino(object: QueryConnectionChannelsResponseAmino): QueryConnectionChannelsResponse {
    const message = createBaseQueryConnectionChannelsResponse();
    message.channels = object.channels?.map(e => IdentifiedChannel.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Height.fromAmino(object.height);
    }
    return message;
  },
  toAmino(message: QueryConnectionChannelsResponse): QueryConnectionChannelsResponseAmino {
    const obj: any = {};
    if (message.channels) {
      obj.channels = message.channels.map(e => e ? IdentifiedChannel.toAmino(e) : undefined);
    } else {
      obj.channels = message.channels;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    obj.height = message.height ? Height.toAmino(message.height) : {};
    return obj;
  },
  fromAminoMsg(object: QueryConnectionChannelsResponseAminoMsg): QueryConnectionChannelsResponse {
    return QueryConnectionChannelsResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryConnectionChannelsResponse): QueryConnectionChannelsResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryConnectionChannelsResponse",
      value: QueryConnectionChannelsResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryConnectionChannelsResponseProtoMsg): QueryConnectionChannelsResponse {
    return QueryConnectionChannelsResponse.decode(message.value);
  },
  toProto(message: QueryConnectionChannelsResponse): Uint8Array {
    return QueryConnectionChannelsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryConnectionChannelsResponse): QueryConnectionChannelsResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryConnectionChannelsResponse",
      value: QueryConnectionChannelsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryChannelClientStateRequest(): QueryChannelClientStateRequest {
  return {
    portId: "",
    channelId: ""
  };
}
export const QueryChannelClientStateRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryChannelClientStateRequest",
  encode(message: QueryChannelClientStateRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryChannelClientStateRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChannelClientStateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryChannelClientStateRequest>): QueryChannelClientStateRequest {
    const message = createBaseQueryChannelClientStateRequest();
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    return message;
  },
  fromAmino(object: QueryChannelClientStateRequestAmino): QueryChannelClientStateRequest {
    const message = createBaseQueryChannelClientStateRequest();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    return message;
  },
  toAmino(message: QueryChannelClientStateRequest): QueryChannelClientStateRequestAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    return obj;
  },
  fromAminoMsg(object: QueryChannelClientStateRequestAminoMsg): QueryChannelClientStateRequest {
    return QueryChannelClientStateRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryChannelClientStateRequest): QueryChannelClientStateRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryChannelClientStateRequest",
      value: QueryChannelClientStateRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryChannelClientStateRequestProtoMsg): QueryChannelClientStateRequest {
    return QueryChannelClientStateRequest.decode(message.value);
  },
  toProto(message: QueryChannelClientStateRequest): Uint8Array {
    return QueryChannelClientStateRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryChannelClientStateRequest): QueryChannelClientStateRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryChannelClientStateRequest",
      value: QueryChannelClientStateRequest.encode(message).finish()
    };
  }
};
function createBaseQueryChannelClientStateResponse(): QueryChannelClientStateResponse {
  return {
    identifiedClientState: undefined,
    proof: new Uint8Array(),
    proofHeight: Height.fromPartial({})
  };
}
export const QueryChannelClientStateResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryChannelClientStateResponse",
  encode(message: QueryChannelClientStateResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.identifiedClientState !== undefined) {
      IdentifiedClientState.encode(message.identifiedClientState, writer.uint32(10).fork()).ldelim();
    }
    if (message.proof.length !== 0) {
      writer.uint32(18).bytes(message.proof);
    }
    if (message.proofHeight !== undefined) {
      Height.encode(message.proofHeight, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryChannelClientStateResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChannelClientStateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifiedClientState = IdentifiedClientState.decode(reader, reader.uint32());
          break;
        case 2:
          message.proof = reader.bytes();
          break;
        case 3:
          message.proofHeight = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryChannelClientStateResponse>): QueryChannelClientStateResponse {
    const message = createBaseQueryChannelClientStateResponse();
    message.identifiedClientState = object.identifiedClientState !== undefined && object.identifiedClientState !== null ? IdentifiedClientState.fromPartial(object.identifiedClientState) : undefined;
    message.proof = object.proof ?? new Uint8Array();
    message.proofHeight = object.proofHeight !== undefined && object.proofHeight !== null ? Height.fromPartial(object.proofHeight) : undefined;
    return message;
  },
  fromAmino(object: QueryChannelClientStateResponseAmino): QueryChannelClientStateResponse {
    const message = createBaseQueryChannelClientStateResponse();
    if (object.identified_client_state !== undefined && object.identified_client_state !== null) {
      message.identifiedClientState = IdentifiedClientState.fromAmino(object.identified_client_state);
    }
    if (object.proof !== undefined && object.proof !== null) {
      message.proof = bytesFromBase64(object.proof);
    }
    if (object.proof_height !== undefined && object.proof_height !== null) {
      message.proofHeight = Height.fromAmino(object.proof_height);
    }
    return message;
  },
  toAmino(message: QueryChannelClientStateResponse): QueryChannelClientStateResponseAmino {
    const obj: any = {};
    obj.identified_client_state = message.identifiedClientState ? IdentifiedClientState.toAmino(message.identifiedClientState) : undefined;
    obj.proof = message.proof ? base64FromBytes(message.proof) : undefined;
    obj.proof_height = message.proofHeight ? Height.toAmino(message.proofHeight) : {};
    return obj;
  },
  fromAminoMsg(object: QueryChannelClientStateResponseAminoMsg): QueryChannelClientStateResponse {
    return QueryChannelClientStateResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryChannelClientStateResponse): QueryChannelClientStateResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryChannelClientStateResponse",
      value: QueryChannelClientStateResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryChannelClientStateResponseProtoMsg): QueryChannelClientStateResponse {
    return QueryChannelClientStateResponse.decode(message.value);
  },
  toProto(message: QueryChannelClientStateResponse): Uint8Array {
    return QueryChannelClientStateResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryChannelClientStateResponse): QueryChannelClientStateResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryChannelClientStateResponse",
      value: QueryChannelClientStateResponse.encode(message).finish()
    };
  }
};
function createBaseQueryChannelConsensusStateRequest(): QueryChannelConsensusStateRequest {
  return {
    portId: "",
    channelId: "",
    revisionNumber: BigInt(0),
    revisionHeight: BigInt(0)
  };
}
export const QueryChannelConsensusStateRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryChannelConsensusStateRequest",
  encode(message: QueryChannelConsensusStateRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    if (message.revisionNumber !== BigInt(0)) {
      writer.uint32(24).uint64(message.revisionNumber);
    }
    if (message.revisionHeight !== BigInt(0)) {
      writer.uint32(32).uint64(message.revisionHeight);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryChannelConsensusStateRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChannelConsensusStateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        case 3:
          message.revisionNumber = reader.uint64();
          break;
        case 4:
          message.revisionHeight = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryChannelConsensusStateRequest>): QueryChannelConsensusStateRequest {
    const message = createBaseQueryChannelConsensusStateRequest();
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    message.revisionNumber = object.revisionNumber !== undefined && object.revisionNumber !== null ? BigInt(object.revisionNumber.toString()) : BigInt(0);
    message.revisionHeight = object.revisionHeight !== undefined && object.revisionHeight !== null ? BigInt(object.revisionHeight.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryChannelConsensusStateRequestAmino): QueryChannelConsensusStateRequest {
    const message = createBaseQueryChannelConsensusStateRequest();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    if (object.revision_number !== undefined && object.revision_number !== null) {
      message.revisionNumber = BigInt(object.revision_number);
    }
    if (object.revision_height !== undefined && object.revision_height !== null) {
      message.revisionHeight = BigInt(object.revision_height);
    }
    return message;
  },
  toAmino(message: QueryChannelConsensusStateRequest): QueryChannelConsensusStateRequestAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    obj.revision_number = message.revisionNumber !== BigInt(0) ? message.revisionNumber.toString() : undefined;
    obj.revision_height = message.revisionHeight !== BigInt(0) ? message.revisionHeight.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryChannelConsensusStateRequestAminoMsg): QueryChannelConsensusStateRequest {
    return QueryChannelConsensusStateRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryChannelConsensusStateRequest): QueryChannelConsensusStateRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryChannelConsensusStateRequest",
      value: QueryChannelConsensusStateRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryChannelConsensusStateRequestProtoMsg): QueryChannelConsensusStateRequest {
    return QueryChannelConsensusStateRequest.decode(message.value);
  },
  toProto(message: QueryChannelConsensusStateRequest): Uint8Array {
    return QueryChannelConsensusStateRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryChannelConsensusStateRequest): QueryChannelConsensusStateRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryChannelConsensusStateRequest",
      value: QueryChannelConsensusStateRequest.encode(message).finish()
    };
  }
};
function createBaseQueryChannelConsensusStateResponse(): QueryChannelConsensusStateResponse {
  return {
    consensusState: undefined,
    clientId: "",
    proof: new Uint8Array(),
    proofHeight: Height.fromPartial({})
  };
}
export const QueryChannelConsensusStateResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryChannelConsensusStateResponse",
  encode(message: QueryChannelConsensusStateResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.consensusState !== undefined) {
      Any.encode(message.consensusState, writer.uint32(10).fork()).ldelim();
    }
    if (message.clientId !== "") {
      writer.uint32(18).string(message.clientId);
    }
    if (message.proof.length !== 0) {
      writer.uint32(26).bytes(message.proof);
    }
    if (message.proofHeight !== undefined) {
      Height.encode(message.proofHeight, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryChannelConsensusStateResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryChannelConsensusStateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.consensusState = Any.decode(reader, reader.uint32());
          break;
        case 2:
          message.clientId = reader.string();
          break;
        case 3:
          message.proof = reader.bytes();
          break;
        case 4:
          message.proofHeight = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryChannelConsensusStateResponse>): QueryChannelConsensusStateResponse {
    const message = createBaseQueryChannelConsensusStateResponse();
    message.consensusState = object.consensusState !== undefined && object.consensusState !== null ? Any.fromPartial(object.consensusState) : undefined;
    message.clientId = object.clientId ?? "";
    message.proof = object.proof ?? new Uint8Array();
    message.proofHeight = object.proofHeight !== undefined && object.proofHeight !== null ? Height.fromPartial(object.proofHeight) : undefined;
    return message;
  },
  fromAmino(object: QueryChannelConsensusStateResponseAmino): QueryChannelConsensusStateResponse {
    const message = createBaseQueryChannelConsensusStateResponse();
    if (object.consensus_state !== undefined && object.consensus_state !== null) {
      message.consensusState = Any.fromAmino(object.consensus_state);
    }
    if (object.client_id !== undefined && object.client_id !== null) {
      message.clientId = object.client_id;
    }
    if (object.proof !== undefined && object.proof !== null) {
      message.proof = bytesFromBase64(object.proof);
    }
    if (object.proof_height !== undefined && object.proof_height !== null) {
      message.proofHeight = Height.fromAmino(object.proof_height);
    }
    return message;
  },
  toAmino(message: QueryChannelConsensusStateResponse): QueryChannelConsensusStateResponseAmino {
    const obj: any = {};
    obj.consensus_state = message.consensusState ? Any.toAmino(message.consensusState) : undefined;
    obj.client_id = message.clientId === "" ? undefined : message.clientId;
    obj.proof = message.proof ? base64FromBytes(message.proof) : undefined;
    obj.proof_height = message.proofHeight ? Height.toAmino(message.proofHeight) : {};
    return obj;
  },
  fromAminoMsg(object: QueryChannelConsensusStateResponseAminoMsg): QueryChannelConsensusStateResponse {
    return QueryChannelConsensusStateResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryChannelConsensusStateResponse): QueryChannelConsensusStateResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryChannelConsensusStateResponse",
      value: QueryChannelConsensusStateResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryChannelConsensusStateResponseProtoMsg): QueryChannelConsensusStateResponse {
    return QueryChannelConsensusStateResponse.decode(message.value);
  },
  toProto(message: QueryChannelConsensusStateResponse): Uint8Array {
    return QueryChannelConsensusStateResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryChannelConsensusStateResponse): QueryChannelConsensusStateResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryChannelConsensusStateResponse",
      value: QueryChannelConsensusStateResponse.encode(message).finish()
    };
  }
};
function createBaseQueryPacketCommitmentRequest(): QueryPacketCommitmentRequest {
  return {
    portId: "",
    channelId: "",
    sequence: BigInt(0)
  };
}
export const QueryPacketCommitmentRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentRequest",
  encode(message: QueryPacketCommitmentRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    if (message.sequence !== BigInt(0)) {
      writer.uint32(24).uint64(message.sequence);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPacketCommitmentRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPacketCommitmentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        case 3:
          message.sequence = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPacketCommitmentRequest>): QueryPacketCommitmentRequest {
    const message = createBaseQueryPacketCommitmentRequest();
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    message.sequence = object.sequence !== undefined && object.sequence !== null ? BigInt(object.sequence.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryPacketCommitmentRequestAmino): QueryPacketCommitmentRequest {
    const message = createBaseQueryPacketCommitmentRequest();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    if (object.sequence !== undefined && object.sequence !== null) {
      message.sequence = BigInt(object.sequence);
    }
    return message;
  },
  toAmino(message: QueryPacketCommitmentRequest): QueryPacketCommitmentRequestAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    obj.sequence = message.sequence !== BigInt(0) ? message.sequence.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPacketCommitmentRequestAminoMsg): QueryPacketCommitmentRequest {
    return QueryPacketCommitmentRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPacketCommitmentRequest): QueryPacketCommitmentRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryPacketCommitmentRequest",
      value: QueryPacketCommitmentRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPacketCommitmentRequestProtoMsg): QueryPacketCommitmentRequest {
    return QueryPacketCommitmentRequest.decode(message.value);
  },
  toProto(message: QueryPacketCommitmentRequest): Uint8Array {
    return QueryPacketCommitmentRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPacketCommitmentRequest): QueryPacketCommitmentRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentRequest",
      value: QueryPacketCommitmentRequest.encode(message).finish()
    };
  }
};
function createBaseQueryPacketCommitmentResponse(): QueryPacketCommitmentResponse {
  return {
    commitment: new Uint8Array(),
    proof: new Uint8Array(),
    proofHeight: Height.fromPartial({})
  };
}
export const QueryPacketCommitmentResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentResponse",
  encode(message: QueryPacketCommitmentResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.commitment.length !== 0) {
      writer.uint32(10).bytes(message.commitment);
    }
    if (message.proof.length !== 0) {
      writer.uint32(18).bytes(message.proof);
    }
    if (message.proofHeight !== undefined) {
      Height.encode(message.proofHeight, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPacketCommitmentResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPacketCommitmentResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commitment = reader.bytes();
          break;
        case 2:
          message.proof = reader.bytes();
          break;
        case 3:
          message.proofHeight = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPacketCommitmentResponse>): QueryPacketCommitmentResponse {
    const message = createBaseQueryPacketCommitmentResponse();
    message.commitment = object.commitment ?? new Uint8Array();
    message.proof = object.proof ?? new Uint8Array();
    message.proofHeight = object.proofHeight !== undefined && object.proofHeight !== null ? Height.fromPartial(object.proofHeight) : undefined;
    return message;
  },
  fromAmino(object: QueryPacketCommitmentResponseAmino): QueryPacketCommitmentResponse {
    const message = createBaseQueryPacketCommitmentResponse();
    if (object.commitment !== undefined && object.commitment !== null) {
      message.commitment = bytesFromBase64(object.commitment);
    }
    if (object.proof !== undefined && object.proof !== null) {
      message.proof = bytesFromBase64(object.proof);
    }
    if (object.proof_height !== undefined && object.proof_height !== null) {
      message.proofHeight = Height.fromAmino(object.proof_height);
    }
    return message;
  },
  toAmino(message: QueryPacketCommitmentResponse): QueryPacketCommitmentResponseAmino {
    const obj: any = {};
    obj.commitment = message.commitment ? base64FromBytes(message.commitment) : undefined;
    obj.proof = message.proof ? base64FromBytes(message.proof) : undefined;
    obj.proof_height = message.proofHeight ? Height.toAmino(message.proofHeight) : {};
    return obj;
  },
  fromAminoMsg(object: QueryPacketCommitmentResponseAminoMsg): QueryPacketCommitmentResponse {
    return QueryPacketCommitmentResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPacketCommitmentResponse): QueryPacketCommitmentResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryPacketCommitmentResponse",
      value: QueryPacketCommitmentResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPacketCommitmentResponseProtoMsg): QueryPacketCommitmentResponse {
    return QueryPacketCommitmentResponse.decode(message.value);
  },
  toProto(message: QueryPacketCommitmentResponse): Uint8Array {
    return QueryPacketCommitmentResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPacketCommitmentResponse): QueryPacketCommitmentResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentResponse",
      value: QueryPacketCommitmentResponse.encode(message).finish()
    };
  }
};
function createBaseQueryPacketCommitmentsRequest(): QueryPacketCommitmentsRequest {
  return {
    portId: "",
    channelId: "",
    pagination: undefined
  };
}
export const QueryPacketCommitmentsRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentsRequest",
  encode(message: QueryPacketCommitmentsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPacketCommitmentsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPacketCommitmentsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        case 3:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPacketCommitmentsRequest>): QueryPacketCommitmentsRequest {
    const message = createBaseQueryPacketCommitmentsRequest();
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryPacketCommitmentsRequestAmino): QueryPacketCommitmentsRequest {
    const message = createBaseQueryPacketCommitmentsRequest();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryPacketCommitmentsRequest): QueryPacketCommitmentsRequestAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPacketCommitmentsRequestAminoMsg): QueryPacketCommitmentsRequest {
    return QueryPacketCommitmentsRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPacketCommitmentsRequest): QueryPacketCommitmentsRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryPacketCommitmentsRequest",
      value: QueryPacketCommitmentsRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPacketCommitmentsRequestProtoMsg): QueryPacketCommitmentsRequest {
    return QueryPacketCommitmentsRequest.decode(message.value);
  },
  toProto(message: QueryPacketCommitmentsRequest): Uint8Array {
    return QueryPacketCommitmentsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPacketCommitmentsRequest): QueryPacketCommitmentsRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentsRequest",
      value: QueryPacketCommitmentsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryPacketCommitmentsResponse(): QueryPacketCommitmentsResponse {
  return {
    commitments: [],
    pagination: undefined,
    height: Height.fromPartial({})
  };
}
export const QueryPacketCommitmentsResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentsResponse",
  encode(message: QueryPacketCommitmentsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.commitments) {
      PacketState.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    if (message.height !== undefined) {
      Height.encode(message.height, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPacketCommitmentsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPacketCommitmentsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commitments.push(PacketState.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        case 3:
          message.height = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPacketCommitmentsResponse>): QueryPacketCommitmentsResponse {
    const message = createBaseQueryPacketCommitmentsResponse();
    message.commitments = object.commitments?.map(e => PacketState.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    message.height = object.height !== undefined && object.height !== null ? Height.fromPartial(object.height) : undefined;
    return message;
  },
  fromAmino(object: QueryPacketCommitmentsResponseAmino): QueryPacketCommitmentsResponse {
    const message = createBaseQueryPacketCommitmentsResponse();
    message.commitments = object.commitments?.map(e => PacketState.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Height.fromAmino(object.height);
    }
    return message;
  },
  toAmino(message: QueryPacketCommitmentsResponse): QueryPacketCommitmentsResponseAmino {
    const obj: any = {};
    if (message.commitments) {
      obj.commitments = message.commitments.map(e => e ? PacketState.toAmino(e) : undefined);
    } else {
      obj.commitments = message.commitments;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    obj.height = message.height ? Height.toAmino(message.height) : {};
    return obj;
  },
  fromAminoMsg(object: QueryPacketCommitmentsResponseAminoMsg): QueryPacketCommitmentsResponse {
    return QueryPacketCommitmentsResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPacketCommitmentsResponse): QueryPacketCommitmentsResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryPacketCommitmentsResponse",
      value: QueryPacketCommitmentsResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPacketCommitmentsResponseProtoMsg): QueryPacketCommitmentsResponse {
    return QueryPacketCommitmentsResponse.decode(message.value);
  },
  toProto(message: QueryPacketCommitmentsResponse): Uint8Array {
    return QueryPacketCommitmentsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPacketCommitmentsResponse): QueryPacketCommitmentsResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryPacketCommitmentsResponse",
      value: QueryPacketCommitmentsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryPacketReceiptRequest(): QueryPacketReceiptRequest {
  return {
    portId: "",
    channelId: "",
    sequence: BigInt(0)
  };
}
export const QueryPacketReceiptRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryPacketReceiptRequest",
  encode(message: QueryPacketReceiptRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    if (message.sequence !== BigInt(0)) {
      writer.uint32(24).uint64(message.sequence);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPacketReceiptRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPacketReceiptRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        case 3:
          message.sequence = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPacketReceiptRequest>): QueryPacketReceiptRequest {
    const message = createBaseQueryPacketReceiptRequest();
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    message.sequence = object.sequence !== undefined && object.sequence !== null ? BigInt(object.sequence.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryPacketReceiptRequestAmino): QueryPacketReceiptRequest {
    const message = createBaseQueryPacketReceiptRequest();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    if (object.sequence !== undefined && object.sequence !== null) {
      message.sequence = BigInt(object.sequence);
    }
    return message;
  },
  toAmino(message: QueryPacketReceiptRequest): QueryPacketReceiptRequestAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    obj.sequence = message.sequence !== BigInt(0) ? message.sequence.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPacketReceiptRequestAminoMsg): QueryPacketReceiptRequest {
    return QueryPacketReceiptRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPacketReceiptRequest): QueryPacketReceiptRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryPacketReceiptRequest",
      value: QueryPacketReceiptRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPacketReceiptRequestProtoMsg): QueryPacketReceiptRequest {
    return QueryPacketReceiptRequest.decode(message.value);
  },
  toProto(message: QueryPacketReceiptRequest): Uint8Array {
    return QueryPacketReceiptRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPacketReceiptRequest): QueryPacketReceiptRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryPacketReceiptRequest",
      value: QueryPacketReceiptRequest.encode(message).finish()
    };
  }
};
function createBaseQueryPacketReceiptResponse(): QueryPacketReceiptResponse {
  return {
    received: false,
    proof: new Uint8Array(),
    proofHeight: Height.fromPartial({})
  };
}
export const QueryPacketReceiptResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryPacketReceiptResponse",
  encode(message: QueryPacketReceiptResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.received === true) {
      writer.uint32(16).bool(message.received);
    }
    if (message.proof.length !== 0) {
      writer.uint32(26).bytes(message.proof);
    }
    if (message.proofHeight !== undefined) {
      Height.encode(message.proofHeight, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPacketReceiptResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPacketReceiptResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.received = reader.bool();
          break;
        case 3:
          message.proof = reader.bytes();
          break;
        case 4:
          message.proofHeight = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPacketReceiptResponse>): QueryPacketReceiptResponse {
    const message = createBaseQueryPacketReceiptResponse();
    message.received = object.received ?? false;
    message.proof = object.proof ?? new Uint8Array();
    message.proofHeight = object.proofHeight !== undefined && object.proofHeight !== null ? Height.fromPartial(object.proofHeight) : undefined;
    return message;
  },
  fromAmino(object: QueryPacketReceiptResponseAmino): QueryPacketReceiptResponse {
    const message = createBaseQueryPacketReceiptResponse();
    if (object.received !== undefined && object.received !== null) {
      message.received = object.received;
    }
    if (object.proof !== undefined && object.proof !== null) {
      message.proof = bytesFromBase64(object.proof);
    }
    if (object.proof_height !== undefined && object.proof_height !== null) {
      message.proofHeight = Height.fromAmino(object.proof_height);
    }
    return message;
  },
  toAmino(message: QueryPacketReceiptResponse): QueryPacketReceiptResponseAmino {
    const obj: any = {};
    obj.received = message.received === false ? undefined : message.received;
    obj.proof = message.proof ? base64FromBytes(message.proof) : undefined;
    obj.proof_height = message.proofHeight ? Height.toAmino(message.proofHeight) : {};
    return obj;
  },
  fromAminoMsg(object: QueryPacketReceiptResponseAminoMsg): QueryPacketReceiptResponse {
    return QueryPacketReceiptResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPacketReceiptResponse): QueryPacketReceiptResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryPacketReceiptResponse",
      value: QueryPacketReceiptResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPacketReceiptResponseProtoMsg): QueryPacketReceiptResponse {
    return QueryPacketReceiptResponse.decode(message.value);
  },
  toProto(message: QueryPacketReceiptResponse): Uint8Array {
    return QueryPacketReceiptResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPacketReceiptResponse): QueryPacketReceiptResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryPacketReceiptResponse",
      value: QueryPacketReceiptResponse.encode(message).finish()
    };
  }
};
function createBaseQueryPacketAcknowledgementRequest(): QueryPacketAcknowledgementRequest {
  return {
    portId: "",
    channelId: "",
    sequence: BigInt(0)
  };
}
export const QueryPacketAcknowledgementRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementRequest",
  encode(message: QueryPacketAcknowledgementRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    if (message.sequence !== BigInt(0)) {
      writer.uint32(24).uint64(message.sequence);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPacketAcknowledgementRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPacketAcknowledgementRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        case 3:
          message.sequence = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPacketAcknowledgementRequest>): QueryPacketAcknowledgementRequest {
    const message = createBaseQueryPacketAcknowledgementRequest();
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    message.sequence = object.sequence !== undefined && object.sequence !== null ? BigInt(object.sequence.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryPacketAcknowledgementRequestAmino): QueryPacketAcknowledgementRequest {
    const message = createBaseQueryPacketAcknowledgementRequest();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    if (object.sequence !== undefined && object.sequence !== null) {
      message.sequence = BigInt(object.sequence);
    }
    return message;
  },
  toAmino(message: QueryPacketAcknowledgementRequest): QueryPacketAcknowledgementRequestAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    obj.sequence = message.sequence !== BigInt(0) ? message.sequence.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPacketAcknowledgementRequestAminoMsg): QueryPacketAcknowledgementRequest {
    return QueryPacketAcknowledgementRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPacketAcknowledgementRequest): QueryPacketAcknowledgementRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryPacketAcknowledgementRequest",
      value: QueryPacketAcknowledgementRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPacketAcknowledgementRequestProtoMsg): QueryPacketAcknowledgementRequest {
    return QueryPacketAcknowledgementRequest.decode(message.value);
  },
  toProto(message: QueryPacketAcknowledgementRequest): Uint8Array {
    return QueryPacketAcknowledgementRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPacketAcknowledgementRequest): QueryPacketAcknowledgementRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementRequest",
      value: QueryPacketAcknowledgementRequest.encode(message).finish()
    };
  }
};
function createBaseQueryPacketAcknowledgementResponse(): QueryPacketAcknowledgementResponse {
  return {
    acknowledgement: new Uint8Array(),
    proof: new Uint8Array(),
    proofHeight: Height.fromPartial({})
  };
}
export const QueryPacketAcknowledgementResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementResponse",
  encode(message: QueryPacketAcknowledgementResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.acknowledgement.length !== 0) {
      writer.uint32(10).bytes(message.acknowledgement);
    }
    if (message.proof.length !== 0) {
      writer.uint32(18).bytes(message.proof);
    }
    if (message.proofHeight !== undefined) {
      Height.encode(message.proofHeight, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPacketAcknowledgementResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPacketAcknowledgementResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.acknowledgement = reader.bytes();
          break;
        case 2:
          message.proof = reader.bytes();
          break;
        case 3:
          message.proofHeight = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPacketAcknowledgementResponse>): QueryPacketAcknowledgementResponse {
    const message = createBaseQueryPacketAcknowledgementResponse();
    message.acknowledgement = object.acknowledgement ?? new Uint8Array();
    message.proof = object.proof ?? new Uint8Array();
    message.proofHeight = object.proofHeight !== undefined && object.proofHeight !== null ? Height.fromPartial(object.proofHeight) : undefined;
    return message;
  },
  fromAmino(object: QueryPacketAcknowledgementResponseAmino): QueryPacketAcknowledgementResponse {
    const message = createBaseQueryPacketAcknowledgementResponse();
    if (object.acknowledgement !== undefined && object.acknowledgement !== null) {
      message.acknowledgement = bytesFromBase64(object.acknowledgement);
    }
    if (object.proof !== undefined && object.proof !== null) {
      message.proof = bytesFromBase64(object.proof);
    }
    if (object.proof_height !== undefined && object.proof_height !== null) {
      message.proofHeight = Height.fromAmino(object.proof_height);
    }
    return message;
  },
  toAmino(message: QueryPacketAcknowledgementResponse): QueryPacketAcknowledgementResponseAmino {
    const obj: any = {};
    obj.acknowledgement = message.acknowledgement ? base64FromBytes(message.acknowledgement) : undefined;
    obj.proof = message.proof ? base64FromBytes(message.proof) : undefined;
    obj.proof_height = message.proofHeight ? Height.toAmino(message.proofHeight) : {};
    return obj;
  },
  fromAminoMsg(object: QueryPacketAcknowledgementResponseAminoMsg): QueryPacketAcknowledgementResponse {
    return QueryPacketAcknowledgementResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPacketAcknowledgementResponse): QueryPacketAcknowledgementResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryPacketAcknowledgementResponse",
      value: QueryPacketAcknowledgementResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPacketAcknowledgementResponseProtoMsg): QueryPacketAcknowledgementResponse {
    return QueryPacketAcknowledgementResponse.decode(message.value);
  },
  toProto(message: QueryPacketAcknowledgementResponse): Uint8Array {
    return QueryPacketAcknowledgementResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPacketAcknowledgementResponse): QueryPacketAcknowledgementResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementResponse",
      value: QueryPacketAcknowledgementResponse.encode(message).finish()
    };
  }
};
function createBaseQueryPacketAcknowledgementsRequest(): QueryPacketAcknowledgementsRequest {
  return {
    portId: "",
    channelId: "",
    pagination: undefined,
    packetCommitmentSequences: []
  };
}
export const QueryPacketAcknowledgementsRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementsRequest",
  encode(message: QueryPacketAcknowledgementsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(26).fork()).ldelim();
    }
    writer.uint32(34).fork();
    for (const v of message.packetCommitmentSequences) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPacketAcknowledgementsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPacketAcknowledgementsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        case 3:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        case 4:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.packetCommitmentSequences.push(reader.uint64());
            }
          } else {
            message.packetCommitmentSequences.push(reader.uint64());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPacketAcknowledgementsRequest>): QueryPacketAcknowledgementsRequest {
    const message = createBaseQueryPacketAcknowledgementsRequest();
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    message.packetCommitmentSequences = object.packetCommitmentSequences?.map(e => BigInt(e.toString())) || [];
    return message;
  },
  fromAmino(object: QueryPacketAcknowledgementsRequestAmino): QueryPacketAcknowledgementsRequest {
    const message = createBaseQueryPacketAcknowledgementsRequest();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    message.packetCommitmentSequences = object.packet_commitment_sequences?.map(e => BigInt(e)) || [];
    return message;
  },
  toAmino(message: QueryPacketAcknowledgementsRequest): QueryPacketAcknowledgementsRequestAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    if (message.packetCommitmentSequences) {
      obj.packet_commitment_sequences = message.packetCommitmentSequences.map(e => e.toString());
    } else {
      obj.packet_commitment_sequences = message.packetCommitmentSequences;
    }
    return obj;
  },
  fromAminoMsg(object: QueryPacketAcknowledgementsRequestAminoMsg): QueryPacketAcknowledgementsRequest {
    return QueryPacketAcknowledgementsRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPacketAcknowledgementsRequest): QueryPacketAcknowledgementsRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryPacketAcknowledgementsRequest",
      value: QueryPacketAcknowledgementsRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPacketAcknowledgementsRequestProtoMsg): QueryPacketAcknowledgementsRequest {
    return QueryPacketAcknowledgementsRequest.decode(message.value);
  },
  toProto(message: QueryPacketAcknowledgementsRequest): Uint8Array {
    return QueryPacketAcknowledgementsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPacketAcknowledgementsRequest): QueryPacketAcknowledgementsRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementsRequest",
      value: QueryPacketAcknowledgementsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryPacketAcknowledgementsResponse(): QueryPacketAcknowledgementsResponse {
  return {
    acknowledgements: [],
    pagination: undefined,
    height: Height.fromPartial({})
  };
}
export const QueryPacketAcknowledgementsResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementsResponse",
  encode(message: QueryPacketAcknowledgementsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.acknowledgements) {
      PacketState.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    if (message.height !== undefined) {
      Height.encode(message.height, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPacketAcknowledgementsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPacketAcknowledgementsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.acknowledgements.push(PacketState.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        case 3:
          message.height = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPacketAcknowledgementsResponse>): QueryPacketAcknowledgementsResponse {
    const message = createBaseQueryPacketAcknowledgementsResponse();
    message.acknowledgements = object.acknowledgements?.map(e => PacketState.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    message.height = object.height !== undefined && object.height !== null ? Height.fromPartial(object.height) : undefined;
    return message;
  },
  fromAmino(object: QueryPacketAcknowledgementsResponseAmino): QueryPacketAcknowledgementsResponse {
    const message = createBaseQueryPacketAcknowledgementsResponse();
    message.acknowledgements = object.acknowledgements?.map(e => PacketState.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Height.fromAmino(object.height);
    }
    return message;
  },
  toAmino(message: QueryPacketAcknowledgementsResponse): QueryPacketAcknowledgementsResponseAmino {
    const obj: any = {};
    if (message.acknowledgements) {
      obj.acknowledgements = message.acknowledgements.map(e => e ? PacketState.toAmino(e) : undefined);
    } else {
      obj.acknowledgements = message.acknowledgements;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    obj.height = message.height ? Height.toAmino(message.height) : {};
    return obj;
  },
  fromAminoMsg(object: QueryPacketAcknowledgementsResponseAminoMsg): QueryPacketAcknowledgementsResponse {
    return QueryPacketAcknowledgementsResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPacketAcknowledgementsResponse): QueryPacketAcknowledgementsResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryPacketAcknowledgementsResponse",
      value: QueryPacketAcknowledgementsResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPacketAcknowledgementsResponseProtoMsg): QueryPacketAcknowledgementsResponse {
    return QueryPacketAcknowledgementsResponse.decode(message.value);
  },
  toProto(message: QueryPacketAcknowledgementsResponse): Uint8Array {
    return QueryPacketAcknowledgementsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPacketAcknowledgementsResponse): QueryPacketAcknowledgementsResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryPacketAcknowledgementsResponse",
      value: QueryPacketAcknowledgementsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryUnreceivedPacketsRequest(): QueryUnreceivedPacketsRequest {
  return {
    portId: "",
    channelId: "",
    packetCommitmentSequences: []
  };
}
export const QueryUnreceivedPacketsRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryUnreceivedPacketsRequest",
  encode(message: QueryUnreceivedPacketsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    writer.uint32(26).fork();
    for (const v of message.packetCommitmentSequences) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryUnreceivedPacketsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryUnreceivedPacketsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.packetCommitmentSequences.push(reader.uint64());
            }
          } else {
            message.packetCommitmentSequences.push(reader.uint64());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryUnreceivedPacketsRequest>): QueryUnreceivedPacketsRequest {
    const message = createBaseQueryUnreceivedPacketsRequest();
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    message.packetCommitmentSequences = object.packetCommitmentSequences?.map(e => BigInt(e.toString())) || [];
    return message;
  },
  fromAmino(object: QueryUnreceivedPacketsRequestAmino): QueryUnreceivedPacketsRequest {
    const message = createBaseQueryUnreceivedPacketsRequest();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    message.packetCommitmentSequences = object.packet_commitment_sequences?.map(e => BigInt(e)) || [];
    return message;
  },
  toAmino(message: QueryUnreceivedPacketsRequest): QueryUnreceivedPacketsRequestAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    if (message.packetCommitmentSequences) {
      obj.packet_commitment_sequences = message.packetCommitmentSequences.map(e => e.toString());
    } else {
      obj.packet_commitment_sequences = message.packetCommitmentSequences;
    }
    return obj;
  },
  fromAminoMsg(object: QueryUnreceivedPacketsRequestAminoMsg): QueryUnreceivedPacketsRequest {
    return QueryUnreceivedPacketsRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryUnreceivedPacketsRequest): QueryUnreceivedPacketsRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryUnreceivedPacketsRequest",
      value: QueryUnreceivedPacketsRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryUnreceivedPacketsRequestProtoMsg): QueryUnreceivedPacketsRequest {
    return QueryUnreceivedPacketsRequest.decode(message.value);
  },
  toProto(message: QueryUnreceivedPacketsRequest): Uint8Array {
    return QueryUnreceivedPacketsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryUnreceivedPacketsRequest): QueryUnreceivedPacketsRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryUnreceivedPacketsRequest",
      value: QueryUnreceivedPacketsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryUnreceivedPacketsResponse(): QueryUnreceivedPacketsResponse {
  return {
    sequences: [],
    height: Height.fromPartial({})
  };
}
export const QueryUnreceivedPacketsResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryUnreceivedPacketsResponse",
  encode(message: QueryUnreceivedPacketsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.sequences) {
      writer.uint64(v);
    }
    writer.ldelim();
    if (message.height !== undefined) {
      Height.encode(message.height, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryUnreceivedPacketsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryUnreceivedPacketsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.sequences.push(reader.uint64());
            }
          } else {
            message.sequences.push(reader.uint64());
          }
          break;
        case 2:
          message.height = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryUnreceivedPacketsResponse>): QueryUnreceivedPacketsResponse {
    const message = createBaseQueryUnreceivedPacketsResponse();
    message.sequences = object.sequences?.map(e => BigInt(e.toString())) || [];
    message.height = object.height !== undefined && object.height !== null ? Height.fromPartial(object.height) : undefined;
    return message;
  },
  fromAmino(object: QueryUnreceivedPacketsResponseAmino): QueryUnreceivedPacketsResponse {
    const message = createBaseQueryUnreceivedPacketsResponse();
    message.sequences = object.sequences?.map(e => BigInt(e)) || [];
    if (object.height !== undefined && object.height !== null) {
      message.height = Height.fromAmino(object.height);
    }
    return message;
  },
  toAmino(message: QueryUnreceivedPacketsResponse): QueryUnreceivedPacketsResponseAmino {
    const obj: any = {};
    if (message.sequences) {
      obj.sequences = message.sequences.map(e => e.toString());
    } else {
      obj.sequences = message.sequences;
    }
    obj.height = message.height ? Height.toAmino(message.height) : {};
    return obj;
  },
  fromAminoMsg(object: QueryUnreceivedPacketsResponseAminoMsg): QueryUnreceivedPacketsResponse {
    return QueryUnreceivedPacketsResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryUnreceivedPacketsResponse): QueryUnreceivedPacketsResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryUnreceivedPacketsResponse",
      value: QueryUnreceivedPacketsResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryUnreceivedPacketsResponseProtoMsg): QueryUnreceivedPacketsResponse {
    return QueryUnreceivedPacketsResponse.decode(message.value);
  },
  toProto(message: QueryUnreceivedPacketsResponse): Uint8Array {
    return QueryUnreceivedPacketsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryUnreceivedPacketsResponse): QueryUnreceivedPacketsResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryUnreceivedPacketsResponse",
      value: QueryUnreceivedPacketsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryUnreceivedAcksRequest(): QueryUnreceivedAcksRequest {
  return {
    portId: "",
    channelId: "",
    packetAckSequences: []
  };
}
export const QueryUnreceivedAcksRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryUnreceivedAcksRequest",
  encode(message: QueryUnreceivedAcksRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    writer.uint32(26).fork();
    for (const v of message.packetAckSequences) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryUnreceivedAcksRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryUnreceivedAcksRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.packetAckSequences.push(reader.uint64());
            }
          } else {
            message.packetAckSequences.push(reader.uint64());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryUnreceivedAcksRequest>): QueryUnreceivedAcksRequest {
    const message = createBaseQueryUnreceivedAcksRequest();
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    message.packetAckSequences = object.packetAckSequences?.map(e => BigInt(e.toString())) || [];
    return message;
  },
  fromAmino(object: QueryUnreceivedAcksRequestAmino): QueryUnreceivedAcksRequest {
    const message = createBaseQueryUnreceivedAcksRequest();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    message.packetAckSequences = object.packet_ack_sequences?.map(e => BigInt(e)) || [];
    return message;
  },
  toAmino(message: QueryUnreceivedAcksRequest): QueryUnreceivedAcksRequestAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    if (message.packetAckSequences) {
      obj.packet_ack_sequences = message.packetAckSequences.map(e => e.toString());
    } else {
      obj.packet_ack_sequences = message.packetAckSequences;
    }
    return obj;
  },
  fromAminoMsg(object: QueryUnreceivedAcksRequestAminoMsg): QueryUnreceivedAcksRequest {
    return QueryUnreceivedAcksRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryUnreceivedAcksRequest): QueryUnreceivedAcksRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryUnreceivedAcksRequest",
      value: QueryUnreceivedAcksRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryUnreceivedAcksRequestProtoMsg): QueryUnreceivedAcksRequest {
    return QueryUnreceivedAcksRequest.decode(message.value);
  },
  toProto(message: QueryUnreceivedAcksRequest): Uint8Array {
    return QueryUnreceivedAcksRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryUnreceivedAcksRequest): QueryUnreceivedAcksRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryUnreceivedAcksRequest",
      value: QueryUnreceivedAcksRequest.encode(message).finish()
    };
  }
};
function createBaseQueryUnreceivedAcksResponse(): QueryUnreceivedAcksResponse {
  return {
    sequences: [],
    height: Height.fromPartial({})
  };
}
export const QueryUnreceivedAcksResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryUnreceivedAcksResponse",
  encode(message: QueryUnreceivedAcksResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.sequences) {
      writer.uint64(v);
    }
    writer.ldelim();
    if (message.height !== undefined) {
      Height.encode(message.height, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryUnreceivedAcksResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryUnreceivedAcksResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.sequences.push(reader.uint64());
            }
          } else {
            message.sequences.push(reader.uint64());
          }
          break;
        case 2:
          message.height = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryUnreceivedAcksResponse>): QueryUnreceivedAcksResponse {
    const message = createBaseQueryUnreceivedAcksResponse();
    message.sequences = object.sequences?.map(e => BigInt(e.toString())) || [];
    message.height = object.height !== undefined && object.height !== null ? Height.fromPartial(object.height) : undefined;
    return message;
  },
  fromAmino(object: QueryUnreceivedAcksResponseAmino): QueryUnreceivedAcksResponse {
    const message = createBaseQueryUnreceivedAcksResponse();
    message.sequences = object.sequences?.map(e => BigInt(e)) || [];
    if (object.height !== undefined && object.height !== null) {
      message.height = Height.fromAmino(object.height);
    }
    return message;
  },
  toAmino(message: QueryUnreceivedAcksResponse): QueryUnreceivedAcksResponseAmino {
    const obj: any = {};
    if (message.sequences) {
      obj.sequences = message.sequences.map(e => e.toString());
    } else {
      obj.sequences = message.sequences;
    }
    obj.height = message.height ? Height.toAmino(message.height) : {};
    return obj;
  },
  fromAminoMsg(object: QueryUnreceivedAcksResponseAminoMsg): QueryUnreceivedAcksResponse {
    return QueryUnreceivedAcksResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryUnreceivedAcksResponse): QueryUnreceivedAcksResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryUnreceivedAcksResponse",
      value: QueryUnreceivedAcksResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryUnreceivedAcksResponseProtoMsg): QueryUnreceivedAcksResponse {
    return QueryUnreceivedAcksResponse.decode(message.value);
  },
  toProto(message: QueryUnreceivedAcksResponse): Uint8Array {
    return QueryUnreceivedAcksResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryUnreceivedAcksResponse): QueryUnreceivedAcksResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryUnreceivedAcksResponse",
      value: QueryUnreceivedAcksResponse.encode(message).finish()
    };
  }
};
function createBaseQueryNextSequenceReceiveRequest(): QueryNextSequenceReceiveRequest {
  return {
    portId: "",
    channelId: ""
  };
}
export const QueryNextSequenceReceiveRequest = {
  typeUrl: "/ibc.core.channel.v1.QueryNextSequenceReceiveRequest",
  encode(message: QueryNextSequenceReceiveRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.portId !== "") {
      writer.uint32(10).string(message.portId);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNextSequenceReceiveRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNextSequenceReceiveRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryNextSequenceReceiveRequest>): QueryNextSequenceReceiveRequest {
    const message = createBaseQueryNextSequenceReceiveRequest();
    message.portId = object.portId ?? "";
    message.channelId = object.channelId ?? "";
    return message;
  },
  fromAmino(object: QueryNextSequenceReceiveRequestAmino): QueryNextSequenceReceiveRequest {
    const message = createBaseQueryNextSequenceReceiveRequest();
    if (object.port_id !== undefined && object.port_id !== null) {
      message.portId = object.port_id;
    }
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    return message;
  },
  toAmino(message: QueryNextSequenceReceiveRequest): QueryNextSequenceReceiveRequestAmino {
    const obj: any = {};
    obj.port_id = message.portId === "" ? undefined : message.portId;
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    return obj;
  },
  fromAminoMsg(object: QueryNextSequenceReceiveRequestAminoMsg): QueryNextSequenceReceiveRequest {
    return QueryNextSequenceReceiveRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryNextSequenceReceiveRequest): QueryNextSequenceReceiveRequestAminoMsg {
    return {
      type: "cosmos-sdk/QueryNextSequenceReceiveRequest",
      value: QueryNextSequenceReceiveRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryNextSequenceReceiveRequestProtoMsg): QueryNextSequenceReceiveRequest {
    return QueryNextSequenceReceiveRequest.decode(message.value);
  },
  toProto(message: QueryNextSequenceReceiveRequest): Uint8Array {
    return QueryNextSequenceReceiveRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryNextSequenceReceiveRequest): QueryNextSequenceReceiveRequestProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryNextSequenceReceiveRequest",
      value: QueryNextSequenceReceiveRequest.encode(message).finish()
    };
  }
};
function createBaseQueryNextSequenceReceiveResponse(): QueryNextSequenceReceiveResponse {
  return {
    nextSequenceReceive: BigInt(0),
    proof: new Uint8Array(),
    proofHeight: Height.fromPartial({})
  };
}
export const QueryNextSequenceReceiveResponse = {
  typeUrl: "/ibc.core.channel.v1.QueryNextSequenceReceiveResponse",
  encode(message: QueryNextSequenceReceiveResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.nextSequenceReceive !== BigInt(0)) {
      writer.uint32(8).uint64(message.nextSequenceReceive);
    }
    if (message.proof.length !== 0) {
      writer.uint32(18).bytes(message.proof);
    }
    if (message.proofHeight !== undefined) {
      Height.encode(message.proofHeight, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNextSequenceReceiveResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNextSequenceReceiveResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nextSequenceReceive = reader.uint64();
          break;
        case 2:
          message.proof = reader.bytes();
          break;
        case 3:
          message.proofHeight = Height.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryNextSequenceReceiveResponse>): QueryNextSequenceReceiveResponse {
    const message = createBaseQueryNextSequenceReceiveResponse();
    message.nextSequenceReceive = object.nextSequenceReceive !== undefined && object.nextSequenceReceive !== null ? BigInt(object.nextSequenceReceive.toString()) : BigInt(0);
    message.proof = object.proof ?? new Uint8Array();
    message.proofHeight = object.proofHeight !== undefined && object.proofHeight !== null ? Height.fromPartial(object.proofHeight) : undefined;
    return message;
  },
  fromAmino(object: QueryNextSequenceReceiveResponseAmino): QueryNextSequenceReceiveResponse {
    const message = createBaseQueryNextSequenceReceiveResponse();
    if (object.next_sequence_receive !== undefined && object.next_sequence_receive !== null) {
      message.nextSequenceReceive = BigInt(object.next_sequence_receive);
    }
    if (object.proof !== undefined && object.proof !== null) {
      message.proof = bytesFromBase64(object.proof);
    }
    if (object.proof_height !== undefined && object.proof_height !== null) {
      message.proofHeight = Height.fromAmino(object.proof_height);
    }
    return message;
  },
  toAmino(message: QueryNextSequenceReceiveResponse): QueryNextSequenceReceiveResponseAmino {
    const obj: any = {};
    obj.next_sequence_receive = message.nextSequenceReceive !== BigInt(0) ? message.nextSequenceReceive.toString() : undefined;
    obj.proof = message.proof ? base64FromBytes(message.proof) : undefined;
    obj.proof_height = message.proofHeight ? Height.toAmino(message.proofHeight) : {};
    return obj;
  },
  fromAminoMsg(object: QueryNextSequenceReceiveResponseAminoMsg): QueryNextSequenceReceiveResponse {
    return QueryNextSequenceReceiveResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryNextSequenceReceiveResponse): QueryNextSequenceReceiveResponseAminoMsg {
    return {
      type: "cosmos-sdk/QueryNextSequenceReceiveResponse",
      value: QueryNextSequenceReceiveResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryNextSequenceReceiveResponseProtoMsg): QueryNextSequenceReceiveResponse {
    return QueryNextSequenceReceiveResponse.decode(message.value);
  },
  toProto(message: QueryNextSequenceReceiveResponse): Uint8Array {
    return QueryNextSequenceReceiveResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryNextSequenceReceiveResponse): QueryNextSequenceReceiveResponseProtoMsg {
    return {
      typeUrl: "/ibc.core.channel.v1.QueryNextSequenceReceiveResponse",
      value: QueryNextSequenceReceiveResponse.encode(message).finish()
    };
  }
};