// eslint-disable-next-line import/no-extraneous-dependencies
const long1 = require('long')
const minimal1 = require('protobufjs-dbx/minimal')
const coin1 = require('cosmjs-types/cosmos/base/v1beta1/coin')
const client1 = require('cosmjs-types/ibc/core/client/v1/client')

const baseMsgTransfer = {
  sourcePort: '',
  sourceChannel: '',
  sender: '',
  receiver: '',
  timeoutTimestamp: '0',
}

exports.MsgTransfer = {
  encode(message, writer = minimal1.default.Writer.create()) {
    if (message.sourcePort !== '') {
      writer.uint32(10).string(message.sourcePort)
    }
    if (message.sourceChannel !== '') {
      writer.uint32(18).string(message.sourceChannel)
    }
    if (message.token !== undefined) {
      coin1.Coin.encode(message.token, writer.uint32(26).fork()).ldelim()
    }
    if (message.sender !== '') {
      writer.uint32(34).string(message.sender)
    }
    if (message.receiver !== '') {
      writer.uint32(42).string(message.receiver)
    }
    if (message.timeoutHeight !== undefined) {
      client1.Height.encode(message.timeoutHeight, writer.uint32(50).fork()).ldelim()
    }
    if (!message.timeoutTimestamp.isZero()) {
      writer.uint32(56).uint64(message.timeoutTimestamp)
    }
    return writer
  },
  decode(input, length) {
    const reader = input instanceof minimal1.default.Reader ? input : new minimal1.default.Reader(input)
    const end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseMsgTransfer }
    while (reader.pos < end) {
      const tag = reader.uint32()
      // eslint-disable-next-line no-bitwise
      switch (tag >>> 3) {
        case 1:
          message.sourcePort = reader.string()
          break
        case 2:
          message.sourceChannel = reader.string()
          break
        case 3:
          message.token = coin1.Coin.decode(reader, reader.uint32())
          break
        case 4:
          message.sender = reader.string()
          break
        case 5:
          message.receiver = reader.string()
          break
        case 6:
          message.timeoutHeight = client1.Height.decode(reader, reader.uint32())
          break
        case 7:
          message.timeoutTimestamp = reader.uint64()
          break
        default:
          // eslint-disable-next-line no-bitwise
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },
  fromJSON(object) {
    const message = { ...baseMsgTransfer }
    if (object.sourcePort !== undefined && object.sourcePort !== null) {
      message.sourcePort = String(object.sourcePort)
    } else {
      message.sourcePort = ''
    }
    if (object.sourceChannel !== undefined && object.sourceChannel !== null) {
      message.sourceChannel = String(object.sourceChannel)
    } else {
      message.sourceChannel = ''
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = coin1.Coin.fromJSON(object.token)
    } else {
      message.token = undefined
    }
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = String(object.sender)
    } else {
      message.sender = ''
    }
    if (object.receiver !== undefined && object.receiver !== null) {
      message.receiver = String(object.receiver)
    } else {
      message.receiver = ''
    }
    if (object.timeoutHeight !== undefined && object.timeoutHeight !== null) {
      message.timeoutHeight = client1.Height.fromJSON(object.timeoutHeight)
    } else {
      message.timeoutHeight = undefined
    }
    if (object.timeoutTimestamp !== undefined && object.timeoutTimestamp !== null) {
      message.timeoutTimestamp = long1.default.fromString(object.timeoutTimestamp)
    } else {
      message.timeoutTimestamp = long1.default.UZERO
    }
    return message
  },
  toJSON(message) {
    const obj = {}
    if (message.sourcePort !== undefined) obj.sourcePort = message.sourcePort
    if (message.sourceChannel !== undefined) obj.sourceChannel = message.sourceChannel
    if (message.token !== undefined) obj.token = message.token ? coin1.Coin.toJSON(message.token) : undefined
    if (message.sender !== undefined) obj.sender = message.sender
    if (message.receiver !== undefined) obj.receiver = message.receiver
    if (message.timeoutHeight !== undefined) obj.timeoutHeight = message.timeoutHeight ? client1.Height.toJSON(message.timeoutHeight) : undefined
    if (message.timeoutTimestamp !== undefined) obj.timeoutTimestamp = (message.timeoutTimestamp || '0').toString()
    return obj
  },
  fromPartial(object) {
    const message = { ...baseMsgTransfer }
    if (object.sourcePort !== undefined && object.sourcePort !== null) {
      message.sourcePort = object.sourcePort
    } else {
      message.sourcePort = ''
    }
    if (object.sourceChannel !== undefined && object.sourceChannel !== null) {
      message.sourceChannel = object.sourceChannel
    } else {
      message.sourceChannel = ''
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = coin1.Coin.fromPartial(object.token)
    } else {
      message.token = undefined
    }
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender
    } else {
      message.sender = ''
    }
    if (object.receiver !== undefined && object.receiver !== null) {
      message.receiver = object.receiver
    } else {
      message.receiver = ''
    }
    if (object.timeoutHeight !== undefined && object.timeoutHeight !== null) {
      message.timeoutHeight = client1.Height.fromPartial(object.timeoutHeight)
    } else {
      message.timeoutHeight = undefined
    }
    if (object.timeoutTimestamp !== undefined && object.timeoutTimestamp !== null) {
      message.timeoutTimestamp = object.timeoutTimestamp
    } else {
      message.timeoutTimestamp = long1.default.UZERO
    }
    return message
  },
}
