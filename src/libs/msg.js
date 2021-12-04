/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
export const protobufPackage = "osmosis.gamm.v1beta1";
const baseSwapAmountInRoute = { poolId: Long.UZERO, tokenOutDenom: "" };
export const SwapAmountInRoute = {
    encode(message, writer = _m0.Writer.create()) {
        if (!message.poolId.isZero()) {
            writer.uint32(8).uint64(message.poolId);
        }
        if (message.tokenOutDenom !== "") {
            writer.uint32(18).string(message.tokenOutDenom);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSwapAmountInRoute);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.poolId = reader.uint64();
                    break;
                case 2:
                    message.tokenOutDenom = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSwapAmountInRoute);
        if (object.poolId !== undefined && object.poolId !== null) {
            message.poolId = Long.fromString(object.poolId);
        }
        else {
            message.poolId = Long.UZERO;
        }
        if (object.tokenOutDenom !== undefined && object.tokenOutDenom !== null) {
            message.tokenOutDenom = String(object.tokenOutDenom);
        }
        else {
            message.tokenOutDenom = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.poolId !== undefined &&
            (obj.poolId = (message.poolId || Long.UZERO).toString());
        message.tokenOutDenom !== undefined &&
            (obj.tokenOutDenom = message.tokenOutDenom);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSwapAmountInRoute);
        if (object.poolId !== undefined && object.poolId !== null) {
            message.poolId = object.poolId;
        }
        else {
            message.poolId = Long.UZERO;
        }
        if (object.tokenOutDenom !== undefined && object.tokenOutDenom !== null) {
            message.tokenOutDenom = object.tokenOutDenom;
        }
        else {
            message.tokenOutDenom = "";
        }
        return message;
    },
};
const baseCoin = { denom: "", amount: "" };
export const Coin = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.denom !== "") {
            writer.uint32(10).string(message.denom);
        }
        if (message.amount !== "") {
            writer.uint32(18).string(message.amount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseCoin);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = reader.string();
                    break;
                case 2:
                    message.amount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseCoin);
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = String(object.denom);
        }
        else {
            message.denom = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = String(object.amount);
        }
        else {
            message.amount = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.denom !== undefined && (obj.denom = message.denom);
        message.amount !== undefined && (obj.amount = message.amount);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseCoin);
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = object.denom;
        }
        else {
            message.denom = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = object.amount;
        }
        else {
            message.amount = "";
        }
        return message;
    },
};
const baseMsgSwapExactAmountIn = { sender: "", tokenOutMinAmount: "" };
export const MsgSwapExactAmountIn = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        for (const v of message.routes) {
            SwapAmountInRoute.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.tokenIn !== undefined) {
            Coin.encode(message.tokenIn, writer.uint32(26).fork()).ldelim();
        }
        if (message.tokenOutMinAmount !== "") {
            writer.uint32(34).string(message.tokenOutMinAmount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSwapExactAmountIn);
        message.routes = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.routes.push(SwapAmountInRoute.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.tokenIn = Coin.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.tokenOutMinAmount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgSwapExactAmountIn);
        message.routes = [];
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = String(object.sender);
        }
        else {
            message.sender = "";
        }
        if (object.routes !== undefined && object.routes !== null) {
            for (const e of object.routes) {
                message.routes.push(SwapAmountInRoute.fromJSON(e));
            }
        }
        if (object.tokenIn !== undefined && object.tokenIn !== null) {
            message.tokenIn = Coin.fromJSON(object.tokenIn);
        }
        else {
            message.tokenIn = undefined;
        }
        if (object.tokenOutMinAmount !== undefined &&
            object.tokenOutMinAmount !== null) {
            message.tokenOutMinAmount = String(object.tokenOutMinAmount);
        }
        else {
            message.tokenOutMinAmount = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined && (obj.sender = message.sender);
        if (message.routes) {
            obj.routes = message.routes.map((e) => e ? SwapAmountInRoute.toJSON(e) : undefined);
        }
        else {
            obj.routes = [];
        }
        message.tokenIn !== undefined &&
            (obj.tokenIn = message.tokenIn
                ? Coin.toJSON(message.tokenIn)
                : undefined);
        message.tokenOutMinAmount !== undefined &&
            (obj.tokenOutMinAmount = message.tokenOutMinAmount);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgSwapExactAmountIn);
        message.routes = [];
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        else {
            message.sender = "";
        }
        if (object.routes !== undefined && object.routes !== null) {
            for (const e of object.routes) {
                message.routes.push(SwapAmountInRoute.fromPartial(e));
            }
        }
        if (object.tokenIn !== undefined && object.tokenIn !== null) {
            message.tokenIn = Coin.fromPartial(object.tokenIn);
        }
        else {
            message.tokenIn = undefined;
        }
        if (object.tokenOutMinAmount !== undefined &&
            object.tokenOutMinAmount !== null) {
            message.tokenOutMinAmount = object.tokenOutMinAmount;
        }
        else {
            message.tokenOutMinAmount = "";
        }
        return message;
    },
};
if (_m0.util.Long !== Long) {
    _m0.util.Long = Long;
    _m0.configure();
}