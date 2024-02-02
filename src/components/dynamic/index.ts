import * as injProto from '@injectivelabs/core-proto-ts';
import evmosProto from '@/libs/protos/evmos';
import osmoProto from '@/libs/protos/osmosis';
import { MsgType } from '@injectivelabs/ts-types';
import ObjectElement from './ObjectElement.vue';
import TextElement from './TextElement.vue';
import ArrayElement from './ArrayElement.vue';
import UInt8Array from './UInt8Array.vue';
import NumberElement from './NumberElement.vue';
import TokenElement from './TokenElement.vue';
import TimestampElement from './TimestampElement.vue';
import ObjectHorizontalElement from './ObjectHorizontalElement.vue';
import Long from 'long';
import { MsgRegistry } from 'secretjs';
import { fromBase64, toBech32 } from '@cosmjs/encoding';

export function select(v: any, direct?: string) {
  // if(k === 'txs' && v) {
  //     return TxsElement
  // } else {

  const type = typeof v;
  switch (type) {
    case 'object':
      return selectObject(v, direct);
    case 'number':
      return NumberElement;
    default:
      return TextElement;
  }
  // }
}

function selectObject(v: Object, direct?: string) {
  switch (true) {
    case v instanceof Long:
      return NumberElement;
    case v instanceof Uint8Array:
      return UInt8Array;
    case Array.isArray(v):
      return ArrayElement;
    case v &&
      Object.keys(v).includes('amount') &&
      Object.keys(v).includes('denom'): {
      return TokenElement;
    }
    case v && Object.keys(v).includes('seconds'):
    case v instanceof Date: {
      return TimestampElement;
    }
    case direct === 'horizontal':
      return ObjectHorizontalElement;
    default:
      return ObjectElement;
  }
}

const typeMap = Object.fromEntries(
  Object.entries(MsgType).map(([k, v]) => ['/' + v, k])
);

const findType = (obj: any, type: string): any => {
  if (typeof obj !== 'object') return;
  const msg = obj[type];
  if (msg && msg.decode) return msg;
  for (const subObj of Object.values(obj)) {
    const find = findType(subObj, type);
    if (find) return find;
  }
};

export const lookupType = (obj: any, typeUrl: string) => {
  const paths = typeUrl.slice(1).split('.');
  let type = obj;
  for (const path of paths) {
    type = type[path];
    if (!type) {
      break;
    }
  }
  return type;
};

export const decodeProto = (msg: {
  typeUrl?: string;
  type_url?: string;
  value: Uint8Array;
}) => {
  const typeUrl = msg.typeUrl ?? msg.type_url;
  if (!typeUrl) return msg;
  let type;
  if (typeUrl.startsWith('/osmosis.')) {
    // fallback with osmosis
    type = lookupType(osmoProto, typeUrl);
  } else if (
    typeUrl.startsWith('/evmos.') ||
    typeUrl.startsWith('/ethermint.')
  ) {
    // fallback with evmos
    type = lookupType(evmosProto, typeUrl);
  } else if (typeUrl.startsWith('/secret.')) {
    type = MsgRegistry.get(typeUrl);
  } else {
    type = findType(injProto, typeMap[typeUrl] ?? typeUrl.split('.').pop());
  }

  if (type) {
    const instance = (type.decode || type.deserialize)(
      typeof msg.value === 'string' ? fromBase64(msg.value) : msg.value
    );
    if (instance.msgs) {
      instance.msgs = instance.msgs.map(decodeProto);
    }
    if (instance.data) {
      instance.data = decodeProto(instance.data);
    }

    // fix for secret
    if (typeUrl.startsWith('/secret.')) {
      if (instance.sender)
        instance.sender = toBech32('secret', instance.sender);
      if (instance.contract)
        instance.contract = toBech32('secret', instance.contract);
    }

    return instance;
  }
};
