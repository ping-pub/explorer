export function getLocalObject(name: string) {
  const text = localStorage.getItem(name);
  if (text) {
    return JSON.parse(text);
  }
  return null;
}

export function getLocalChains() {
  return 'osmosis';
}

export const percent = (num: number) => {
  return parseFloat((num * 100).toFixed(2));
};

const COUNT_ABBRS = [
  '',
  'K',
  'M',
  'B',
  't',
  'q',
  's',
  'S',
  'o',
  'n',
  'd',
  'U',
  'D',
  'T',
  'Qt',
  'Qd',
  'Sd',
  'St',
];

export function formatNumber(count: number, withAbbr = false, decimals = 2) {
  const i = count === 0 ? count : Math.floor(Math.log(count) / Math.log(1000));
  let result: any = parseFloat((count / 1000 ** i).toFixed(decimals));
  if (withAbbr && COUNT_ABBRS[i]) {
    result += `${COUNT_ABBRS[i]}`;
  }
  return result;
}

export function formatTokenAmount(
  assets: any,
  tokenAmount: any,
  decimals = 2,
  tokenDenom = 'uatom',
  format = true
) {
  const denom = tokenDenom?.denom_trace
    ? tokenDenom?.denom_trace?.base_denom
    : tokenDenom;
  let amount = 0;
  const asset = assets.find((a: any) => a.base === denom);
  let exp = asset
    ? asset.exponent
    : String(denom).startsWith('gravity')
    ? 18
    : 6;
  const config = Object.values(getLocalChains());

  amount = Number(Number(tokenAmount)) / 10 ** exp;
  if (amount > 10) {
    if (format) {
      return numberWithCommas(parseFloat(amount.toFixed(decimals)));
    }
    return parseFloat(amount.toFixed(decimals));
  }
  return parseFloat(amount.toFixed(exp));
}

export function numberWithCommas(x: any) {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function tokenFormatter(tokens: any, denoms = {}, decimal = 2) {
  if (Array.isArray(tokens)) {
    return tokens.map((t) => formatToken(t, denoms, decimal)).join(', ');
  }
  return formatToken(tokens, denoms, 2);
}
export function formatToken(
  token: any,
  IBCDenom = {},
  decimals = 2,
  withDenom = true
) {
  if (token) {
    const denom = IBCDenom[token.denom] || token.denom;
    if (withDenom) {
      return `${formatTokenAmount(
        token.amount,
        decimals,
        denom
      )} ${formatTokenDenom(denom)}`;
    }
    return formatTokenAmount(token.amount, decimals, denom);
  }
  return token;
}
export function formatTokenDenom(tokenDenom: any) {
  if (tokenDenom && tokenDenom.code === undefined) {
    let denom = tokenDenom.denom_trace
      ? tokenDenom.denom_trace.base_denom
      : tokenDenom;
    const chains = getLocalChains();
    const selected = localStorage.getItem('selected_chain');
    const selChain = chains[selected];
    const nativeAsset = selChain.assets.find((a) => a.base === denom);
    if (nativeAsset) {
      denom = nativeAsset.symbol;
    } else {
      const config = Object.values(chains);
      config.forEach((x) => {
        if (x.assets) {
          const asset = x.assets.find((a) => a.base === denom);
          if (asset) denom = asset.symbol;
        }
      });
    }
    return denom.length > 10
      ? `${denom.substring(0, 7).toUpperCase()}..${denom.substring(
          denom.length - 3
        )}`
      : denom.toUpperCase();
  }
  return '';
}

export function isToken(value: string) {
  let is = false;
  if (Array.isArray(value)) {
    is = value.findIndex((x) => Object.keys(x).includes('denom')) > -1;
  } else {
    is = Object.keys(value).includes('denom');
  }
  return is;
}
export function isStringArray(value: any) {
  let is = false;
  if (Array.isArray(value)) {
    is = value.findIndex((x) => typeof x === 'string') > -1;
  }
  return is;
}

export function isHexAddress(v: any) {
  // const re = /^[A-Z\d]{40}$/
  // return re.test(v)
  return v.length === 28;
}
