import {
  fromBase64,
  fromBech32,
  toBech32,
  toHex,
} from '@cosmjs/encoding';
import { Ripemd160, sha256 } from '@cosmjs/crypto';

export function decodeAddress(address: string) {
  return fromBech32(address);
}

export function operatorAddressToAccount(operAddress?: string) {
  if (!operAddress) return '';
  const { prefix, data } = fromBech32(operAddress);
  if (prefix === 'iva') {
    // handle special cases
    return toBech32('iaa', data);
  }
  if (prefix === 'crocncl') {
    // handle special cases
    return toBech32('cro', data);
  }
  return toBech32(prefix.replace('valoper', ''), data);
}

export function consensusPubkeyToHexAddress(consensusPubkey?: {
  '@type': string;
  key: string;
}) {
  if (!consensusPubkey) return '';
  let raw = '';
  if (consensusPubkey['@type'] === '/cosmos.crypto.ed25519.PubKey') {
    const pubkey = fromBase64(consensusPubkey.key);
    if (pubkey) return toHex(sha256(pubkey)).slice(0, 40).toUpperCase();
  }

  if (consensusPubkey['@type'] === '/cosmos.crypto.secp256k1.PubKey') {
    const pubkey = fromBase64(consensusPubkey.key);
    if (pubkey) return toHex(new Ripemd160().update(sha256(pubkey)).digest());
  }
  return raw;
}

export function pubKeyToValcons(
  consensusPubkey: { '@type': string; key: string },
  prefix: string
) {
  if (consensusPubkey && consensusPubkey.key) {
    const pubkey = fromBase64(consensusPubkey.key);
    if (pubkey) {
      const addressData = sha256(pubkey).slice(0, 20);
      return toBech32(prefix, addressData);
    }
  }
  return '';
}

export function valconsToBase64(address: string) {
  if (address) return toHex(fromBech32(address).data).toUpperCase();
  return '';
}

export function toETHAddress(cosmosAddress: string) {
  return `0x${toHex(fromBech32(cosmosAddress).data)}`;
}

export function addressEnCode(prefix: string, pubkey: Uint8Array) {
  return toBech32(prefix, pubkey);
}
