import { LCDClient } from "@osmonauts/lcd";
import { QueryAccountsRequest, QueryAccountsResponseSDKType, QueryAccountRequest, QueryAccountResponseSDKType, QueryParamsRequest, QueryParamsResponseSDKType, QueryModuleAccountsRequest, QueryModuleAccountsResponseSDKType, Bech32PrefixRequest, Bech32PrefixResponseSDKType, AddressBytesToStringRequest, AddressBytesToStringResponseSDKType, AddressStringToBytesRequest, AddressStringToBytesResponseSDKType } from "./query";
export declare class LCDQueryClient {
    req: LCDClient;
    constructor({ requestClient }: {
        requestClient: LCDClient;
    });
    accounts(params?: QueryAccountsRequest): Promise<QueryAccountsResponseSDKType>;
    account(params: QueryAccountRequest): Promise<QueryAccountResponseSDKType>;
    params(_params?: QueryParamsRequest): Promise<QueryParamsResponseSDKType>;
    moduleAccounts(_params?: QueryModuleAccountsRequest): Promise<QueryModuleAccountsResponseSDKType>;
    bech32Prefix(_params?: Bech32PrefixRequest): Promise<Bech32PrefixResponseSDKType>;
    addressBytesToString(params: AddressBytesToStringRequest): Promise<AddressBytesToStringResponseSDKType>;
    addressStringToBytes(params: AddressStringToBytesRequest): Promise<AddressStringToBytesResponseSDKType>;
}
