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

export function stringToUint8Array(str: string) {
  const arr = [];
  for (let i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
  return new Uint8Array(arr);
}

export function uint8ArrayToString(arr: Uint8Array) {
  let str = '';
  for (let i = 0, j = arr.length; i < j; ++i) {
    str += String.fromCharCode(arr[i]);
  }
  return str;
}

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

export function isBech32Address(v?: string) {
  if(!v) return ""
  const pattern = /^[a-z\d]+1[a-z\d]{38}$/g
  return String(v).search(pattern) > -1
}

export function formatSeconds(value?: string) {
  if(!value) return ''
  const duration = Number(value.replace(/s/, ''))
  if(duration > 24*60*60) {
    return `${(duration / ( 24 * 60 * 60)).toFixed()} days`
  }
  if(duration > 60*60) {
    return `${(duration / (60 * 60)).toFixed()} hours`
  }    
  if(duration > 60) {
    return `${duration / 60} mins`
  }
  return value
}

export function hexToRgb(hex: string) {
  // remove '#'
  hex = hex.replace('#', '');
  // red
  const r = parseInt(hex.substring(0, 2), 16);
  // green
  const g = parseInt(hex.substring(2, 4), 16);
  // blue
  const b = parseInt(hex.substring(4, 6), 16);

  return {
    color: 'rgb(' + r + ', ' + g + ', ' + b + ')',
    r,
    g,
    b,
  };
}

export function rgbToHsl(color: string) {
  color = color.replace('rgb(', '');
  color = color.replace(')', '');
  const colorList = color.split(',') || [0, 0, 0];
  // console.log(colorList, 'colorList')
  const r = parseInt(colorList?.[0]) / 255;
  const g = parseInt(colorList?.[1]) / 255;
  const b = parseInt(colorList?.[2]) / 255;
  // console.log(r,g,b, '88')
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max == min) {
    h = 0;
    s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = h / 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return {
    color: 'hsl(' + h + ', ' + s + '%, ' + l + '%)',
    value: h + ' ' + s + ' ' + l,
    h,
    s,
    l,
  };
}
