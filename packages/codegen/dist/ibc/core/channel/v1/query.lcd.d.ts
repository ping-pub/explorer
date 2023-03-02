import { LCDClient } from "@osmonauts/lcd";
import { QueryChannelRequest, QueryChannelResponseSDKType, QueryChannelsRequest, QueryChannelsResponseSDKType, QueryConnectionChannelsRequest, QueryConnectionChannelsResponseSDKType, QueryChannelClientStateRequest, QueryChannelClientStateResponseSDKType, QueryChannelConsensusStateRequest, QueryChannelConsensusStateResponseSDKType, QueryPacketCommitmentRequest, QueryPacketCommitmentResponseSDKType, QueryPacketCommitmentsRequest, QueryPacketCommitmentsResponseSDKType, QueryPacketReceiptRequest, QueryPacketReceiptResponseSDKType, QueryPacketAcknowledgementRequest, QueryPacketAcknowledgementResponseSDKType, QueryPacketAcknowledgementsRequest, QueryPacketAcknowledgementsResponseSDKType, QueryUnreceivedPacketsRequest, QueryUnreceivedPacketsResponseSDKType, QueryUnreceivedAcksRequest, QueryUnreceivedAcksResponseSDKType, QueryNextSequenceReceiveRequest, QueryNextSequenceReceiveResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    channel(params: QueryChannelRequest): Promise<QueryChannelResponseSDKType>;
    channels(params?: QueryChannelsRequest): Promise<QueryChannelsResponseSDKType>;
    connectionChannels(params: QueryConnectionChannelsRequest): Promise<QueryConnectionChannelsResponseSDKType>;
    channelClientState(params: QueryChannelClientStateRequest): Promise<QueryChannelClientStateResponseSDKType>;
    channelConsensusState(params: QueryChannelConsensusStateRequest): Promise<QueryChannelConsensusStateResponseSDKType>;
    packetCommitment(params: QueryPacketCommitmentRequest): Promise<QueryPacketCommitmentResponseSDKType>;
    packetCommitments(params: QueryPacketCommitmentsRequest): Promise<QueryPacketCommitmentsResponseSDKType>;
    packetReceipt(params: QueryPacketReceiptRequest): Promise<QueryPacketReceiptResponseSDKType>;
    packetAcknowledgement(params: QueryPacketAcknowledgementRequest): Promise<QueryPacketAcknowledgementResponseSDKType>;
    packetAcknowledgements(params: QueryPacketAcknowledgementsRequest): Promise<QueryPacketAcknowledgementsResponseSDKType>;
    unreceivedPackets(params: QueryUnreceivedPacketsRequest): Promise<QueryUnreceivedPacketsResponseSDKType>;
    unreceivedAcks(params: QueryUnreceivedAcksRequest): Promise<QueryUnreceivedAcksResponseSDKType>;
    nextSequenceReceive(params: QueryNextSequenceReceiveRequest): Promise<QueryNextSequenceReceiveResponseSDKType>;
}
