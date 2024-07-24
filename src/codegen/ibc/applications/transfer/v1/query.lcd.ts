import { setPaginationParams } from "../../../../helpers";
import { LCDClient } from "@cosmology/lcd";
import { QueryDenomTracesRequest, QueryDenomTracesResponseSDKType, QueryDenomTraceRequest, QueryDenomTraceResponseSDKType, QueryParamsRequest, QueryParamsResponseSDKType, QueryDenomHashRequest, QueryDenomHashResponseSDKType, QueryEscrowAddressRequest, QueryEscrowAddressResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.denomTraces = this.denomTraces.bind(this);
    this.denomTrace = this.denomTrace.bind(this);
    this.params = this.params.bind(this);
    this.denomHash = this.denomHash.bind(this);
    this.escrowAddress = this.escrowAddress.bind(this);
  }
  /* DenomTraces queries all denomination traces. */
  async denomTraces(params: QueryDenomTracesRequest = {
    pagination: undefined
  }): Promise<QueryDenomTracesResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `ibc/apps/transfer/v1/denom_traces`;
    return await this.req.get<QueryDenomTracesResponseSDKType>(endpoint, options);
  }
  /* DenomTrace queries a denomination trace information. */
  async denomTrace(params: QueryDenomTraceRequest): Promise<QueryDenomTraceResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.hash !== "undefined") {
      options.params.hash = params.hash;
    }
    const endpoint = `ibc/apps/transfer/v1/denom_traces/${params.hash}`;
    return await this.req.get<QueryDenomTraceResponseSDKType>(endpoint, options);
  }
  /* Params queries all parameters of the ibc-transfer module. */
  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `ibc/apps/transfer/v1/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
  /* DenomHash queries a denomination hash information. */
  async denomHash(params: QueryDenomHashRequest): Promise<QueryDenomHashResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.trace !== "undefined") {
      options.params.trace = params.trace;
    }
    const endpoint = `ibc/apps/transfer/v1/denom_hashes/${params.trace}`;
    return await this.req.get<QueryDenomHashResponseSDKType>(endpoint, options);
  }
  /* EscrowAddress returns the escrow address for a particular port and channel id. */
  async escrowAddress(params: QueryEscrowAddressRequest): Promise<QueryEscrowAddressResponseSDKType> {
    const endpoint = `ibc/apps/transfer/v1/channels/${params.channelId}/ports/${params.portId}/escrow_address`;
    return await this.req.get<QueryEscrowAddressResponseSDKType>(endpoint);
  }
}