import { setPaginationParams } from "../../../../helpers";
import { LCDClient } from "@cosmology/lcd";
import { QueryIncentivizedPacketsRequest, QueryIncentivizedPacketsResponseSDKType, QueryIncentivizedPacketRequest, QueryIncentivizedPacketResponseSDKType, QueryIncentivizedPacketsForChannelRequest, QueryIncentivizedPacketsForChannelResponseSDKType, QueryTotalRecvFeesRequest, QueryTotalRecvFeesResponseSDKType, QueryTotalAckFeesRequest, QueryTotalAckFeesResponseSDKType, QueryTotalTimeoutFeesRequest, QueryTotalTimeoutFeesResponseSDKType, QueryPayeeRequest, QueryPayeeResponseSDKType, QueryCounterpartyPayeeRequest, QueryCounterpartyPayeeResponseSDKType, QueryFeeEnabledChannelsRequest, QueryFeeEnabledChannelsResponseSDKType, QueryFeeEnabledChannelRequest, QueryFeeEnabledChannelResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.incentivizedPackets = this.incentivizedPackets.bind(this);
    this.incentivizedPacket = this.incentivizedPacket.bind(this);
    this.incentivizedPacketsForChannel = this.incentivizedPacketsForChannel.bind(this);
    this.totalRecvFees = this.totalRecvFees.bind(this);
    this.totalAckFees = this.totalAckFees.bind(this);
    this.totalTimeoutFees = this.totalTimeoutFees.bind(this);
    this.payee = this.payee.bind(this);
    this.counterpartyPayee = this.counterpartyPayee.bind(this);
    this.feeEnabledChannels = this.feeEnabledChannels.bind(this);
    this.feeEnabledChannel = this.feeEnabledChannel.bind(this);
  }
  /* IncentivizedPackets returns all incentivized packets and their associated fees */
  async incentivizedPackets(params: QueryIncentivizedPacketsRequest): Promise<QueryIncentivizedPacketsResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    if (typeof params?.queryHeight !== "undefined") {
      options.params.query_height = params.queryHeight;
    }
    const endpoint = `ibc/apps/fee/v1/incentivized_packets`;
    return await this.req.get<QueryIncentivizedPacketsResponseSDKType>(endpoint, options);
  }
  /* IncentivizedPacket returns all packet fees for a packet given its identifier */
  async incentivizedPacket(params: QueryIncentivizedPacketRequest): Promise<QueryIncentivizedPacketResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.packetId !== "undefined") {
      options.params.packet_id = params.packetId;
    }
    if (typeof params?.queryHeight !== "undefined") {
      options.params.query_height = params.queryHeight;
    }
    const endpoint = `ibc/apps/fee/v1/channels/${params.packetId.channel_id}/ports/${params.packetId.port_id}/sequences/${params.packetId.sequence}/incentivized_packet`;
    return await this.req.get<QueryIncentivizedPacketResponseSDKType>(endpoint, options);
  }
  /* Gets all incentivized packets for a specific channel */
  async incentivizedPacketsForChannel(params: QueryIncentivizedPacketsForChannelRequest): Promise<QueryIncentivizedPacketsForChannelResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    if (typeof params?.queryHeight !== "undefined") {
      options.params.query_height = params.queryHeight;
    }
    const endpoint = `ibc/apps/fee/v1/channels/${params.channelId}/ports/${params.portId}/incentivized_packets`;
    return await this.req.get<QueryIncentivizedPacketsForChannelResponseSDKType>(endpoint, options);
  }
  /* TotalRecvFees returns the total receive fees for a packet given its identifier */
  async totalRecvFees(params: QueryTotalRecvFeesRequest): Promise<QueryTotalRecvFeesResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.packetId !== "undefined") {
      options.params.packet_id = params.packetId;
    }
    const endpoint = `ibc/apps/fee/v1/channels/${params.packetId.channel_id}/ports/${params.packetId.port_id}/sequences/${params.packetId.sequence}/total_recv_fees`;
    return await this.req.get<QueryTotalRecvFeesResponseSDKType>(endpoint, options);
  }
  /* TotalAckFees returns the total acknowledgement fees for a packet given its identifier */
  async totalAckFees(params: QueryTotalAckFeesRequest): Promise<QueryTotalAckFeesResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.packetId !== "undefined") {
      options.params.packet_id = params.packetId;
    }
    const endpoint = `ibc/apps/fee/v1/channels/${params.packetId.channel_id}/ports/${params.packetId.port_id}/sequences/${params.packetId.sequence}/total_ack_fees`;
    return await this.req.get<QueryTotalAckFeesResponseSDKType>(endpoint, options);
  }
  /* TotalTimeoutFees returns the total timeout fees for a packet given its identifier */
  async totalTimeoutFees(params: QueryTotalTimeoutFeesRequest): Promise<QueryTotalTimeoutFeesResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.packetId !== "undefined") {
      options.params.packet_id = params.packetId;
    }
    const endpoint = `ibc/apps/fee/v1/channels/${params.packetId.channel_id}/ports/${params.packetId.port_id}/sequences/${params.packetId.sequence}/total_timeout_fees`;
    return await this.req.get<QueryTotalTimeoutFeesResponseSDKType>(endpoint, options);
  }
  /* Payee returns the registered payee address for a specific channel given the relayer address */
  async payee(params: QueryPayeeRequest): Promise<QueryPayeeResponseSDKType> {
    const endpoint = `ibc/apps/fee/v1/channels/${params.channelId}/relayers/${params.relayer}/payee`;
    return await this.req.get<QueryPayeeResponseSDKType>(endpoint);
  }
  /* CounterpartyPayee returns the registered counterparty payee for forward relaying */
  async counterpartyPayee(params: QueryCounterpartyPayeeRequest): Promise<QueryCounterpartyPayeeResponseSDKType> {
    const endpoint = `ibc/apps/fee/v1/channels/${params.channelId}/relayers/${params.relayer}/counterparty_payee`;
    return await this.req.get<QueryCounterpartyPayeeResponseSDKType>(endpoint);
  }
  /* FeeEnabledChannels returns a list of all fee enabled channels */
  async feeEnabledChannels(params: QueryFeeEnabledChannelsRequest): Promise<QueryFeeEnabledChannelsResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    if (typeof params?.queryHeight !== "undefined") {
      options.params.query_height = params.queryHeight;
    }
    const endpoint = `ibc/apps/fee/v1/fee_enabled`;
    return await this.req.get<QueryFeeEnabledChannelsResponseSDKType>(endpoint, options);
  }
  /* FeeEnabledChannel returns true if the provided port and channel identifiers belong to a fee enabled channel */
  async feeEnabledChannel(params: QueryFeeEnabledChannelRequest): Promise<QueryFeeEnabledChannelResponseSDKType> {
    const endpoint = `ibc/apps/fee/v1/channels/${params.channelId}/ports/${params.portId}/fee_enabled`;
    return await this.req.get<QueryFeeEnabledChannelResponseSDKType>(endpoint);
  }
}