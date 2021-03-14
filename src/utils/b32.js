/*
 * @Description: 
 * @Author: dingyi
 * @Date: 2020-07-13 09:41:17
 * @lastTime: 2020-12-11 16:07:06
 * @LastEditors: dingyi
 */
"use strict"
// 可用于验证地址是否正确
import bech32 from 'bech32'
import hex from './hex'
import hashJs from "hash.js";
import { Base64 } from 'js-base64';

const b32 = {
  decode(value) {
    const words = bech32.decode(value)
    return Buffer.from(bech32.fromWords(words.words)).toString(`hex`)
  },
  encode(value, prefix = `cosmos1`, type = `hex`) {
    const words = bech32.toWords(Buffer.from(value, type))
    return bech32.encode(prefix, words)
  }
}

export default b32

export function base64ToPubkey(b64) {
  const hexUnit = Base64.toUint8Array(b64)
  const hex16 = Buffer.from(hexUnit).toString('hex')
  return b32.encode(hex16)
}

export function addressToHex(pubkey) {
  const bech32Str = bech32.decode(pubkey);
  const words = bech32Str.words;
  const str = bech32.fromWords(words);
  let hexStr = hex.bytesToHex(str);
  const resHex = hexStr.replace("1624DE6420", "");
  const pubkeyStr = hex.hexToBytes(resHex);
  const bytes = Buffer.from(pubkeyStr, "base64");
  const hashStr = hashJs
    .sha256()
    .update(bytes)
    .digest("hex");
  const res = hashStr
    .slice(0, 40)
    .toString("hex")
    .toUpperCase();
  return res;
}

export function validatorAddressToAccount(validatorAddress) {
  const chainName = window.chain.prefix; // TODO: 地址前缀问题
  const bech32Address = bech32.decode(validatorAddress);
  return bech32.encode(chainName, bech32Address.words);
}