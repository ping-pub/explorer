import ObjectElement from './ObjectElement.vue'
import TextElement from './TextElement.vue'
import ArrayElement from './ArrayElement.vue'
import UInt8Array from './UInt8Array.vue'
import NumberElement from './NumberElement.vue'
import TxsElement from './TxsElement.vue'
import Long from 'long'

export function select(v: any, k?: any) {
    if(k === 'txs' && v) {
        console.log("=======txs=======", k, v)
        return TxsElement
    } else {
        const type = typeof v
        switch(type) {
            case 'object':
                return selectObject(v)
            case 'number':
                return NumberElement
            default: 
                return TextElement
        }
    }
}

function selectObject(v: Object) {
    switch(true) {
        case v instanceof Long:
            return NumberElement
        case v instanceof Uint8Array:
            return UInt8Array
        case Array.isArray(v):
            return ArrayElement
        default:
            return ObjectElement
    }
}