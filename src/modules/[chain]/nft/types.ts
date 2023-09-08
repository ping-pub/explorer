
import { BaseRestClient } from '@/libs/client';
import { adapter, type AbstractRegistry, type Request } from '@/libs/registry';
import { PageRequest, type PaginatedResponse } from '@/types';

export interface Classes {
    id: string,
    name: string,
    symbol: string,
    description: string,
    uri: string,
    uri_hash: string,
    data: {
        type_url: string,
        value: string
    }
}

export interface NFT {
    class_id: string,
    id: string,
    uri: string,
    uri_hash: string,
    data: {
      type_url: string,
      value: string
    }
  }

export interface Balance {
    amount: string,
}

export interface PageinatedClasses extends PaginatedResponse {
    classes: Classes[],
}

export interface PageinatedNFTs extends PaginatedResponse {
    nfts: NFT[],
}

export interface NFTRequestRegistry extends AbstractRegistry {
    nft_classes: Request<PageinatedClasses>;
    nft_classes_class_id: Request<Classes>;
    nft_supply_class_id: Request<Balance>;
    nft_classes_nfts: Request<PageinatedNFTs>;
    nft_classes_nfts_class_id_nft_id: Request<NFT>;
    nft_classes_nfts_class_id_nft_id_owner: Request<{
        owner: string
      }>;
    nft_balance_owner: Request<Balance>;
}

export const DEFAULT: NFTRequestRegistry = {
    nft_classes: {
        url: '/cosmos/nft/v1beta1/classes',
        adapter,
    },
    nft_classes_class_id: {
        url: '/cosmos/nft/v1beta1/classes/{class_id}',
        adapter,
    },
    nft_supply_class_id: {
        url: '/cosmos/nft/v1beta1/supply/{class_id}',
        adapter,
    },
    nft_classes_nfts: {
        url: '/cosmos/nft/v1beta1/nfts',
        adapter,
    },
    nft_classes_nfts_class_id_nft_id: {
        url: '/cosmos/nft/v1beta1/{class_id}/{nft_id}',
        adapter,
    },
    nft_classes_nfts_class_id_nft_id_owner: {
        url: '/cosmos/nft/v1beta1/owner/{class_id}/{nft_id}',
        adapter,
    },
    nft_balance_owner: {
        url: '/cosmos/nft/v1beta1/balance/{owner}/{class_id}',
        adapter,
    }
};

export class NFTRestClient extends BaseRestClient<NFTRequestRegistry> {
    getClasses(pr?: PageRequest) {
      if(!pr) pr = new PageRequest()
      const query = `?${pr.toQueryString()}`
      return this.request(this.registry.nft_classes, {}, query);
    }
    getClassesById(class_id: string) {
      return this.request(this.registry.nft_classes_class_id, { class_id }); // `code_id` is a param in above url
    }
    getNFTs(class_id: string, id: string, page?: PageRequest) {
      if(!page) page = new PageRequest()
      const query = `?${page.toQueryString()}`
      return this.request(this.registry.nft_classes_nfts_class_id_nft_id, { class_id, id }, query);
    }
    getNFTOwner(class_id: string, id: string) {
      return this.request(this.registry.nft_classes_nfts_class_id_nft_id_owner, {class_id, id});
    }
    getNFTSupply(class_id: string) {
      return this.request(this.registry.nft_supply_class_id, { class_id });
    }
    getBalanceOfNFT(class_id: string, owner: string) {
        return this.request(this.registry.nft_balance_owner, { class_id, owner });
    }
  }