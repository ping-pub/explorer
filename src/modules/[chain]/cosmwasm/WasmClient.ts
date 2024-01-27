import { BaseRestClient } from '@/libs/client';
import { adapter, type AbstractRegistry, type Request } from '@/libs/registry';
import { defineStore } from 'pinia';
import type {
  CodeInfo,
  ContractInfo,
  PaginabledCodeInfos,
  PaginabledContractHistory,
  PaginabledContracts,
  PaginabledContractStates,
  WasmParam,
} from './types';
import { toBase64 } from '@cosmjs/encoding';
import { useBlockchain } from '@/stores';
import { PageRequest } from '@/types';

export interface WasmRequestRegistry extends AbstractRegistry {
    cosmwasm_code: Request<PaginabledCodeInfos>;
    cosmwasm_code_id: Request<CodeInfo>;
    cosmwasm_code_id_contracts: Request<PaginabledContracts>;
    cosmwasm_param: Request<WasmParam>;
    cosmwasm_contract_address: Request<{
      address: string;
      contract_info: ContractInfo;
    }>;
    cosmwasm_contract_address_history: Request<PaginabledContractHistory>;
    cosmwasm_contract_address_raw_query_data: Request<any>;
    cosmwasm_contract_address_smart_query_data: Request<any>;
    cosmwasm_contract_address_state: Request<PaginabledContractStates>;
    cosmwasm_wasm_contracts_creator: Request<PaginabledContracts>;
  }
  
  export const DEFAULT_VERSION: WasmRequestRegistry = {
    cosmwasm_code: { url: '/cosmwasm/wasm/v1/code', adapter },
    cosmwasm_code_id: { url: '/cosmwasm/wasm/v1/code/{code_id}', adapter },
    cosmwasm_code_id_contracts: {
      url: '/cosmwasm/wasm/v1/code/{code_id}/contracts',
      adapter,
    },
    cosmwasm_param: { url: '/cosmwasm/wasm/v1/codes/params', adapter },
    cosmwasm_contract_address: {
      url: '/cosmwasm/wasm/v1/contract/{address}',
      adapter,
    },
    cosmwasm_contract_address_history: {
      url: '/cosmwasm/wasm/v1/contract/{address}/history',
      adapter,
    },
    cosmwasm_contract_address_raw_query_data: {
      url: '/cosmwasm/wasm/v1/contract/{address}/raw/{query_data}',
      adapter,
    },
    cosmwasm_contract_address_smart_query_data: {
      url: '/cosmwasm/wasm/v1/contract/{address}/smart/{query_data}',
      adapter,
    },
    cosmwasm_contract_address_state: {
      url: '/cosmwasm/wasm/v1/contract/{address}/state',
      adapter,
    },
    cosmwasm_wasm_contracts_creator: {
      url: '/cosmwasm/wasm/v1/contracts/creator/{creator_address}',
      adapter,
    },
  };
  
  export class WasmRestClient extends BaseRestClient<WasmRequestRegistry> {
    getWasmCodeList(pr?: PageRequest) {
      // if(!pr) pr = new PageRequest()
      // const query = `?${pr.toQueryString()}`
      return this.request(this.registry.cosmwasm_code, {}, /*query*/);
    }
    getWasmCodeById(code_id: string) {
      return this.request(this.registry.cosmwasm_code, { code_id }); // `code_id` is a param in above url
    }
    getWasmCodeContracts(code_id: string, page?: PageRequest) {
      // if(!page) page = new PageRequest()
      // const query = `?${page.toQueryString()}`
      return this.request(this.registry.cosmwasm_code_id_contracts, { code_id });
    }
    getWasmParams() {
      return this.request(this.registry.cosmwasm_param, {});
    }
    getWasmContracts(address: string) {
      return this.request(this.registry.cosmwasm_contract_address, { address });
    }
    getWasmContractsByCreator(creator_address: string, page?: PageRequest) {    
      // if(!page) page = new PageRequest()
      // const query = `?${page.toQueryString()}`
      return this.request(this.registry.cosmwasm_wasm_contracts_creator, { creator_address });
    }
    getWasmContractHistory(address: string) {
      return this.request(this.registry.cosmwasm_contract_address_history, {
        address,
      });
    }
    getWasmContractRawQuery(address: string, query: string) {
      const query_data = toBase64(new TextEncoder().encode(query));
      return this.request(
        this.registry.cosmwasm_contract_address_raw_query_data,
        { address, query_data }
      );
    }
    getWasmContractSmartQuery(address: string, query: string) {
      const query_data = toBase64(new TextEncoder().encode(query));
      return this.request(
        this.registry.cosmwasm_contract_address_smart_query_data,
        { address, query_data }
      );
    }
    getWasmContractStates(address: string, pr: PageRequest) {    
      if(!pr) pr = new PageRequest()
      const query = `?${pr.toQueryString()}`
      return this.request(this.registry.cosmwasm_contract_address_state, {
        address,
      }, query);
    }
  }
  