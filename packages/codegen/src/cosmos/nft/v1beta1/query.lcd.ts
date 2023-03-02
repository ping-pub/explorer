import { setPaginationParams } from "../../../helpers";
import { LCDClient } from "@osmonauts/lcd";
import { QueryBalanceRequest, QueryBalanceResponseSDKType, QueryOwnerRequest, QueryOwnerResponseSDKType, QuerySupplyRequest, QuerySupplyResponseSDKType, QueryNFTsRequest, QueryNFTsResponseSDKType, QueryNFTRequest, QueryNFTResponseSDKType, QueryClassRequest, QueryClassResponseSDKType, QueryClassesRequest, QueryClassesResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;

  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.balance = this.balance.bind(this);
    this.owner = this.owner.bind(this);
    this.supply = this.supply.bind(this);
    this.nFTs = this.nFTs.bind(this);
    this.nFT = this.nFT.bind(this);
    this.class = this.class.bind(this);
    this.classes = this.classes.bind(this);
  }
  /* Balance queries the number of NFTs of a given class owned by the owner, same as balanceOf in ERC721 */


  async balance(params: QueryBalanceRequest): Promise<QueryBalanceResponseSDKType> {
    const endpoint = `cosmos/nft/v1beta1/balance/${params.owner}/${params.classId}`;
    return await this.req.get<QueryBalanceResponseSDKType>(endpoint);
  }
  /* Owner queries the owner of the NFT based on its class and id, same as ownerOf in ERC721 */


  async owner(params: QueryOwnerRequest): Promise<QueryOwnerResponseSDKType> {
    const endpoint = `cosmos/nft/v1beta1/owner/${params.classId}/${params.id}`;
    return await this.req.get<QueryOwnerResponseSDKType>(endpoint);
  }
  /* Supply queries the number of NFTs from the given class, same as totalSupply of ERC721. */


  async supply(params: QuerySupplyRequest): Promise<QuerySupplyResponseSDKType> {
    const endpoint = `cosmos/nft/v1beta1/supply/${params.classId}`;
    return await this.req.get<QuerySupplyResponseSDKType>(endpoint);
  }
  /* NFTs queries all NFTs of a given class or owner,choose at least one of the two, similar to tokenByIndex in
   ERC721Enumerable */


  async nFTs(params: QueryNFTsRequest): Promise<QueryNFTsResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.classId !== "undefined") {
      options.params.class_id = params.classId;
    }

    if (typeof params?.owner !== "undefined") {
      options.params.owner = params.owner;
    }

    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }

    const endpoint = `cosmos/nft/v1beta1/nfts`;
    return await this.req.get<QueryNFTsResponseSDKType>(endpoint, options);
  }
  /* NFT queries an NFT based on its class and id. */


  async nFT(params: QueryNFTRequest): Promise<QueryNFTResponseSDKType> {
    const endpoint = `cosmos/nft/v1beta1/nfts/${params.classId}/${params.id}`;
    return await this.req.get<QueryNFTResponseSDKType>(endpoint);
  }
  /* Class queries an NFT class based on its id */


  async class(params: QueryClassRequest): Promise<QueryClassResponseSDKType> {
    const endpoint = `cosmos/nft/v1beta1/classes/${params.classId}`;
    return await this.req.get<QueryClassResponseSDKType>(endpoint);
  }
  /* Classes queries all NFT classes */


  async classes(params: QueryClassesRequest = {
    pagination: undefined
  }): Promise<QueryClassesResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }

    const endpoint = `cosmos/nft/v1beta1/classes`;
    return await this.req.get<QueryClassesResponseSDKType>(endpoint, options);
  }

}