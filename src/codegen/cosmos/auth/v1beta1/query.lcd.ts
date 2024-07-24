import { setPaginationParams } from "../../../helpers";
import { LCDClient } from "@cosmology/lcd";
import { QueryAccountsRequest, QueryAccountsResponseSDKType, QueryAccountRequest, QueryAccountResponseSDKType, QueryParamsRequest, QueryParamsResponseSDKType, QueryModuleAccountByNameRequest, QueryModuleAccountByNameResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.accounts = this.accounts.bind(this);
    this.account = this.account.bind(this);
    this.params = this.params.bind(this);
    this.moduleAccountByName = this.moduleAccountByName.bind(this);
  }
  /* Accounts returns all the existing accounts
  
   Since: cosmos-sdk 0.43 */
  async accounts(params: QueryAccountsRequest = {
    pagination: undefined
  }): Promise<QueryAccountsResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `cosmos/auth/v1beta1/accounts`;
    return await this.req.get<QueryAccountsResponseSDKType>(endpoint, options);
  }
  /* Account returns account details based on address. */
  async account(params: QueryAccountRequest): Promise<QueryAccountResponseSDKType> {
    const endpoint = `cosmos/auth/v1beta1/accounts/${params.address}`;
    return await this.req.get<QueryAccountResponseSDKType>(endpoint);
  }
  /* Params queries all parameters. */
  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `cosmos/auth/v1beta1/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
  /* ModuleAccountByName returns the module account info by module name */
  async moduleAccountByName(params: QueryModuleAccountByNameRequest): Promise<QueryModuleAccountByNameResponseSDKType> {
    const endpoint = `cosmos/auth/v1beta1/module_accounts/${params.name}`;
    return await this.req.get<QueryModuleAccountByNameResponseSDKType>(endpoint);
  }
}