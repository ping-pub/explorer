import { Rpc } from "../../../../../helpers";
import { BinaryReader } from "../../../../../binary";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { QueryInterchainAccountRequest, QueryInterchainAccountResponse, QueryParamsRequest, QueryParamsResponse } from "./query";
/** Query provides defines the gRPC querier service. */
export interface Query {
  /** InterchainAccount returns the interchain account address for a given owner address on a given connection */
  interchainAccount(request: QueryInterchainAccountRequest): Promise<QueryInterchainAccountResponse>;
  /** Params queries all parameters of the ICA controller submodule. */
  params(request?: QueryParamsRequest): Promise<QueryParamsResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.interchainAccount = this.interchainAccount.bind(this);
    this.params = this.params.bind(this);
  }
  interchainAccount(request: QueryInterchainAccountRequest): Promise<QueryInterchainAccountResponse> {
    const data = QueryInterchainAccountRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.interchain_accounts.controller.v1.Query", "InterchainAccount", data);
    return promise.then(data => QueryInterchainAccountResponse.decode(new BinaryReader(data)));
  }
  params(request: QueryParamsRequest = {}): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("ibc.applications.interchain_accounts.controller.v1.Query", "Params", data);
    return promise.then(data => QueryParamsResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    interchainAccount(request: QueryInterchainAccountRequest): Promise<QueryInterchainAccountResponse> {
      return queryService.interchainAccount(request);
    },
    params(request?: QueryParamsRequest): Promise<QueryParamsResponse> {
      return queryService.params(request);
    }
  };
};