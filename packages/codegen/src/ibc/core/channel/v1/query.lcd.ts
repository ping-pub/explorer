import { setPaginationParams } from "../../../../helpers";
import { LCDClient } from "@osmonauts/lcd";
import { QueryChannelRequest, QueryChannelResponseSDKType, QueryChannelsRequest, QueryChannelsResponseSDKType, QueryConnectionChannelsRequest, QueryConnectionChannelsResponseSDKType, QueryChannelClientStateRequest, QueryChannelClientStateResponseSDKType, QueryChannelConsensusStateRequest, QueryChannelConsensusStateResponseSDKType, QueryPacketCommitmentRequest, QueryPacketCommitmentResponseSDKType, QueryPacketCommitmentsRequest, QueryPacketCommitmentsResponseSDKType, QueryPacketReceiptRequest, QueryPacketReceiptResponseSDKType, QueryPacketAcknowledgementRequest, QueryPacketAcknowledgementResponseSDKType, QueryPacketAcknowledgementsRequest, QueryPacketAcknowledgementsResponseSDKType, QueryUnreceivedPacketsRequest, QueryUnreceivedPacketsResponseSDKType, QueryUnreceivedAcksRequest, QueryUnreceivedAcksResponseSDKType, QueryNextSequenceReceiveRequest, QueryNextSequenceReceiveResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;

  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.channel = this.channel.bind(this);
    this.channels = this.channels.bind(this);
    this.connectionChannels = this.connectionChannels.bind(this);
    this.channelClientState = this.channelClientState.bind(this);
    this.channelConsensusState = this.channelConsensusState.bind(this);
    this.packetCommitment = this.packetCommitment.bind(this);
    this.packetCommitments = this.packetCommitments.bind(this);
    this.packetReceipt = this.packetReceipt.bind(this);
    this.packetAcknowledgement = this.packetAcknowledgement.bind(this);
    this.packetAcknowledgements = this.packetAcknowledgements.bind(this);
    this.unreceivedPackets = this.unreceivedPackets.bind(this);
    this.unreceivedAcks = this.unreceivedAcks.bind(this);
    this.nextSequenceReceive = this.nextSequenceReceive.bind(this);
  }
  /* Channel queries an IBC Channel. */


  async channel(params: QueryChannelRequest): Promise<QueryChannelResponseSDKType> {
    const endpoint = `ibc/core/channel/v1/channels/${params.channelId}/ports/${params.portId}`;
    return await this.req.get<QueryChannelResponseSDKType>(endpoint);
  }
  /* Channels queries all the IBC channels of a chain. */


  async channels(params: QueryChannelsRequest = {
    pagination: undefined
  }): Promise<QueryChannelsResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }

    const endpoint = `ibc/core/channel/v1/channels`;
    return await this.req.get<QueryChannelsResponseSDKType>(endpoint, options);
  }
  /* ConnectionChannels queries all the channels associated with a connection
   end. */


  async connectionChannels(params: QueryConnectionChannelsRequest): Promise<QueryConnectionChannelsResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }

    const endpoint = `ibc/core/channel/v1/connections/${params.connection}/channels`;
    return await this.req.get<QueryConnectionChannelsResponseSDKType>(endpoint, options);
  }
  /* ChannelClientState queries for the client state for the channel associated
   with the provided channel identifiers. */


  async channelClientState(params: QueryChannelClientStateRequest): Promise<QueryChannelClientStateResponseSDKType> {
    const endpoint = `ibc/core/channel/v1/channels/${params.channelId}/ports/${params.portId}/client_state`;
    return await this.req.get<QueryChannelClientStateResponseSDKType>(endpoint);
  }
  /* ChannelConsensusState queries for the consensus state for the channel
   associated with the provided channel identifiers. */


  async channelConsensusState(params: QueryChannelConsensusStateRequest): Promise<QueryChannelConsensusStateResponseSDKType> {
    const endpoint = `ibc/core/channel/v1/channels/${params.channelId}/ports/${params.portId}/consensus_state/revision/${params.revisionNumber}/height/${params.revisionHeight}`;
    return await this.req.get<QueryChannelConsensusStateResponseSDKType>(endpoint);
  }
  /* PacketCommitment queries a stored packet commitment hash. */


  async packetCommitment(params: QueryPacketCommitmentRequest): Promise<QueryPacketCommitmentResponseSDKType> {
    const endpoint = `ibc/core/channel/v1/channels/${params.channelId}/ports/${params.portId}/packet_commitments/${params.sequence}`;
    return await this.req.get<QueryPacketCommitmentResponseSDKType>(endpoint);
  }
  /* PacketCommitments returns all the packet commitments hashes associated
   with a channel. */


  async packetCommitments(params: QueryPacketCommitmentsRequest): Promise<QueryPacketCommitmentsResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }

    const endpoint = `ibc/core/channel/v1/channels/${params.channelId}/ports/${params.portId}/packet_commitments`;
    return await this.req.get<QueryPacketCommitmentsResponseSDKType>(endpoint, options);
  }
  /* PacketReceipt queries if a given packet sequence has been received on the
   queried chain */


  async packetReceipt(params: QueryPacketReceiptRequest): Promise<QueryPacketReceiptResponseSDKType> {
    const endpoint = `ibc/core/channel/v1/channels/${params.channelId}/ports/${params.portId}/packet_receipts/${params.sequence}`;
    return await this.req.get<QueryPacketReceiptResponseSDKType>(endpoint);
  }
  /* PacketAcknowledgement queries a stored packet acknowledgement hash. */


  async packetAcknowledgement(params: QueryPacketAcknowledgementRequest): Promise<QueryPacketAcknowledgementResponseSDKType> {
    const endpoint = `ibc/core/channel/v1/channels/${params.channelId}/ports/${params.portId}/packet_acks/${params.sequence}`;
    return await this.req.get<QueryPacketAcknowledgementResponseSDKType>(endpoint);
  }
  /* PacketAcknowledgements returns all the packet acknowledgements associated
   with a channel. */


  async packetAcknowledgements(params: QueryPacketAcknowledgementsRequest): Promise<QueryPacketAcknowledgementsResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }

    if (typeof params?.packetCommitmentSequences !== "undefined") {
      options.params.packet_commitment_sequences = params.packetCommitmentSequences;
    }

    const endpoint = `ibc/core/channel/v1/channels/${params.channelId}/ports/${params.portId}/packet_acknowledgements`;
    return await this.req.get<QueryPacketAcknowledgementsResponseSDKType>(endpoint, options);
  }
  /* UnreceivedPackets returns all the unreceived IBC packets associated with a
   channel and sequences. */


  async unreceivedPackets(params: QueryUnreceivedPacketsRequest): Promise<QueryUnreceivedPacketsResponseSDKType> {
    const endpoint = `ibc/core/channel/v1/channels/${params.channelId}/ports/${params.portId}/packet_commitments/${params.packetCommitmentSequences}/unreceived_packets`;
    return await this.req.get<QueryUnreceivedPacketsResponseSDKType>(endpoint);
  }
  /* UnreceivedAcks returns all the unreceived IBC acknowledgements associated
   with a channel and sequences. */


  async unreceivedAcks(params: QueryUnreceivedAcksRequest): Promise<QueryUnreceivedAcksResponseSDKType> {
    const endpoint = `ibc/core/channel/v1/channels/${params.channelId}/ports/${params.portId}/packet_commitments/${params.packetAckSequences}/unreceived_acks`;
    return await this.req.get<QueryUnreceivedAcksResponseSDKType>(endpoint);
  }
  /* NextSequenceReceive returns the next receive sequence for a given channel. */


  async nextSequenceReceive(params: QueryNextSequenceReceiveRequest): Promise<QueryNextSequenceReceiveResponseSDKType> {
    const endpoint = `ibc/core/channel/v1/channels/${params.channelId}/ports/${params.portId}/next_sequence`;
    return await this.req.get<QueryNextSequenceReceiveResponseSDKType>(endpoint);
  }

}