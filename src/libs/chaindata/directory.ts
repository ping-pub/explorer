import { get } from '../http';
import type { ChainConfig, Asset, Endpoint } from '@/types/chaindata';
import { ConfigSource, NetworkType } from '@/types/chaindata';


// Chain config structure of cosmos.directory
export interface DirectoryChain {
    assets: Asset[];
    bech32_prefix: string;
    best_apis: {
        rest: Endpoint[];
        rpc: Endpoint[];
    };
    chain_id: string;
    chain_name: string;
    pretty_name: string;
    coingecko_id: string;
    cosmwasm_enabled: boolean;
    decimals: number;
    denom: string;
    display: string;
    explorers:
    | {
        name?: string | undefined;
        kind?: string | undefined;
        url?: string | undefined;
        tx_page?: string | undefined;
        account_page?: string | undefined;
    }[]
    | undefined;
    height: number;
    image: string;
    name: string;
    network_type: string;
    symbol: string;
    versions?: {
        application_version: string;
        cosmos_sdk_version: string;
        tendermint_version: string;
    };
}

function pathConvert(path: string | undefined) {
    if (path) {
        path = path.replace(
            'https://raw.githubusercontent.com/cosmos/chain-registry/master',
            'https://registry.ping.pub'
        );
    }
    return path || '';
}

export async function loadFromDirectory(networkType: NetworkType): Promise<Record<string, ChainConfig>> {
    const chains: Record<string, ChainConfig> = {};
    const source = getConfigSource(networkType);
    console.log(`Loading chains from source: ${source}`);
    try {
        const res = await get(source);
        res.chains.forEach((x: DirectoryChain) => {
            chains[x.chain_name] = convertFromDirectory(x);
        });
    } catch (error) {
        console.error("Failed to load chains from registry:", error);
        throw error;
    }
    return chains;
}

function getConfigSource(networkType: NetworkType): ConfigSource {
    if (networkType === NetworkType.Testnet) {
        return ConfigSource.TestnetCosmosDirectory;
    }
    return ConfigSource.MainnetCosmosDirectory;
}

function convertFromDirectory(source: DirectoryChain): ChainConfig {
    const conf = {} as ChainConfig;
    (conf.assets = source.assets),
        (conf.bech32Prefix = source.bech32_prefix || ''),
        (conf.bech32ConsensusPrefix = source.bech32_prefix + 'valcons'),
        (conf.chainId = source.chain_id || ''),
        (conf.chainName = source.chain_name),
        (conf.prettyName = source.pretty_name || source.chain_name),
        (conf.versions = {
            application: source.versions?.application_version || '',
            cosmosSdk: source.versions?.cosmos_sdk_version || '',
            tendermint: source.versions?.tendermint_version || '',
        }),
        (conf.logo = pathConvert(source.image));
    conf.endpoints = source.best_apis;
    return conf;
}
