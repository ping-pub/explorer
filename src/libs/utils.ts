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
  const denom = typeof tokenDenom === 'string'
    ? tokenDenom
    // @ts-ignore
    : tokenDenom?.denom_trace?.base_denom;
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
