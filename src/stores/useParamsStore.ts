import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';
import { percent, formatNumber, formatTokenAmount } from '@/libs/utils';
export interface stakingItem {
  unbonding_time: string;
  max_validators: number;
  max_entries: number;
  historical_entries: number;
  bond_denom: string;
  min_commission_rate: string;
  min_self_delegation: string;
}

export const useParamStore = defineStore('paramstore', {
  state: () => ({
    latestTime: '',
    chain: {
      title: '',
      class: 'border-primary',
      items: [
        {
          subtitle: 'height',
          icon: 'BoxIcon',
          color: 'light-success',
          value: '-',
        },
        {
          subtitle: 'staked_and_supply',
          icon: 'DollarSignIcon',
          color: 'light-danger',
          value: '-',
        },
        {
          subtitle: 'staked_ratio',
          icon: 'PercentIcon',
          color: 'light-warning',
          value: '-',
        },
        {
          subtitle: 'inflation',
          icon: 'TrendingUpIcon',
          color: 'light-primary',
          value: '-',
        },
      ],
    },
    mint: {
      title: 'Mint Parameters',
      items: [] as Array<any>,
    },
    staking: {
      title: 'Staking Parameters',
      items: [] as Array<any>,
    },
    distribution: {
      title: 'Distribution Parameters',
      items: [] as Array<any>,
    },
    applicationParams: {
      title: 'Application Parameters',
      items: [] as Array<any>,
    },
    gatewayParams: {
      title: 'Gateway Parameters',
      items: [] as Array<any>,
    },
    migrationParams: {
      title: 'Migration Parameters',
      items: [] as Array<any>,
    },
    proofParams: {
      title: 'Proof Parameters',
      items: [] as Array<any>,
    },
    serviceParams: {
      title: 'Service Parameters',
      items: [] as Array<any>,
    },
    sessionParams: {
      title: 'Session Parameters',
      items: [] as Array<any>,
    },
    sharedParams: {
      title: 'Shared Parameters',
      items: [] as Array<any>,
    },
    supplierParams: {
      title: 'Supplier Parameters',
      items: [] as Array<any>,
    },
    tokenomicsParams: {
      title: 'Tokenomics Parameters',
      items: [] as Array<any>,
    },
    bank: {
      title: 'Bank Parameters',
      items: [] as Array<any>,
    },
    slashing: {
      title: 'Slashing Parameters',
      items: [] as Array<any>,
    },
    gov: {
      title: 'Governance Parameters',
      items: [] as Array<any>,
    },
    auth: {
      title: 'Auth Parameters',
      items: [] as Array<any>,
    },
    appVersion: {
      title: 'Application Version',
      items: [] as Array<any>,
    },
    nodeVersion: {
      title: 'Node Information',
      items: [] as Array<any>,
    },
  }),
  getters: {
    blockchain() {
      return useBlockchain();
    },
  },
  actions: {
    initial() {
      this.handleBaseBlockLatest();
      // this.handleMintParam()
      this.handleStakingParams();
      this.handleSlashingParams();
      this.handleDistributionParams();
      this.handleBankParams();
      this.handleAuthParams();
      this.handleApplicationParams();
      this.handleGatewayParams();
      this.handleMigrationParams();
      this.handleProofParams();
      this.handleServiceParams();
      this.handleSessionParams();
      this.handleSharedParams();
      this.handleSupplierParams();
      this.handleTokenomicsParams();
      this.handleGovernanceParams();
      this.handleAbciInfo();
    },
    async handleBaseBlockLatest() {
      try {
        const res = await this.getBaseTendermintBlockLatest();
        const height = this.chain.items.findIndex(
          (x) => x.subtitle === 'height'
        );
        this.chain.title = `Chain ID: ${res.block.header.chain_id}`;
        this.chain.items[height].value = res.block.header.height;
        // if (timeIn(res.block.header.time, 3, 'm')) {
        //   this.syncing = true
        // } else {
        //   this.syncing = false
        // }
        // this.latestTime = toDay(res.block.header.time, 'long')
        this.latestTime = res.block.header.time;
      } catch (error) {
        console.warn(error);
      }
    },
    async handleStakingParams() {
      const res = await this.getStakingParams();
      const bond_denom = res?.params.bond_denom;
      this.staking.items = Object.entries(res.params)
        .map(([key, value]) => ({ subtitle: key, value: value }))
        .filter((item: any) => {
          if (
            !['min_commission_rate', 'min_self_delegation'].includes(
              item.subtitle
            )
          )
            return item;
        });
      Promise.all([this.getStakingPool(), this.getBankTotal(bond_denom)]).then(
        (resArr) => {
          const pool = resArr[0]?.pool;
          const amount = resArr[1]?.amount?.amount;
          const assets = this.blockchain.current?.assets;
          const stakedAndSupply = this.chain.items.findIndex(
            (x) => x.subtitle === 'staked_and_supply'
          );
          this.chain.items[stakedAndSupply].value = `${formatNumber(
            formatTokenAmount(assets, pool.bonded_tokens, 2, bond_denom, false),
            true,
            0
          )}/${formatNumber(
            formatTokenAmount(assets, amount, 2, bond_denom, false),
            true,
            0
          )}`;
          const stakedRatio = this.chain.items.findIndex(
            (x) => x.subtitle === 'staked_ratio'
          );
          this.chain.items[stakedRatio].value = `${percent(
            Number(pool.bonded_tokens) / Number(amount)
          )}%`;
        }
      );
    },
    async handleMintParam() {
      const excludes = this.blockchain.current?.excludes;
      if (excludes && excludes.indexOf('mint') > -1) {
        return;
      }
      // this.getMintingInflation().then(res => {
      //     const chainIndex = this.chain.items.findIndex(x => x.subtitle === 'inflation')
      //     this.chain.items[chainIndex].value = `${percent(res)}%`
      // })
      const res = await this.getMintParam();
    },
    async handleSlashingParams() {
      const res = await this.getSlashingParams();
      this.slashing.items = Object.entries(res.params).map(([key, value]) => ({
        subtitle: key,
        value: value,
      }));
    },
    async handleDistributionParams() {
      const res = await this.getDistributionParams();
      this.distribution.items = Object.entries(res.params).map(
        ([key, value]) => ({ subtitle: key, value: value })
      );
    },
    async handleApplicationParams() {
      try {
        const res = await this.getApplicationParams();
        const params = res?.params || res;
        if(params) {
          this.applicationParams.items = Object.entries(params).map(([key, value]) => ({ subtitle: key, value }));
        }
      } catch (e) {
        console.warn('Failed to load application params', e)
      }
    },
    async handleGatewayParams() {
      try {
        const res = await this.getGatewayParams();
        const params = res?.params || res;
        if(params) {
          this.gatewayParams.items = Object.entries(params).map(([key, value]) => ({ subtitle: key, value }));
        }
      } catch (e) {
        console.warn('Failed to load gateway params', e)
      }
    },
    async handleMigrationParams() {
      try {
        const res = await this.getMigrationParams();
        const params = res?.params || res;
        if(params) {
          this.migrationParams.items = Object.entries(params).map(([key, value]) => ({ subtitle: key, value }));
        }
      } catch (e) {
        console.warn('Failed to load migration params', e)
      }
    },
    async handleProofParams() {
      try {
        const res = await this.getProofParams();
        const params = res?.params || res;
        if(params) {
          this.proofParams.items = Object.entries(params).map(([key, value]) => ({ subtitle: key, value }));
        }
      } catch (e) {
        console.warn('Failed to load proof params', e)
      }
    },
    async handleServiceParams() {
      try {
        const res = await this.getServiceParams();
        const params = res?.params || res;
        if(params) {
          this.serviceParams.items = Object.entries(params).map(([key, value]) => ({ subtitle: key, value }));
        }
      } catch (e) {
        console.warn('Failed to load service params', e)
      }
    },
    async handleSessionParams() {
      try {
        const res = await this.getSessionParams();
        const params = res?.params || res;
        if(params) {
          this.sessionParams.items = Object.entries(params).map(([key, value]) => ({ subtitle: key, value }));
        }
      } catch (e) {
        console.warn('Failed to load session params', e)
      }
    },
    async handleSharedParams() {
      try {
        const res = await this.getSharedParams();
        const params = res?.params || res;
        if(params) {
          this.sharedParams.items = Object.entries(params).map(([key, value]) => ({ subtitle: key, value }));
        }
      } catch (e) {
        console.warn('Failed to load shared params', e)
      }
    },
    async handleSupplierParams() {
      try {
        const res = await this.getSupplierParams();
        const params = res?.params || res;
        if(params) {
          this.supplierParams.items = Object.entries(params).map(([key, value]) => ({ subtitle: key, value }));
        }
      } catch (e) {
        console.warn('Failed to load supplier params', e)
      }
    },
    async handleTokenomicsParams() {
      try {
        const res = await this.getTokenomicsParams();
        const params = res?.params || res;
        if(params) {
          this.tokenomicsParams.items = Object.entries(params).map(([key, value]) => ({ subtitle: key, value }));
        }
      } catch (e) {
        console.warn('Failed to load tokenomics params', e)
      }
    },
    async handleBankParams() {
      const res = await this.getBankParams();
      const params = res?.params || res; // some chains may return params at root
      if(params) {
        this.bank.items = Object.entries(params).map(([key, value]) => ({ subtitle: key, value }));
      }
    },
    async handleAuthParams() {
      const res = await this.getAuthParams();
      const params = res?.params || res;
      if(params) {
        this.auth.items = Object.entries(params).map(([key, value]) => ({ subtitle: key, value }));
      }
    },
    async handleGovernanceParams() {
      const excludes = this.blockchain.current?.excludes;
      if (excludes && excludes.indexOf('governance') > -1) {
        return;
      }
      Promise.all([
        this.getGovParamsVoting(),
        this.getGovParamsDeposit(),
        this.getGovParamsTally(),
      ]).then((resArr) => {
        const govParams = {
          ...resArr[0]?.voting_params,
          ...resArr[1]?.deposit_params,
          ...resArr[2]?.tally_params,
        };
        this.gov.items = Object.entries(govParams).map(([key, value]) => ({
          subtitle: key,
          value: value,
        }));
      });
    },
    async handleAbciInfo() {
      const res = await this.fetchAbciInfo();

      localStorage.setItem(`sdk_version_${this.blockchain.chainName}`, res.application_version?.cosmos_sdk_version);
      
      this.appVersion.items = Object.entries(res.application_version).map(
        ([key, value]) => ({ subtitle: key, value: value })
      );
      this.nodeVersion.items = Object.entries(res.default_node_info).map(
        ([key, value]) => ({ subtitle: key, value: value })
      );
    },
    async getBaseTendermintBlockLatest() {
      return await this.blockchain.rpc?.getBaseBlockLatest();
    },
    async getMintParam() {
      return await this.blockchain.rpc?.getMintParam();
    },
    async getStakingParams() {
      return await this.blockchain.rpc?.getStakingParams();
    },
    async getStakingPool() {
      return await this.blockchain.rpc?.getStakingPool();
    },
    async getBankTotal(denom: string) {
      return await this.blockchain.rpc?.getBankSupplyByDenom(denom);
      // if (compareVersions(this.config.sdk_version, '0.46.2') > 0) {
      //     return this.get(`/cosmos/bank/v1beta1/supply/by_denom?denom=${denom}`).then(data => commonProcess(data).amount)
      //   }
      //   if (compareVersions(this.config.sdk_version, '0.40') < 0) {
      //     return this.get(`/supply/total/${denom}`).then(data => ({ amount: commonProcess(data), denom }))
      //   }
      //   return this.get(`/cosmos/bank/v1beta1/supply/${denom}`).then(data => commonProcess(data).amount)
    },
    async getSlashingParams() {
      return await this.blockchain.rpc?.getSlashingParams();
    },
    async getDistributionParams() {
      return await this.blockchain.rpc?.getDistributionParams();
    },
    async getBankParams() {
      return await this.blockchain.rpc?.getBankParams();
    },
    async getAuthParams() {
      return await this.blockchain.rpc?.getAuthParams();
    },
    async getApplicationParams() {
      return await this.blockchain.rpc?.getApplicationParams();
    },
    async getGatewayParams() {
      return await this.blockchain.rpc?.getGatewayParams();
    },
    async getMigrationParams() {
      return await this.blockchain.rpc?.getMigrationParams();
    },
    async getProofParams() {
      return await this.blockchain.rpc?.getProofParams();
    },
    async getServiceParams() {
      return await this.blockchain.rpc?.getServiceParams();
    },
    async getSessionParams() {
      return await this.blockchain.rpc?.getSessionParams();
    },
    async getSharedParams() {
      return await this.blockchain.rpc?.getSharedParams();
    },
    async getSupplierParams() {
      return await this.blockchain.rpc?.getSupplierParams();
    },
    async getTokenomicsParams() {
      return await this.blockchain.rpc?.getTokenomicsParams();
    },
    async getGovParamsVoting() {
      return await this.blockchain.rpc?.getGovParamsVoting();
    },
    async getGovParamsDeposit() {
      return await this.blockchain.rpc?.getGovParamsDeposit();
    },
    async getGovParamsTally() {
      return await this.blockchain.rpc?.getGovParamsTally();
    },
    async fetchAbciInfo() {
      return this.blockchain.rpc?.getBaseNodeInfo();
    },
  },
});
