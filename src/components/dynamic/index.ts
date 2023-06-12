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
    case v && Object.keys(v).includes('amount') && Object.keys(v).includes('denom'): {
      return TokenElement;
    }
    case direct === 'horizontal':
      return ObjectHorizontalElement;
    default:
      return ObjectElement;
  }
}
