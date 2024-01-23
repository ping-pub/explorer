const path = require('path');
const fs = require('fs');

const chainsPath = path.join(__dirname, 'chains', 'mainnet');
const chainNameMap = {
  crypto: 'cryptoorgchain',
  empower: 'empowerchain',
  fetchai: 'fetchhub',
  iris: 'irisnet',
  secret: 'secretnetwork',
  terp: 'terpnetwork',
  bandchain: 'band',
  'terra-luna': 'terra',
  cosmos: 'cosmoshub',
  'dyson-protocol': 'dyson',
};

const updateChain = async (chainFile) => {
  const first = chainFile.split('.')[0];
  const chainName = chainNameMap[first] || first;
  const url = `https://raw.githubusercontent.com/cosmos/chain-registry/master/${chainName}/chain.json`;
  try {
    const data = await fetch(url).then((res) => res.json());
    const cosmwasmEnabled = data.codebase?.cosmwasm_enabled ?? false;
    const logo = data.logo_URIs?.png;
    const filePath = path.join(chainsPath, chainFile);
    const chainData = JSON.parse(fs.readFileSync(filePath).toString());
    chainData.logo = logo;
    chainData.cosmwasm_enabled = cosmwasmEnabled;
    fs.writeFileSync(filePath, JSON.stringify(chainData, null, 2));
  } catch (ex) {
    console.log('Problem with', url, ex.toString());
  }
};

(async () => {
  const chainFiles = fs.readdirSync(chainsPath);
  for (const chainFile of chainFiles) {
    console.log('Updating', chainFile);
    await updateChain(chainFile);
  }
  //   updateChain('bitsong.json');
})();
