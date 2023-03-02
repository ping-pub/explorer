import { Rpc } from "../../../helpers";
import { QueryClient } from "@cosmjs/stargate";
import { QueryBalanceRequest, QueryBalanceResponse, QueryOwnerRequest, QueryOwnerResponse, QuerySupplyRequest, QuerySupplyResponse, QueryNFTsRequest, QueryNFTsResponse, QueryNFTRequest, QueryNFTResponse, QueryClassRequest, QueryClassResponse, QueryClassesRequest, QueryClassesResponse } from "./query";
/** Query defines the gRPC querier service. */
export interface Query {
    /** Balance queries the number of NFTs of a given class owned by the owner, same as balanceOf in ERC721 */
    balance(request: QueryBalanceRequest): Promise<QueryBalanceResponse>;
    /** Owner queries the owner of the NFT based on its class and id, same as ownerOf in ERC721 */
    owner(request: QueryOwnerRequest): Promise<QueryOwnerResponse>;
    /** Supply queries the number of NFTs from the given class, same as totalSupply of ERC721. */
    supply(request: QuerySupplyRequest): Promise<QuerySupplyResponse>;
    /**
     * NFTs queries all NFTs of a given class or owner,choose at least one of the two, similar to tokenByIndex in
     * ERC721Enumerable
     */
    nFTs(request: QueryNFTsRequest): Promise<QueryNFTsResponse>;
    /** NFT queries an NFT based on its class and id. */
    nFT(request: QueryNFTRequest): Promise<QueryNFTResponse>;
    /** Class queries an NFT class based on its id */
    class(request: QueryClassRequest): Promise<QueryClassResponse>;
    /** Classes queries all NFT classes */
    classes(request?: QueryClassesRequest): Promise<QueryClassesResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    balance(request: QueryBalanceRequest): Promise<QueryBalanceResponse>;
    owner(request: QueryOwnerRequest): Promise<QueryOwnerResponse>;
    supply(request: QuerySupplyRequest): Promise<QuerySupplyResponse>;
    nFTs(request: QueryNFTsRequest): Promise<QueryNFTsResponse>;
    nFT(request: QueryNFTRequest): Promise<QueryNFTResponse>;
    class(request: QueryClassRequest): Promise<QueryClassResponse>;
    classes(request?: QueryClassesRequest): Promise<QueryClassesResponse>;
}
export declare const createRpcQueryExtension: (base: QueryClient) => {
    balance(request: QueryBalanceRequest): Promise<QueryBalanceResponse>;
    owner(request: QueryOwnerRequest): Promise<QueryOwnerResponse>;
    supply(request: QuerySupplyRequest): Promise<QuerySupplyResponse>;
    nFTs(request: QueryNFTsRequest): Promise<QueryNFTsResponse>;
    nFT(request: QueryNFTRequest): Promise<QueryNFTResponse>;
    class(request: QueryClassRequest): Promise<QueryClassResponse>;
    classes(request?: QueryClassesRequest): Promise<QueryClassesResponse>;
};
