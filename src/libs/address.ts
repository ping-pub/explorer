import {
  fromBase64,
  fromBech32,
  fromHex,
  toBase64,
  toBech32,
  toHex,
} from '@cosmjs/encoding';
import { PubKey as Ed25519PubKey } from 'cosmjs-types/cosmos/crypto/ed25519/keys';
import { PubKey as Secp256k1PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import { Ripemd160, sha256 } from '@cosmjs/crypto';
import type { Any } from 'cosmjs-types/google/protobuf/any';
import type { Key } from '@/types';

export function decodeAddress(address: string) {
  return fromBech32(address);
}

export function valoperToPrefix(valoper?: string) {
  if (!valoper) return '';
  const { prefix } = fromBech32(valoper);
  if (!prefix) return '';
  return prefix.replace('valoper', '');
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

export const decodeKey = (value: Any): Key => {
  const key: Key = {
    '@type': value.typeUrl,
    key: '',
  };
  try {
    switch (value.typeUrl) {
      case '/cosmos.crypto.ed25519.PubKey':
        key.key = toBase64(Ed25519PubKey.decode(value.value).key);
        break;
      default:
        key.key = toBase64(Secp256k1PubKey.decode(value.value).key);
        break;
    }
  } catch {
    // already decoded
    key.key = toBase64(value.value);
  }
  return key;
};

export function consensusPubkeyToKey(consensusPubkey?: Any) {
  if (!consensusPubkey) return;
  if (consensusPubkey.typeUrl === '/cosmos.crypto.ed25519.PubKey') {
    const value =
      // fix trim 0a20 at beginning of buffer
      consensusPubkey.value.length === 32
        ? new Uint8Array([10, 32, ...consensusPubkey.value])
        : consensusPubkey.value;
    return Ed25519PubKey.decode(value).key;
  }
  if (consensusPubkey.typeUrl === '/cosmos.crypto.secp256k1.PubKey') {
    return Secp256k1PubKey.decode(consensusPubkey.value).key;
  }
}

export function consensusPubkeyToHexAddress(consensusPubkey?: Any) {
  console.log('consensusPubkey', consensusPubkey);
  const pubkey = consensusPubkeyToKey(consensusPubkey);
  if (!pubkey) return '';
  if (consensusPubkey?.typeUrl === '/cosmos.crypto.ed25519.PubKey') {
    return toHex(sha256(pubkey)).slice(0, 40).toUpperCase();
  }

  if (consensusPubkey?.typeUrl === '/cosmos.crypto.secp256k1.PubKey') {
    return toHex(new Ripemd160().update(sha256(pubkey)).digest());
  }
  return '';
}

export function pubKeyToValcons(consensusPubkey: Any, prefix: string) {
  const pubkey = consensusPubkeyToKey(consensusPubkey);
  if (pubkey) {
    const addressData = sha256(pubkey).slice(0, 20);
    return toBech32(`${prefix}valcons`, addressData);
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
