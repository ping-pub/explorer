import { Rpc } from "../../../../helpers";
import { BinaryReader } from "../../../../binary";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { QueryIncentivizedPacketsRequest, QueryIncentivizedPacketsResponse, QueryIncentivizedPacketRequest, QueryIncentivizedPacketResponse, QueryIncentivizedPacketsForChannelRequest, QueryIncentivizedPacketsForChannelResponse, QueryTotalRecvFeesRequest, QueryTotalRecvFeesResponse, QueryTotalAckFeesRequest, QueryTotalAckFeesResponse, QueryTotalTimeoutFeesRequest, QueryTotalTimeoutFeesResponse, QueryPayeeRequest, QueryPayeeResponse, QueryCounterpartyPayeeRequest, QueryCounterpartyPayeeResponse, QueryFeeEnabledChannelsRequest, QueryFeeEnabledChannelsResponse, QueryFeeEnabledChannelRequest, QueryFeeEnabledChannelResponse } from "./query";
/** Query defines the ICS29 gRPC querier service. */
export interface Query {
  /** IncentivizedPackets returns all incentivized packets and their associated fees */
  incentivizedPackets(request: QueryIncentivizedPacketsRequest): Promise<QueryIncentivizedPacketsResponse>;
  /** IncentivizedPacket returns all packet fees for a packet given its identifier */
  incentivizedPacket(request: QueryIncentivizedPacketRequest): Promise<QueryIncentivizedPacketResponse>;
  /** Gets all incentivized packets for a specific channel */
  incentivizedPacketsForChannel(request: QueryIncentivizedPacketsForChannelRequest): Promise<QueryIncentivizedPacketsForChannelResponse>;
  /** TotalRecvFees returns the total receive fees for a packet given its identifier */
  totalRecvFees(request: QueryTotalRecvFeesRequest): Promise<QueryTotalRecvFeesResponse>;
  /** TotalAckFees returns the total acknowledgement fees for a packet given its identifier */
  totalAckFees(request: QueryTotalAckFeesRequest): Promise<QueryTotalAckFeesResponse>;
  /** TotalTimeoutFees returns the total timeout fees for a packet given its identifier */
  totalTimeoutFees(request: QueryTotalTimeoutFeesRequest): Promise<QueryTotalTimeoutFeesResponse>;
  /** Payee returns the registered payee address for a specific channel given the relayer address */
  payee(request: QueryPayeeRequest): Promise<QueryPayeeResponse>;
  /** CounterpartyPayee returns the registered counterparty payee for forward relaying */
  counterpartyPayee(request: QueryCounterpartyPayeeRequest): Promise<QueryCounterpartyPayeeResponse>;
  /** FeeEnabledChannels returns a list of all fee enabled channels */
  feeEnabledChannels(request: QueryFeeEnabledChannelsRequest): Promise<QueryFeeEnabledChannelsResponse>;
  /** FeeEnabledChannel returns true if the provided port and channel identifiers belong to a fee enabled channel */
  feeEnabledChannel(request: QueryFeeEnabledChannelRequest): Promise<QueryFeeEnabledChannelResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
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
  incentivizedPackets(request: QueryIncentivizedPacketsRequest): Promise<QueryIncentivizedPacketsResponse> {
    const data = QueryIncentivizedPacketsRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.fee.v1.Query", "IncentivizedPackets", data);
    return promise.then(data => QueryIncentivizedPacketsResponse.decode(new BinaryReader(data)));
  }
  incentivizedPacket(request: QueryIncentivizedPacketRequest): Promise<QueryIncentivizedPacketResponse> {
    const data = QueryIncentivizedPacketRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.fee.v1.Query", "IncentivizedPacket", data);
    return promise.then(data => QueryIncentivizedPacketResponse.decode(new BinaryReader(data)));
  }
  incentivizedPacketsForChannel(request: QueryIncentivizedPacketsForChannelRequest): Promise<QueryIncentivizedPacketsForChannelResponse> {
    const data = QueryIncentivizedPacketsForChannelRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.fee.v1.Query", "IncentivizedPacketsForChannel", data);
    return promise.then(data => QueryIncentivizedPacketsForChannelResponse.decode(new BinaryReader(data)));
  }
  totalRecvFees(request: QueryTotalRecvFeesRequest): Promise<QueryTotalRecvFeesResponse> {
    const data = QueryTotalRecvFeesRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.fee.v1.Query", "TotalRecvFees", data);
    return promise.then(data => QueryTotalRecvFeesResponse.decode(new BinaryReader(data)));
  }
  totalAckFees(request: QueryTotalAckFeesRequest): Promise<QueryTotalAckFeesResponse> {
    const data = QueryTotalAckFeesRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.fee.v1.Query", "TotalAckFees", data);
    return promise.then(data => QueryTotalAckFeesResponse.decode(new BinaryReader(data)));
  }
  totalTimeoutFees(request: QueryTotalTimeoutFeesRequest): Promise<QueryTotalTimeoutFeesResponse> {
    const data = QueryTotalTimeoutFeesRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.fee.v1.Query", "TotalTimeoutFees", data);
    return promise.then(data => QueryTotalTimeoutFeesResponse.decode(new BinaryReader(data)));
  }
  payee(request: QueryPayeeRequest): Promise<QueryPayeeResponse> {
    const data = QueryPayeeRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.fee.v1.Query", "Payee", data);
    return promise.then(data => QueryPayeeResponse.decode(new BinaryReader(data)));
  }
  counterpartyPayee(request: QueryCounterpartyPayeeRequest): Promise<QueryCounterpartyPayeeResponse> {
    const data = QueryCounterpartyPayeeRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.fee.v1.Query", "CounterpartyPayee", data);
    return promise.then(data => QueryCounterpartyPayeeResponse.decode(new BinaryReader(data)));
  }
  feeEnabledChannels(request: QueryFeeEnabledChannelsRequest): Promise<QueryFeeEnabledChannelsResponse> {
    const data = QueryFeeEnabledChannelsRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.fee.v1.Query", "FeeEnabledChannels", data);
    return promise.then(data => QueryFeeEnabledChannelsResponse.decode(new BinaryReader(data)));
  }
  feeEnabledChannel(request: QueryFeeEnabledChannelRequest): Promise<QueryFeeEnabledChannelResponse> {
    const data = QueryFeeEnabledChannelRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.fee.v1.Query", "FeeEnabledChannel", data);
    return promise.then(data => QueryFeeEnabledChannelResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    incentivizedPackets(request: QueryIncentivizedPacketsRequest): Promise<QueryIncentivizedPacketsResponse> {
      return queryService.incentivizedPackets(request);
    },
    incentivizedPacket(request: QueryIncentivizedPacketRequest): Promise<QueryIncentivizedPacketResponse> {
      return queryService.incentivizedPacket(request);
    },
    incentivizedPacketsForChannel(request: QueryIncentivizedPacketsForChannelRequest): Promise<QueryIncentivizedPacketsForChannelResponse> {
      return queryService.incentivizedPacketsForChannel(request);
    },
    totalRecvFees(request: QueryTotalRecvFeesRequest): Promise<QueryTotalRecvFeesResponse> {
      return queryService.totalRecvFees(request);
    },
    totalAckFees(request: QueryTotalAckFeesRequest): Promise<QueryTotalAckFeesResponse> {
      return queryService.totalAckFees(request);
    },
    totalTimeoutFees(request: QueryTotalTimeoutFeesRequest): Promise<QueryTotalTimeoutFeesResponse> {
      return queryService.totalTimeoutFees(request);
    },
    payee(request: QueryPayeeRequest): Promise<QueryPayeeResponse> {
      return queryService.payee(request);
    },
    counterpartyPayee(request: QueryCounterpartyPayeeRequest): Promise<QueryCounterpartyPayeeResponse> {
      return queryService.counterpartyPayee(request);
    },
    feeEnabledChannels(request: QueryFeeEnabledChannelsRequest): Promise<QueryFeeEnabledChannelsResponse> {
      return queryService.feeEnabledChannels(request);
    },
    feeEnabledChannel(request: QueryFeeEnabledChannelRequest): Promise<QueryFeeEnabledChannelResponse> {
      return queryService.feeEnabledChannel(request);
    }
  };
};