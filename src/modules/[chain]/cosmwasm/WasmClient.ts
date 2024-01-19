import { BaseRestClient } from '@/libs/client';
import { adapter, type AbstractRegistry, type Request } from '@/libs/registry';

import type {
  CodeInfo,
  ContractInfo,
  PaginabledCodeInfos,
  PaginabledContractHistory,
  PaginabledContracts,
  PaginabledContractStates,
  WasmParam,
} from './types';
import { toAscii, toBase64 } from '@cosmjs/encoding';
import type { PageRequest } from '@/types';
import { useBlockchain } from '@/stores';

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
  async getWasmCodeList(page?: PageRequest) {
    // if(!pr) pr = new PageRequest()
    // const query = `?${pr.toQueryString()}`
    // return this.request(this.registry.cosmwasm_code, {}, /*query*/);
    const blockchain = useBlockchain();
    if (blockchain.chainName === 'osmosis') {
      page?.setCountTotal(false);
    }

    const res = await this.queryClient.extra.listCode(page);
    return res;
  }
  async getWasmCodeById(code_id: string) {
    // return this.request(this.registry.cosmwasm_code, { code_id }); // `code_id` is a param in above url
    const res = await this.queryClient.wasm.getCode(Number(code_id));
    return res;
  }
  async getWasmCodeContracts(code_id: string, page?: PageRequest) {
    // if(!page) page = new PageRequest()
    // const query = `?${page.toQueryString()}`
    // return this.request(this.registry.cosmwasm_code_id_contracts, { code_id });
    const res = await this.queryClient.wasm.listContractsByCodeId(
      Number(code_id)
    );
    return res;
  }
  async getWasmParams() {
    // return this.request(this.registry.cosmwasm_param, {});
    const res = await this.queryClient.extra.wasmParams();
    return res;
  }
  async getWasmContracts(address: string) {
    // return this.request(this.registry.cosmwasm_contract_address, { address });
    const res = await this.queryClient.wasm.getContractInfo(address);
    return res;
  }
  async getWasmContractsByCreator(creator_address: string, page?: PageRequest) {
    // if(!page) page = new PageRequest()
    // const query = `?${page.toQueryString()}`
    // return this.request(this.registry.cosmwasm_wasm_contracts_creator, { creator_address });
    const res = await this.queryClient.extra.contractsByCreator(
      creator_address,
      page
    );
    return res;
  }
  async getWasmContractHistory(address: string) {
    // return this.request(this.registry.cosmwasm_contract_address_history, {
    //   address,
    // });
    const res = await this.queryClient.wasm.getContractCodeHistory(address);
    return res;
  }
  async getWasmContractRawQuery(address: string, query: string) {
    // const query_data = toBase64(new TextEncoder().encode(query));
    // return this.request(
    //   this.registry.cosmwasm_contract_address_raw_query_data,
    //   { address, query_data }
    // );

    const res = await this.queryClient.wasm.queryContractRaw(
      address,
      toAscii(query)
    );
    return res;
  }
  async getWasmContractSmartQuery(address: string, query: string) {
    // const query_data = toBase64(new TextEncoder().encode(query));
    // return this.request(
    //   this.registry.cosmwasm_contract_address_smart_query_data,
    //   { address, query_data }
    // );
    const res = await this.queryClient.wasm.queryContractSmart(
      address,
      JSON.parse(query)
    );
    return res;
  }
  async getWasmContractStates(address: string, page: PageRequest) {
    const blockchain = useBlockchain();
    if (blockchain.chainName === 'osmosis') {
      page.setCountTotal(false);
    }
    const res = await this.queryClient.extra.contractStates(address, page);
    return res;
    // if(!pr) pr = new PageRequest()
    // const query = `?${pr.toQueryString()}`
    // return this.request(this.registry.cosmwasm_contract_address_state, {
    //   address,
    // }, query);
  }
}
