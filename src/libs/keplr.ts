import type { ChainConfig, DenomUnit } from '@/types/chaindata';
import { CosmosRestClient } from '@/libs/client';

export async function buildKeplrChainInfo(chain: ChainConfig) {
  if (!chain.endpoints?.rest?.at(0)) throw new Error('Endpoint does not set');
  const client = CosmosRestClient.newDefault(chain.endpoints.rest.at(0)!.address);
  const b = await client.getBaseBlockLatest();
  const chainId = b.block.header.chain_id;

  const gasPriceStep = chain.keplrPriceStep || {
    low: 0.01,
    average: 0.025,
    high: 0.03,
  };
  const coinDecimals =
    chain.assets[0].denom_units.find((x: DenomUnit) => x.denom === chain.assets[0].symbol.toLowerCase())?.exponent ||
    6;

  return {
    chainId,
    chainName: chain.chainName,
    rpc: chain.endpoints?.rpc?.at(0)?.address,
    rest: chain.endpoints?.rest?.at(0)?.address,
    bip44: { coinType: Number(chain.coinType) },
    coinType: Number(chain.coinType),
    bech32Config: {
      bech32PrefixAccAddr: chain.bech32Prefix,
      bech32PrefixAccPub: `${chain.bech32Prefix}pub`,
      bech32PrefixValAddr: `${chain.bech32Prefix}valoper`,
      bech32PrefixValPub: `${chain.bech32Prefix}valoperpub`,
      bech32PrefixConsAddr: `${chain.bech32Prefix}valcons`,
      bech32PrefixConsPub: `${chain.bech32Prefix}valconspub`,
    },
    currencies: [
      {
        coinDenom: chain.assets[0].symbol,
        coinMinimalDenom: chain.assets[0].base,
        coinDecimals,
        coinGeckoId: chain.assets[0].coingecko_id || 'unknown',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: chain.assets[0].symbol,
        coinMinimalDenom: chain.assets[0].base,
        coinDecimals,
        coinGeckoId: chain.assets[0].coingecko_id || 'unknown',
        gasPriceStep,
      },
    ],
    gasPriceStep,
    stakeCurrency: {
      coinDenom: chain.assets[0].symbol,
      coinMinimalDenom: chain.assets[0].base,
      coinDecimals,
      coinGeckoId: chain.assets[0].coingecko_id || 'unknown',
    },
    features: chain.keplrFeatures || [],
  };
}

export async function suggestKeplrChain(chain: ChainConfig) {
  // @ts-ignore
  const keplr = window.keplr;
  if (!keplr) throw new Error('Keplr extension not detected');
  const info = await buildKeplrChainInfo(chain);
  await keplr.experimentalSuggestChain(info);
  return info.chainId;
}
