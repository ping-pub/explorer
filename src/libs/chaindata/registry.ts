import type { Chain, AssetList } from '@chain-registry/types';
import { type ChainConfig, NetworkType } from '@/types/chaindata';
import { chains as mainnetChains, assets as mainnetAssets } from 'chain-registry/mainnet';
import { chains as testnetChains, assets as testnetAssets } from 'chain-registry/testnet';

const getNetworkChains = (networkType: NetworkType) => {
    const chains = networkType === NetworkType.Testnet ? testnetChains : mainnetChains;
    const assets = networkType === NetworkType.Testnet ? testnetAssets : mainnetAssets;
    return { chains, assets };
}

const getNetworkType = (chainName: string): NetworkType => {
    if (chainName.includes('testnet')) {
        return NetworkType.Testnet;
    }
    return NetworkType.Mainnet;
}

export const loadFromRegistry = async (networkType: NetworkType, chainNames: string[] | undefined): Promise<Record<string, ChainConfig>> => {
    if (!chainNames || chainNames.length === 0) {
        return loadAllFromRegistry(networkType);
    }
    return loadListFromRegistry(chainNames);
}

const loadAllFromRegistry = async (networkType: NetworkType): Promise<Record<string, ChainConfig>> => {
    const result: Record<string, ChainConfig> = {};
    const { chains, assets } = getNetworkChains(networkType);
    chains.forEach((chain: Chain) => {
        const assetList = assets.find(({ chain_name }) => chain_name === chain.chain_name);
        result[chain.chain_name] = convertFromRegistry(chain, assetList);
    });
    return result;
}

const loadListFromRegistry = async (chainNames: string[]): Promise<Record<string, ChainConfig>> => {
    const result: Record<string, ChainConfig> = {};
    chainNames.forEach(chainName => {
        const networkType = getNetworkType(chainName);
        const { chains, assets } = getNetworkChains(networkType);
        const chain = chains.find(({ chain_name }) => chain_name === chainName);
        const assetList = assets.find(({ chain_name }) => chain_name === chainName);
        if (chain) {
            result[chainName] = convertFromRegistry(chain, assetList);
        }
    });
    return result;
}

const convertFromRegistry = (chain: Chain, assetList: AssetList | undefined): ChainConfig => {
    const conf: ChainConfig = {
        chainId: chain.chain_id || '',
        chainName: chain.chain_name,
        prettyName: chain.pretty_name || chain.chain_name,
        bech32Prefix: chain.bech32_prefix || '',
        bech32ConsensusPrefix: chain.bech32_config?.bech32PrefixConsAddr || chain.bech32_prefix + 'valcons',
        logo: chain.logo_URIs?.svg || chain.logo_URIs?.png || '',
        assets: assetList?.assets || [],
        features: [],
        versions: {
            application: chain.codebase?.recommended_version || '',
            cosmosSdk: chain.codebase?.cosmos_sdk_version || '',
            tendermint: chain.codebase?.consensus?.version
        },
        endpoints: {
            rest: chain.apis?.rest || [],
            rpc: chain.apis?.rpc || [],
        },
        coinType: chain.slip44?.toString() || '',
        exponent: assetList?.assets?.[0]?.denom_units.at(0)?.exponent?.toString() || '6',
        providerChain: {
            api: []
        }
    };
    return conf;
}
