import type { ChainConfig, Endpoint } from '@/types/chaindata';
import { NetworkType } from '@/types/chaindata';

export interface LocalConfig {
    addr_prefix: string;
    consensus_prefix?: string;
    alias: string;
    api: string[] | Endpoint[];
    grpc: Endpoint[];
    provider_chain: {
        api: string[] | Endpoint[]
    }
    assets: {
        base: string;
        coingecko_id: string;
        exponent: string;
        logo: string;
        symbol: string;
    }[];
    chain_name: string;
    coin_type: string;
    logo: string;
    theme_color?: string;
    min_tx_fee: string;
    rpc: string[] | Endpoint[];
    sdk_version: string;
    registry_name?: string;
    features?: string[];
    keplr_price_step?: {
        low: number,
        average: number,
        high: number,
    },
    keplr_features: string[],
    faucet?: {
        amount: string,
        ip_limit: number,
        address_limit: number,
        fees: string
    };
}

export async function loadFromLocal(network: NetworkType) {
    const config: Record<string, ChainConfig> = {}
    console.log(network, NetworkType.Mainnet, NetworkType.Testnet);
    const source: Record<string, LocalConfig> =
        network === NetworkType.Mainnet
            ? import.meta.glob('../../../chains/mainnet/*.json', { eager: true })
            : import.meta.glob('../../../chains/testnet/*.json', { eager: true });
    Object.values<LocalConfig>(source).forEach((x: LocalConfig) => {
        config[x.chain_name] = convertFromLocal(x);
    });
    return config
}

export function convertFromLocal(lc: LocalConfig): ChainConfig {
    const conf = {} as ChainConfig;
    if (lc.assets && Array.isArray(lc.assets)) {
        conf.assets = lc.assets.map((x) => ({
            name: x.base,
            base: x.base,
            display: x.symbol,
            symbol: x.symbol,
            logo_URIs: { svg: x.logo },
            coingecko_id: x.coingecko_id,
            exponent: x.exponent,
            denom_units: [
                { denom: x.base, exponent: 0 },
                { denom: x.symbol.toLowerCase(), exponent: Number(x.exponent) },
            ],
            type_asset: 'sdk.coin'
        }));
    }
    conf.versions = {
        cosmosSdk: lc.sdk_version
    }
    conf.bech32Prefix = lc.addr_prefix;
    conf.bech32ConsensusPrefix = lc.consensus_prefix ?? lc.addr_prefix + 'valcons';
    conf.chainName = lc.chain_name;
    conf.coinType = lc.coin_type;
    conf.prettyName = lc.registry_name || lc.chain_name;
    conf.endpoints = {
        rest: apiConverter(lc.api),
        rpc: apiConverter(lc.rpc),
        grpc: apiConverter(lc.grpc),
    };
    if (lc.provider_chain) {
        conf.providerChain = {
            api: apiConverter(lc.provider_chain.api)
        }
    }
    conf.features = lc.features
    conf.logo = lc.logo.startsWith('http') ? lc.logo : `https://ping.pub${lc.logo}`;
    conf.keplrFeatures = lc.keplr_features;
    conf.keplrPriceStep = lc.keplr_price_step;
    conf.themeColor = lc.theme_color;
    conf.faucet = lc.faucet;
    return conf;
}

function apiConverter(api: any[]) {
    if (!api) return [];
    const array = typeof api === 'string' ? [api] : api;
    return array.map((x) => {
        if (typeof x === 'string') {
            const parts = String(x).split('.');
            return {
                address: x,
                provider: parts.length >= 2 ? parts[parts.length - 2] : x,
            };
        } else {
            return x as Endpoint;
        }
    });
}
