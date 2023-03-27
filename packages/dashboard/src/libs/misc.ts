import { sha256 } from "@cosmjs/crypto";
import { toHex } from "@cosmjs/encoding";
import { PageRequest } from "@ping-pub/codegen/src/cosmos/base/query/v1beta1/pagination";

export function newPageRequest(param: {
    key?: Uint8Array,
    limit?: number,
    offset?: number,
    countTotal?: boolean,
    reverse?: boolean
}) {
    return PageRequest.fromPartial(
        param
    )
}

export function hashTx(raw: Uint8Array) {
    return toHex(sha256(raw)).toUpperCase()
}