// OFAC SDN digital-currency addresses, republished per asset by
// https://github.com/0xB10C/ofac-sanctioned-digital-currency-addresses ("lists" branch).
// OFAC files 0x addresses under several assets, not only ETH: these are all the
// lists that contain EVM addresses as of 2026-09-27. Add any new asset list that does.
const OFAC_LISTS_BASE =
  'https://raw.githubusercontent.com/0xB10C/ofac-sanctioned-digital-currency-addresses/lists';
const EVM_ASSET_LISTS = ['ETH', 'USDT', 'USDC', 'ARB', 'BSC', 'ETC'];

let evmSanctioned: Promise<Set<string>> | undefined;

function loadEvmSanctioned(): Promise<Set<string>> {
  if (!evmSanctioned) {
    evmSanctioned = Promise.allSettled(
      EVM_ASSET_LISTS.map((asset) =>
        fetch(`${OFAC_LISTS_BASE}/sanctioned_addresses_${asset}.txt`).then(
          (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.text();
          }
        )
      )
    ).then((results) => {
      if (results.every((result) => result.status === 'rejected')) {
        evmSanctioned = undefined; // retry on the next lookup
      }
      const addresses = new Set<string>();
      for (const result of results) {
        if (result.status !== 'fulfilled') continue;
        for (const line of result.value.split('\n')) {
          const entry = line.trim().toLowerCase();
          if (entry.startsWith('0x')) addresses.add(entry);
        }
      }
      return addresses;
    });
  }
  return evmSanctioned;
}

// Positive matches only: a list that failed to load can hide a match, so a
// "not sanctioned" answer is never given. Never rejects.
export async function isOfacSanctionedEvm(address: string): Promise<boolean> {
  const addresses = await loadEvmSanctioned();
  return addresses.has(address.toLowerCase());
}
