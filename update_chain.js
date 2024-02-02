const path = require('path');
const fs = require('fs');

const chainsPath = path.join(__dirname, 'chains', 'mainnet');
const chainNameMap = {
  lum: 'lumnetwork',
  nym: 'nyx',
  centauri: 'composable',
  crypto: 'cryptoorgchain',
  empower: 'empowerchain',
  fetchai: 'fetchhub',
  iris: 'irisnet',
  secret: 'secretnetwork',
  terp: 'terpnetwork',
  band: 'bandchain',
  'terra-luna': 'terra',
  terra: 'terra2',
  cosmos: 'cosmoshub',
  'dyson-protocol': 'dyson',
};

const filterProvider = (providers) => {
  return providers.filter((p) => {
    const url = p.address || p;
    return url.startsWith('https://') && !url.includes('notional');
  });
};

const updateChain = async (chainFile) => {
  const first = chainFile.split('.')[0];
  const chainName = chainNameMap[first] || first;
  const filePath = path.join(chainsPath, chainFile);
  const chainData = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath).toString())
    : {};

  try {
    let data = await fetch(
      `https://raw.githubusercontent.com/cosmos/chain-registry/master/${chainName}/chain.json`
    ).then((res) => res.json());
    // re-assign
    chainData.cosmwasm_enabled = data.codebase?.cosmwasm_enabled ?? false;
    const logo = data.logo_URIs?.svg || data.logo_URIs?.png;
    if (logo) chainData.logo = logo;

    chainData.chain_name = data.chain_name;
    chainData.sdk_version = data.codebase.cosmos_sdk_version.match(
      /v((?:\d+\.)?(?:\d+\.)?(?:\*|\d+))/
    )[1];
    chainData.coin_type = data.slip44;
    chainData.min_tx_fee = data.fees.fee_tokens[0].low_gas_price;
    chainData.addr_prefix = data.bech32_prefix;
    chainData.api = filterProvider(data.apis.rest);
    chainData.grpc = filterProvider(data.apis.grpc);
    // re-assign assets
    data = await fetch(
      `https://raw.githubusercontent.com/cosmos/chain-registry/master/${chainName}/assetlist.json`
    ).then((res) => res.json());
    chainData.assets = data.assets.map((asset) => {
      return {
        base: asset.base,
        symbol: asset.symbol,
        exponent: asset.denom_units.find((u) => u.denom === asset.display)
          .exponent,
        coingecko_id: asset.coingecko_id ?? asset.display,
        logo: asset.logo_URIs?.svg || asset.logo_URIs?.png,
      };
    });
    const strData = JSON.stringify(chainData, null, 2);
    // console.log(strData);
    fs.writeFileSync(filePath, strData);
  } catch (ex) {
    console.log('Problem with', url, ex.toString());
  }
};

(async () => {
  if (process.argv[2]) {
    updateChain(process.argv[2]);
  } else {
    const chainFiles = fs.readdirSync(chainsPath);
    for (const chainFile of chainFiles) {
      await updateChain(chainFile);
    }
  }
})();
