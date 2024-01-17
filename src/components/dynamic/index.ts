import * as injProto from '@injectivelabs/core-proto-ts';
import { MsgType } from '@injectivelabs/ts-types';

import ObjectElement from './ObjectElement.vue';
import TextElement from './TextElement.vue';
import ArrayElement from './ArrayElement.vue';
import UInt8Array from './UInt8Array.vue';
import NumberElement from './NumberElement.vue';
import TokenElement from './TokenElement.vue';
import ObjectHorizontalElement from './ObjectHorizontalElement.vue';
import Long from 'long';

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
    case direct === 'horizontal':
      return ObjectHorizontalElement;
    default:
      return ObjectElement;
  }
}

const typeMap = Object.fromEntries(
  Object.entries(MsgType).map(([k, v]) => ['/' + v, k])
);

type TxType = keyof typeof MsgType;

const findType = (obj: any, type: string): any => {
  if (typeof obj !== 'object') return;
  const msg = obj[type];
  if (msg && msg.decode) return msg;
  for (const subObj of Object.values(obj)) {
    const find = findType(subObj, type);
    if (find) return find;
  }
};

export const decodeProto = (msg: { typeUrl: string; value: Uint8Array }) => {
  const type = typeMap[msg.typeUrl];
  if (type) {
    const obj = findType(injProto, type);
    if (obj) {
      const res = obj.decode(msg.value);
      if (res.msgs) {
        res.msgs = res.msgs.map(decodeProto);
      }
      return res;
    }
  }
};
