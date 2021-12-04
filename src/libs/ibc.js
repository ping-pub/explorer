/* eslint-disable */
import * as $protobuf from "protobufjs-dbx/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

/**
 * Namespace ibc.
 * @exports ibc
 * @namespace
 */

export const ibc = $root.ibc = ((ibc) => {

    /**
     * Namespace applications.
     * @memberof ibc
     * @namespace
     */

    ibc.applications = (function(applications) {

        /**
         * Namespace transfer.
         * @memberof ibc.applications
         * @namespace
         */

        applications.transfer = (function(transfer) {

            /**
             * Namespace v1.
             * @memberof ibc.applications.transfer
             * @namespace
             */

            transfer.v1 = (function(v1) {

                v1.Msg = (function(Msg) {

                    /**
                     * Constructs a new Msg service.
                     * @memberof ibc.applications.transfer.v1
                     * @classdesc Represents a Msg
                     * @extends $protobuf.rpc.Service
                     * @constructor
                     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                     */
                    function Msg(rpcImpl, requestDelimited, responseDelimited) {
                        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
                    }

                    (Msg.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Msg;

                    /**
                     * Creates new Msg service using the specified rpc implementation.
                     * @function create
                     * @memberof ibc.applications.transfer.v1.Msg
                     * @static
                     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                     * @returns {Msg} RPC service. Useful where requests and/or responses are streamed.
                     */
                    Msg.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                        return new this(rpcImpl, requestDelimited, responseDelimited);
                    };

                    /**
                     * Callback as used by {@link ibc.applications.transfer.v1.Msg#transfer}.
                     * @memberof ibc.applications.transfer.v1.Msg
                     * @typedef TransferCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {ibc.applications.transfer.v1.IMsgTransferResponse} [response] MsgTransferResponse
                     */

                    /**
                     * Calls Transfer.
                     * @function transfer
                     * @memberof ibc.applications.transfer.v1.Msg
                     * @instance
                     * @param {ibc.applications.transfer.v1.IMsgTransfer} request MsgTransfer message or plain object
                     * @param {ibc.applications.transfer.v1.Msg.TransferCallback} callback Node-style callback called with the error, if any, and MsgTransferResponse
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(Msg.prototype.transfer = function transfer(request, callback) {
                        return this.rpcCall(transfer, $root.ibc.applications.transfer.v1.MsgTransfer, $root.ibc.applications.transfer.v1.MsgTransferResponse, request, callback);
                    }, "name", { value: "Transfer" });

                    /**
                     * Calls Transfer.
                     * @function transfer
                     * @memberof ibc.applications.transfer.v1.Msg
                     * @instance
                     * @param {ibc.applications.transfer.v1.IMsgTransfer} request MsgTransfer message or plain object
                     * @returns {Promise<ibc.applications.transfer.v1.IMsgTransferResponse>} Promise
                     * @variation 2
                     */

                    return Msg;
                })(v1.Msg || {});

                v1.MsgTransfer = (function(MsgTransfer) {

                    /**
                     * Properties of a MsgTransfer.
                     * @memberof ibc.applications.transfer.v1
                     * @interface IMsgTransfer
                     * @property {string|null} [sourcePort] MsgTransfer sourcePort
                     * @property {string|null} [sourceChannel] MsgTransfer sourceChannel
                     * @property {cosmos.base.v1beta1.ICoin|null} [token] MsgTransfer token
                     * @property {string|null} [sender] MsgTransfer sender
                     * @property {string|null} [receiver] MsgTransfer receiver
                     * @property {ibc.core.client.v1.IHeight|null} [timeoutHeight] MsgTransfer timeoutHeight
                     * @property {number|Long|null} [timeoutTimestamp] MsgTransfer timeoutTimestamp
                     */

                    /**
                     * Constructs a new MsgTransfer.
                     * @memberof ibc.applications.transfer.v1
                     * @classdesc Represents a MsgTransfer.
                     * @implements IMsgTransfer
                     * @constructor
                     * @param {ibc.applications.transfer.v1.IMsgTransfer=} [properties] Properties to set
                     */
                    function MsgTransfer(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * MsgTransfer sourcePort.
                     * @member {string} sourcePort
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @instance
                     */
                    MsgTransfer.prototype.sourcePort = "";

                    /**
                     * MsgTransfer sourceChannel.
                     * @member {string} sourceChannel
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @instance
                     */
                    MsgTransfer.prototype.sourceChannel = "";

                    /**
                     * MsgTransfer token.
                     * @member {cosmos.base.v1beta1.ICoin|null|undefined} token
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @instance
                     */
                    MsgTransfer.prototype.token = null;

                    /**
                     * MsgTransfer sender.
                     * @member {string} sender
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @instance
                     */
                    MsgTransfer.prototype.sender = "";

                    /**
                     * MsgTransfer receiver.
                     * @member {string} receiver
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @instance
                     */
                    MsgTransfer.prototype.receiver = "";

                    /**
                     * MsgTransfer timeoutHeight.
                     * @member {ibc.core.client.v1.IHeight|null|undefined} timeoutHeight
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @instance
                     */
                    MsgTransfer.prototype.timeoutHeight = null;

                    /**
                     * MsgTransfer timeoutTimestamp.
                     * @member {number|Long} timeoutTimestamp
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @instance
                     */
                    MsgTransfer.prototype.timeoutTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * Creates a new MsgTransfer instance using the specified properties.
                     * @function create
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @static
                     * @param {ibc.applications.transfer.v1.IMsgTransfer=} [properties] Properties to set
                     * @returns {ibc.applications.transfer.v1.MsgTransfer} MsgTransfer instance
                     */
                    MsgTransfer.create = function create(properties) {
                        return new MsgTransfer(properties);
                    };

                    /**
                     * Encodes the specified MsgTransfer message. Does not implicitly {@link ibc.applications.transfer.v1.MsgTransfer.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @static
                     * @param {ibc.applications.transfer.v1.IMsgTransfer} message MsgTransfer message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgTransfer.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.sourcePort != null && Object.hasOwnProperty.call(message, "sourcePort"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.sourcePort);
                        if (message.sourceChannel != null && Object.hasOwnProperty.call(message, "sourceChannel"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sourceChannel);
                        if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                            $root.cosmos.base.v1beta1.Coin.encode(message.token, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        if (message.sender != null && Object.hasOwnProperty.call(message, "sender"))
                            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sender);
                        if (message.receiver != null && Object.hasOwnProperty.call(message, "receiver"))
                            writer.uint32(/* id 5, wireType 2 =*/42).string(message.receiver);
                        if (message.timeoutHeight != null && Object.hasOwnProperty.call(message, "timeoutHeight"))
                            $root.ibc.core.client.v1.Height.encode(message.timeoutHeight, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                        if (message.timeoutTimestamp != null && Object.hasOwnProperty.call(message, "timeoutTimestamp"))
                            writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.timeoutTimestamp);
                        return writer;
                    };

                    /**
                     * Encodes the specified MsgTransfer message, length delimited. Does not implicitly {@link ibc.applications.transfer.v1.MsgTransfer.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @static
                     * @param {ibc.applications.transfer.v1.IMsgTransfer} message MsgTransfer message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgTransfer.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a MsgTransfer message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.applications.transfer.v1.MsgTransfer} MsgTransfer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgTransfer.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.applications.transfer.v1.MsgTransfer();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.sourcePort = reader.string();
                                break;
                            case 2:
                                message.sourceChannel = reader.string();
                                break;
                            case 3:
                                message.token = $root.cosmos.base.v1beta1.Coin.decode(reader, reader.uint32());
                                break;
                            case 4:
                                message.sender = reader.string();
                                break;
                            case 5:
                                message.receiver = reader.string();
                                break;
                            case 6:
                                message.timeoutHeight = $root.ibc.core.client.v1.Height.decode(reader, reader.uint32());
                                break;
                            case 7:
                                message.timeoutTimestamp = reader.uint64();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MsgTransfer message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.applications.transfer.v1.MsgTransfer} MsgTransfer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgTransfer.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MsgTransfer message.
                     * @function verify
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MsgTransfer.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.sourcePort != null && message.hasOwnProperty("sourcePort"))
                            if (!$util.isString(message.sourcePort))
                                return "sourcePort: string expected";
                        if (message.sourceChannel != null && message.hasOwnProperty("sourceChannel"))
                            if (!$util.isString(message.sourceChannel))
                                return "sourceChannel: string expected";
                        if (message.token != null && message.hasOwnProperty("token")) {
                            let error = $root.cosmos.base.v1beta1.Coin.verify(message.token);
                            if (error)
                                return "token." + error;
                        }
                        if (message.sender != null && message.hasOwnProperty("sender"))
                            if (!$util.isString(message.sender))
                                return "sender: string expected";
                        if (message.receiver != null && message.hasOwnProperty("receiver"))
                            if (!$util.isString(message.receiver))
                                return "receiver: string expected";
                        if (message.timeoutHeight != null && message.hasOwnProperty("timeoutHeight")) {
                            let error = $root.ibc.core.client.v1.Height.verify(message.timeoutHeight);
                            if (error)
                                return "timeoutHeight." + error;
                        }
                        if (message.timeoutTimestamp != null && message.hasOwnProperty("timeoutTimestamp"))
                            if (!$util.isInteger(message.timeoutTimestamp) && !(message.timeoutTimestamp && $util.isInteger(message.timeoutTimestamp.low) && $util.isInteger(message.timeoutTimestamp.high)))
                                return "timeoutTimestamp: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a MsgTransfer message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.applications.transfer.v1.MsgTransfer} MsgTransfer
                     */
                    MsgTransfer.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.applications.transfer.v1.MsgTransfer)
                            return object;
                        let message = new $root.ibc.applications.transfer.v1.MsgTransfer();
                        if (object.sourcePort != null)
                            message.sourcePort = String(object.sourcePort);
                        if (object.sourceChannel != null)
                            message.sourceChannel = String(object.sourceChannel);
                        if (object.token != null) {
                            if (typeof object.token !== "object")
                                throw TypeError(".ibc.applications.transfer.v1.MsgTransfer.token: object expected");
                            message.token = $root.cosmos.base.v1beta1.Coin.fromObject(object.token);
                        }
                        if (object.sender != null)
                            message.sender = String(object.sender);
                        if (object.receiver != null)
                            message.receiver = String(object.receiver);
                        if (object.timeoutHeight != null) {
                            if (typeof object.timeoutHeight !== "object")
                                throw TypeError(".ibc.applications.transfer.v1.MsgTransfer.timeoutHeight: object expected");
                            message.timeoutHeight = $root.ibc.core.client.v1.Height.fromObject(object.timeoutHeight);
                        }
                        if (object.timeoutTimestamp != null)
                            if ($util.Long)
                                (message.timeoutTimestamp = $util.Long.fromValue(object.timeoutTimestamp)).unsigned = true;
                            else if (typeof object.timeoutTimestamp === "string")
                                message.timeoutTimestamp = parseInt(object.timeoutTimestamp, 10);
                            else if (typeof object.timeoutTimestamp === "number")
                                message.timeoutTimestamp = object.timeoutTimestamp;
                            else if (typeof object.timeoutTimestamp === "object")
                                message.timeoutTimestamp = new $util.LongBits(object.timeoutTimestamp.low >>> 0, object.timeoutTimestamp.high >>> 0).toNumber(true);
                        return message;
                    };

                    /**
                     * Creates a plain object from a MsgTransfer message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @static
                     * @param {ibc.applications.transfer.v1.MsgTransfer} message MsgTransfer
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MsgTransfer.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.sourcePort = "";
                            object.sourceChannel = "";
                            object.token = null;
                            object.sender = "";
                            object.receiver = "";
                            object.timeoutHeight = null;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.timeoutTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timeoutTimestamp = options.longs === String ? "0" : 0;
                        }
                        if (message.sourcePort != null && message.hasOwnProperty("sourcePort"))
                            object.sourcePort = message.sourcePort;
                        if (message.sourceChannel != null && message.hasOwnProperty("sourceChannel"))
                            object.sourceChannel = message.sourceChannel;
                        if (message.token != null && message.hasOwnProperty("token"))
                            object.token = $root.cosmos.base.v1beta1.Coin.toObject(message.token, options);
                        if (message.sender != null && message.hasOwnProperty("sender"))
                            object.sender = message.sender;
                        if (message.receiver != null && message.hasOwnProperty("receiver"))
                            object.receiver = message.receiver;
                        if (message.timeoutHeight != null && message.hasOwnProperty("timeoutHeight"))
                            object.timeoutHeight = $root.ibc.core.client.v1.Height.toObject(message.timeoutHeight, options);
                        if (message.timeoutTimestamp != null && message.hasOwnProperty("timeoutTimestamp"))
                            if (typeof message.timeoutTimestamp === "number")
                                object.timeoutTimestamp = options.longs === String ? String(message.timeoutTimestamp) : message.timeoutTimestamp;
                            else
                                object.timeoutTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timeoutTimestamp) : options.longs === Number ? new $util.LongBits(message.timeoutTimestamp.low >>> 0, message.timeoutTimestamp.high >>> 0).toNumber(true) : message.timeoutTimestamp;
                        return object;
                    };

                    /**
                     * Converts this MsgTransfer to JSON.
                     * @function toJSON
                     * @memberof ibc.applications.transfer.v1.MsgTransfer
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MsgTransfer.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return MsgTransfer;
                })(v1.MsgTransfer || {});

                v1.MsgTransferResponse = (function(MsgTransferResponse) {

                    /**
                     * Properties of a MsgTransferResponse.
                     * @memberof ibc.applications.transfer.v1
                     * @interface IMsgTransferResponse
                     */

                    /**
                     * Constructs a new MsgTransferResponse.
                     * @memberof ibc.applications.transfer.v1
                     * @classdesc Represents a MsgTransferResponse.
                     * @implements IMsgTransferResponse
                     * @constructor
                     * @param {ibc.applications.transfer.v1.IMsgTransferResponse=} [properties] Properties to set
                     */
                    function MsgTransferResponse(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Creates a new MsgTransferResponse instance using the specified properties.
                     * @function create
                     * @memberof ibc.applications.transfer.v1.MsgTransferResponse
                     * @static
                     * @param {ibc.applications.transfer.v1.IMsgTransferResponse=} [properties] Properties to set
                     * @returns {ibc.applications.transfer.v1.MsgTransferResponse} MsgTransferResponse instance
                     */
                    MsgTransferResponse.create = function create(properties) {
                        return new MsgTransferResponse(properties);
                    };

                    /**
                     * Encodes the specified MsgTransferResponse message. Does not implicitly {@link ibc.applications.transfer.v1.MsgTransferResponse.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.applications.transfer.v1.MsgTransferResponse
                     * @static
                     * @param {ibc.applications.transfer.v1.IMsgTransferResponse} message MsgTransferResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgTransferResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        return writer;
                    };

                    /**
                     * Encodes the specified MsgTransferResponse message, length delimited. Does not implicitly {@link ibc.applications.transfer.v1.MsgTransferResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.applications.transfer.v1.MsgTransferResponse
                     * @static
                     * @param {ibc.applications.transfer.v1.IMsgTransferResponse} message MsgTransferResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgTransferResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a MsgTransferResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.applications.transfer.v1.MsgTransferResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.applications.transfer.v1.MsgTransferResponse} MsgTransferResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgTransferResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.applications.transfer.v1.MsgTransferResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MsgTransferResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.applications.transfer.v1.MsgTransferResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.applications.transfer.v1.MsgTransferResponse} MsgTransferResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgTransferResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MsgTransferResponse message.
                     * @function verify
                     * @memberof ibc.applications.transfer.v1.MsgTransferResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MsgTransferResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        return null;
                    };

                    /**
                     * Creates a MsgTransferResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.applications.transfer.v1.MsgTransferResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.applications.transfer.v1.MsgTransferResponse} MsgTransferResponse
                     */
                    MsgTransferResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.applications.transfer.v1.MsgTransferResponse)
                            return object;
                        return new $root.ibc.applications.transfer.v1.MsgTransferResponse();
                    };

                    /**
                     * Creates a plain object from a MsgTransferResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.applications.transfer.v1.MsgTransferResponse
                     * @static
                     * @param {ibc.applications.transfer.v1.MsgTransferResponse} message MsgTransferResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MsgTransferResponse.toObject = function toObject() {
                        return {};
                    };

                    /**
                     * Converts this MsgTransferResponse to JSON.
                     * @function toJSON
                     * @memberof ibc.applications.transfer.v1.MsgTransferResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MsgTransferResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return MsgTransferResponse;
                })(v1.MsgTransferResponse || {});

                return v1;
            })(transfer.v1 || {});

            return transfer;
        })(applications.transfer || {});

        return applications;
    })(ibc.applications || {});

    /**
     * Namespace core.
     * @memberof ibc
     * @namespace
     */

    ibc.core = (function(core) {

        /**
         * Namespace client.
         * @memberof ibc.core
         * @namespace
         */

        core.client = (function(client) {

            /**
             * Namespace v1.
             * @memberof ibc.core.client
             * @namespace
             */

            client.v1 = (function(v1) {

                v1.IdentifiedClientState = (function(IdentifiedClientState) {

                    /**
                     * Properties of an IdentifiedClientState.
                     * @memberof ibc.core.client.v1
                     * @interface IIdentifiedClientState
                     * @property {string|null} [clientId] IdentifiedClientState clientId
                     * @property {google.protobuf.IAny|null} [clientState] IdentifiedClientState clientState
                     */

                    /**
                     * Constructs a new IdentifiedClientState.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents an IdentifiedClientState.
                     * @implements IIdentifiedClientState
                     * @constructor
                     * @param {ibc.core.client.v1.IIdentifiedClientState=} [properties] Properties to set
                     */
                    function IdentifiedClientState(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * IdentifiedClientState clientId.
                     * @member {string} clientId
                     * @memberof ibc.core.client.v1.IdentifiedClientState
                     * @instance
                     */
                    IdentifiedClientState.prototype.clientId = "";

                    /**
                     * IdentifiedClientState clientState.
                     * @member {google.protobuf.IAny|null|undefined} clientState
                     * @memberof ibc.core.client.v1.IdentifiedClientState
                     * @instance
                     */
                    IdentifiedClientState.prototype.clientState = null;

                    /**
                     * Creates a new IdentifiedClientState instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.IdentifiedClientState
                     * @static
                     * @param {ibc.core.client.v1.IIdentifiedClientState=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.IdentifiedClientState} IdentifiedClientState instance
                     */
                    IdentifiedClientState.create = function create(properties) {
                        return new IdentifiedClientState(properties);
                    };

                    /**
                     * Encodes the specified IdentifiedClientState message. Does not implicitly {@link ibc.core.client.v1.IdentifiedClientState.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.IdentifiedClientState
                     * @static
                     * @param {ibc.core.client.v1.IIdentifiedClientState} message IdentifiedClientState message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    IdentifiedClientState.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
                        if (message.clientState != null && Object.hasOwnProperty.call(message, "clientState"))
                            $root.google.protobuf.Any.encode(message.clientState, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified IdentifiedClientState message, length delimited. Does not implicitly {@link ibc.core.client.v1.IdentifiedClientState.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.IdentifiedClientState
                     * @static
                     * @param {ibc.core.client.v1.IIdentifiedClientState} message IdentifiedClientState message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    IdentifiedClientState.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes an IdentifiedClientState message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.IdentifiedClientState
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.IdentifiedClientState} IdentifiedClientState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    IdentifiedClientState.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.IdentifiedClientState();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clientId = reader.string();
                                break;
                            case 2:
                                message.clientState = $root.google.protobuf.Any.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes an IdentifiedClientState message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.IdentifiedClientState
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.IdentifiedClientState} IdentifiedClientState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    IdentifiedClientState.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies an IdentifiedClientState message.
                     * @function verify
                     * @memberof ibc.core.client.v1.IdentifiedClientState
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    IdentifiedClientState.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            if (!$util.isString(message.clientId))
                                return "clientId: string expected";
                        if (message.clientState != null && message.hasOwnProperty("clientState")) {
                            let error = $root.google.protobuf.Any.verify(message.clientState);
                            if (error)
                                return "clientState." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates an IdentifiedClientState message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.IdentifiedClientState
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.IdentifiedClientState} IdentifiedClientState
                     */
                    IdentifiedClientState.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.IdentifiedClientState)
                            return object;
                        let message = new $root.ibc.core.client.v1.IdentifiedClientState();
                        if (object.clientId != null)
                            message.clientId = String(object.clientId);
                        if (object.clientState != null) {
                            if (typeof object.clientState !== "object")
                                throw TypeError(".ibc.core.client.v1.IdentifiedClientState.clientState: object expected");
                            message.clientState = $root.google.protobuf.Any.fromObject(object.clientState);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from an IdentifiedClientState message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.IdentifiedClientState
                     * @static
                     * @param {ibc.core.client.v1.IdentifiedClientState} message IdentifiedClientState
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    IdentifiedClientState.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.clientId = "";
                            object.clientState = null;
                        }
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            object.clientId = message.clientId;
                        if (message.clientState != null && message.hasOwnProperty("clientState"))
                            object.clientState = $root.google.protobuf.Any.toObject(message.clientState, options);
                        return object;
                    };

                    /**
                     * Converts this IdentifiedClientState to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.IdentifiedClientState
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    IdentifiedClientState.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return IdentifiedClientState;
                })(v1.IdentifiedClientState || {});

                v1.ConsensusStateWithHeight = (function(ConsensusStateWithHeight) {

                    /**
                     * Properties of a ConsensusStateWithHeight.
                     * @memberof ibc.core.client.v1
                     * @interface IConsensusStateWithHeight
                     * @property {ibc.core.client.v1.IHeight|null} [height] ConsensusStateWithHeight height
                     * @property {google.protobuf.IAny|null} [consensusState] ConsensusStateWithHeight consensusState
                     */

                    /**
                     * Constructs a new ConsensusStateWithHeight.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a ConsensusStateWithHeight.
                     * @implements IConsensusStateWithHeight
                     * @constructor
                     * @param {ibc.core.client.v1.IConsensusStateWithHeight=} [properties] Properties to set
                     */
                    function ConsensusStateWithHeight(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * ConsensusStateWithHeight height.
                     * @member {ibc.core.client.v1.IHeight|null|undefined} height
                     * @memberof ibc.core.client.v1.ConsensusStateWithHeight
                     * @instance
                     */
                    ConsensusStateWithHeight.prototype.height = null;

                    /**
                     * ConsensusStateWithHeight consensusState.
                     * @member {google.protobuf.IAny|null|undefined} consensusState
                     * @memberof ibc.core.client.v1.ConsensusStateWithHeight
                     * @instance
                     */
                    ConsensusStateWithHeight.prototype.consensusState = null;

                    /**
                     * Creates a new ConsensusStateWithHeight instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.ConsensusStateWithHeight
                     * @static
                     * @param {ibc.core.client.v1.IConsensusStateWithHeight=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.ConsensusStateWithHeight} ConsensusStateWithHeight instance
                     */
                    ConsensusStateWithHeight.create = function create(properties) {
                        return new ConsensusStateWithHeight(properties);
                    };

                    /**
                     * Encodes the specified ConsensusStateWithHeight message. Does not implicitly {@link ibc.core.client.v1.ConsensusStateWithHeight.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.ConsensusStateWithHeight
                     * @static
                     * @param {ibc.core.client.v1.IConsensusStateWithHeight} message ConsensusStateWithHeight message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ConsensusStateWithHeight.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            $root.ibc.core.client.v1.Height.encode(message.height, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.consensusState != null && Object.hasOwnProperty.call(message, "consensusState"))
                            $root.google.protobuf.Any.encode(message.consensusState, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified ConsensusStateWithHeight message, length delimited. Does not implicitly {@link ibc.core.client.v1.ConsensusStateWithHeight.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.ConsensusStateWithHeight
                     * @static
                     * @param {ibc.core.client.v1.IConsensusStateWithHeight} message ConsensusStateWithHeight message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ConsensusStateWithHeight.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a ConsensusStateWithHeight message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.ConsensusStateWithHeight
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.ConsensusStateWithHeight} ConsensusStateWithHeight
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ConsensusStateWithHeight.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.ConsensusStateWithHeight();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.height = $root.ibc.core.client.v1.Height.decode(reader, reader.uint32());
                                break;
                            case 2:
                                message.consensusState = $root.google.protobuf.Any.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a ConsensusStateWithHeight message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.ConsensusStateWithHeight
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.ConsensusStateWithHeight} ConsensusStateWithHeight
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ConsensusStateWithHeight.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a ConsensusStateWithHeight message.
                     * @function verify
                     * @memberof ibc.core.client.v1.ConsensusStateWithHeight
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    ConsensusStateWithHeight.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.height != null && message.hasOwnProperty("height")) {
                            let error = $root.ibc.core.client.v1.Height.verify(message.height);
                            if (error)
                                return "height." + error;
                        }
                        if (message.consensusState != null && message.hasOwnProperty("consensusState")) {
                            let error = $root.google.protobuf.Any.verify(message.consensusState);
                            if (error)
                                return "consensusState." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a ConsensusStateWithHeight message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.ConsensusStateWithHeight
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.ConsensusStateWithHeight} ConsensusStateWithHeight
                     */
                    ConsensusStateWithHeight.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.ConsensusStateWithHeight)
                            return object;
                        let message = new $root.ibc.core.client.v1.ConsensusStateWithHeight();
                        if (object.height != null) {
                            if (typeof object.height !== "object")
                                throw TypeError(".ibc.core.client.v1.ConsensusStateWithHeight.height: object expected");
                            message.height = $root.ibc.core.client.v1.Height.fromObject(object.height);
                        }
                        if (object.consensusState != null) {
                            if (typeof object.consensusState !== "object")
                                throw TypeError(".ibc.core.client.v1.ConsensusStateWithHeight.consensusState: object expected");
                            message.consensusState = $root.google.protobuf.Any.fromObject(object.consensusState);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a ConsensusStateWithHeight message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.ConsensusStateWithHeight
                     * @static
                     * @param {ibc.core.client.v1.ConsensusStateWithHeight} message ConsensusStateWithHeight
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    ConsensusStateWithHeight.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.height = null;
                            object.consensusState = null;
                        }
                        if (message.height != null && message.hasOwnProperty("height"))
                            object.height = $root.ibc.core.client.v1.Height.toObject(message.height, options);
                        if (message.consensusState != null && message.hasOwnProperty("consensusState"))
                            object.consensusState = $root.google.protobuf.Any.toObject(message.consensusState, options);
                        return object;
                    };

                    /**
                     * Converts this ConsensusStateWithHeight to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.ConsensusStateWithHeight
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    ConsensusStateWithHeight.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ConsensusStateWithHeight;
                })(v1.ConsensusStateWithHeight || {});

                v1.ClientConsensusStates = (function(ClientConsensusStates) {

                    /**
                     * Properties of a ClientConsensusStates.
                     * @memberof ibc.core.client.v1
                     * @interface IClientConsensusStates
                     * @property {string|null} [clientId] ClientConsensusStates clientId
                     * @property {Array.<ibc.core.client.v1.IConsensusStateWithHeight>|null} [consensusStates] ClientConsensusStates consensusStates
                     */

                    /**
                     * Constructs a new ClientConsensusStates.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a ClientConsensusStates.
                     * @implements IClientConsensusStates
                     * @constructor
                     * @param {ibc.core.client.v1.IClientConsensusStates=} [properties] Properties to set
                     */
                    function ClientConsensusStates(properties) {
                        this.consensusStates = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * ClientConsensusStates clientId.
                     * @member {string} clientId
                     * @memberof ibc.core.client.v1.ClientConsensusStates
                     * @instance
                     */
                    ClientConsensusStates.prototype.clientId = "";

                    /**
                     * ClientConsensusStates consensusStates.
                     * @member {Array.<ibc.core.client.v1.IConsensusStateWithHeight>} consensusStates
                     * @memberof ibc.core.client.v1.ClientConsensusStates
                     * @instance
                     */
                    ClientConsensusStates.prototype.consensusStates = $util.emptyArray;

                    /**
                     * Creates a new ClientConsensusStates instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.ClientConsensusStates
                     * @static
                     * @param {ibc.core.client.v1.IClientConsensusStates=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.ClientConsensusStates} ClientConsensusStates instance
                     */
                    ClientConsensusStates.create = function create(properties) {
                        return new ClientConsensusStates(properties);
                    };

                    /**
                     * Encodes the specified ClientConsensusStates message. Does not implicitly {@link ibc.core.client.v1.ClientConsensusStates.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.ClientConsensusStates
                     * @static
                     * @param {ibc.core.client.v1.IClientConsensusStates} message ClientConsensusStates message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ClientConsensusStates.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
                        if (message.consensusStates != null && message.consensusStates.length)
                            for (let i = 0; i < message.consensusStates.length; ++i)
                                $root.ibc.core.client.v1.ConsensusStateWithHeight.encode(message.consensusStates[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified ClientConsensusStates message, length delimited. Does not implicitly {@link ibc.core.client.v1.ClientConsensusStates.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.ClientConsensusStates
                     * @static
                     * @param {ibc.core.client.v1.IClientConsensusStates} message ClientConsensusStates message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ClientConsensusStates.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a ClientConsensusStates message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.ClientConsensusStates
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.ClientConsensusStates} ClientConsensusStates
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ClientConsensusStates.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.ClientConsensusStates();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clientId = reader.string();
                                break;
                            case 2:
                                if (!(message.consensusStates && message.consensusStates.length))
                                    message.consensusStates = [];
                                message.consensusStates.push($root.ibc.core.client.v1.ConsensusStateWithHeight.decode(reader, reader.uint32()));
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a ClientConsensusStates message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.ClientConsensusStates
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.ClientConsensusStates} ClientConsensusStates
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ClientConsensusStates.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a ClientConsensusStates message.
                     * @function verify
                     * @memberof ibc.core.client.v1.ClientConsensusStates
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    ClientConsensusStates.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            if (!$util.isString(message.clientId))
                                return "clientId: string expected";
                        if (message.consensusStates != null && message.hasOwnProperty("consensusStates")) {
                            if (!Array.isArray(message.consensusStates))
                                return "consensusStates: array expected";
                            for (let i = 0; i < message.consensusStates.length; ++i) {
                                let error = $root.ibc.core.client.v1.ConsensusStateWithHeight.verify(message.consensusStates[i]);
                                if (error)
                                    return "consensusStates." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates a ClientConsensusStates message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.ClientConsensusStates
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.ClientConsensusStates} ClientConsensusStates
                     */
                    ClientConsensusStates.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.ClientConsensusStates)
                            return object;
                        let message = new $root.ibc.core.client.v1.ClientConsensusStates();
                        if (object.clientId != null)
                            message.clientId = String(object.clientId);
                        if (object.consensusStates) {
                            if (!Array.isArray(object.consensusStates))
                                throw TypeError(".ibc.core.client.v1.ClientConsensusStates.consensusStates: array expected");
                            message.consensusStates = [];
                            for (let i = 0; i < object.consensusStates.length; ++i) {
                                if (typeof object.consensusStates[i] !== "object")
                                    throw TypeError(".ibc.core.client.v1.ClientConsensusStates.consensusStates: object expected");
                                message.consensusStates[i] = $root.ibc.core.client.v1.ConsensusStateWithHeight.fromObject(object.consensusStates[i]);
                            }
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a ClientConsensusStates message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.ClientConsensusStates
                     * @static
                     * @param {ibc.core.client.v1.ClientConsensusStates} message ClientConsensusStates
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    ClientConsensusStates.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.consensusStates = [];
                        if (options.defaults)
                            object.clientId = "";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            object.clientId = message.clientId;
                        if (message.consensusStates && message.consensusStates.length) {
                            object.consensusStates = [];
                            for (let j = 0; j < message.consensusStates.length; ++j)
                                object.consensusStates[j] = $root.ibc.core.client.v1.ConsensusStateWithHeight.toObject(message.consensusStates[j], options);
                        }
                        return object;
                    };

                    /**
                     * Converts this ClientConsensusStates to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.ClientConsensusStates
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    ClientConsensusStates.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ClientConsensusStates;
                })(v1.ClientConsensusStates || {});

                v1.ClientUpdateProposal = (function(ClientUpdateProposal) {

                    /**
                     * Properties of a ClientUpdateProposal.
                     * @memberof ibc.core.client.v1
                     * @interface IClientUpdateProposal
                     * @property {string|null} [title] ClientUpdateProposal title
                     * @property {string|null} [description] ClientUpdateProposal description
                     * @property {string|null} [clientId] ClientUpdateProposal clientId
                     * @property {google.protobuf.IAny|null} [header] ClientUpdateProposal header
                     */

                    /**
                     * Constructs a new ClientUpdateProposal.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a ClientUpdateProposal.
                     * @implements IClientUpdateProposal
                     * @constructor
                     * @param {ibc.core.client.v1.IClientUpdateProposal=} [properties] Properties to set
                     */
                    function ClientUpdateProposal(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * ClientUpdateProposal title.
                     * @member {string} title
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @instance
                     */
                    ClientUpdateProposal.prototype.title = "";

                    /**
                     * ClientUpdateProposal description.
                     * @member {string} description
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @instance
                     */
                    ClientUpdateProposal.prototype.description = "";

                    /**
                     * ClientUpdateProposal clientId.
                     * @member {string} clientId
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @instance
                     */
                    ClientUpdateProposal.prototype.clientId = "";

                    /**
                     * ClientUpdateProposal header.
                     * @member {google.protobuf.IAny|null|undefined} header
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @instance
                     */
                    ClientUpdateProposal.prototype.header = null;

                    /**
                     * Creates a new ClientUpdateProposal instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @static
                     * @param {ibc.core.client.v1.IClientUpdateProposal=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.ClientUpdateProposal} ClientUpdateProposal instance
                     */
                    ClientUpdateProposal.create = function create(properties) {
                        return new ClientUpdateProposal(properties);
                    };

                    /**
                     * Encodes the specified ClientUpdateProposal message. Does not implicitly {@link ibc.core.client.v1.ClientUpdateProposal.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @static
                     * @param {ibc.core.client.v1.IClientUpdateProposal} message ClientUpdateProposal message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ClientUpdateProposal.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.title);
                        if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                        if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.clientId);
                        if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                            $root.google.protobuf.Any.encode(message.header, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified ClientUpdateProposal message, length delimited. Does not implicitly {@link ibc.core.client.v1.ClientUpdateProposal.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @static
                     * @param {ibc.core.client.v1.IClientUpdateProposal} message ClientUpdateProposal message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ClientUpdateProposal.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a ClientUpdateProposal message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.ClientUpdateProposal} ClientUpdateProposal
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ClientUpdateProposal.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.ClientUpdateProposal();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.title = reader.string();
                                break;
                            case 2:
                                message.description = reader.string();
                                break;
                            case 3:
                                message.clientId = reader.string();
                                break;
                            case 4:
                                message.header = $root.google.protobuf.Any.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a ClientUpdateProposal message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.ClientUpdateProposal} ClientUpdateProposal
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ClientUpdateProposal.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a ClientUpdateProposal message.
                     * @function verify
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    ClientUpdateProposal.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.title != null && message.hasOwnProperty("title"))
                            if (!$util.isString(message.title))
                                return "title: string expected";
                        if (message.description != null && message.hasOwnProperty("description"))
                            if (!$util.isString(message.description))
                                return "description: string expected";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            if (!$util.isString(message.clientId))
                                return "clientId: string expected";
                        if (message.header != null && message.hasOwnProperty("header")) {
                            let error = $root.google.protobuf.Any.verify(message.header);
                            if (error)
                                return "header." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a ClientUpdateProposal message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.ClientUpdateProposal} ClientUpdateProposal
                     */
                    ClientUpdateProposal.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.ClientUpdateProposal)
                            return object;
                        let message = new $root.ibc.core.client.v1.ClientUpdateProposal();
                        if (object.title != null)
                            message.title = String(object.title);
                        if (object.description != null)
                            message.description = String(object.description);
                        if (object.clientId != null)
                            message.clientId = String(object.clientId);
                        if (object.header != null) {
                            if (typeof object.header !== "object")
                                throw TypeError(".ibc.core.client.v1.ClientUpdateProposal.header: object expected");
                            message.header = $root.google.protobuf.Any.fromObject(object.header);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a ClientUpdateProposal message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @static
                     * @param {ibc.core.client.v1.ClientUpdateProposal} message ClientUpdateProposal
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    ClientUpdateProposal.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.title = "";
                            object.description = "";
                            object.clientId = "";
                            object.header = null;
                        }
                        if (message.title != null && message.hasOwnProperty("title"))
                            object.title = message.title;
                        if (message.description != null && message.hasOwnProperty("description"))
                            object.description = message.description;
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            object.clientId = message.clientId;
                        if (message.header != null && message.hasOwnProperty("header"))
                            object.header = $root.google.protobuf.Any.toObject(message.header, options);
                        return object;
                    };

                    /**
                     * Converts this ClientUpdateProposal to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.ClientUpdateProposal
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    ClientUpdateProposal.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ClientUpdateProposal;
                })(v1.ClientUpdateProposal || {});

                v1.Height = (function(Height) {

                    /**
                     * Properties of an Height.
                     * @memberof ibc.core.client.v1
                     * @interface IHeight
                     * @property {number|Long|null} [revisionNumber] Height revisionNumber
                     * @property {number|Long|null} [revisionHeight] Height revisionHeight
                     */

                    /**
                     * Constructs a new Height.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents an Height.
                     * @implements IHeight
                     * @constructor
                     * @param {ibc.core.client.v1.IHeight=} [properties] Properties to set
                     */
                    function Height(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Height revisionNumber.
                     * @member {number|Long} revisionNumber
                     * @memberof ibc.core.client.v1.Height
                     * @instance
                     */
                    Height.prototype.revisionNumber = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * Height revisionHeight.
                     * @member {number|Long} revisionHeight
                     * @memberof ibc.core.client.v1.Height
                     * @instance
                     */
                    Height.prototype.revisionHeight = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * Creates a new Height instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.Height
                     * @static
                     * @param {ibc.core.client.v1.IHeight=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.Height} Height instance
                     */
                    Height.create = function create(properties) {
                        return new Height(properties);
                    };

                    /**
                     * Encodes the specified Height message. Does not implicitly {@link ibc.core.client.v1.Height.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.Height
                     * @static
                     * @param {ibc.core.client.v1.IHeight} message Height message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Height.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.revisionNumber != null && Object.hasOwnProperty.call(message, "revisionNumber"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.revisionNumber);
                        if (message.revisionHeight != null && Object.hasOwnProperty.call(message, "revisionHeight"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.revisionHeight);
                        return writer;
                    };

                    /**
                     * Encodes the specified Height message, length delimited. Does not implicitly {@link ibc.core.client.v1.Height.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.Height
                     * @static
                     * @param {ibc.core.client.v1.IHeight} message Height message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Height.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes an Height message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.Height
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.Height} Height
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Height.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.Height();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.revisionNumber = reader.uint64();
                                break;
                            case 2:
                                message.revisionHeight = reader.uint64();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes an Height message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.Height
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.Height} Height
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Height.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies an Height message.
                     * @function verify
                     * @memberof ibc.core.client.v1.Height
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Height.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.revisionNumber != null && message.hasOwnProperty("revisionNumber"))
                            if (!$util.isInteger(message.revisionNumber) && !(message.revisionNumber && $util.isInteger(message.revisionNumber.low) && $util.isInteger(message.revisionNumber.high)))
                                return "revisionNumber: integer|Long expected";
                        if (message.revisionHeight != null && message.hasOwnProperty("revisionHeight"))
                            if (!$util.isInteger(message.revisionHeight) && !(message.revisionHeight && $util.isInteger(message.revisionHeight.low) && $util.isInteger(message.revisionHeight.high)))
                                return "revisionHeight: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates an Height message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.Height
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.Height} Height
                     */
                    Height.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.Height)
                            return object;
                        let message = new $root.ibc.core.client.v1.Height();
                        if (object.revisionNumber != null)
                            if ($util.Long)
                                (message.revisionNumber = $util.Long.fromValue(object.revisionNumber)).unsigned = true;
                            else if (typeof object.revisionNumber === "string")
                                message.revisionNumber = parseInt(object.revisionNumber, 10);
                            else if (typeof object.revisionNumber === "number")
                                message.revisionNumber = object.revisionNumber;
                            else if (typeof object.revisionNumber === "object")
                                message.revisionNumber = new $util.LongBits(object.revisionNumber.low >>> 0, object.revisionNumber.high >>> 0).toNumber(true);
                        if (object.revisionHeight != null)
                            if ($util.Long)
                                (message.revisionHeight = $util.Long.fromValue(object.revisionHeight)).unsigned = true;
                            else if (typeof object.revisionHeight === "string")
                                message.revisionHeight = parseInt(object.revisionHeight, 10);
                            else if (typeof object.revisionHeight === "number")
                                message.revisionHeight = object.revisionHeight;
                            else if (typeof object.revisionHeight === "object")
                                message.revisionHeight = new $util.LongBits(object.revisionHeight.low >>> 0, object.revisionHeight.high >>> 0).toNumber(true);
                        return message;
                    };

                    /**
                     * Creates a plain object from an Height message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.Height
                     * @static
                     * @param {ibc.core.client.v1.Height} message Height
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Height.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.revisionNumber = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.revisionNumber = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.revisionHeight = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.revisionHeight = options.longs === String ? "0" : 0;
                        }
                        if (message.revisionNumber != null && message.hasOwnProperty("revisionNumber"))
                            if (typeof message.revisionNumber === "number")
                                object.revisionNumber = options.longs === String ? String(message.revisionNumber) : message.revisionNumber;
                            else
                                object.revisionNumber = options.longs === String ? $util.Long.prototype.toString.call(message.revisionNumber) : options.longs === Number ? new $util.LongBits(message.revisionNumber.low >>> 0, message.revisionNumber.high >>> 0).toNumber(true) : message.revisionNumber;
                        if (message.revisionHeight != null && message.hasOwnProperty("revisionHeight"))
                            if (typeof message.revisionHeight === "number")
                                object.revisionHeight = options.longs === String ? String(message.revisionHeight) : message.revisionHeight;
                            else
                                object.revisionHeight = options.longs === String ? $util.Long.prototype.toString.call(message.revisionHeight) : options.longs === Number ? new $util.LongBits(message.revisionHeight.low >>> 0, message.revisionHeight.high >>> 0).toNumber(true) : message.revisionHeight;
                        return object;
                    };

                    /**
                     * Converts this Height to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.Height
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Height.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Height;
                })(v1.Height || {});

                v1.Params = (function(Params) {

                    /**
                     * Properties of a Params.
                     * @memberof ibc.core.client.v1
                     * @interface IParams
                     * @property {Array.<string>|null} [allowedClients] Params allowedClients
                     */

                    /**
                     * Constructs a new Params.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a Params.
                     * @implements IParams
                     * @constructor
                     * @param {ibc.core.client.v1.IParams=} [properties] Properties to set
                     */
                    function Params(properties) {
                        this.allowedClients = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Params allowedClients.
                     * @member {Array.<string>} allowedClients
                     * @memberof ibc.core.client.v1.Params
                     * @instance
                     */
                    Params.prototype.allowedClients = $util.emptyArray;

                    /**
                     * Creates a new Params instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.Params
                     * @static
                     * @param {ibc.core.client.v1.IParams=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.Params} Params instance
                     */
                    Params.create = function create(properties) {
                        return new Params(properties);
                    };

                    /**
                     * Encodes the specified Params message. Does not implicitly {@link ibc.core.client.v1.Params.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.Params
                     * @static
                     * @param {ibc.core.client.v1.IParams} message Params message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Params.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.allowedClients != null && message.allowedClients.length)
                            for (let i = 0; i < message.allowedClients.length; ++i)
                                writer.uint32(/* id 1, wireType 2 =*/10).string(message.allowedClients[i]);
                        return writer;
                    };

                    /**
                     * Encodes the specified Params message, length delimited. Does not implicitly {@link ibc.core.client.v1.Params.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.Params
                     * @static
                     * @param {ibc.core.client.v1.IParams} message Params message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Params.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Params message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.Params
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.Params} Params
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Params.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.Params();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                if (!(message.allowedClients && message.allowedClients.length))
                                    message.allowedClients = [];
                                message.allowedClients.push(reader.string());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Params message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.Params
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.Params} Params
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Params.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Params message.
                     * @function verify
                     * @memberof ibc.core.client.v1.Params
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Params.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.allowedClients != null && message.hasOwnProperty("allowedClients")) {
                            if (!Array.isArray(message.allowedClients))
                                return "allowedClients: array expected";
                            for (let i = 0; i < message.allowedClients.length; ++i)
                                if (!$util.isString(message.allowedClients[i]))
                                    return "allowedClients: string[] expected";
                        }
                        return null;
                    };

                    /**
                     * Creates a Params message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.Params
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.Params} Params
                     */
                    Params.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.Params)
                            return object;
                        let message = new $root.ibc.core.client.v1.Params();
                        if (object.allowedClients) {
                            if (!Array.isArray(object.allowedClients))
                                throw TypeError(".ibc.core.client.v1.Params.allowedClients: array expected");
                            message.allowedClients = [];
                            for (let i = 0; i < object.allowedClients.length; ++i)
                                message.allowedClients[i] = String(object.allowedClients[i]);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a Params message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.Params
                     * @static
                     * @param {ibc.core.client.v1.Params} message Params
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Params.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.allowedClients = [];
                        if (message.allowedClients && message.allowedClients.length) {
                            object.allowedClients = [];
                            for (let j = 0; j < message.allowedClients.length; ++j)
                                object.allowedClients[j] = message.allowedClients[j];
                        }
                        return object;
                    };

                    /**
                     * Converts this Params to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.Params
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Params.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Params;
                })(v1.Params || {});

                v1.GenesisState = (function(GenesisState) {

                    /**
                     * Properties of a GenesisState.
                     * @memberof ibc.core.client.v1
                     * @interface IGenesisState
                     * @property {Array.<ibc.core.client.v1.IIdentifiedClientState>|null} [clients] GenesisState clients
                     * @property {Array.<ibc.core.client.v1.IClientConsensusStates>|null} [clientsConsensus] GenesisState clientsConsensus
                     * @property {Array.<ibc.core.client.v1.IIdentifiedGenesisMetadata>|null} [clientsMetadata] GenesisState clientsMetadata
                     * @property {ibc.core.client.v1.IParams|null} [params] GenesisState params
                     * @property {boolean|null} [createLocalhost] GenesisState createLocalhost
                     * @property {number|Long|null} [nextClientSequence] GenesisState nextClientSequence
                     */

                    /**
                     * Constructs a new GenesisState.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a GenesisState.
                     * @implements IGenesisState
                     * @constructor
                     * @param {ibc.core.client.v1.IGenesisState=} [properties] Properties to set
                     */
                    function GenesisState(properties) {
                        this.clients = [];
                        this.clientsConsensus = [];
                        this.clientsMetadata = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * GenesisState clients.
                     * @member {Array.<ibc.core.client.v1.IIdentifiedClientState>} clients
                     * @memberof ibc.core.client.v1.GenesisState
                     * @instance
                     */
                    GenesisState.prototype.clients = $util.emptyArray;

                    /**
                     * GenesisState clientsConsensus.
                     * @member {Array.<ibc.core.client.v1.IClientConsensusStates>} clientsConsensus
                     * @memberof ibc.core.client.v1.GenesisState
                     * @instance
                     */
                    GenesisState.prototype.clientsConsensus = $util.emptyArray;

                    /**
                     * GenesisState clientsMetadata.
                     * @member {Array.<ibc.core.client.v1.IIdentifiedGenesisMetadata>} clientsMetadata
                     * @memberof ibc.core.client.v1.GenesisState
                     * @instance
                     */
                    GenesisState.prototype.clientsMetadata = $util.emptyArray;

                    /**
                     * GenesisState params.
                     * @member {ibc.core.client.v1.IParams|null|undefined} params
                     * @memberof ibc.core.client.v1.GenesisState
                     * @instance
                     */
                    GenesisState.prototype.params = null;

                    /**
                     * GenesisState createLocalhost.
                     * @member {boolean} createLocalhost
                     * @memberof ibc.core.client.v1.GenesisState
                     * @instance
                     */
                    GenesisState.prototype.createLocalhost = false;

                    /**
                     * GenesisState nextClientSequence.
                     * @member {number|Long} nextClientSequence
                     * @memberof ibc.core.client.v1.GenesisState
                     * @instance
                     */
                    GenesisState.prototype.nextClientSequence = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * Creates a new GenesisState instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.GenesisState
                     * @static
                     * @param {ibc.core.client.v1.IGenesisState=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.GenesisState} GenesisState instance
                     */
                    GenesisState.create = function create(properties) {
                        return new GenesisState(properties);
                    };

                    /**
                     * Encodes the specified GenesisState message. Does not implicitly {@link ibc.core.client.v1.GenesisState.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.GenesisState
                     * @static
                     * @param {ibc.core.client.v1.IGenesisState} message GenesisState message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GenesisState.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clients != null && message.clients.length)
                            for (let i = 0; i < message.clients.length; ++i)
                                $root.ibc.core.client.v1.IdentifiedClientState.encode(message.clients[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.clientsConsensus != null && message.clientsConsensus.length)
                            for (let i = 0; i < message.clientsConsensus.length; ++i)
                                $root.ibc.core.client.v1.ClientConsensusStates.encode(message.clientsConsensus[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        if (message.clientsMetadata != null && message.clientsMetadata.length)
                            for (let i = 0; i < message.clientsMetadata.length; ++i)
                                $root.ibc.core.client.v1.IdentifiedGenesisMetadata.encode(message.clientsMetadata[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        if (message.params != null && Object.hasOwnProperty.call(message, "params"))
                            $root.ibc.core.client.v1.Params.encode(message.params, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                        if (message.createLocalhost != null && Object.hasOwnProperty.call(message, "createLocalhost"))
                            writer.uint32(/* id 5, wireType 0 =*/40).bool(message.createLocalhost);
                        if (message.nextClientSequence != null && Object.hasOwnProperty.call(message, "nextClientSequence"))
                            writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.nextClientSequence);
                        return writer;
                    };

                    /**
                     * Encodes the specified GenesisState message, length delimited. Does not implicitly {@link ibc.core.client.v1.GenesisState.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.GenesisState
                     * @static
                     * @param {ibc.core.client.v1.IGenesisState} message GenesisState message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GenesisState.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a GenesisState message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.GenesisState
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.GenesisState} GenesisState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GenesisState.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.GenesisState();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                if (!(message.clients && message.clients.length))
                                    message.clients = [];
                                message.clients.push($root.ibc.core.client.v1.IdentifiedClientState.decode(reader, reader.uint32()));
                                break;
                            case 2:
                                if (!(message.clientsConsensus && message.clientsConsensus.length))
                                    message.clientsConsensus = [];
                                message.clientsConsensus.push($root.ibc.core.client.v1.ClientConsensusStates.decode(reader, reader.uint32()));
                                break;
                            case 3:
                                if (!(message.clientsMetadata && message.clientsMetadata.length))
                                    message.clientsMetadata = [];
                                message.clientsMetadata.push($root.ibc.core.client.v1.IdentifiedGenesisMetadata.decode(reader, reader.uint32()));
                                break;
                            case 4:
                                message.params = $root.ibc.core.client.v1.Params.decode(reader, reader.uint32());
                                break;
                            case 5:
                                message.createLocalhost = reader.bool();
                                break;
                            case 6:
                                message.nextClientSequence = reader.uint64();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a GenesisState message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.GenesisState
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.GenesisState} GenesisState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GenesisState.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a GenesisState message.
                     * @function verify
                     * @memberof ibc.core.client.v1.GenesisState
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    GenesisState.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clients != null && message.hasOwnProperty("clients")) {
                            if (!Array.isArray(message.clients))
                                return "clients: array expected";
                            for (let i = 0; i < message.clients.length; ++i) {
                                let error = $root.ibc.core.client.v1.IdentifiedClientState.verify(message.clients[i]);
                                if (error)
                                    return "clients." + error;
                            }
                        }
                        if (message.clientsConsensus != null && message.hasOwnProperty("clientsConsensus")) {
                            if (!Array.isArray(message.clientsConsensus))
                                return "clientsConsensus: array expected";
                            for (let i = 0; i < message.clientsConsensus.length; ++i) {
                                let error = $root.ibc.core.client.v1.ClientConsensusStates.verify(message.clientsConsensus[i]);
                                if (error)
                                    return "clientsConsensus." + error;
                            }
                        }
                        if (message.clientsMetadata != null && message.hasOwnProperty("clientsMetadata")) {
                            if (!Array.isArray(message.clientsMetadata))
                                return "clientsMetadata: array expected";
                            for (let i = 0; i < message.clientsMetadata.length; ++i) {
                                let error = $root.ibc.core.client.v1.IdentifiedGenesisMetadata.verify(message.clientsMetadata[i]);
                                if (error)
                                    return "clientsMetadata." + error;
                            }
                        }
                        if (message.params != null && message.hasOwnProperty("params")) {
                            let error = $root.ibc.core.client.v1.Params.verify(message.params);
                            if (error)
                                return "params." + error;
                        }
                        if (message.createLocalhost != null && message.hasOwnProperty("createLocalhost"))
                            if (typeof message.createLocalhost !== "boolean")
                                return "createLocalhost: boolean expected";
                        if (message.nextClientSequence != null && message.hasOwnProperty("nextClientSequence"))
                            if (!$util.isInteger(message.nextClientSequence) && !(message.nextClientSequence && $util.isInteger(message.nextClientSequence.low) && $util.isInteger(message.nextClientSequence.high)))
                                return "nextClientSequence: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a GenesisState message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.GenesisState
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.GenesisState} GenesisState
                     */
                    GenesisState.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.GenesisState)
                            return object;
                        let message = new $root.ibc.core.client.v1.GenesisState();
                        if (object.clients) {
                            if (!Array.isArray(object.clients))
                                throw TypeError(".ibc.core.client.v1.GenesisState.clients: array expected");
                            message.clients = [];
                            for (let i = 0; i < object.clients.length; ++i) {
                                if (typeof object.clients[i] !== "object")
                                    throw TypeError(".ibc.core.client.v1.GenesisState.clients: object expected");
                                message.clients[i] = $root.ibc.core.client.v1.IdentifiedClientState.fromObject(object.clients[i]);
                            }
                        }
                        if (object.clientsConsensus) {
                            if (!Array.isArray(object.clientsConsensus))
                                throw TypeError(".ibc.core.client.v1.GenesisState.clientsConsensus: array expected");
                            message.clientsConsensus = [];
                            for (let i = 0; i < object.clientsConsensus.length; ++i) {
                                if (typeof object.clientsConsensus[i] !== "object")
                                    throw TypeError(".ibc.core.client.v1.GenesisState.clientsConsensus: object expected");
                                message.clientsConsensus[i] = $root.ibc.core.client.v1.ClientConsensusStates.fromObject(object.clientsConsensus[i]);
                            }
                        }
                        if (object.clientsMetadata) {
                            if (!Array.isArray(object.clientsMetadata))
                                throw TypeError(".ibc.core.client.v1.GenesisState.clientsMetadata: array expected");
                            message.clientsMetadata = [];
                            for (let i = 0; i < object.clientsMetadata.length; ++i) {
                                if (typeof object.clientsMetadata[i] !== "object")
                                    throw TypeError(".ibc.core.client.v1.GenesisState.clientsMetadata: object expected");
                                message.clientsMetadata[i] = $root.ibc.core.client.v1.IdentifiedGenesisMetadata.fromObject(object.clientsMetadata[i]);
                            }
                        }
                        if (object.params != null) {
                            if (typeof object.params !== "object")
                                throw TypeError(".ibc.core.client.v1.GenesisState.params: object expected");
                            message.params = $root.ibc.core.client.v1.Params.fromObject(object.params);
                        }
                        if (object.createLocalhost != null)
                            message.createLocalhost = Boolean(object.createLocalhost);
                        if (object.nextClientSequence != null)
                            if ($util.Long)
                                (message.nextClientSequence = $util.Long.fromValue(object.nextClientSequence)).unsigned = true;
                            else if (typeof object.nextClientSequence === "string")
                                message.nextClientSequence = parseInt(object.nextClientSequence, 10);
                            else if (typeof object.nextClientSequence === "number")
                                message.nextClientSequence = object.nextClientSequence;
                            else if (typeof object.nextClientSequence === "object")
                                message.nextClientSequence = new $util.LongBits(object.nextClientSequence.low >>> 0, object.nextClientSequence.high >>> 0).toNumber(true);
                        return message;
                    };

                    /**
                     * Creates a plain object from a GenesisState message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.GenesisState
                     * @static
                     * @param {ibc.core.client.v1.GenesisState} message GenesisState
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    GenesisState.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.clients = [];
                            object.clientsConsensus = [];
                            object.clientsMetadata = [];
                        }
                        if (options.defaults) {
                            object.params = null;
                            object.createLocalhost = false;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.nextClientSequence = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.nextClientSequence = options.longs === String ? "0" : 0;
                        }
                        if (message.clients && message.clients.length) {
                            object.clients = [];
                            for (let j = 0; j < message.clients.length; ++j)
                                object.clients[j] = $root.ibc.core.client.v1.IdentifiedClientState.toObject(message.clients[j], options);
                        }
                        if (message.clientsConsensus && message.clientsConsensus.length) {
                            object.clientsConsensus = [];
                            for (let j = 0; j < message.clientsConsensus.length; ++j)
                                object.clientsConsensus[j] = $root.ibc.core.client.v1.ClientConsensusStates.toObject(message.clientsConsensus[j], options);
                        }
                        if (message.clientsMetadata && message.clientsMetadata.length) {
                            object.clientsMetadata = [];
                            for (let j = 0; j < message.clientsMetadata.length; ++j)
                                object.clientsMetadata[j] = $root.ibc.core.client.v1.IdentifiedGenesisMetadata.toObject(message.clientsMetadata[j], options);
                        }
                        if (message.params != null && message.hasOwnProperty("params"))
                            object.params = $root.ibc.core.client.v1.Params.toObject(message.params, options);
                        if (message.createLocalhost != null && message.hasOwnProperty("createLocalhost"))
                            object.createLocalhost = message.createLocalhost;
                        if (message.nextClientSequence != null && message.hasOwnProperty("nextClientSequence"))
                            if (typeof message.nextClientSequence === "number")
                                object.nextClientSequence = options.longs === String ? String(message.nextClientSequence) : message.nextClientSequence;
                            else
                                object.nextClientSequence = options.longs === String ? $util.Long.prototype.toString.call(message.nextClientSequence) : options.longs === Number ? new $util.LongBits(message.nextClientSequence.low >>> 0, message.nextClientSequence.high >>> 0).toNumber(true) : message.nextClientSequence;
                        return object;
                    };

                    /**
                     * Converts this GenesisState to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.GenesisState
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    GenesisState.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return GenesisState;
                })(v1.GenesisState || {});

                v1.GenesisMetadata = (function(GenesisMetadata) {

                    /**
                     * Properties of a GenesisMetadata.
                     * @memberof ibc.core.client.v1
                     * @interface IGenesisMetadata
                     * @property {Uint8Array|null} [key] GenesisMetadata key
                     * @property {Uint8Array|null} [value] GenesisMetadata value
                     */

                    /**
                     * Constructs a new GenesisMetadata.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a GenesisMetadata.
                     * @implements IGenesisMetadata
                     * @constructor
                     * @param {ibc.core.client.v1.IGenesisMetadata=} [properties] Properties to set
                     */
                    function GenesisMetadata(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * GenesisMetadata key.
                     * @member {Uint8Array} key
                     * @memberof ibc.core.client.v1.GenesisMetadata
                     * @instance
                     */
                    GenesisMetadata.prototype.key = $util.newBuffer([]);

                    /**
                     * GenesisMetadata value.
                     * @member {Uint8Array} value
                     * @memberof ibc.core.client.v1.GenesisMetadata
                     * @instance
                     */
                    GenesisMetadata.prototype.value = $util.newBuffer([]);

                    /**
                     * Creates a new GenesisMetadata instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.GenesisMetadata
                     * @static
                     * @param {ibc.core.client.v1.IGenesisMetadata=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.GenesisMetadata} GenesisMetadata instance
                     */
                    GenesisMetadata.create = function create(properties) {
                        return new GenesisMetadata(properties);
                    };

                    /**
                     * Encodes the specified GenesisMetadata message. Does not implicitly {@link ibc.core.client.v1.GenesisMetadata.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.GenesisMetadata
                     * @static
                     * @param {ibc.core.client.v1.IGenesisMetadata} message GenesisMetadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GenesisMetadata.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.key);
                        if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                        return writer;
                    };

                    /**
                     * Encodes the specified GenesisMetadata message, length delimited. Does not implicitly {@link ibc.core.client.v1.GenesisMetadata.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.GenesisMetadata
                     * @static
                     * @param {ibc.core.client.v1.IGenesisMetadata} message GenesisMetadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GenesisMetadata.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a GenesisMetadata message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.GenesisMetadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.GenesisMetadata} GenesisMetadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GenesisMetadata.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.GenesisMetadata();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.key = reader.bytes();
                                break;
                            case 2:
                                message.value = reader.bytes();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a GenesisMetadata message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.GenesisMetadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.GenesisMetadata} GenesisMetadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GenesisMetadata.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a GenesisMetadata message.
                     * @function verify
                     * @memberof ibc.core.client.v1.GenesisMetadata
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    GenesisMetadata.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.key != null && message.hasOwnProperty("key"))
                            if (!(message.key && typeof message.key.length === "number" || $util.isString(message.key)))
                                return "key: buffer expected";
                        if (message.value != null && message.hasOwnProperty("value"))
                            if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                                return "value: buffer expected";
                        return null;
                    };

                    /**
                     * Creates a GenesisMetadata message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.GenesisMetadata
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.GenesisMetadata} GenesisMetadata
                     */
                    GenesisMetadata.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.GenesisMetadata)
                            return object;
                        let message = new $root.ibc.core.client.v1.GenesisMetadata();
                        if (object.key != null)
                            if (typeof object.key === "string")
                                $util.base64.decode(object.key, message.key = $util.newBuffer($util.base64.length(object.key)), 0);
                            else if (object.key.length)
                                message.key = object.key;
                        if (object.value != null)
                            if (typeof object.value === "string")
                                $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                            else if (object.value.length)
                                message.value = object.value;
                        return message;
                    };

                    /**
                     * Creates a plain object from a GenesisMetadata message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.GenesisMetadata
                     * @static
                     * @param {ibc.core.client.v1.GenesisMetadata} message GenesisMetadata
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    GenesisMetadata.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            if (options.bytes === String)
                                object.key = "";
                            else {
                                object.key = [];
                                if (options.bytes !== Array)
                                    object.key = $util.newBuffer(object.key);
                            }
                            if (options.bytes === String)
                                object.value = "";
                            else {
                                object.value = [];
                                if (options.bytes !== Array)
                                    object.value = $util.newBuffer(object.value);
                            }
                        }
                        if (message.key != null && message.hasOwnProperty("key"))
                            object.key = options.bytes === String ? $util.base64.encode(message.key, 0, message.key.length) : options.bytes === Array ? Array.prototype.slice.call(message.key) : message.key;
                        if (message.value != null && message.hasOwnProperty("value"))
                            object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                        return object;
                    };

                    /**
                     * Converts this GenesisMetadata to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.GenesisMetadata
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    GenesisMetadata.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return GenesisMetadata;
                })(v1.GenesisMetadata || {});

                v1.IdentifiedGenesisMetadata = (function(IdentifiedGenesisMetadata) {

                    /**
                     * Properties of an IdentifiedGenesisMetadata.
                     * @memberof ibc.core.client.v1
                     * @interface IIdentifiedGenesisMetadata
                     * @property {string|null} [clientId] IdentifiedGenesisMetadata clientId
                     * @property {Array.<ibc.core.client.v1.IGenesisMetadata>|null} [clientMetadata] IdentifiedGenesisMetadata clientMetadata
                     */

                    /**
                     * Constructs a new IdentifiedGenesisMetadata.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents an IdentifiedGenesisMetadata.
                     * @implements IIdentifiedGenesisMetadata
                     * @constructor
                     * @param {ibc.core.client.v1.IIdentifiedGenesisMetadata=} [properties] Properties to set
                     */
                    function IdentifiedGenesisMetadata(properties) {
                        this.clientMetadata = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * IdentifiedGenesisMetadata clientId.
                     * @member {string} clientId
                     * @memberof ibc.core.client.v1.IdentifiedGenesisMetadata
                     * @instance
                     */
                    IdentifiedGenesisMetadata.prototype.clientId = "";

                    /**
                     * IdentifiedGenesisMetadata clientMetadata.
                     * @member {Array.<ibc.core.client.v1.IGenesisMetadata>} clientMetadata
                     * @memberof ibc.core.client.v1.IdentifiedGenesisMetadata
                     * @instance
                     */
                    IdentifiedGenesisMetadata.prototype.clientMetadata = $util.emptyArray;

                    /**
                     * Creates a new IdentifiedGenesisMetadata instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.IdentifiedGenesisMetadata
                     * @static
                     * @param {ibc.core.client.v1.IIdentifiedGenesisMetadata=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.IdentifiedGenesisMetadata} IdentifiedGenesisMetadata instance
                     */
                    IdentifiedGenesisMetadata.create = function create(properties) {
                        return new IdentifiedGenesisMetadata(properties);
                    };

                    /**
                     * Encodes the specified IdentifiedGenesisMetadata message. Does not implicitly {@link ibc.core.client.v1.IdentifiedGenesisMetadata.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.IdentifiedGenesisMetadata
                     * @static
                     * @param {ibc.core.client.v1.IIdentifiedGenesisMetadata} message IdentifiedGenesisMetadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    IdentifiedGenesisMetadata.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
                        if (message.clientMetadata != null && message.clientMetadata.length)
                            for (let i = 0; i < message.clientMetadata.length; ++i)
                                $root.ibc.core.client.v1.GenesisMetadata.encode(message.clientMetadata[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified IdentifiedGenesisMetadata message, length delimited. Does not implicitly {@link ibc.core.client.v1.IdentifiedGenesisMetadata.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.IdentifiedGenesisMetadata
                     * @static
                     * @param {ibc.core.client.v1.IIdentifiedGenesisMetadata} message IdentifiedGenesisMetadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    IdentifiedGenesisMetadata.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes an IdentifiedGenesisMetadata message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.IdentifiedGenesisMetadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.IdentifiedGenesisMetadata} IdentifiedGenesisMetadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    IdentifiedGenesisMetadata.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.IdentifiedGenesisMetadata();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clientId = reader.string();
                                break;
                            case 2:
                                if (!(message.clientMetadata && message.clientMetadata.length))
                                    message.clientMetadata = [];
                                message.clientMetadata.push($root.ibc.core.client.v1.GenesisMetadata.decode(reader, reader.uint32()));
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes an IdentifiedGenesisMetadata message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.IdentifiedGenesisMetadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.IdentifiedGenesisMetadata} IdentifiedGenesisMetadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    IdentifiedGenesisMetadata.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies an IdentifiedGenesisMetadata message.
                     * @function verify
                     * @memberof ibc.core.client.v1.IdentifiedGenesisMetadata
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    IdentifiedGenesisMetadata.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            if (!$util.isString(message.clientId))
                                return "clientId: string expected";
                        if (message.clientMetadata != null && message.hasOwnProperty("clientMetadata")) {
                            if (!Array.isArray(message.clientMetadata))
                                return "clientMetadata: array expected";
                            for (let i = 0; i < message.clientMetadata.length; ++i) {
                                let error = $root.ibc.core.client.v1.GenesisMetadata.verify(message.clientMetadata[i]);
                                if (error)
                                    return "clientMetadata." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates an IdentifiedGenesisMetadata message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.IdentifiedGenesisMetadata
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.IdentifiedGenesisMetadata} IdentifiedGenesisMetadata
                     */
                    IdentifiedGenesisMetadata.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.IdentifiedGenesisMetadata)
                            return object;
                        let message = new $root.ibc.core.client.v1.IdentifiedGenesisMetadata();
                        if (object.clientId != null)
                            message.clientId = String(object.clientId);
                        if (object.clientMetadata) {
                            if (!Array.isArray(object.clientMetadata))
                                throw TypeError(".ibc.core.client.v1.IdentifiedGenesisMetadata.clientMetadata: array expected");
                            message.clientMetadata = [];
                            for (let i = 0; i < object.clientMetadata.length; ++i) {
                                if (typeof object.clientMetadata[i] !== "object")
                                    throw TypeError(".ibc.core.client.v1.IdentifiedGenesisMetadata.clientMetadata: object expected");
                                message.clientMetadata[i] = $root.ibc.core.client.v1.GenesisMetadata.fromObject(object.clientMetadata[i]);
                            }
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from an IdentifiedGenesisMetadata message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.IdentifiedGenesisMetadata
                     * @static
                     * @param {ibc.core.client.v1.IdentifiedGenesisMetadata} message IdentifiedGenesisMetadata
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    IdentifiedGenesisMetadata.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.clientMetadata = [];
                        if (options.defaults)
                            object.clientId = "";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            object.clientId = message.clientId;
                        if (message.clientMetadata && message.clientMetadata.length) {
                            object.clientMetadata = [];
                            for (let j = 0; j < message.clientMetadata.length; ++j)
                                object.clientMetadata[j] = $root.ibc.core.client.v1.GenesisMetadata.toObject(message.clientMetadata[j], options);
                        }
                        return object;
                    };

                    /**
                     * Converts this IdentifiedGenesisMetadata to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.IdentifiedGenesisMetadata
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    IdentifiedGenesisMetadata.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return IdentifiedGenesisMetadata;
                })(v1.IdentifiedGenesisMetadata || {});

                v1.Query = (function(Query) {

                    /**
                     * Constructs a new Query service.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a Query
                     * @extends $protobuf.rpc.Service
                     * @constructor
                     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                     */
                    function Query(rpcImpl, requestDelimited, responseDelimited) {
                        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
                    }

                    (Query.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Query;

                    /**
                     * Creates new Query service using the specified rpc implementation.
                     * @function create
                     * @memberof ibc.core.client.v1.Query
                     * @static
                     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                     * @returns {Query} RPC service. Useful where requests and/or responses are streamed.
                     */
                    Query.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                        return new this(rpcImpl, requestDelimited, responseDelimited);
                    };

                    /**
                     * Callback as used by {@link ibc.core.client.v1.Query#clientState}.
                     * @memberof ibc.core.client.v1.Query
                     * @typedef ClientStateCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {ibc.core.client.v1.IQueryClientStateResponse} [response] QueryClientStateResponse
                     */

                    /**
                     * Calls ClientState.
                     * @function clientState
                     * @memberof ibc.core.client.v1.Query
                     * @instance
                     * @param {ibc.core.client.v1.IQueryClientStateRequest} request QueryClientStateRequest message or plain object
                     * @param {ibc.core.client.v1.Query.ClientStateCallback} callback Node-style callback called with the error, if any, and QueryClientStateResponse
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(Query.prototype.clientState = function clientState(request, callback) {
                        return this.rpcCall(clientState, $root.ibc.core.client.v1.QueryClientStateRequest, $root.ibc.core.client.v1.QueryClientStateResponse, request, callback);
                    }, "name", { value: "ClientState" });

                    /**
                     * Calls ClientState.
                     * @function clientState
                     * @memberof ibc.core.client.v1.Query
                     * @instance
                     * @param {ibc.core.client.v1.IQueryClientStateRequest} request QueryClientStateRequest message or plain object
                     * @returns {Promise<ibc.core.client.v1.IQueryClientStateResponse>} Promise
                     * @variation 2
                     */

                    /**
                     * Callback as used by {@link ibc.core.client.v1.Query#clientStates}.
                     * @memberof ibc.core.client.v1.Query
                     * @typedef ClientStatesCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {ibc.core.client.v1.IQueryClientStatesResponse} [response] QueryClientStatesResponse
                     */

                    /**
                     * Calls ClientStates.
                     * @function clientStates
                     * @memberof ibc.core.client.v1.Query
                     * @instance
                     * @param {ibc.core.client.v1.IQueryClientStatesRequest} request QueryClientStatesRequest message or plain object
                     * @param {ibc.core.client.v1.Query.ClientStatesCallback} callback Node-style callback called with the error, if any, and QueryClientStatesResponse
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(Query.prototype.clientStates = function clientStates(request, callback) {
                        return this.rpcCall(clientStates, $root.ibc.core.client.v1.QueryClientStatesRequest, $root.ibc.core.client.v1.QueryClientStatesResponse, request, callback);
                    }, "name", { value: "ClientStates" });

                    /**
                     * Calls ClientStates.
                     * @function clientStates
                     * @memberof ibc.core.client.v1.Query
                     * @instance
                     * @param {ibc.core.client.v1.IQueryClientStatesRequest} request QueryClientStatesRequest message or plain object
                     * @returns {Promise<ibc.core.client.v1.IQueryClientStatesResponse>} Promise
                     * @variation 2
                     */

                    /**
                     * Callback as used by {@link ibc.core.client.v1.Query#consensusState}.
                     * @memberof ibc.core.client.v1.Query
                     * @typedef ConsensusStateCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {ibc.core.client.v1.IQueryConsensusStateResponse} [response] QueryConsensusStateResponse
                     */

                    /**
                     * Calls ConsensusState.
                     * @function consensusState
                     * @memberof ibc.core.client.v1.Query
                     * @instance
                     * @param {ibc.core.client.v1.IQueryConsensusStateRequest} request QueryConsensusStateRequest message or plain object
                     * @param {ibc.core.client.v1.Query.ConsensusStateCallback} callback Node-style callback called with the error, if any, and QueryConsensusStateResponse
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(Query.prototype.consensusState = function consensusState(request, callback) {
                        return this.rpcCall(consensusState, $root.ibc.core.client.v1.QueryConsensusStateRequest, $root.ibc.core.client.v1.QueryConsensusStateResponse, request, callback);
                    }, "name", { value: "ConsensusState" });

                    /**
                     * Calls ConsensusState.
                     * @function consensusState
                     * @memberof ibc.core.client.v1.Query
                     * @instance
                     * @param {ibc.core.client.v1.IQueryConsensusStateRequest} request QueryConsensusStateRequest message or plain object
                     * @returns {Promise<ibc.core.client.v1.IQueryConsensusStateResponse>} Promise
                     * @variation 2
                     */

                    /**
                     * Callback as used by {@link ibc.core.client.v1.Query#consensusStates}.
                     * @memberof ibc.core.client.v1.Query
                     * @typedef ConsensusStatesCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {ibc.core.client.v1.IQueryConsensusStatesResponse} [response] QueryConsensusStatesResponse
                     */

                    /**
                     * Calls ConsensusStates.
                     * @function consensusStates
                     * @memberof ibc.core.client.v1.Query
                     * @instance
                     * @param {ibc.core.client.v1.IQueryConsensusStatesRequest} request QueryConsensusStatesRequest message or plain object
                     * @param {ibc.core.client.v1.Query.ConsensusStatesCallback} callback Node-style callback called with the error, if any, and QueryConsensusStatesResponse
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(Query.prototype.consensusStates = function consensusStates(request, callback) {
                        return this.rpcCall(consensusStates, $root.ibc.core.client.v1.QueryConsensusStatesRequest, $root.ibc.core.client.v1.QueryConsensusStatesResponse, request, callback);
                    }, "name", { value: "ConsensusStates" });

                    /**
                     * Calls ConsensusStates.
                     * @function consensusStates
                     * @memberof ibc.core.client.v1.Query
                     * @instance
                     * @param {ibc.core.client.v1.IQueryConsensusStatesRequest} request QueryConsensusStatesRequest message or plain object
                     * @returns {Promise<ibc.core.client.v1.IQueryConsensusStatesResponse>} Promise
                     * @variation 2
                     */

                    /**
                     * Callback as used by {@link ibc.core.client.v1.Query#clientParams}.
                     * @memberof ibc.core.client.v1.Query
                     * @typedef ClientParamsCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {ibc.core.client.v1.IQueryClientParamsResponse} [response] QueryClientParamsResponse
                     */

                    /**
                     * Calls ClientParams.
                     * @function clientParams
                     * @memberof ibc.core.client.v1.Query
                     * @instance
                     * @param {ibc.core.client.v1.IQueryClientParamsRequest} request QueryClientParamsRequest message or plain object
                     * @param {ibc.core.client.v1.Query.ClientParamsCallback} callback Node-style callback called with the error, if any, and QueryClientParamsResponse
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(Query.prototype.clientParams = function clientParams(request, callback) {
                        return this.rpcCall(clientParams, $root.ibc.core.client.v1.QueryClientParamsRequest, $root.ibc.core.client.v1.QueryClientParamsResponse, request, callback);
                    }, "name", { value: "ClientParams" });

                    /**
                     * Calls ClientParams.
                     * @function clientParams
                     * @memberof ibc.core.client.v1.Query
                     * @instance
                     * @param {ibc.core.client.v1.IQueryClientParamsRequest} request QueryClientParamsRequest message or plain object
                     * @returns {Promise<ibc.core.client.v1.IQueryClientParamsResponse>} Promise
                     * @variation 2
                     */

                    return Query;
                })(v1.Query || {});

                v1.QueryClientStateRequest = (function(QueryClientStateRequest) {

                    /**
                     * Properties of a QueryClientStateRequest.
                     * @memberof ibc.core.client.v1
                     * @interface IQueryClientStateRequest
                     * @property {string|null} [clientId] QueryClientStateRequest clientId
                     */

                    /**
                     * Constructs a new QueryClientStateRequest.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a QueryClientStateRequest.
                     * @implements IQueryClientStateRequest
                     * @constructor
                     * @param {ibc.core.client.v1.IQueryClientStateRequest=} [properties] Properties to set
                     */
                    function QueryClientStateRequest(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * QueryClientStateRequest clientId.
                     * @member {string} clientId
                     * @memberof ibc.core.client.v1.QueryClientStateRequest
                     * @instance
                     */
                    QueryClientStateRequest.prototype.clientId = "";

                    /**
                     * Creates a new QueryClientStateRequest instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.QueryClientStateRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStateRequest=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.QueryClientStateRequest} QueryClientStateRequest instance
                     */
                    QueryClientStateRequest.create = function create(properties) {
                        return new QueryClientStateRequest(properties);
                    };

                    /**
                     * Encodes the specified QueryClientStateRequest message. Does not implicitly {@link ibc.core.client.v1.QueryClientStateRequest.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.QueryClientStateRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStateRequest} message QueryClientStateRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientStateRequest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
                        return writer;
                    };

                    /**
                     * Encodes the specified QueryClientStateRequest message, length delimited. Does not implicitly {@link ibc.core.client.v1.QueryClientStateRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientStateRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStateRequest} message QueryClientStateRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientStateRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a QueryClientStateRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.QueryClientStateRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.QueryClientStateRequest} QueryClientStateRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientStateRequest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.QueryClientStateRequest();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clientId = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a QueryClientStateRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientStateRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.QueryClientStateRequest} QueryClientStateRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientStateRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a QueryClientStateRequest message.
                     * @function verify
                     * @memberof ibc.core.client.v1.QueryClientStateRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    QueryClientStateRequest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            if (!$util.isString(message.clientId))
                                return "clientId: string expected";
                        return null;
                    };

                    /**
                     * Creates a QueryClientStateRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.QueryClientStateRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.QueryClientStateRequest} QueryClientStateRequest
                     */
                    QueryClientStateRequest.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.QueryClientStateRequest)
                            return object;
                        let message = new $root.ibc.core.client.v1.QueryClientStateRequest();
                        if (object.clientId != null)
                            message.clientId = String(object.clientId);
                        return message;
                    };

                    /**
                     * Creates a plain object from a QueryClientStateRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.QueryClientStateRequest
                     * @static
                     * @param {ibc.core.client.v1.QueryClientStateRequest} message QueryClientStateRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    QueryClientStateRequest.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults)
                            object.clientId = "";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            object.clientId = message.clientId;
                        return object;
                    };

                    /**
                     * Converts this QueryClientStateRequest to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.QueryClientStateRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    QueryClientStateRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return QueryClientStateRequest;
                })(v1.QueryClientStateRequest || {});

                v1.QueryClientStateResponse = (function(QueryClientStateResponse) {

                    /**
                     * Properties of a QueryClientStateResponse.
                     * @memberof ibc.core.client.v1
                     * @interface IQueryClientStateResponse
                     * @property {google.protobuf.IAny|null} [clientState] QueryClientStateResponse clientState
                     * @property {Uint8Array|null} [proof] QueryClientStateResponse proof
                     * @property {ibc.core.client.v1.IHeight|null} [proofHeight] QueryClientStateResponse proofHeight
                     */

                    /**
                     * Constructs a new QueryClientStateResponse.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a QueryClientStateResponse.
                     * @implements IQueryClientStateResponse
                     * @constructor
                     * @param {ibc.core.client.v1.IQueryClientStateResponse=} [properties] Properties to set
                     */
                    function QueryClientStateResponse(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * QueryClientStateResponse clientState.
                     * @member {google.protobuf.IAny|null|undefined} clientState
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @instance
                     */
                    QueryClientStateResponse.prototype.clientState = null;

                    /**
                     * QueryClientStateResponse proof.
                     * @member {Uint8Array} proof
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @instance
                     */
                    QueryClientStateResponse.prototype.proof = $util.newBuffer([]);

                    /**
                     * QueryClientStateResponse proofHeight.
                     * @member {ibc.core.client.v1.IHeight|null|undefined} proofHeight
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @instance
                     */
                    QueryClientStateResponse.prototype.proofHeight = null;

                    /**
                     * Creates a new QueryClientStateResponse instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStateResponse=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.QueryClientStateResponse} QueryClientStateResponse instance
                     */
                    QueryClientStateResponse.create = function create(properties) {
                        return new QueryClientStateResponse(properties);
                    };

                    /**
                     * Encodes the specified QueryClientStateResponse message. Does not implicitly {@link ibc.core.client.v1.QueryClientStateResponse.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStateResponse} message QueryClientStateResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientStateResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientState != null && Object.hasOwnProperty.call(message, "clientState"))
                            $root.google.protobuf.Any.encode(message.clientState, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.proof != null && Object.hasOwnProperty.call(message, "proof"))
                            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.proof);
                        if (message.proofHeight != null && Object.hasOwnProperty.call(message, "proofHeight"))
                            $root.ibc.core.client.v1.Height.encode(message.proofHeight, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified QueryClientStateResponse message, length delimited. Does not implicitly {@link ibc.core.client.v1.QueryClientStateResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStateResponse} message QueryClientStateResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientStateResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a QueryClientStateResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.QueryClientStateResponse} QueryClientStateResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientStateResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.QueryClientStateResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clientState = $root.google.protobuf.Any.decode(reader, reader.uint32());
                                break;
                            case 2:
                                message.proof = reader.bytes();
                                break;
                            case 3:
                                message.proofHeight = $root.ibc.core.client.v1.Height.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a QueryClientStateResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.QueryClientStateResponse} QueryClientStateResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientStateResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a QueryClientStateResponse message.
                     * @function verify
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    QueryClientStateResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientState != null && message.hasOwnProperty("clientState")) {
                            let error = $root.google.protobuf.Any.verify(message.clientState);
                            if (error)
                                return "clientState." + error;
                        }
                        if (message.proof != null && message.hasOwnProperty("proof"))
                            if (!(message.proof && typeof message.proof.length === "number" || $util.isString(message.proof)))
                                return "proof: buffer expected";
                        if (message.proofHeight != null && message.hasOwnProperty("proofHeight")) {
                            let error = $root.ibc.core.client.v1.Height.verify(message.proofHeight);
                            if (error)
                                return "proofHeight." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a QueryClientStateResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.QueryClientStateResponse} QueryClientStateResponse
                     */
                    QueryClientStateResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.QueryClientStateResponse)
                            return object;
                        let message = new $root.ibc.core.client.v1.QueryClientStateResponse();
                        if (object.clientState != null) {
                            if (typeof object.clientState !== "object")
                                throw TypeError(".ibc.core.client.v1.QueryClientStateResponse.clientState: object expected");
                            message.clientState = $root.google.protobuf.Any.fromObject(object.clientState);
                        }
                        if (object.proof != null)
                            if (typeof object.proof === "string")
                                $util.base64.decode(object.proof, message.proof = $util.newBuffer($util.base64.length(object.proof)), 0);
                            else if (object.proof.length)
                                message.proof = object.proof;
                        if (object.proofHeight != null) {
                            if (typeof object.proofHeight !== "object")
                                throw TypeError(".ibc.core.client.v1.QueryClientStateResponse.proofHeight: object expected");
                            message.proofHeight = $root.ibc.core.client.v1.Height.fromObject(object.proofHeight);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a QueryClientStateResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @static
                     * @param {ibc.core.client.v1.QueryClientStateResponse} message QueryClientStateResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    QueryClientStateResponse.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.clientState = null;
                            if (options.bytes === String)
                                object.proof = "";
                            else {
                                object.proof = [];
                                if (options.bytes !== Array)
                                    object.proof = $util.newBuffer(object.proof);
                            }
                            object.proofHeight = null;
                        }
                        if (message.clientState != null && message.hasOwnProperty("clientState"))
                            object.clientState = $root.google.protobuf.Any.toObject(message.clientState, options);
                        if (message.proof != null && message.hasOwnProperty("proof"))
                            object.proof = options.bytes === String ? $util.base64.encode(message.proof, 0, message.proof.length) : options.bytes === Array ? Array.prototype.slice.call(message.proof) : message.proof;
                        if (message.proofHeight != null && message.hasOwnProperty("proofHeight"))
                            object.proofHeight = $root.ibc.core.client.v1.Height.toObject(message.proofHeight, options);
                        return object;
                    };

                    /**
                     * Converts this QueryClientStateResponse to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.QueryClientStateResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    QueryClientStateResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return QueryClientStateResponse;
                })(v1.QueryClientStateResponse || {});

                v1.QueryClientStatesRequest = (function(QueryClientStatesRequest) {

                    /**
                     * Properties of a QueryClientStatesRequest.
                     * @memberof ibc.core.client.v1
                     * @interface IQueryClientStatesRequest
                     * @property {cosmos.base.query.v1beta1.IPageRequest|null} [pagination] QueryClientStatesRequest pagination
                     */

                    /**
                     * Constructs a new QueryClientStatesRequest.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a QueryClientStatesRequest.
                     * @implements IQueryClientStatesRequest
                     * @constructor
                     * @param {ibc.core.client.v1.IQueryClientStatesRequest=} [properties] Properties to set
                     */
                    function QueryClientStatesRequest(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * QueryClientStatesRequest pagination.
                     * @member {cosmos.base.query.v1beta1.IPageRequest|null|undefined} pagination
                     * @memberof ibc.core.client.v1.QueryClientStatesRequest
                     * @instance
                     */
                    QueryClientStatesRequest.prototype.pagination = null;

                    /**
                     * Creates a new QueryClientStatesRequest instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.QueryClientStatesRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStatesRequest=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.QueryClientStatesRequest} QueryClientStatesRequest instance
                     */
                    QueryClientStatesRequest.create = function create(properties) {
                        return new QueryClientStatesRequest(properties);
                    };

                    /**
                     * Encodes the specified QueryClientStatesRequest message. Does not implicitly {@link ibc.core.client.v1.QueryClientStatesRequest.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.QueryClientStatesRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStatesRequest} message QueryClientStatesRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientStatesRequest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.pagination != null && Object.hasOwnProperty.call(message, "pagination"))
                            $root.cosmos.base.query.v1beta1.PageRequest.encode(message.pagination, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified QueryClientStatesRequest message, length delimited. Does not implicitly {@link ibc.core.client.v1.QueryClientStatesRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientStatesRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStatesRequest} message QueryClientStatesRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientStatesRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a QueryClientStatesRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.QueryClientStatesRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.QueryClientStatesRequest} QueryClientStatesRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientStatesRequest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.QueryClientStatesRequest();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.pagination = $root.cosmos.base.query.v1beta1.PageRequest.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a QueryClientStatesRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientStatesRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.QueryClientStatesRequest} QueryClientStatesRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientStatesRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a QueryClientStatesRequest message.
                     * @function verify
                     * @memberof ibc.core.client.v1.QueryClientStatesRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    QueryClientStatesRequest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.pagination != null && message.hasOwnProperty("pagination")) {
                            let error = $root.cosmos.base.query.v1beta1.PageRequest.verify(message.pagination);
                            if (error)
                                return "pagination." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a QueryClientStatesRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.QueryClientStatesRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.QueryClientStatesRequest} QueryClientStatesRequest
                     */
                    QueryClientStatesRequest.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.QueryClientStatesRequest)
                            return object;
                        let message = new $root.ibc.core.client.v1.QueryClientStatesRequest();
                        if (object.pagination != null) {
                            if (typeof object.pagination !== "object")
                                throw TypeError(".ibc.core.client.v1.QueryClientStatesRequest.pagination: object expected");
                            message.pagination = $root.cosmos.base.query.v1beta1.PageRequest.fromObject(object.pagination);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a QueryClientStatesRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.QueryClientStatesRequest
                     * @static
                     * @param {ibc.core.client.v1.QueryClientStatesRequest} message QueryClientStatesRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    QueryClientStatesRequest.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults)
                            object.pagination = null;
                        if (message.pagination != null && message.hasOwnProperty("pagination"))
                            object.pagination = $root.cosmos.base.query.v1beta1.PageRequest.toObject(message.pagination, options);
                        return object;
                    };

                    /**
                     * Converts this QueryClientStatesRequest to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.QueryClientStatesRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    QueryClientStatesRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return QueryClientStatesRequest;
                })(v1.QueryClientStatesRequest || {});

                v1.QueryClientStatesResponse = (function(QueryClientStatesResponse) {

                    /**
                     * Properties of a QueryClientStatesResponse.
                     * @memberof ibc.core.client.v1
                     * @interface IQueryClientStatesResponse
                     * @property {Array.<ibc.core.client.v1.IIdentifiedClientState>|null} [clientStates] QueryClientStatesResponse clientStates
                     * @property {cosmos.base.query.v1beta1.IPageResponse|null} [pagination] QueryClientStatesResponse pagination
                     */

                    /**
                     * Constructs a new QueryClientStatesResponse.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a QueryClientStatesResponse.
                     * @implements IQueryClientStatesResponse
                     * @constructor
                     * @param {ibc.core.client.v1.IQueryClientStatesResponse=} [properties] Properties to set
                     */
                    function QueryClientStatesResponse(properties) {
                        this.clientStates = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * QueryClientStatesResponse clientStates.
                     * @member {Array.<ibc.core.client.v1.IIdentifiedClientState>} clientStates
                     * @memberof ibc.core.client.v1.QueryClientStatesResponse
                     * @instance
                     */
                    QueryClientStatesResponse.prototype.clientStates = $util.emptyArray;

                    /**
                     * QueryClientStatesResponse pagination.
                     * @member {cosmos.base.query.v1beta1.IPageResponse|null|undefined} pagination
                     * @memberof ibc.core.client.v1.QueryClientStatesResponse
                     * @instance
                     */
                    QueryClientStatesResponse.prototype.pagination = null;

                    /**
                     * Creates a new QueryClientStatesResponse instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.QueryClientStatesResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStatesResponse=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.QueryClientStatesResponse} QueryClientStatesResponse instance
                     */
                    QueryClientStatesResponse.create = function create(properties) {
                        return new QueryClientStatesResponse(properties);
                    };

                    /**
                     * Encodes the specified QueryClientStatesResponse message. Does not implicitly {@link ibc.core.client.v1.QueryClientStatesResponse.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.QueryClientStatesResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStatesResponse} message QueryClientStatesResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientStatesResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientStates != null && message.clientStates.length)
                            for (let i = 0; i < message.clientStates.length; ++i)
                                $root.ibc.core.client.v1.IdentifiedClientState.encode(message.clientStates[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.pagination != null && Object.hasOwnProperty.call(message, "pagination"))
                            $root.cosmos.base.query.v1beta1.PageResponse.encode(message.pagination, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified QueryClientStatesResponse message, length delimited. Does not implicitly {@link ibc.core.client.v1.QueryClientStatesResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientStatesResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientStatesResponse} message QueryClientStatesResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientStatesResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a QueryClientStatesResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.QueryClientStatesResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.QueryClientStatesResponse} QueryClientStatesResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientStatesResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.QueryClientStatesResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                if (!(message.clientStates && message.clientStates.length))
                                    message.clientStates = [];
                                message.clientStates.push($root.ibc.core.client.v1.IdentifiedClientState.decode(reader, reader.uint32()));
                                break;
                            case 2:
                                message.pagination = $root.cosmos.base.query.v1beta1.PageResponse.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a QueryClientStatesResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientStatesResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.QueryClientStatesResponse} QueryClientStatesResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientStatesResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a QueryClientStatesResponse message.
                     * @function verify
                     * @memberof ibc.core.client.v1.QueryClientStatesResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    QueryClientStatesResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientStates != null && message.hasOwnProperty("clientStates")) {
                            if (!Array.isArray(message.clientStates))
                                return "clientStates: array expected";
                            for (let i = 0; i < message.clientStates.length; ++i) {
                                let error = $root.ibc.core.client.v1.IdentifiedClientState.verify(message.clientStates[i]);
                                if (error)
                                    return "clientStates." + error;
                            }
                        }
                        if (message.pagination != null && message.hasOwnProperty("pagination")) {
                            let error = $root.cosmos.base.query.v1beta1.PageResponse.verify(message.pagination);
                            if (error)
                                return "pagination." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a QueryClientStatesResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.QueryClientStatesResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.QueryClientStatesResponse} QueryClientStatesResponse
                     */
                    QueryClientStatesResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.QueryClientStatesResponse)
                            return object;
                        let message = new $root.ibc.core.client.v1.QueryClientStatesResponse();
                        if (object.clientStates) {
                            if (!Array.isArray(object.clientStates))
                                throw TypeError(".ibc.core.client.v1.QueryClientStatesResponse.clientStates: array expected");
                            message.clientStates = [];
                            for (let i = 0; i < object.clientStates.length; ++i) {
                                if (typeof object.clientStates[i] !== "object")
                                    throw TypeError(".ibc.core.client.v1.QueryClientStatesResponse.clientStates: object expected");
                                message.clientStates[i] = $root.ibc.core.client.v1.IdentifiedClientState.fromObject(object.clientStates[i]);
                            }
                        }
                        if (object.pagination != null) {
                            if (typeof object.pagination !== "object")
                                throw TypeError(".ibc.core.client.v1.QueryClientStatesResponse.pagination: object expected");
                            message.pagination = $root.cosmos.base.query.v1beta1.PageResponse.fromObject(object.pagination);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a QueryClientStatesResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.QueryClientStatesResponse
                     * @static
                     * @param {ibc.core.client.v1.QueryClientStatesResponse} message QueryClientStatesResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    QueryClientStatesResponse.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.clientStates = [];
                        if (options.defaults)
                            object.pagination = null;
                        if (message.clientStates && message.clientStates.length) {
                            object.clientStates = [];
                            for (let j = 0; j < message.clientStates.length; ++j)
                                object.clientStates[j] = $root.ibc.core.client.v1.IdentifiedClientState.toObject(message.clientStates[j], options);
                        }
                        if (message.pagination != null && message.hasOwnProperty("pagination"))
                            object.pagination = $root.cosmos.base.query.v1beta1.PageResponse.toObject(message.pagination, options);
                        return object;
                    };

                    /**
                     * Converts this QueryClientStatesResponse to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.QueryClientStatesResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    QueryClientStatesResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return QueryClientStatesResponse;
                })(v1.QueryClientStatesResponse || {});

                v1.QueryConsensusStateRequest = (function(QueryConsensusStateRequest) {

                    /**
                     * Properties of a QueryConsensusStateRequest.
                     * @memberof ibc.core.client.v1
                     * @interface IQueryConsensusStateRequest
                     * @property {string|null} [clientId] QueryConsensusStateRequest clientId
                     * @property {number|Long|null} [revisionNumber] QueryConsensusStateRequest revisionNumber
                     * @property {number|Long|null} [revisionHeight] QueryConsensusStateRequest revisionHeight
                     * @property {boolean|null} [latestHeight] QueryConsensusStateRequest latestHeight
                     */

                    /**
                     * Constructs a new QueryConsensusStateRequest.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a QueryConsensusStateRequest.
                     * @implements IQueryConsensusStateRequest
                     * @constructor
                     * @param {ibc.core.client.v1.IQueryConsensusStateRequest=} [properties] Properties to set
                     */
                    function QueryConsensusStateRequest(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * QueryConsensusStateRequest clientId.
                     * @member {string} clientId
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @instance
                     */
                    QueryConsensusStateRequest.prototype.clientId = "";

                    /**
                     * QueryConsensusStateRequest revisionNumber.
                     * @member {number|Long} revisionNumber
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @instance
                     */
                    QueryConsensusStateRequest.prototype.revisionNumber = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * QueryConsensusStateRequest revisionHeight.
                     * @member {number|Long} revisionHeight
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @instance
                     */
                    QueryConsensusStateRequest.prototype.revisionHeight = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * QueryConsensusStateRequest latestHeight.
                     * @member {boolean} latestHeight
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @instance
                     */
                    QueryConsensusStateRequest.prototype.latestHeight = false;

                    /**
                     * Creates a new QueryConsensusStateRequest instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStateRequest=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.QueryConsensusStateRequest} QueryConsensusStateRequest instance
                     */
                    QueryConsensusStateRequest.create = function create(properties) {
                        return new QueryConsensusStateRequest(properties);
                    };

                    /**
                     * Encodes the specified QueryConsensusStateRequest message. Does not implicitly {@link ibc.core.client.v1.QueryConsensusStateRequest.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStateRequest} message QueryConsensusStateRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryConsensusStateRequest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
                        if (message.revisionNumber != null && Object.hasOwnProperty.call(message, "revisionNumber"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.revisionNumber);
                        if (message.revisionHeight != null && Object.hasOwnProperty.call(message, "revisionHeight"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.revisionHeight);
                        if (message.latestHeight != null && Object.hasOwnProperty.call(message, "latestHeight"))
                            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.latestHeight);
                        return writer;
                    };

                    /**
                     * Encodes the specified QueryConsensusStateRequest message, length delimited. Does not implicitly {@link ibc.core.client.v1.QueryConsensusStateRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStateRequest} message QueryConsensusStateRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryConsensusStateRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a QueryConsensusStateRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.QueryConsensusStateRequest} QueryConsensusStateRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryConsensusStateRequest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.QueryConsensusStateRequest();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clientId = reader.string();
                                break;
                            case 2:
                                message.revisionNumber = reader.uint64();
                                break;
                            case 3:
                                message.revisionHeight = reader.uint64();
                                break;
                            case 4:
                                message.latestHeight = reader.bool();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a QueryConsensusStateRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.QueryConsensusStateRequest} QueryConsensusStateRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryConsensusStateRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a QueryConsensusStateRequest message.
                     * @function verify
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    QueryConsensusStateRequest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            if (!$util.isString(message.clientId))
                                return "clientId: string expected";
                        if (message.revisionNumber != null && message.hasOwnProperty("revisionNumber"))
                            if (!$util.isInteger(message.revisionNumber) && !(message.revisionNumber && $util.isInteger(message.revisionNumber.low) && $util.isInteger(message.revisionNumber.high)))
                                return "revisionNumber: integer|Long expected";
                        if (message.revisionHeight != null && message.hasOwnProperty("revisionHeight"))
                            if (!$util.isInteger(message.revisionHeight) && !(message.revisionHeight && $util.isInteger(message.revisionHeight.low) && $util.isInteger(message.revisionHeight.high)))
                                return "revisionHeight: integer|Long expected";
                        if (message.latestHeight != null && message.hasOwnProperty("latestHeight"))
                            if (typeof message.latestHeight !== "boolean")
                                return "latestHeight: boolean expected";
                        return null;
                    };

                    /**
                     * Creates a QueryConsensusStateRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.QueryConsensusStateRequest} QueryConsensusStateRequest
                     */
                    QueryConsensusStateRequest.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.QueryConsensusStateRequest)
                            return object;
                        let message = new $root.ibc.core.client.v1.QueryConsensusStateRequest();
                        if (object.clientId != null)
                            message.clientId = String(object.clientId);
                        if (object.revisionNumber != null)
                            if ($util.Long)
                                (message.revisionNumber = $util.Long.fromValue(object.revisionNumber)).unsigned = true;
                            else if (typeof object.revisionNumber === "string")
                                message.revisionNumber = parseInt(object.revisionNumber, 10);
                            else if (typeof object.revisionNumber === "number")
                                message.revisionNumber = object.revisionNumber;
                            else if (typeof object.revisionNumber === "object")
                                message.revisionNumber = new $util.LongBits(object.revisionNumber.low >>> 0, object.revisionNumber.high >>> 0).toNumber(true);
                        if (object.revisionHeight != null)
                            if ($util.Long)
                                (message.revisionHeight = $util.Long.fromValue(object.revisionHeight)).unsigned = true;
                            else if (typeof object.revisionHeight === "string")
                                message.revisionHeight = parseInt(object.revisionHeight, 10);
                            else if (typeof object.revisionHeight === "number")
                                message.revisionHeight = object.revisionHeight;
                            else if (typeof object.revisionHeight === "object")
                                message.revisionHeight = new $util.LongBits(object.revisionHeight.low >>> 0, object.revisionHeight.high >>> 0).toNumber(true);
                        if (object.latestHeight != null)
                            message.latestHeight = Boolean(object.latestHeight);
                        return message;
                    };

                    /**
                     * Creates a plain object from a QueryConsensusStateRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @static
                     * @param {ibc.core.client.v1.QueryConsensusStateRequest} message QueryConsensusStateRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    QueryConsensusStateRequest.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.clientId = "";
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.revisionNumber = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.revisionNumber = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.revisionHeight = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.revisionHeight = options.longs === String ? "0" : 0;
                            object.latestHeight = false;
                        }
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            object.clientId = message.clientId;
                        if (message.revisionNumber != null && message.hasOwnProperty("revisionNumber"))
                            if (typeof message.revisionNumber === "number")
                                object.revisionNumber = options.longs === String ? String(message.revisionNumber) : message.revisionNumber;
                            else
                                object.revisionNumber = options.longs === String ? $util.Long.prototype.toString.call(message.revisionNumber) : options.longs === Number ? new $util.LongBits(message.revisionNumber.low >>> 0, message.revisionNumber.high >>> 0).toNumber(true) : message.revisionNumber;
                        if (message.revisionHeight != null && message.hasOwnProperty("revisionHeight"))
                            if (typeof message.revisionHeight === "number")
                                object.revisionHeight = options.longs === String ? String(message.revisionHeight) : message.revisionHeight;
                            else
                                object.revisionHeight = options.longs === String ? $util.Long.prototype.toString.call(message.revisionHeight) : options.longs === Number ? new $util.LongBits(message.revisionHeight.low >>> 0, message.revisionHeight.high >>> 0).toNumber(true) : message.revisionHeight;
                        if (message.latestHeight != null && message.hasOwnProperty("latestHeight"))
                            object.latestHeight = message.latestHeight;
                        return object;
                    };

                    /**
                     * Converts this QueryConsensusStateRequest to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.QueryConsensusStateRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    QueryConsensusStateRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return QueryConsensusStateRequest;
                })(v1.QueryConsensusStateRequest || {});

                v1.QueryConsensusStateResponse = (function(QueryConsensusStateResponse) {

                    /**
                     * Properties of a QueryConsensusStateResponse.
                     * @memberof ibc.core.client.v1
                     * @interface IQueryConsensusStateResponse
                     * @property {google.protobuf.IAny|null} [consensusState] QueryConsensusStateResponse consensusState
                     * @property {Uint8Array|null} [proof] QueryConsensusStateResponse proof
                     * @property {ibc.core.client.v1.IHeight|null} [proofHeight] QueryConsensusStateResponse proofHeight
                     */

                    /**
                     * Constructs a new QueryConsensusStateResponse.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a QueryConsensusStateResponse.
                     * @implements IQueryConsensusStateResponse
                     * @constructor
                     * @param {ibc.core.client.v1.IQueryConsensusStateResponse=} [properties] Properties to set
                     */
                    function QueryConsensusStateResponse(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * QueryConsensusStateResponse consensusState.
                     * @member {google.protobuf.IAny|null|undefined} consensusState
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @instance
                     */
                    QueryConsensusStateResponse.prototype.consensusState = null;

                    /**
                     * QueryConsensusStateResponse proof.
                     * @member {Uint8Array} proof
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @instance
                     */
                    QueryConsensusStateResponse.prototype.proof = $util.newBuffer([]);

                    /**
                     * QueryConsensusStateResponse proofHeight.
                     * @member {ibc.core.client.v1.IHeight|null|undefined} proofHeight
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @instance
                     */
                    QueryConsensusStateResponse.prototype.proofHeight = null;

                    /**
                     * Creates a new QueryConsensusStateResponse instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStateResponse=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.QueryConsensusStateResponse} QueryConsensusStateResponse instance
                     */
                    QueryConsensusStateResponse.create = function create(properties) {
                        return new QueryConsensusStateResponse(properties);
                    };

                    /**
                     * Encodes the specified QueryConsensusStateResponse message. Does not implicitly {@link ibc.core.client.v1.QueryConsensusStateResponse.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStateResponse} message QueryConsensusStateResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryConsensusStateResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.consensusState != null && Object.hasOwnProperty.call(message, "consensusState"))
                            $root.google.protobuf.Any.encode(message.consensusState, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.proof != null && Object.hasOwnProperty.call(message, "proof"))
                            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.proof);
                        if (message.proofHeight != null && Object.hasOwnProperty.call(message, "proofHeight"))
                            $root.ibc.core.client.v1.Height.encode(message.proofHeight, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified QueryConsensusStateResponse message, length delimited. Does not implicitly {@link ibc.core.client.v1.QueryConsensusStateResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStateResponse} message QueryConsensusStateResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryConsensusStateResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a QueryConsensusStateResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.QueryConsensusStateResponse} QueryConsensusStateResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryConsensusStateResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.QueryConsensusStateResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.consensusState = $root.google.protobuf.Any.decode(reader, reader.uint32());
                                break;
                            case 2:
                                message.proof = reader.bytes();
                                break;
                            case 3:
                                message.proofHeight = $root.ibc.core.client.v1.Height.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a QueryConsensusStateResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.QueryConsensusStateResponse} QueryConsensusStateResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryConsensusStateResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a QueryConsensusStateResponse message.
                     * @function verify
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    QueryConsensusStateResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.consensusState != null && message.hasOwnProperty("consensusState")) {
                            let error = $root.google.protobuf.Any.verify(message.consensusState);
                            if (error)
                                return "consensusState." + error;
                        }
                        if (message.proof != null && message.hasOwnProperty("proof"))
                            if (!(message.proof && typeof message.proof.length === "number" || $util.isString(message.proof)))
                                return "proof: buffer expected";
                        if (message.proofHeight != null && message.hasOwnProperty("proofHeight")) {
                            let error = $root.ibc.core.client.v1.Height.verify(message.proofHeight);
                            if (error)
                                return "proofHeight." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a QueryConsensusStateResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.QueryConsensusStateResponse} QueryConsensusStateResponse
                     */
                    QueryConsensusStateResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.QueryConsensusStateResponse)
                            return object;
                        let message = new $root.ibc.core.client.v1.QueryConsensusStateResponse();
                        if (object.consensusState != null) {
                            if (typeof object.consensusState !== "object")
                                throw TypeError(".ibc.core.client.v1.QueryConsensusStateResponse.consensusState: object expected");
                            message.consensusState = $root.google.protobuf.Any.fromObject(object.consensusState);
                        }
                        if (object.proof != null)
                            if (typeof object.proof === "string")
                                $util.base64.decode(object.proof, message.proof = $util.newBuffer($util.base64.length(object.proof)), 0);
                            else if (object.proof.length)
                                message.proof = object.proof;
                        if (object.proofHeight != null) {
                            if (typeof object.proofHeight !== "object")
                                throw TypeError(".ibc.core.client.v1.QueryConsensusStateResponse.proofHeight: object expected");
                            message.proofHeight = $root.ibc.core.client.v1.Height.fromObject(object.proofHeight);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a QueryConsensusStateResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @static
                     * @param {ibc.core.client.v1.QueryConsensusStateResponse} message QueryConsensusStateResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    QueryConsensusStateResponse.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.consensusState = null;
                            if (options.bytes === String)
                                object.proof = "";
                            else {
                                object.proof = [];
                                if (options.bytes !== Array)
                                    object.proof = $util.newBuffer(object.proof);
                            }
                            object.proofHeight = null;
                        }
                        if (message.consensusState != null && message.hasOwnProperty("consensusState"))
                            object.consensusState = $root.google.protobuf.Any.toObject(message.consensusState, options);
                        if (message.proof != null && message.hasOwnProperty("proof"))
                            object.proof = options.bytes === String ? $util.base64.encode(message.proof, 0, message.proof.length) : options.bytes === Array ? Array.prototype.slice.call(message.proof) : message.proof;
                        if (message.proofHeight != null && message.hasOwnProperty("proofHeight"))
                            object.proofHeight = $root.ibc.core.client.v1.Height.toObject(message.proofHeight, options);
                        return object;
                    };

                    /**
                     * Converts this QueryConsensusStateResponse to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.QueryConsensusStateResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    QueryConsensusStateResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return QueryConsensusStateResponse;
                })(v1.QueryConsensusStateResponse || {});

                v1.QueryConsensusStatesRequest = (function(QueryConsensusStatesRequest) {

                    /**
                     * Properties of a QueryConsensusStatesRequest.
                     * @memberof ibc.core.client.v1
                     * @interface IQueryConsensusStatesRequest
                     * @property {string|null} [clientId] QueryConsensusStatesRequest clientId
                     * @property {cosmos.base.query.v1beta1.IPageRequest|null} [pagination] QueryConsensusStatesRequest pagination
                     */

                    /**
                     * Constructs a new QueryConsensusStatesRequest.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a QueryConsensusStatesRequest.
                     * @implements IQueryConsensusStatesRequest
                     * @constructor
                     * @param {ibc.core.client.v1.IQueryConsensusStatesRequest=} [properties] Properties to set
                     */
                    function QueryConsensusStatesRequest(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * QueryConsensusStatesRequest clientId.
                     * @member {string} clientId
                     * @memberof ibc.core.client.v1.QueryConsensusStatesRequest
                     * @instance
                     */
                    QueryConsensusStatesRequest.prototype.clientId = "";

                    /**
                     * QueryConsensusStatesRequest pagination.
                     * @member {cosmos.base.query.v1beta1.IPageRequest|null|undefined} pagination
                     * @memberof ibc.core.client.v1.QueryConsensusStatesRequest
                     * @instance
                     */
                    QueryConsensusStatesRequest.prototype.pagination = null;

                    /**
                     * Creates a new QueryConsensusStatesRequest instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.QueryConsensusStatesRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStatesRequest=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.QueryConsensusStatesRequest} QueryConsensusStatesRequest instance
                     */
                    QueryConsensusStatesRequest.create = function create(properties) {
                        return new QueryConsensusStatesRequest(properties);
                    };

                    /**
                     * Encodes the specified QueryConsensusStatesRequest message. Does not implicitly {@link ibc.core.client.v1.QueryConsensusStatesRequest.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.QueryConsensusStatesRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStatesRequest} message QueryConsensusStatesRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryConsensusStatesRequest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
                        if (message.pagination != null && Object.hasOwnProperty.call(message, "pagination"))
                            $root.cosmos.base.query.v1beta1.PageRequest.encode(message.pagination, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified QueryConsensusStatesRequest message, length delimited. Does not implicitly {@link ibc.core.client.v1.QueryConsensusStatesRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.QueryConsensusStatesRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStatesRequest} message QueryConsensusStatesRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryConsensusStatesRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a QueryConsensusStatesRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.QueryConsensusStatesRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.QueryConsensusStatesRequest} QueryConsensusStatesRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryConsensusStatesRequest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.QueryConsensusStatesRequest();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clientId = reader.string();
                                break;
                            case 2:
                                message.pagination = $root.cosmos.base.query.v1beta1.PageRequest.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a QueryConsensusStatesRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.QueryConsensusStatesRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.QueryConsensusStatesRequest} QueryConsensusStatesRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryConsensusStatesRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a QueryConsensusStatesRequest message.
                     * @function verify
                     * @memberof ibc.core.client.v1.QueryConsensusStatesRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    QueryConsensusStatesRequest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            if (!$util.isString(message.clientId))
                                return "clientId: string expected";
                        if (message.pagination != null && message.hasOwnProperty("pagination")) {
                            let error = $root.cosmos.base.query.v1beta1.PageRequest.verify(message.pagination);
                            if (error)
                                return "pagination." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a QueryConsensusStatesRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.QueryConsensusStatesRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.QueryConsensusStatesRequest} QueryConsensusStatesRequest
                     */
                    QueryConsensusStatesRequest.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.QueryConsensusStatesRequest)
                            return object;
                        let message = new $root.ibc.core.client.v1.QueryConsensusStatesRequest();
                        if (object.clientId != null)
                            message.clientId = String(object.clientId);
                        if (object.pagination != null) {
                            if (typeof object.pagination !== "object")
                                throw TypeError(".ibc.core.client.v1.QueryConsensusStatesRequest.pagination: object expected");
                            message.pagination = $root.cosmos.base.query.v1beta1.PageRequest.fromObject(object.pagination);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a QueryConsensusStatesRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.QueryConsensusStatesRequest
                     * @static
                     * @param {ibc.core.client.v1.QueryConsensusStatesRequest} message QueryConsensusStatesRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    QueryConsensusStatesRequest.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.clientId = "";
                            object.pagination = null;
                        }
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            object.clientId = message.clientId;
                        if (message.pagination != null && message.hasOwnProperty("pagination"))
                            object.pagination = $root.cosmos.base.query.v1beta1.PageRequest.toObject(message.pagination, options);
                        return object;
                    };

                    /**
                     * Converts this QueryConsensusStatesRequest to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.QueryConsensusStatesRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    QueryConsensusStatesRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return QueryConsensusStatesRequest;
                })(v1.QueryConsensusStatesRequest || {});

                v1.QueryConsensusStatesResponse = (function(QueryConsensusStatesResponse) {

                    /**
                     * Properties of a QueryConsensusStatesResponse.
                     * @memberof ibc.core.client.v1
                     * @interface IQueryConsensusStatesResponse
                     * @property {Array.<ibc.core.client.v1.IConsensusStateWithHeight>|null} [consensusStates] QueryConsensusStatesResponse consensusStates
                     * @property {cosmos.base.query.v1beta1.IPageResponse|null} [pagination] QueryConsensusStatesResponse pagination
                     */

                    /**
                     * Constructs a new QueryConsensusStatesResponse.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a QueryConsensusStatesResponse.
                     * @implements IQueryConsensusStatesResponse
                     * @constructor
                     * @param {ibc.core.client.v1.IQueryConsensusStatesResponse=} [properties] Properties to set
                     */
                    function QueryConsensusStatesResponse(properties) {
                        this.consensusStates = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * QueryConsensusStatesResponse consensusStates.
                     * @member {Array.<ibc.core.client.v1.IConsensusStateWithHeight>} consensusStates
                     * @memberof ibc.core.client.v1.QueryConsensusStatesResponse
                     * @instance
                     */
                    QueryConsensusStatesResponse.prototype.consensusStates = $util.emptyArray;

                    /**
                     * QueryConsensusStatesResponse pagination.
                     * @member {cosmos.base.query.v1beta1.IPageResponse|null|undefined} pagination
                     * @memberof ibc.core.client.v1.QueryConsensusStatesResponse
                     * @instance
                     */
                    QueryConsensusStatesResponse.prototype.pagination = null;

                    /**
                     * Creates a new QueryConsensusStatesResponse instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.QueryConsensusStatesResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStatesResponse=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.QueryConsensusStatesResponse} QueryConsensusStatesResponse instance
                     */
                    QueryConsensusStatesResponse.create = function create(properties) {
                        return new QueryConsensusStatesResponse(properties);
                    };

                    /**
                     * Encodes the specified QueryConsensusStatesResponse message. Does not implicitly {@link ibc.core.client.v1.QueryConsensusStatesResponse.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.QueryConsensusStatesResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStatesResponse} message QueryConsensusStatesResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryConsensusStatesResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.consensusStates != null && message.consensusStates.length)
                            for (let i = 0; i < message.consensusStates.length; ++i)
                                $root.ibc.core.client.v1.ConsensusStateWithHeight.encode(message.consensusStates[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.pagination != null && Object.hasOwnProperty.call(message, "pagination"))
                            $root.cosmos.base.query.v1beta1.PageResponse.encode(message.pagination, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified QueryConsensusStatesResponse message, length delimited. Does not implicitly {@link ibc.core.client.v1.QueryConsensusStatesResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.QueryConsensusStatesResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryConsensusStatesResponse} message QueryConsensusStatesResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryConsensusStatesResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a QueryConsensusStatesResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.QueryConsensusStatesResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.QueryConsensusStatesResponse} QueryConsensusStatesResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryConsensusStatesResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.QueryConsensusStatesResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                if (!(message.consensusStates && message.consensusStates.length))
                                    message.consensusStates = [];
                                message.consensusStates.push($root.ibc.core.client.v1.ConsensusStateWithHeight.decode(reader, reader.uint32()));
                                break;
                            case 2:
                                message.pagination = $root.cosmos.base.query.v1beta1.PageResponse.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a QueryConsensusStatesResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.QueryConsensusStatesResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.QueryConsensusStatesResponse} QueryConsensusStatesResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryConsensusStatesResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a QueryConsensusStatesResponse message.
                     * @function verify
                     * @memberof ibc.core.client.v1.QueryConsensusStatesResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    QueryConsensusStatesResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.consensusStates != null && message.hasOwnProperty("consensusStates")) {
                            if (!Array.isArray(message.consensusStates))
                                return "consensusStates: array expected";
                            for (let i = 0; i < message.consensusStates.length; ++i) {
                                let error = $root.ibc.core.client.v1.ConsensusStateWithHeight.verify(message.consensusStates[i]);
                                if (error)
                                    return "consensusStates." + error;
                            }
                        }
                        if (message.pagination != null && message.hasOwnProperty("pagination")) {
                            let error = $root.cosmos.base.query.v1beta1.PageResponse.verify(message.pagination);
                            if (error)
                                return "pagination." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a QueryConsensusStatesResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.QueryConsensusStatesResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.QueryConsensusStatesResponse} QueryConsensusStatesResponse
                     */
                    QueryConsensusStatesResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.QueryConsensusStatesResponse)
                            return object;
                        let message = new $root.ibc.core.client.v1.QueryConsensusStatesResponse();
                        if (object.consensusStates) {
                            if (!Array.isArray(object.consensusStates))
                                throw TypeError(".ibc.core.client.v1.QueryConsensusStatesResponse.consensusStates: array expected");
                            message.consensusStates = [];
                            for (let i = 0; i < object.consensusStates.length; ++i) {
                                if (typeof object.consensusStates[i] !== "object")
                                    throw TypeError(".ibc.core.client.v1.QueryConsensusStatesResponse.consensusStates: object expected");
                                message.consensusStates[i] = $root.ibc.core.client.v1.ConsensusStateWithHeight.fromObject(object.consensusStates[i]);
                            }
                        }
                        if (object.pagination != null) {
                            if (typeof object.pagination !== "object")
                                throw TypeError(".ibc.core.client.v1.QueryConsensusStatesResponse.pagination: object expected");
                            message.pagination = $root.cosmos.base.query.v1beta1.PageResponse.fromObject(object.pagination);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a QueryConsensusStatesResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.QueryConsensusStatesResponse
                     * @static
                     * @param {ibc.core.client.v1.QueryConsensusStatesResponse} message QueryConsensusStatesResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    QueryConsensusStatesResponse.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.consensusStates = [];
                        if (options.defaults)
                            object.pagination = null;
                        if (message.consensusStates && message.consensusStates.length) {
                            object.consensusStates = [];
                            for (let j = 0; j < message.consensusStates.length; ++j)
                                object.consensusStates[j] = $root.ibc.core.client.v1.ConsensusStateWithHeight.toObject(message.consensusStates[j], options);
                        }
                        if (message.pagination != null && message.hasOwnProperty("pagination"))
                            object.pagination = $root.cosmos.base.query.v1beta1.PageResponse.toObject(message.pagination, options);
                        return object;
                    };

                    /**
                     * Converts this QueryConsensusStatesResponse to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.QueryConsensusStatesResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    QueryConsensusStatesResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return QueryConsensusStatesResponse;
                })(v1.QueryConsensusStatesResponse || {});

                v1.QueryClientParamsRequest = (function(QueryClientParamsRequest) {

                    /**
                     * Properties of a QueryClientParamsRequest.
                     * @memberof ibc.core.client.v1
                     * @interface IQueryClientParamsRequest
                     */

                    /**
                     * Constructs a new QueryClientParamsRequest.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a QueryClientParamsRequest.
                     * @implements IQueryClientParamsRequest
                     * @constructor
                     * @param {ibc.core.client.v1.IQueryClientParamsRequest=} [properties] Properties to set
                     */
                    function QueryClientParamsRequest(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Creates a new QueryClientParamsRequest instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.QueryClientParamsRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientParamsRequest=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.QueryClientParamsRequest} QueryClientParamsRequest instance
                     */
                    QueryClientParamsRequest.create = function create(properties) {
                        return new QueryClientParamsRequest(properties);
                    };

                    /**
                     * Encodes the specified QueryClientParamsRequest message. Does not implicitly {@link ibc.core.client.v1.QueryClientParamsRequest.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.QueryClientParamsRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientParamsRequest} message QueryClientParamsRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientParamsRequest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        return writer;
                    };

                    /**
                     * Encodes the specified QueryClientParamsRequest message, length delimited. Does not implicitly {@link ibc.core.client.v1.QueryClientParamsRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientParamsRequest
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientParamsRequest} message QueryClientParamsRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientParamsRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a QueryClientParamsRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.QueryClientParamsRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.QueryClientParamsRequest} QueryClientParamsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientParamsRequest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.QueryClientParamsRequest();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a QueryClientParamsRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientParamsRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.QueryClientParamsRequest} QueryClientParamsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientParamsRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a QueryClientParamsRequest message.
                     * @function verify
                     * @memberof ibc.core.client.v1.QueryClientParamsRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    QueryClientParamsRequest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        return null;
                    };

                    /**
                     * Creates a QueryClientParamsRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.QueryClientParamsRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.QueryClientParamsRequest} QueryClientParamsRequest
                     */
                    QueryClientParamsRequest.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.QueryClientParamsRequest)
                            return object;
                        return new $root.ibc.core.client.v1.QueryClientParamsRequest();
                    };

                    /**
                     * Creates a plain object from a QueryClientParamsRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.QueryClientParamsRequest
                     * @static
                     * @param {ibc.core.client.v1.QueryClientParamsRequest} message QueryClientParamsRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    QueryClientParamsRequest.toObject = function toObject() {
                        return {};
                    };

                    /**
                     * Converts this QueryClientParamsRequest to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.QueryClientParamsRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    QueryClientParamsRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return QueryClientParamsRequest;
                })(v1.QueryClientParamsRequest || {});

                v1.QueryClientParamsResponse = (function(QueryClientParamsResponse) {

                    /**
                     * Properties of a QueryClientParamsResponse.
                     * @memberof ibc.core.client.v1
                     * @interface IQueryClientParamsResponse
                     * @property {ibc.core.client.v1.IParams|null} [params] QueryClientParamsResponse params
                     */

                    /**
                     * Constructs a new QueryClientParamsResponse.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a QueryClientParamsResponse.
                     * @implements IQueryClientParamsResponse
                     * @constructor
                     * @param {ibc.core.client.v1.IQueryClientParamsResponse=} [properties] Properties to set
                     */
                    function QueryClientParamsResponse(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * QueryClientParamsResponse params.
                     * @member {ibc.core.client.v1.IParams|null|undefined} params
                     * @memberof ibc.core.client.v1.QueryClientParamsResponse
                     * @instance
                     */
                    QueryClientParamsResponse.prototype.params = null;

                    /**
                     * Creates a new QueryClientParamsResponse instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.QueryClientParamsResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientParamsResponse=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.QueryClientParamsResponse} QueryClientParamsResponse instance
                     */
                    QueryClientParamsResponse.create = function create(properties) {
                        return new QueryClientParamsResponse(properties);
                    };

                    /**
                     * Encodes the specified QueryClientParamsResponse message. Does not implicitly {@link ibc.core.client.v1.QueryClientParamsResponse.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.QueryClientParamsResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientParamsResponse} message QueryClientParamsResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientParamsResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.params != null && Object.hasOwnProperty.call(message, "params"))
                            $root.ibc.core.client.v1.Params.encode(message.params, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified QueryClientParamsResponse message, length delimited. Does not implicitly {@link ibc.core.client.v1.QueryClientParamsResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientParamsResponse
                     * @static
                     * @param {ibc.core.client.v1.IQueryClientParamsResponse} message QueryClientParamsResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    QueryClientParamsResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a QueryClientParamsResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.QueryClientParamsResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.QueryClientParamsResponse} QueryClientParamsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientParamsResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.QueryClientParamsResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.params = $root.ibc.core.client.v1.Params.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a QueryClientParamsResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.QueryClientParamsResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.QueryClientParamsResponse} QueryClientParamsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    QueryClientParamsResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a QueryClientParamsResponse message.
                     * @function verify
                     * @memberof ibc.core.client.v1.QueryClientParamsResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    QueryClientParamsResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.params != null && message.hasOwnProperty("params")) {
                            let error = $root.ibc.core.client.v1.Params.verify(message.params);
                            if (error)
                                return "params." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a QueryClientParamsResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.QueryClientParamsResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.QueryClientParamsResponse} QueryClientParamsResponse
                     */
                    QueryClientParamsResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.QueryClientParamsResponse)
                            return object;
                        let message = new $root.ibc.core.client.v1.QueryClientParamsResponse();
                        if (object.params != null) {
                            if (typeof object.params !== "object")
                                throw TypeError(".ibc.core.client.v1.QueryClientParamsResponse.params: object expected");
                            message.params = $root.ibc.core.client.v1.Params.fromObject(object.params);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a QueryClientParamsResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.QueryClientParamsResponse
                     * @static
                     * @param {ibc.core.client.v1.QueryClientParamsResponse} message QueryClientParamsResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    QueryClientParamsResponse.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults)
                            object.params = null;
                        if (message.params != null && message.hasOwnProperty("params"))
                            object.params = $root.ibc.core.client.v1.Params.toObject(message.params, options);
                        return object;
                    };

                    /**
                     * Converts this QueryClientParamsResponse to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.QueryClientParamsResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    QueryClientParamsResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return QueryClientParamsResponse;
                })(v1.QueryClientParamsResponse || {});

                v1.Msg = (function(Msg) {

                    /**
                     * Constructs a new Msg service.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a Msg
                     * @extends $protobuf.rpc.Service
                     * @constructor
                     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                     */
                    function Msg(rpcImpl, requestDelimited, responseDelimited) {
                        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
                    }

                    (Msg.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Msg;

                    /**
                     * Creates new Msg service using the specified rpc implementation.
                     * @function create
                     * @memberof ibc.core.client.v1.Msg
                     * @static
                     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                     * @returns {Msg} RPC service. Useful where requests and/or responses are streamed.
                     */
                    Msg.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                        return new this(rpcImpl, requestDelimited, responseDelimited);
                    };

                    /**
                     * Callback as used by {@link ibc.core.client.v1.Msg#createClient}.
                     * @memberof ibc.core.client.v1.Msg
                     * @typedef CreateClientCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {ibc.core.client.v1.IMsgCreateClientResponse} [response] MsgCreateClientResponse
                     */

                    /**
                     * Calls CreateClient.
                     * @function createClient
                     * @memberof ibc.core.client.v1.Msg
                     * @instance
                     * @param {ibc.core.client.v1.IMsgCreateClient} request MsgCreateClient message or plain object
                     * @param {ibc.core.client.v1.Msg.CreateClientCallback} callback Node-style callback called with the error, if any, and MsgCreateClientResponse
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(Msg.prototype.createClient = function createClient(request, callback) {
                        return this.rpcCall(createClient, $root.ibc.core.client.v1.MsgCreateClient, $root.ibc.core.client.v1.MsgCreateClientResponse, request, callback);
                    }, "name", { value: "CreateClient" });

                    /**
                     * Calls CreateClient.
                     * @function createClient
                     * @memberof ibc.core.client.v1.Msg
                     * @instance
                     * @param {ibc.core.client.v1.IMsgCreateClient} request MsgCreateClient message or plain object
                     * @returns {Promise<ibc.core.client.v1.IMsgCreateClientResponse>} Promise
                     * @variation 2
                     */

                    /**
                     * Callback as used by {@link ibc.core.client.v1.Msg#updateClient}.
                     * @memberof ibc.core.client.v1.Msg
                     * @typedef UpdateClientCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {ibc.core.client.v1.IMsgUpdateClientResponse} [response] MsgUpdateClientResponse
                     */

                    /**
                     * Calls UpdateClient.
                     * @function updateClient
                     * @memberof ibc.core.client.v1.Msg
                     * @instance
                     * @param {ibc.core.client.v1.IMsgUpdateClient} request MsgUpdateClient message or plain object
                     * @param {ibc.core.client.v1.Msg.UpdateClientCallback} callback Node-style callback called with the error, if any, and MsgUpdateClientResponse
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(Msg.prototype.updateClient = function updateClient(request, callback) {
                        return this.rpcCall(updateClient, $root.ibc.core.client.v1.MsgUpdateClient, $root.ibc.core.client.v1.MsgUpdateClientResponse, request, callback);
                    }, "name", { value: "UpdateClient" });

                    /**
                     * Calls UpdateClient.
                     * @function updateClient
                     * @memberof ibc.core.client.v1.Msg
                     * @instance
                     * @param {ibc.core.client.v1.IMsgUpdateClient} request MsgUpdateClient message or plain object
                     * @returns {Promise<ibc.core.client.v1.IMsgUpdateClientResponse>} Promise
                     * @variation 2
                     */

                    /**
                     * Callback as used by {@link ibc.core.client.v1.Msg#upgradeClient}.
                     * @memberof ibc.core.client.v1.Msg
                     * @typedef UpgradeClientCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {ibc.core.client.v1.IMsgUpgradeClientResponse} [response] MsgUpgradeClientResponse
                     */

                    /**
                     * Calls UpgradeClient.
                     * @function upgradeClient
                     * @memberof ibc.core.client.v1.Msg
                     * @instance
                     * @param {ibc.core.client.v1.IMsgUpgradeClient} request MsgUpgradeClient message or plain object
                     * @param {ibc.core.client.v1.Msg.UpgradeClientCallback} callback Node-style callback called with the error, if any, and MsgUpgradeClientResponse
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(Msg.prototype.upgradeClient = function upgradeClient(request, callback) {
                        return this.rpcCall(upgradeClient, $root.ibc.core.client.v1.MsgUpgradeClient, $root.ibc.core.client.v1.MsgUpgradeClientResponse, request, callback);
                    }, "name", { value: "UpgradeClient" });

                    /**
                     * Calls UpgradeClient.
                     * @function upgradeClient
                     * @memberof ibc.core.client.v1.Msg
                     * @instance
                     * @param {ibc.core.client.v1.IMsgUpgradeClient} request MsgUpgradeClient message or plain object
                     * @returns {Promise<ibc.core.client.v1.IMsgUpgradeClientResponse>} Promise
                     * @variation 2
                     */

                    /**
                     * Callback as used by {@link ibc.core.client.v1.Msg#submitMisbehaviour}.
                     * @memberof ibc.core.client.v1.Msg
                     * @typedef SubmitMisbehaviourCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {ibc.core.client.v1.IMsgSubmitMisbehaviourResponse} [response] MsgSubmitMisbehaviourResponse
                     */

                    /**
                     * Calls SubmitMisbehaviour.
                     * @function submitMisbehaviour
                     * @memberof ibc.core.client.v1.Msg
                     * @instance
                     * @param {ibc.core.client.v1.IMsgSubmitMisbehaviour} request MsgSubmitMisbehaviour message or plain object
                     * @param {ibc.core.client.v1.Msg.SubmitMisbehaviourCallback} callback Node-style callback called with the error, if any, and MsgSubmitMisbehaviourResponse
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(Msg.prototype.submitMisbehaviour = function submitMisbehaviour(request, callback) {
                        return this.rpcCall(submitMisbehaviour, $root.ibc.core.client.v1.MsgSubmitMisbehaviour, $root.ibc.core.client.v1.MsgSubmitMisbehaviourResponse, request, callback);
                    }, "name", { value: "SubmitMisbehaviour" });

                    /**
                     * Calls SubmitMisbehaviour.
                     * @function submitMisbehaviour
                     * @memberof ibc.core.client.v1.Msg
                     * @instance
                     * @param {ibc.core.client.v1.IMsgSubmitMisbehaviour} request MsgSubmitMisbehaviour message or plain object
                     * @returns {Promise<ibc.core.client.v1.IMsgSubmitMisbehaviourResponse>} Promise
                     * @variation 2
                     */

                    return Msg;
                })(v1.Msg || {});

                v1.MsgCreateClient = (function(MsgCreateClient) {

                    /**
                     * Properties of a MsgCreateClient.
                     * @memberof ibc.core.client.v1
                     * @interface IMsgCreateClient
                     * @property {google.protobuf.IAny|null} [clientState] MsgCreateClient clientState
                     * @property {google.protobuf.IAny|null} [consensusState] MsgCreateClient consensusState
                     * @property {string|null} [signer] MsgCreateClient signer
                     */

                    /**
                     * Constructs a new MsgCreateClient.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a MsgCreateClient.
                     * @implements IMsgCreateClient
                     * @constructor
                     * @param {ibc.core.client.v1.IMsgCreateClient=} [properties] Properties to set
                     */
                    function MsgCreateClient(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * MsgCreateClient clientState.
                     * @member {google.protobuf.IAny|null|undefined} clientState
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @instance
                     */
                    MsgCreateClient.prototype.clientState = null;

                    /**
                     * MsgCreateClient consensusState.
                     * @member {google.protobuf.IAny|null|undefined} consensusState
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @instance
                     */
                    MsgCreateClient.prototype.consensusState = null;

                    /**
                     * MsgCreateClient signer.
                     * @member {string} signer
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @instance
                     */
                    MsgCreateClient.prototype.signer = "";

                    /**
                     * Creates a new MsgCreateClient instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @static
                     * @param {ibc.core.client.v1.IMsgCreateClient=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.MsgCreateClient} MsgCreateClient instance
                     */
                    MsgCreateClient.create = function create(properties) {
                        return new MsgCreateClient(properties);
                    };

                    /**
                     * Encodes the specified MsgCreateClient message. Does not implicitly {@link ibc.core.client.v1.MsgCreateClient.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @static
                     * @param {ibc.core.client.v1.IMsgCreateClient} message MsgCreateClient message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgCreateClient.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientState != null && Object.hasOwnProperty.call(message, "clientState"))
                            $root.google.protobuf.Any.encode(message.clientState, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.consensusState != null && Object.hasOwnProperty.call(message, "consensusState"))
                            $root.google.protobuf.Any.encode(message.consensusState, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        if (message.signer != null && Object.hasOwnProperty.call(message, "signer"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.signer);
                        return writer;
                    };

                    /**
                     * Encodes the specified MsgCreateClient message, length delimited. Does not implicitly {@link ibc.core.client.v1.MsgCreateClient.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @static
                     * @param {ibc.core.client.v1.IMsgCreateClient} message MsgCreateClient message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgCreateClient.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a MsgCreateClient message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.MsgCreateClient} MsgCreateClient
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgCreateClient.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.MsgCreateClient();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clientState = $root.google.protobuf.Any.decode(reader, reader.uint32());
                                break;
                            case 2:
                                message.consensusState = $root.google.protobuf.Any.decode(reader, reader.uint32());
                                break;
                            case 3:
                                message.signer = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MsgCreateClient message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.MsgCreateClient} MsgCreateClient
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgCreateClient.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MsgCreateClient message.
                     * @function verify
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MsgCreateClient.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientState != null && message.hasOwnProperty("clientState")) {
                            let error = $root.google.protobuf.Any.verify(message.clientState);
                            if (error)
                                return "clientState." + error;
                        }
                        if (message.consensusState != null && message.hasOwnProperty("consensusState")) {
                            let error = $root.google.protobuf.Any.verify(message.consensusState);
                            if (error)
                                return "consensusState." + error;
                        }
                        if (message.signer != null && message.hasOwnProperty("signer"))
                            if (!$util.isString(message.signer))
                                return "signer: string expected";
                        return null;
                    };

                    /**
                     * Creates a MsgCreateClient message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.MsgCreateClient} MsgCreateClient
                     */
                    MsgCreateClient.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.MsgCreateClient)
                            return object;
                        let message = new $root.ibc.core.client.v1.MsgCreateClient();
                        if (object.clientState != null) {
                            if (typeof object.clientState !== "object")
                                throw TypeError(".ibc.core.client.v1.MsgCreateClient.clientState: object expected");
                            message.clientState = $root.google.protobuf.Any.fromObject(object.clientState);
                        }
                        if (object.consensusState != null) {
                            if (typeof object.consensusState !== "object")
                                throw TypeError(".ibc.core.client.v1.MsgCreateClient.consensusState: object expected");
                            message.consensusState = $root.google.protobuf.Any.fromObject(object.consensusState);
                        }
                        if (object.signer != null)
                            message.signer = String(object.signer);
                        return message;
                    };

                    /**
                     * Creates a plain object from a MsgCreateClient message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @static
                     * @param {ibc.core.client.v1.MsgCreateClient} message MsgCreateClient
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MsgCreateClient.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.clientState = null;
                            object.consensusState = null;
                            object.signer = "";
                        }
                        if (message.clientState != null && message.hasOwnProperty("clientState"))
                            object.clientState = $root.google.protobuf.Any.toObject(message.clientState, options);
                        if (message.consensusState != null && message.hasOwnProperty("consensusState"))
                            object.consensusState = $root.google.protobuf.Any.toObject(message.consensusState, options);
                        if (message.signer != null && message.hasOwnProperty("signer"))
                            object.signer = message.signer;
                        return object;
                    };

                    /**
                     * Converts this MsgCreateClient to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.MsgCreateClient
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MsgCreateClient.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return MsgCreateClient;
                })(v1.MsgCreateClient || {});

                v1.MsgCreateClientResponse = (function(MsgCreateClientResponse) {

                    /**
                     * Properties of a MsgCreateClientResponse.
                     * @memberof ibc.core.client.v1
                     * @interface IMsgCreateClientResponse
                     */

                    /**
                     * Constructs a new MsgCreateClientResponse.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a MsgCreateClientResponse.
                     * @implements IMsgCreateClientResponse
                     * @constructor
                     * @param {ibc.core.client.v1.IMsgCreateClientResponse=} [properties] Properties to set
                     */
                    function MsgCreateClientResponse(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Creates a new MsgCreateClientResponse instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.MsgCreateClientResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgCreateClientResponse=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.MsgCreateClientResponse} MsgCreateClientResponse instance
                     */
                    MsgCreateClientResponse.create = function create(properties) {
                        return new MsgCreateClientResponse(properties);
                    };

                    /**
                     * Encodes the specified MsgCreateClientResponse message. Does not implicitly {@link ibc.core.client.v1.MsgCreateClientResponse.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.MsgCreateClientResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgCreateClientResponse} message MsgCreateClientResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgCreateClientResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        return writer;
                    };

                    /**
                     * Encodes the specified MsgCreateClientResponse message, length delimited. Does not implicitly {@link ibc.core.client.v1.MsgCreateClientResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.MsgCreateClientResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgCreateClientResponse} message MsgCreateClientResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgCreateClientResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a MsgCreateClientResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.MsgCreateClientResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.MsgCreateClientResponse} MsgCreateClientResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgCreateClientResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.MsgCreateClientResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MsgCreateClientResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.MsgCreateClientResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.MsgCreateClientResponse} MsgCreateClientResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgCreateClientResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MsgCreateClientResponse message.
                     * @function verify
                     * @memberof ibc.core.client.v1.MsgCreateClientResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MsgCreateClientResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        return null;
                    };

                    /**
                     * Creates a MsgCreateClientResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.MsgCreateClientResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.MsgCreateClientResponse} MsgCreateClientResponse
                     */
                    MsgCreateClientResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.MsgCreateClientResponse)
                            return object;
                        return new $root.ibc.core.client.v1.MsgCreateClientResponse();
                    };

                    /**
                     * Creates a plain object from a MsgCreateClientResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.MsgCreateClientResponse
                     * @static
                     * @param {ibc.core.client.v1.MsgCreateClientResponse} message MsgCreateClientResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MsgCreateClientResponse.toObject = function toObject() {
                        return {};
                    };

                    /**
                     * Converts this MsgCreateClientResponse to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.MsgCreateClientResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MsgCreateClientResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return MsgCreateClientResponse;
                })(v1.MsgCreateClientResponse || {});

                v1.MsgUpdateClient = (function(MsgUpdateClient) {

                    /**
                     * Properties of a MsgUpdateClient.
                     * @memberof ibc.core.client.v1
                     * @interface IMsgUpdateClient
                     * @property {string|null} [clientId] MsgUpdateClient clientId
                     * @property {google.protobuf.IAny|null} [header] MsgUpdateClient header
                     * @property {string|null} [signer] MsgUpdateClient signer
                     */

                    /**
                     * Constructs a new MsgUpdateClient.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a MsgUpdateClient.
                     * @implements IMsgUpdateClient
                     * @constructor
                     * @param {ibc.core.client.v1.IMsgUpdateClient=} [properties] Properties to set
                     */
                    function MsgUpdateClient(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * MsgUpdateClient clientId.
                     * @member {string} clientId
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @instance
                     */
                    MsgUpdateClient.prototype.clientId = "";

                    /**
                     * MsgUpdateClient header.
                     * @member {google.protobuf.IAny|null|undefined} header
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @instance
                     */
                    MsgUpdateClient.prototype.header = null;

                    /**
                     * MsgUpdateClient signer.
                     * @member {string} signer
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @instance
                     */
                    MsgUpdateClient.prototype.signer = "";

                    /**
                     * Creates a new MsgUpdateClient instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpdateClient=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.MsgUpdateClient} MsgUpdateClient instance
                     */
                    MsgUpdateClient.create = function create(properties) {
                        return new MsgUpdateClient(properties);
                    };

                    /**
                     * Encodes the specified MsgUpdateClient message. Does not implicitly {@link ibc.core.client.v1.MsgUpdateClient.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpdateClient} message MsgUpdateClient message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgUpdateClient.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
                        if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                            $root.google.protobuf.Any.encode(message.header, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        if (message.signer != null && Object.hasOwnProperty.call(message, "signer"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.signer);
                        return writer;
                    };

                    /**
                     * Encodes the specified MsgUpdateClient message, length delimited. Does not implicitly {@link ibc.core.client.v1.MsgUpdateClient.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpdateClient} message MsgUpdateClient message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgUpdateClient.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a MsgUpdateClient message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.MsgUpdateClient} MsgUpdateClient
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgUpdateClient.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.MsgUpdateClient();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clientId = reader.string();
                                break;
                            case 2:
                                message.header = $root.google.protobuf.Any.decode(reader, reader.uint32());
                                break;
                            case 3:
                                message.signer = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MsgUpdateClient message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.MsgUpdateClient} MsgUpdateClient
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgUpdateClient.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MsgUpdateClient message.
                     * @function verify
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MsgUpdateClient.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            if (!$util.isString(message.clientId))
                                return "clientId: string expected";
                        if (message.header != null && message.hasOwnProperty("header")) {
                            let error = $root.google.protobuf.Any.verify(message.header);
                            if (error)
                                return "header." + error;
                        }
                        if (message.signer != null && message.hasOwnProperty("signer"))
                            if (!$util.isString(message.signer))
                                return "signer: string expected";
                        return null;
                    };

                    /**
                     * Creates a MsgUpdateClient message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.MsgUpdateClient} MsgUpdateClient
                     */
                    MsgUpdateClient.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.MsgUpdateClient)
                            return object;
                        let message = new $root.ibc.core.client.v1.MsgUpdateClient();
                        if (object.clientId != null)
                            message.clientId = String(object.clientId);
                        if (object.header != null) {
                            if (typeof object.header !== "object")
                                throw TypeError(".ibc.core.client.v1.MsgUpdateClient.header: object expected");
                            message.header = $root.google.protobuf.Any.fromObject(object.header);
                        }
                        if (object.signer != null)
                            message.signer = String(object.signer);
                        return message;
                    };

                    /**
                     * Creates a plain object from a MsgUpdateClient message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @static
                     * @param {ibc.core.client.v1.MsgUpdateClient} message MsgUpdateClient
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MsgUpdateClient.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.clientId = "";
                            object.header = null;
                            object.signer = "";
                        }
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            object.clientId = message.clientId;
                        if (message.header != null && message.hasOwnProperty("header"))
                            object.header = $root.google.protobuf.Any.toObject(message.header, options);
                        if (message.signer != null && message.hasOwnProperty("signer"))
                            object.signer = message.signer;
                        return object;
                    };

                    /**
                     * Converts this MsgUpdateClient to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.MsgUpdateClient
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MsgUpdateClient.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return MsgUpdateClient;
                })(v1.MsgUpdateClient || {});

                v1.MsgUpdateClientResponse = (function(MsgUpdateClientResponse) {

                    /**
                     * Properties of a MsgUpdateClientResponse.
                     * @memberof ibc.core.client.v1
                     * @interface IMsgUpdateClientResponse
                     */

                    /**
                     * Constructs a new MsgUpdateClientResponse.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a MsgUpdateClientResponse.
                     * @implements IMsgUpdateClientResponse
                     * @constructor
                     * @param {ibc.core.client.v1.IMsgUpdateClientResponse=} [properties] Properties to set
                     */
                    function MsgUpdateClientResponse(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Creates a new MsgUpdateClientResponse instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.MsgUpdateClientResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpdateClientResponse=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.MsgUpdateClientResponse} MsgUpdateClientResponse instance
                     */
                    MsgUpdateClientResponse.create = function create(properties) {
                        return new MsgUpdateClientResponse(properties);
                    };

                    /**
                     * Encodes the specified MsgUpdateClientResponse message. Does not implicitly {@link ibc.core.client.v1.MsgUpdateClientResponse.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.MsgUpdateClientResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpdateClientResponse} message MsgUpdateClientResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgUpdateClientResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        return writer;
                    };

                    /**
                     * Encodes the specified MsgUpdateClientResponse message, length delimited. Does not implicitly {@link ibc.core.client.v1.MsgUpdateClientResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.MsgUpdateClientResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpdateClientResponse} message MsgUpdateClientResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgUpdateClientResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a MsgUpdateClientResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.MsgUpdateClientResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.MsgUpdateClientResponse} MsgUpdateClientResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgUpdateClientResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.MsgUpdateClientResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MsgUpdateClientResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.MsgUpdateClientResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.MsgUpdateClientResponse} MsgUpdateClientResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgUpdateClientResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MsgUpdateClientResponse message.
                     * @function verify
                     * @memberof ibc.core.client.v1.MsgUpdateClientResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MsgUpdateClientResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        return null;
                    };

                    /**
                     * Creates a MsgUpdateClientResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.MsgUpdateClientResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.MsgUpdateClientResponse} MsgUpdateClientResponse
                     */
                    MsgUpdateClientResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.MsgUpdateClientResponse)
                            return object;
                        return new $root.ibc.core.client.v1.MsgUpdateClientResponse();
                    };

                    /**
                     * Creates a plain object from a MsgUpdateClientResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.MsgUpdateClientResponse
                     * @static
                     * @param {ibc.core.client.v1.MsgUpdateClientResponse} message MsgUpdateClientResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MsgUpdateClientResponse.toObject = function toObject() {
                        return {};
                    };

                    /**
                     * Converts this MsgUpdateClientResponse to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.MsgUpdateClientResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MsgUpdateClientResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return MsgUpdateClientResponse;
                })(v1.MsgUpdateClientResponse || {});

                v1.MsgUpgradeClient = (function(MsgUpgradeClient) {

                    /**
                     * Properties of a MsgUpgradeClient.
                     * @memberof ibc.core.client.v1
                     * @interface IMsgUpgradeClient
                     * @property {string|null} [clientId] MsgUpgradeClient clientId
                     * @property {google.protobuf.IAny|null} [clientState] MsgUpgradeClient clientState
                     * @property {google.protobuf.IAny|null} [consensusState] MsgUpgradeClient consensusState
                     * @property {Uint8Array|null} [proofUpgradeClient] MsgUpgradeClient proofUpgradeClient
                     * @property {Uint8Array|null} [proofUpgradeConsensusState] MsgUpgradeClient proofUpgradeConsensusState
                     * @property {string|null} [signer] MsgUpgradeClient signer
                     */

                    /**
                     * Constructs a new MsgUpgradeClient.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a MsgUpgradeClient.
                     * @implements IMsgUpgradeClient
                     * @constructor
                     * @param {ibc.core.client.v1.IMsgUpgradeClient=} [properties] Properties to set
                     */
                    function MsgUpgradeClient(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * MsgUpgradeClient clientId.
                     * @member {string} clientId
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @instance
                     */
                    MsgUpgradeClient.prototype.clientId = "";

                    /**
                     * MsgUpgradeClient clientState.
                     * @member {google.protobuf.IAny|null|undefined} clientState
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @instance
                     */
                    MsgUpgradeClient.prototype.clientState = null;

                    /**
                     * MsgUpgradeClient consensusState.
                     * @member {google.protobuf.IAny|null|undefined} consensusState
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @instance
                     */
                    MsgUpgradeClient.prototype.consensusState = null;

                    /**
                     * MsgUpgradeClient proofUpgradeClient.
                     * @member {Uint8Array} proofUpgradeClient
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @instance
                     */
                    MsgUpgradeClient.prototype.proofUpgradeClient = $util.newBuffer([]);

                    /**
                     * MsgUpgradeClient proofUpgradeConsensusState.
                     * @member {Uint8Array} proofUpgradeConsensusState
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @instance
                     */
                    MsgUpgradeClient.prototype.proofUpgradeConsensusState = $util.newBuffer([]);

                    /**
                     * MsgUpgradeClient signer.
                     * @member {string} signer
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @instance
                     */
                    MsgUpgradeClient.prototype.signer = "";

                    /**
                     * Creates a new MsgUpgradeClient instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpgradeClient=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.MsgUpgradeClient} MsgUpgradeClient instance
                     */
                    MsgUpgradeClient.create = function create(properties) {
                        return new MsgUpgradeClient(properties);
                    };

                    /**
                     * Encodes the specified MsgUpgradeClient message. Does not implicitly {@link ibc.core.client.v1.MsgUpgradeClient.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpgradeClient} message MsgUpgradeClient message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgUpgradeClient.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
                        if (message.clientState != null && Object.hasOwnProperty.call(message, "clientState"))
                            $root.google.protobuf.Any.encode(message.clientState, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        if (message.consensusState != null && Object.hasOwnProperty.call(message, "consensusState"))
                            $root.google.protobuf.Any.encode(message.consensusState, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        if (message.proofUpgradeClient != null && Object.hasOwnProperty.call(message, "proofUpgradeClient"))
                            writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.proofUpgradeClient);
                        if (message.proofUpgradeConsensusState != null && Object.hasOwnProperty.call(message, "proofUpgradeConsensusState"))
                            writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.proofUpgradeConsensusState);
                        if (message.signer != null && Object.hasOwnProperty.call(message, "signer"))
                            writer.uint32(/* id 6, wireType 2 =*/50).string(message.signer);
                        return writer;
                    };

                    /**
                     * Encodes the specified MsgUpgradeClient message, length delimited. Does not implicitly {@link ibc.core.client.v1.MsgUpgradeClient.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpgradeClient} message MsgUpgradeClient message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgUpgradeClient.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a MsgUpgradeClient message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.MsgUpgradeClient} MsgUpgradeClient
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgUpgradeClient.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.MsgUpgradeClient();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clientId = reader.string();
                                break;
                            case 2:
                                message.clientState = $root.google.protobuf.Any.decode(reader, reader.uint32());
                                break;
                            case 3:
                                message.consensusState = $root.google.protobuf.Any.decode(reader, reader.uint32());
                                break;
                            case 4:
                                message.proofUpgradeClient = reader.bytes();
                                break;
                            case 5:
                                message.proofUpgradeConsensusState = reader.bytes();
                                break;
                            case 6:
                                message.signer = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MsgUpgradeClient message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.MsgUpgradeClient} MsgUpgradeClient
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgUpgradeClient.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MsgUpgradeClient message.
                     * @function verify
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MsgUpgradeClient.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            if (!$util.isString(message.clientId))
                                return "clientId: string expected";
                        if (message.clientState != null && message.hasOwnProperty("clientState")) {
                            let error = $root.google.protobuf.Any.verify(message.clientState);
                            if (error)
                                return "clientState." + error;
                        }
                        if (message.consensusState != null && message.hasOwnProperty("consensusState")) {
                            let error = $root.google.protobuf.Any.verify(message.consensusState);
                            if (error)
                                return "consensusState." + error;
                        }
                        if (message.proofUpgradeClient != null && message.hasOwnProperty("proofUpgradeClient"))
                            if (!(message.proofUpgradeClient && typeof message.proofUpgradeClient.length === "number" || $util.isString(message.proofUpgradeClient)))
                                return "proofUpgradeClient: buffer expected";
                        if (message.proofUpgradeConsensusState != null && message.hasOwnProperty("proofUpgradeConsensusState"))
                            if (!(message.proofUpgradeConsensusState && typeof message.proofUpgradeConsensusState.length === "number" || $util.isString(message.proofUpgradeConsensusState)))
                                return "proofUpgradeConsensusState: buffer expected";
                        if (message.signer != null && message.hasOwnProperty("signer"))
                            if (!$util.isString(message.signer))
                                return "signer: string expected";
                        return null;
                    };

                    /**
                     * Creates a MsgUpgradeClient message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.MsgUpgradeClient} MsgUpgradeClient
                     */
                    MsgUpgradeClient.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.MsgUpgradeClient)
                            return object;
                        let message = new $root.ibc.core.client.v1.MsgUpgradeClient();
                        if (object.clientId != null)
                            message.clientId = String(object.clientId);
                        if (object.clientState != null) {
                            if (typeof object.clientState !== "object")
                                throw TypeError(".ibc.core.client.v1.MsgUpgradeClient.clientState: object expected");
                            message.clientState = $root.google.protobuf.Any.fromObject(object.clientState);
                        }
                        if (object.consensusState != null) {
                            if (typeof object.consensusState !== "object")
                                throw TypeError(".ibc.core.client.v1.MsgUpgradeClient.consensusState: object expected");
                            message.consensusState = $root.google.protobuf.Any.fromObject(object.consensusState);
                        }
                        if (object.proofUpgradeClient != null)
                            if (typeof object.proofUpgradeClient === "string")
                                $util.base64.decode(object.proofUpgradeClient, message.proofUpgradeClient = $util.newBuffer($util.base64.length(object.proofUpgradeClient)), 0);
                            else if (object.proofUpgradeClient.length)
                                message.proofUpgradeClient = object.proofUpgradeClient;
                        if (object.proofUpgradeConsensusState != null)
                            if (typeof object.proofUpgradeConsensusState === "string")
                                $util.base64.decode(object.proofUpgradeConsensusState, message.proofUpgradeConsensusState = $util.newBuffer($util.base64.length(object.proofUpgradeConsensusState)), 0);
                            else if (object.proofUpgradeConsensusState.length)
                                message.proofUpgradeConsensusState = object.proofUpgradeConsensusState;
                        if (object.signer != null)
                            message.signer = String(object.signer);
                        return message;
                    };

                    /**
                     * Creates a plain object from a MsgUpgradeClient message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @static
                     * @param {ibc.core.client.v1.MsgUpgradeClient} message MsgUpgradeClient
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MsgUpgradeClient.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.clientId = "";
                            object.clientState = null;
                            object.consensusState = null;
                            if (options.bytes === String)
                                object.proofUpgradeClient = "";
                            else {
                                object.proofUpgradeClient = [];
                                if (options.bytes !== Array)
                                    object.proofUpgradeClient = $util.newBuffer(object.proofUpgradeClient);
                            }
                            if (options.bytes === String)
                                object.proofUpgradeConsensusState = "";
                            else {
                                object.proofUpgradeConsensusState = [];
                                if (options.bytes !== Array)
                                    object.proofUpgradeConsensusState = $util.newBuffer(object.proofUpgradeConsensusState);
                            }
                            object.signer = "";
                        }
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            object.clientId = message.clientId;
                        if (message.clientState != null && message.hasOwnProperty("clientState"))
                            object.clientState = $root.google.protobuf.Any.toObject(message.clientState, options);
                        if (message.consensusState != null && message.hasOwnProperty("consensusState"))
                            object.consensusState = $root.google.protobuf.Any.toObject(message.consensusState, options);
                        if (message.proofUpgradeClient != null && message.hasOwnProperty("proofUpgradeClient"))
                            object.proofUpgradeClient = options.bytes === String ? $util.base64.encode(message.proofUpgradeClient, 0, message.proofUpgradeClient.length) : options.bytes === Array ? Array.prototype.slice.call(message.proofUpgradeClient) : message.proofUpgradeClient;
                        if (message.proofUpgradeConsensusState != null && message.hasOwnProperty("proofUpgradeConsensusState"))
                            object.proofUpgradeConsensusState = options.bytes === String ? $util.base64.encode(message.proofUpgradeConsensusState, 0, message.proofUpgradeConsensusState.length) : options.bytes === Array ? Array.prototype.slice.call(message.proofUpgradeConsensusState) : message.proofUpgradeConsensusState;
                        if (message.signer != null && message.hasOwnProperty("signer"))
                            object.signer = message.signer;
                        return object;
                    };

                    /**
                     * Converts this MsgUpgradeClient to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.MsgUpgradeClient
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MsgUpgradeClient.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return MsgUpgradeClient;
                })(v1.MsgUpgradeClient || {});

                v1.MsgUpgradeClientResponse = (function(MsgUpgradeClientResponse) {

                    /**
                     * Properties of a MsgUpgradeClientResponse.
                     * @memberof ibc.core.client.v1
                     * @interface IMsgUpgradeClientResponse
                     */

                    /**
                     * Constructs a new MsgUpgradeClientResponse.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a MsgUpgradeClientResponse.
                     * @implements IMsgUpgradeClientResponse
                     * @constructor
                     * @param {ibc.core.client.v1.IMsgUpgradeClientResponse=} [properties] Properties to set
                     */
                    function MsgUpgradeClientResponse(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Creates a new MsgUpgradeClientResponse instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.MsgUpgradeClientResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpgradeClientResponse=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.MsgUpgradeClientResponse} MsgUpgradeClientResponse instance
                     */
                    MsgUpgradeClientResponse.create = function create(properties) {
                        return new MsgUpgradeClientResponse(properties);
                    };

                    /**
                     * Encodes the specified MsgUpgradeClientResponse message. Does not implicitly {@link ibc.core.client.v1.MsgUpgradeClientResponse.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.MsgUpgradeClientResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpgradeClientResponse} message MsgUpgradeClientResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgUpgradeClientResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        return writer;
                    };

                    /**
                     * Encodes the specified MsgUpgradeClientResponse message, length delimited. Does not implicitly {@link ibc.core.client.v1.MsgUpgradeClientResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.MsgUpgradeClientResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgUpgradeClientResponse} message MsgUpgradeClientResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgUpgradeClientResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a MsgUpgradeClientResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.MsgUpgradeClientResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.MsgUpgradeClientResponse} MsgUpgradeClientResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgUpgradeClientResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.MsgUpgradeClientResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MsgUpgradeClientResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.MsgUpgradeClientResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.MsgUpgradeClientResponse} MsgUpgradeClientResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgUpgradeClientResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MsgUpgradeClientResponse message.
                     * @function verify
                     * @memberof ibc.core.client.v1.MsgUpgradeClientResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MsgUpgradeClientResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        return null;
                    };

                    /**
                     * Creates a MsgUpgradeClientResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.MsgUpgradeClientResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.MsgUpgradeClientResponse} MsgUpgradeClientResponse
                     */
                    MsgUpgradeClientResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.MsgUpgradeClientResponse)
                            return object;
                        return new $root.ibc.core.client.v1.MsgUpgradeClientResponse();
                    };

                    /**
                     * Creates a plain object from a MsgUpgradeClientResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.MsgUpgradeClientResponse
                     * @static
                     * @param {ibc.core.client.v1.MsgUpgradeClientResponse} message MsgUpgradeClientResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MsgUpgradeClientResponse.toObject = function toObject() {
                        return {};
                    };

                    /**
                     * Converts this MsgUpgradeClientResponse to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.MsgUpgradeClientResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MsgUpgradeClientResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return MsgUpgradeClientResponse;
                })(v1.MsgUpgradeClientResponse || {});

                v1.MsgSubmitMisbehaviour = (function(MsgSubmitMisbehaviour) {

                    /**
                     * Properties of a MsgSubmitMisbehaviour.
                     * @memberof ibc.core.client.v1
                     * @interface IMsgSubmitMisbehaviour
                     * @property {string|null} [clientId] MsgSubmitMisbehaviour clientId
                     * @property {google.protobuf.IAny|null} [misbehaviour] MsgSubmitMisbehaviour misbehaviour
                     * @property {string|null} [signer] MsgSubmitMisbehaviour signer
                     */

                    /**
                     * Constructs a new MsgSubmitMisbehaviour.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a MsgSubmitMisbehaviour.
                     * @implements IMsgSubmitMisbehaviour
                     * @constructor
                     * @param {ibc.core.client.v1.IMsgSubmitMisbehaviour=} [properties] Properties to set
                     */
                    function MsgSubmitMisbehaviour(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * MsgSubmitMisbehaviour clientId.
                     * @member {string} clientId
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @instance
                     */
                    MsgSubmitMisbehaviour.prototype.clientId = "";

                    /**
                     * MsgSubmitMisbehaviour misbehaviour.
                     * @member {google.protobuf.IAny|null|undefined} misbehaviour
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @instance
                     */
                    MsgSubmitMisbehaviour.prototype.misbehaviour = null;

                    /**
                     * MsgSubmitMisbehaviour signer.
                     * @member {string} signer
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @instance
                     */
                    MsgSubmitMisbehaviour.prototype.signer = "";

                    /**
                     * Creates a new MsgSubmitMisbehaviour instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @static
                     * @param {ibc.core.client.v1.IMsgSubmitMisbehaviour=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.MsgSubmitMisbehaviour} MsgSubmitMisbehaviour instance
                     */
                    MsgSubmitMisbehaviour.create = function create(properties) {
                        return new MsgSubmitMisbehaviour(properties);
                    };

                    /**
                     * Encodes the specified MsgSubmitMisbehaviour message. Does not implicitly {@link ibc.core.client.v1.MsgSubmitMisbehaviour.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @static
                     * @param {ibc.core.client.v1.IMsgSubmitMisbehaviour} message MsgSubmitMisbehaviour message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgSubmitMisbehaviour.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
                        if (message.misbehaviour != null && Object.hasOwnProperty.call(message, "misbehaviour"))
                            $root.google.protobuf.Any.encode(message.misbehaviour, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        if (message.signer != null && Object.hasOwnProperty.call(message, "signer"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.signer);
                        return writer;
                    };

                    /**
                     * Encodes the specified MsgSubmitMisbehaviour message, length delimited. Does not implicitly {@link ibc.core.client.v1.MsgSubmitMisbehaviour.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @static
                     * @param {ibc.core.client.v1.IMsgSubmitMisbehaviour} message MsgSubmitMisbehaviour message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgSubmitMisbehaviour.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a MsgSubmitMisbehaviour message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.MsgSubmitMisbehaviour} MsgSubmitMisbehaviour
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgSubmitMisbehaviour.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.MsgSubmitMisbehaviour();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clientId = reader.string();
                                break;
                            case 2:
                                message.misbehaviour = $root.google.protobuf.Any.decode(reader, reader.uint32());
                                break;
                            case 3:
                                message.signer = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MsgSubmitMisbehaviour message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.MsgSubmitMisbehaviour} MsgSubmitMisbehaviour
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgSubmitMisbehaviour.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MsgSubmitMisbehaviour message.
                     * @function verify
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MsgSubmitMisbehaviour.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            if (!$util.isString(message.clientId))
                                return "clientId: string expected";
                        if (message.misbehaviour != null && message.hasOwnProperty("misbehaviour")) {
                            let error = $root.google.protobuf.Any.verify(message.misbehaviour);
                            if (error)
                                return "misbehaviour." + error;
                        }
                        if (message.signer != null && message.hasOwnProperty("signer"))
                            if (!$util.isString(message.signer))
                                return "signer: string expected";
                        return null;
                    };

                    /**
                     * Creates a MsgSubmitMisbehaviour message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.MsgSubmitMisbehaviour} MsgSubmitMisbehaviour
                     */
                    MsgSubmitMisbehaviour.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.MsgSubmitMisbehaviour)
                            return object;
                        let message = new $root.ibc.core.client.v1.MsgSubmitMisbehaviour();
                        if (object.clientId != null)
                            message.clientId = String(object.clientId);
                        if (object.misbehaviour != null) {
                            if (typeof object.misbehaviour !== "object")
                                throw TypeError(".ibc.core.client.v1.MsgSubmitMisbehaviour.misbehaviour: object expected");
                            message.misbehaviour = $root.google.protobuf.Any.fromObject(object.misbehaviour);
                        }
                        if (object.signer != null)
                            message.signer = String(object.signer);
                        return message;
                    };

                    /**
                     * Creates a plain object from a MsgSubmitMisbehaviour message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @static
                     * @param {ibc.core.client.v1.MsgSubmitMisbehaviour} message MsgSubmitMisbehaviour
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MsgSubmitMisbehaviour.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.clientId = "";
                            object.misbehaviour = null;
                            object.signer = "";
                        }
                        if (message.clientId != null && message.hasOwnProperty("clientId"))
                            object.clientId = message.clientId;
                        if (message.misbehaviour != null && message.hasOwnProperty("misbehaviour"))
                            object.misbehaviour = $root.google.protobuf.Any.toObject(message.misbehaviour, options);
                        if (message.signer != null && message.hasOwnProperty("signer"))
                            object.signer = message.signer;
                        return object;
                    };

                    /**
                     * Converts this MsgSubmitMisbehaviour to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviour
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MsgSubmitMisbehaviour.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return MsgSubmitMisbehaviour;
                })(v1.MsgSubmitMisbehaviour || {});

                v1.MsgSubmitMisbehaviourResponse = (function(MsgSubmitMisbehaviourResponse) {

                    /**
                     * Properties of a MsgSubmitMisbehaviourResponse.
                     * @memberof ibc.core.client.v1
                     * @interface IMsgSubmitMisbehaviourResponse
                     */

                    /**
                     * Constructs a new MsgSubmitMisbehaviourResponse.
                     * @memberof ibc.core.client.v1
                     * @classdesc Represents a MsgSubmitMisbehaviourResponse.
                     * @implements IMsgSubmitMisbehaviourResponse
                     * @constructor
                     * @param {ibc.core.client.v1.IMsgSubmitMisbehaviourResponse=} [properties] Properties to set
                     */
                    function MsgSubmitMisbehaviourResponse(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Creates a new MsgSubmitMisbehaviourResponse instance using the specified properties.
                     * @function create
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviourResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgSubmitMisbehaviourResponse=} [properties] Properties to set
                     * @returns {ibc.core.client.v1.MsgSubmitMisbehaviourResponse} MsgSubmitMisbehaviourResponse instance
                     */
                    MsgSubmitMisbehaviourResponse.create = function create(properties) {
                        return new MsgSubmitMisbehaviourResponse(properties);
                    };

                    /**
                     * Encodes the specified MsgSubmitMisbehaviourResponse message. Does not implicitly {@link ibc.core.client.v1.MsgSubmitMisbehaviourResponse.verify|verify} messages.
                     * @function encode
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviourResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgSubmitMisbehaviourResponse} message MsgSubmitMisbehaviourResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgSubmitMisbehaviourResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        return writer;
                    };

                    /**
                     * Encodes the specified MsgSubmitMisbehaviourResponse message, length delimited. Does not implicitly {@link ibc.core.client.v1.MsgSubmitMisbehaviourResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviourResponse
                     * @static
                     * @param {ibc.core.client.v1.IMsgSubmitMisbehaviourResponse} message MsgSubmitMisbehaviourResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MsgSubmitMisbehaviourResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a MsgSubmitMisbehaviourResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviourResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {ibc.core.client.v1.MsgSubmitMisbehaviourResponse} MsgSubmitMisbehaviourResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgSubmitMisbehaviourResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ibc.core.client.v1.MsgSubmitMisbehaviourResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MsgSubmitMisbehaviourResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviourResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {ibc.core.client.v1.MsgSubmitMisbehaviourResponse} MsgSubmitMisbehaviourResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MsgSubmitMisbehaviourResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MsgSubmitMisbehaviourResponse message.
                     * @function verify
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviourResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MsgSubmitMisbehaviourResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        return null;
                    };

                    /**
                     * Creates a MsgSubmitMisbehaviourResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviourResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {ibc.core.client.v1.MsgSubmitMisbehaviourResponse} MsgSubmitMisbehaviourResponse
                     */
                    MsgSubmitMisbehaviourResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.ibc.core.client.v1.MsgSubmitMisbehaviourResponse)
                            return object;
                        return new $root.ibc.core.client.v1.MsgSubmitMisbehaviourResponse();
                    };

                    /**
                     * Creates a plain object from a MsgSubmitMisbehaviourResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviourResponse
                     * @static
                     * @param {ibc.core.client.v1.MsgSubmitMisbehaviourResponse} message MsgSubmitMisbehaviourResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MsgSubmitMisbehaviourResponse.toObject = function toObject() {
                        return {};
                    };

                    /**
                     * Converts this MsgSubmitMisbehaviourResponse to JSON.
                     * @function toJSON
                     * @memberof ibc.core.client.v1.MsgSubmitMisbehaviourResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MsgSubmitMisbehaviourResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return MsgSubmitMisbehaviourResponse;
                })(v1.MsgSubmitMisbehaviourResponse || {});

                return v1;
            })(client.v1 || {});

            return client;
        })(core.client || {});

        return core;
    })(ibc.core || {});

    return ibc;
})($root.ibc || {});

/**
 * Namespace cosmos.
 * @exports cosmos
 * @namespace
 */

export const cosmos = $root.cosmos = ((cosmos) => {

    /**
     * Namespace base.
     * @memberof cosmos
     * @namespace
     */

    cosmos.base = (function(base) {

        /**
         * Namespace v1beta1.
         * @memberof cosmos.base
         * @namespace
         */

        base.v1beta1 = (function(v1beta1) {

            v1beta1.Coin = (function(Coin) {

                /**
                 * Properties of a Coin.
                 * @memberof cosmos.base.v1beta1
                 * @interface ICoin
                 * @property {string|null} [denom] Coin denom
                 * @property {string|null} [amount] Coin amount
                 */

                /**
                 * Constructs a new Coin.
                 * @memberof cosmos.base.v1beta1
                 * @classdesc Represents a Coin.
                 * @implements ICoin
                 * @constructor
                 * @param {cosmos.base.v1beta1.ICoin=} [properties] Properties to set
                 */
                function Coin(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Coin denom.
                 * @member {string} denom
                 * @memberof cosmos.base.v1beta1.Coin
                 * @instance
                 */
                Coin.prototype.denom = "";

                /**
                 * Coin amount.
                 * @member {string} amount
                 * @memberof cosmos.base.v1beta1.Coin
                 * @instance
                 */
                Coin.prototype.amount = "";

                /**
                 * Creates a new Coin instance using the specified properties.
                 * @function create
                 * @memberof cosmos.base.v1beta1.Coin
                 * @static
                 * @param {cosmos.base.v1beta1.ICoin=} [properties] Properties to set
                 * @returns {cosmos.base.v1beta1.Coin} Coin instance
                 */
                Coin.create = function create(properties) {
                    return new Coin(properties);
                };

                /**
                 * Encodes the specified Coin message. Does not implicitly {@link cosmos.base.v1beta1.Coin.verify|verify} messages.
                 * @function encode
                 * @memberof cosmos.base.v1beta1.Coin
                 * @static
                 * @param {cosmos.base.v1beta1.ICoin} message Coin message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Coin.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.denom != null && Object.hasOwnProperty.call(message, "denom"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.denom);
                    if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.amount);
                    return writer;
                };

                /**
                 * Encodes the specified Coin message, length delimited. Does not implicitly {@link cosmos.base.v1beta1.Coin.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof cosmos.base.v1beta1.Coin
                 * @static
                 * @param {cosmos.base.v1beta1.ICoin} message Coin message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Coin.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Coin message from the specified reader or buffer.
                 * @function decode
                 * @memberof cosmos.base.v1beta1.Coin
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {cosmos.base.v1beta1.Coin} Coin
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Coin.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cosmos.base.v1beta1.Coin();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
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
                };

                /**
                 * Decodes a Coin message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof cosmos.base.v1beta1.Coin
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {cosmos.base.v1beta1.Coin} Coin
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Coin.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Coin message.
                 * @function verify
                 * @memberof cosmos.base.v1beta1.Coin
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Coin.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.denom != null && message.hasOwnProperty("denom"))
                        if (!$util.isString(message.denom))
                            return "denom: string expected";
                    if (message.amount != null && message.hasOwnProperty("amount"))
                        if (!$util.isString(message.amount))
                            return "amount: string expected";
                    return null;
                };

                /**
                 * Creates a Coin message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof cosmos.base.v1beta1.Coin
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {cosmos.base.v1beta1.Coin} Coin
                 */
                Coin.fromObject = function fromObject(object) {
                    if (object instanceof $root.cosmos.base.v1beta1.Coin)
                        return object;
                    let message = new $root.cosmos.base.v1beta1.Coin();
                    if (object.denom != null)
                        message.denom = String(object.denom);
                    if (object.amount != null)
                        message.amount = String(object.amount);
                    return message;
                };

                /**
                 * Creates a plain object from a Coin message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof cosmos.base.v1beta1.Coin
                 * @static
                 * @param {cosmos.base.v1beta1.Coin} message Coin
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Coin.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        object.denom = "";
                        object.amount = "";
                    }
                    if (message.denom != null && message.hasOwnProperty("denom"))
                        object.denom = message.denom;
                    if (message.amount != null && message.hasOwnProperty("amount"))
                        object.amount = message.amount;
                    return object;
                };

                /**
                 * Converts this Coin to JSON.
                 * @function toJSON
                 * @memberof cosmos.base.v1beta1.Coin
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Coin.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Coin;
            })(v1beta1.Coin || {});

            v1beta1.DecCoin = (function(DecCoin) {

                /**
                 * Properties of a DecCoin.
                 * @memberof cosmos.base.v1beta1
                 * @interface IDecCoin
                 * @property {string|null} [denom] DecCoin denom
                 * @property {string|null} [amount] DecCoin amount
                 */

                /**
                 * Constructs a new DecCoin.
                 * @memberof cosmos.base.v1beta1
                 * @classdesc Represents a DecCoin.
                 * @implements IDecCoin
                 * @constructor
                 * @param {cosmos.base.v1beta1.IDecCoin=} [properties] Properties to set
                 */
                function DecCoin(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * DecCoin denom.
                 * @member {string} denom
                 * @memberof cosmos.base.v1beta1.DecCoin
                 * @instance
                 */
                DecCoin.prototype.denom = "";

                /**
                 * DecCoin amount.
                 * @member {string} amount
                 * @memberof cosmos.base.v1beta1.DecCoin
                 * @instance
                 */
                DecCoin.prototype.amount = "";

                /**
                 * Creates a new DecCoin instance using the specified properties.
                 * @function create
                 * @memberof cosmos.base.v1beta1.DecCoin
                 * @static
                 * @param {cosmos.base.v1beta1.IDecCoin=} [properties] Properties to set
                 * @returns {cosmos.base.v1beta1.DecCoin} DecCoin instance
                 */
                DecCoin.create = function create(properties) {
                    return new DecCoin(properties);
                };

                /**
                 * Encodes the specified DecCoin message. Does not implicitly {@link cosmos.base.v1beta1.DecCoin.verify|verify} messages.
                 * @function encode
                 * @memberof cosmos.base.v1beta1.DecCoin
                 * @static
                 * @param {cosmos.base.v1beta1.IDecCoin} message DecCoin message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DecCoin.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.denom != null && Object.hasOwnProperty.call(message, "denom"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.denom);
                    if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.amount);
                    return writer;
                };

                /**
                 * Encodes the specified DecCoin message, length delimited. Does not implicitly {@link cosmos.base.v1beta1.DecCoin.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof cosmos.base.v1beta1.DecCoin
                 * @static
                 * @param {cosmos.base.v1beta1.IDecCoin} message DecCoin message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DecCoin.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a DecCoin message from the specified reader or buffer.
                 * @function decode
                 * @memberof cosmos.base.v1beta1.DecCoin
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {cosmos.base.v1beta1.DecCoin} DecCoin
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DecCoin.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cosmos.base.v1beta1.DecCoin();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
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
                };

                /**
                 * Decodes a DecCoin message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof cosmos.base.v1beta1.DecCoin
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {cosmos.base.v1beta1.DecCoin} DecCoin
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DecCoin.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a DecCoin message.
                 * @function verify
                 * @memberof cosmos.base.v1beta1.DecCoin
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                DecCoin.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.denom != null && message.hasOwnProperty("denom"))
                        if (!$util.isString(message.denom))
                            return "denom: string expected";
                    if (message.amount != null && message.hasOwnProperty("amount"))
                        if (!$util.isString(message.amount))
                            return "amount: string expected";
                    return null;
                };

                /**
                 * Creates a DecCoin message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof cosmos.base.v1beta1.DecCoin
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {cosmos.base.v1beta1.DecCoin} DecCoin
                 */
                DecCoin.fromObject = function fromObject(object) {
                    if (object instanceof $root.cosmos.base.v1beta1.DecCoin)
                        return object;
                    let message = new $root.cosmos.base.v1beta1.DecCoin();
                    if (object.denom != null)
                        message.denom = String(object.denom);
                    if (object.amount != null)
                        message.amount = String(object.amount);
                    return message;
                };

                /**
                 * Creates a plain object from a DecCoin message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof cosmos.base.v1beta1.DecCoin
                 * @static
                 * @param {cosmos.base.v1beta1.DecCoin} message DecCoin
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                DecCoin.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        object.denom = "";
                        object.amount = "";
                    }
                    if (message.denom != null && message.hasOwnProperty("denom"))
                        object.denom = message.denom;
                    if (message.amount != null && message.hasOwnProperty("amount"))
                        object.amount = message.amount;
                    return object;
                };

                /**
                 * Converts this DecCoin to JSON.
                 * @function toJSON
                 * @memberof cosmos.base.v1beta1.DecCoin
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                DecCoin.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return DecCoin;
            })(v1beta1.DecCoin || {});

            v1beta1.IntProto = (function(IntProto) {

                /**
                 * Properties of an IntProto.
                 * @memberof cosmos.base.v1beta1
                 * @interface IIntProto
                 * @property {string|null} [int] IntProto int
                 */

                /**
                 * Constructs a new IntProto.
                 * @memberof cosmos.base.v1beta1
                 * @classdesc Represents an IntProto.
                 * @implements IIntProto
                 * @constructor
                 * @param {cosmos.base.v1beta1.IIntProto=} [properties] Properties to set
                 */
                function IntProto(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * IntProto int.
                 * @member {string} int
                 * @memberof cosmos.base.v1beta1.IntProto
                 * @instance
                 */
                IntProto.prototype.int = "";

                /**
                 * Creates a new IntProto instance using the specified properties.
                 * @function create
                 * @memberof cosmos.base.v1beta1.IntProto
                 * @static
                 * @param {cosmos.base.v1beta1.IIntProto=} [properties] Properties to set
                 * @returns {cosmos.base.v1beta1.IntProto} IntProto instance
                 */
                IntProto.create = function create(properties) {
                    return new IntProto(properties);
                };

                /**
                 * Encodes the specified IntProto message. Does not implicitly {@link cosmos.base.v1beta1.IntProto.verify|verify} messages.
                 * @function encode
                 * @memberof cosmos.base.v1beta1.IntProto
                 * @static
                 * @param {cosmos.base.v1beta1.IIntProto} message IntProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                IntProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.int != null && Object.hasOwnProperty.call(message, "int"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.int);
                    return writer;
                };

                /**
                 * Encodes the specified IntProto message, length delimited. Does not implicitly {@link cosmos.base.v1beta1.IntProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof cosmos.base.v1beta1.IntProto
                 * @static
                 * @param {cosmos.base.v1beta1.IIntProto} message IntProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                IntProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an IntProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof cosmos.base.v1beta1.IntProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {cosmos.base.v1beta1.IntProto} IntProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                IntProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cosmos.base.v1beta1.IntProto();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.int = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an IntProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof cosmos.base.v1beta1.IntProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {cosmos.base.v1beta1.IntProto} IntProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                IntProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an IntProto message.
                 * @function verify
                 * @memberof cosmos.base.v1beta1.IntProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                IntProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.int != null && message.hasOwnProperty("int"))
                        if (!$util.isString(message.int))
                            return "int: string expected";
                    return null;
                };

                /**
                 * Creates an IntProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof cosmos.base.v1beta1.IntProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {cosmos.base.v1beta1.IntProto} IntProto
                 */
                IntProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.cosmos.base.v1beta1.IntProto)
                        return object;
                    let message = new $root.cosmos.base.v1beta1.IntProto();
                    if (object.int != null)
                        message.int = String(object.int);
                    return message;
                };

                /**
                 * Creates a plain object from an IntProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof cosmos.base.v1beta1.IntProto
                 * @static
                 * @param {cosmos.base.v1beta1.IntProto} message IntProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                IntProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults)
                        object.int = "";
                    if (message.int != null && message.hasOwnProperty("int"))
                        object.int = message.int;
                    return object;
                };

                /**
                 * Converts this IntProto to JSON.
                 * @function toJSON
                 * @memberof cosmos.base.v1beta1.IntProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                IntProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return IntProto;
            })(v1beta1.IntProto || {});

            v1beta1.DecProto = (function(DecProto) {

                /**
                 * Properties of a DecProto.
                 * @memberof cosmos.base.v1beta1
                 * @interface IDecProto
                 * @property {string|null} [dec] DecProto dec
                 */

                /**
                 * Constructs a new DecProto.
                 * @memberof cosmos.base.v1beta1
                 * @classdesc Represents a DecProto.
                 * @implements IDecProto
                 * @constructor
                 * @param {cosmos.base.v1beta1.IDecProto=} [properties] Properties to set
                 */
                function DecProto(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * DecProto dec.
                 * @member {string} dec
                 * @memberof cosmos.base.v1beta1.DecProto
                 * @instance
                 */
                DecProto.prototype.dec = "";

                /**
                 * Creates a new DecProto instance using the specified properties.
                 * @function create
                 * @memberof cosmos.base.v1beta1.DecProto
                 * @static
                 * @param {cosmos.base.v1beta1.IDecProto=} [properties] Properties to set
                 * @returns {cosmos.base.v1beta1.DecProto} DecProto instance
                 */
                DecProto.create = function create(properties) {
                    return new DecProto(properties);
                };

                /**
                 * Encodes the specified DecProto message. Does not implicitly {@link cosmos.base.v1beta1.DecProto.verify|verify} messages.
                 * @function encode
                 * @memberof cosmos.base.v1beta1.DecProto
                 * @static
                 * @param {cosmos.base.v1beta1.IDecProto} message DecProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DecProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.dec != null && Object.hasOwnProperty.call(message, "dec"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.dec);
                    return writer;
                };

                /**
                 * Encodes the specified DecProto message, length delimited. Does not implicitly {@link cosmos.base.v1beta1.DecProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof cosmos.base.v1beta1.DecProto
                 * @static
                 * @param {cosmos.base.v1beta1.IDecProto} message DecProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DecProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a DecProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof cosmos.base.v1beta1.DecProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {cosmos.base.v1beta1.DecProto} DecProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DecProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cosmos.base.v1beta1.DecProto();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.dec = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a DecProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof cosmos.base.v1beta1.DecProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {cosmos.base.v1beta1.DecProto} DecProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DecProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a DecProto message.
                 * @function verify
                 * @memberof cosmos.base.v1beta1.DecProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                DecProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.dec != null && message.hasOwnProperty("dec"))
                        if (!$util.isString(message.dec))
                            return "dec: string expected";
                    return null;
                };

                /**
                 * Creates a DecProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof cosmos.base.v1beta1.DecProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {cosmos.base.v1beta1.DecProto} DecProto
                 */
                DecProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.cosmos.base.v1beta1.DecProto)
                        return object;
                    let message = new $root.cosmos.base.v1beta1.DecProto();
                    if (object.dec != null)
                        message.dec = String(object.dec);
                    return message;
                };

                /**
                 * Creates a plain object from a DecProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof cosmos.base.v1beta1.DecProto
                 * @static
                 * @param {cosmos.base.v1beta1.DecProto} message DecProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                DecProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults)
                        object.dec = "";
                    if (message.dec != null && message.hasOwnProperty("dec"))
                        object.dec = message.dec;
                    return object;
                };

                /**
                 * Converts this DecProto to JSON.
                 * @function toJSON
                 * @memberof cosmos.base.v1beta1.DecProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                DecProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return DecProto;
            })(v1beta1.DecProto || {});

            return v1beta1;
        })(base.v1beta1 || {});

        /**
         * Namespace query.
         * @memberof cosmos.base
         * @namespace
         */

        base.query = (function(query) {

            /**
             * Namespace v1beta1.
             * @memberof cosmos.base.query
             * @namespace
             */

            query.v1beta1 = (function(v1beta1) {

                v1beta1.PageRequest = (function(PageRequest) {

                    /**
                     * Properties of a PageRequest.
                     * @memberof cosmos.base.query.v1beta1
                     * @interface IPageRequest
                     * @property {Uint8Array|null} [key] PageRequest key
                     * @property {number|Long|null} [offset] PageRequest offset
                     * @property {number|Long|null} [limit] PageRequest limit
                     * @property {boolean|null} [countTotal] PageRequest countTotal
                     */

                    /**
                     * Constructs a new PageRequest.
                     * @memberof cosmos.base.query.v1beta1
                     * @classdesc Represents a PageRequest.
                     * @implements IPageRequest
                     * @constructor
                     * @param {cosmos.base.query.v1beta1.IPageRequest=} [properties] Properties to set
                     */
                    function PageRequest(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * PageRequest key.
                     * @member {Uint8Array} key
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @instance
                     */
                    PageRequest.prototype.key = $util.newBuffer([]);

                    /**
                     * PageRequest offset.
                     * @member {number|Long} offset
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @instance
                     */
                    PageRequest.prototype.offset = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * PageRequest limit.
                     * @member {number|Long} limit
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @instance
                     */
                    PageRequest.prototype.limit = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * PageRequest countTotal.
                     * @member {boolean} countTotal
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @instance
                     */
                    PageRequest.prototype.countTotal = false;

                    /**
                     * Creates a new PageRequest instance using the specified properties.
                     * @function create
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @static
                     * @param {cosmos.base.query.v1beta1.IPageRequest=} [properties] Properties to set
                     * @returns {cosmos.base.query.v1beta1.PageRequest} PageRequest instance
                     */
                    PageRequest.create = function create(properties) {
                        return new PageRequest(properties);
                    };

                    /**
                     * Encodes the specified PageRequest message. Does not implicitly {@link cosmos.base.query.v1beta1.PageRequest.verify|verify} messages.
                     * @function encode
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @static
                     * @param {cosmos.base.query.v1beta1.IPageRequest} message PageRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PageRequest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.key);
                        if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.offset);
                        if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.limit);
                        if (message.countTotal != null && Object.hasOwnProperty.call(message, "countTotal"))
                            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.countTotal);
                        return writer;
                    };

                    /**
                     * Encodes the specified PageRequest message, length delimited. Does not implicitly {@link cosmos.base.query.v1beta1.PageRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @static
                     * @param {cosmos.base.query.v1beta1.IPageRequest} message PageRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PageRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a PageRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {cosmos.base.query.v1beta1.PageRequest} PageRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PageRequest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cosmos.base.query.v1beta1.PageRequest();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.key = reader.bytes();
                                break;
                            case 2:
                                message.offset = reader.uint64();
                                break;
                            case 3:
                                message.limit = reader.uint64();
                                break;
                            case 4:
                                message.countTotal = reader.bool();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a PageRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {cosmos.base.query.v1beta1.PageRequest} PageRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PageRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a PageRequest message.
                     * @function verify
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    PageRequest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.key != null && message.hasOwnProperty("key"))
                            if (!(message.key && typeof message.key.length === "number" || $util.isString(message.key)))
                                return "key: buffer expected";
                        if (message.offset != null && message.hasOwnProperty("offset"))
                            if (!$util.isInteger(message.offset) && !(message.offset && $util.isInteger(message.offset.low) && $util.isInteger(message.offset.high)))
                                return "offset: integer|Long expected";
                        if (message.limit != null && message.hasOwnProperty("limit"))
                            if (!$util.isInteger(message.limit) && !(message.limit && $util.isInteger(message.limit.low) && $util.isInteger(message.limit.high)))
                                return "limit: integer|Long expected";
                        if (message.countTotal != null && message.hasOwnProperty("countTotal"))
                            if (typeof message.countTotal !== "boolean")
                                return "countTotal: boolean expected";
                        return null;
                    };

                    /**
                     * Creates a PageRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {cosmos.base.query.v1beta1.PageRequest} PageRequest
                     */
                    PageRequest.fromObject = function fromObject(object) {
                        if (object instanceof $root.cosmos.base.query.v1beta1.PageRequest)
                            return object;
                        let message = new $root.cosmos.base.query.v1beta1.PageRequest();
                        if (object.key != null)
                            if (typeof object.key === "string")
                                $util.base64.decode(object.key, message.key = $util.newBuffer($util.base64.length(object.key)), 0);
                            else if (object.key.length)
                                message.key = object.key;
                        if (object.offset != null)
                            if ($util.Long)
                                (message.offset = $util.Long.fromValue(object.offset)).unsigned = true;
                            else if (typeof object.offset === "string")
                                message.offset = parseInt(object.offset, 10);
                            else if (typeof object.offset === "number")
                                message.offset = object.offset;
                            else if (typeof object.offset === "object")
                                message.offset = new $util.LongBits(object.offset.low >>> 0, object.offset.high >>> 0).toNumber(true);
                        if (object.limit != null)
                            if ($util.Long)
                                (message.limit = $util.Long.fromValue(object.limit)).unsigned = true;
                            else if (typeof object.limit === "string")
                                message.limit = parseInt(object.limit, 10);
                            else if (typeof object.limit === "number")
                                message.limit = object.limit;
                            else if (typeof object.limit === "object")
                                message.limit = new $util.LongBits(object.limit.low >>> 0, object.limit.high >>> 0).toNumber(true);
                        if (object.countTotal != null)
                            message.countTotal = Boolean(object.countTotal);
                        return message;
                    };

                    /**
                     * Creates a plain object from a PageRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @static
                     * @param {cosmos.base.query.v1beta1.PageRequest} message PageRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    PageRequest.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            if (options.bytes === String)
                                object.key = "";
                            else {
                                object.key = [];
                                if (options.bytes !== Array)
                                    object.key = $util.newBuffer(object.key);
                            }
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.offset = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.offset = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.limit = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.limit = options.longs === String ? "0" : 0;
                            object.countTotal = false;
                        }
                        if (message.key != null && message.hasOwnProperty("key"))
                            object.key = options.bytes === String ? $util.base64.encode(message.key, 0, message.key.length) : options.bytes === Array ? Array.prototype.slice.call(message.key) : message.key;
                        if (message.offset != null && message.hasOwnProperty("offset"))
                            if (typeof message.offset === "number")
                                object.offset = options.longs === String ? String(message.offset) : message.offset;
                            else
                                object.offset = options.longs === String ? $util.Long.prototype.toString.call(message.offset) : options.longs === Number ? new $util.LongBits(message.offset.low >>> 0, message.offset.high >>> 0).toNumber(true) : message.offset;
                        if (message.limit != null && message.hasOwnProperty("limit"))
                            if (typeof message.limit === "number")
                                object.limit = options.longs === String ? String(message.limit) : message.limit;
                            else
                                object.limit = options.longs === String ? $util.Long.prototype.toString.call(message.limit) : options.longs === Number ? new $util.LongBits(message.limit.low >>> 0, message.limit.high >>> 0).toNumber(true) : message.limit;
                        if (message.countTotal != null && message.hasOwnProperty("countTotal"))
                            object.countTotal = message.countTotal;
                        return object;
                    };

                    /**
                     * Converts this PageRequest to JSON.
                     * @function toJSON
                     * @memberof cosmos.base.query.v1beta1.PageRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    PageRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return PageRequest;
                })(v1beta1.PageRequest || {});

                v1beta1.PageResponse = (function(PageResponse) {

                    /**
                     * Properties of a PageResponse.
                     * @memberof cosmos.base.query.v1beta1
                     * @interface IPageResponse
                     * @property {Uint8Array|null} [nextKey] PageResponse nextKey
                     * @property {number|Long|null} [total] PageResponse total
                     */

                    /**
                     * Constructs a new PageResponse.
                     * @memberof cosmos.base.query.v1beta1
                     * @classdesc Represents a PageResponse.
                     * @implements IPageResponse
                     * @constructor
                     * @param {cosmos.base.query.v1beta1.IPageResponse=} [properties] Properties to set
                     */
                    function PageResponse(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * PageResponse nextKey.
                     * @member {Uint8Array} nextKey
                     * @memberof cosmos.base.query.v1beta1.PageResponse
                     * @instance
                     */
                    PageResponse.prototype.nextKey = $util.newBuffer([]);

                    /**
                     * PageResponse total.
                     * @member {number|Long} total
                     * @memberof cosmos.base.query.v1beta1.PageResponse
                     * @instance
                     */
                    PageResponse.prototype.total = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * Creates a new PageResponse instance using the specified properties.
                     * @function create
                     * @memberof cosmos.base.query.v1beta1.PageResponse
                     * @static
                     * @param {cosmos.base.query.v1beta1.IPageResponse=} [properties] Properties to set
                     * @returns {cosmos.base.query.v1beta1.PageResponse} PageResponse instance
                     */
                    PageResponse.create = function create(properties) {
                        return new PageResponse(properties);
                    };

                    /**
                     * Encodes the specified PageResponse message. Does not implicitly {@link cosmos.base.query.v1beta1.PageResponse.verify|verify} messages.
                     * @function encode
                     * @memberof cosmos.base.query.v1beta1.PageResponse
                     * @static
                     * @param {cosmos.base.query.v1beta1.IPageResponse} message PageResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PageResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.nextKey != null && Object.hasOwnProperty.call(message, "nextKey"))
                            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.nextKey);
                        if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.total);
                        return writer;
                    };

                    /**
                     * Encodes the specified PageResponse message, length delimited. Does not implicitly {@link cosmos.base.query.v1beta1.PageResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof cosmos.base.query.v1beta1.PageResponse
                     * @static
                     * @param {cosmos.base.query.v1beta1.IPageResponse} message PageResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PageResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a PageResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof cosmos.base.query.v1beta1.PageResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {cosmos.base.query.v1beta1.PageResponse} PageResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PageResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cosmos.base.query.v1beta1.PageResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.nextKey = reader.bytes();
                                break;
                            case 2:
                                message.total = reader.uint64();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a PageResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof cosmos.base.query.v1beta1.PageResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {cosmos.base.query.v1beta1.PageResponse} PageResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PageResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a PageResponse message.
                     * @function verify
                     * @memberof cosmos.base.query.v1beta1.PageResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    PageResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.nextKey != null && message.hasOwnProperty("nextKey"))
                            if (!(message.nextKey && typeof message.nextKey.length === "number" || $util.isString(message.nextKey)))
                                return "nextKey: buffer expected";
                        if (message.total != null && message.hasOwnProperty("total"))
                            if (!$util.isInteger(message.total) && !(message.total && $util.isInteger(message.total.low) && $util.isInteger(message.total.high)))
                                return "total: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a PageResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof cosmos.base.query.v1beta1.PageResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {cosmos.base.query.v1beta1.PageResponse} PageResponse
                     */
                    PageResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.cosmos.base.query.v1beta1.PageResponse)
                            return object;
                        let message = new $root.cosmos.base.query.v1beta1.PageResponse();
                        if (object.nextKey != null)
                            if (typeof object.nextKey === "string")
                                $util.base64.decode(object.nextKey, message.nextKey = $util.newBuffer($util.base64.length(object.nextKey)), 0);
                            else if (object.nextKey.length)
                                message.nextKey = object.nextKey;
                        if (object.total != null)
                            if ($util.Long)
                                (message.total = $util.Long.fromValue(object.total)).unsigned = true;
                            else if (typeof object.total === "string")
                                message.total = parseInt(object.total, 10);
                            else if (typeof object.total === "number")
                                message.total = object.total;
                            else if (typeof object.total === "object")
                                message.total = new $util.LongBits(object.total.low >>> 0, object.total.high >>> 0).toNumber(true);
                        return message;
                    };

                    /**
                     * Creates a plain object from a PageResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof cosmos.base.query.v1beta1.PageResponse
                     * @static
                     * @param {cosmos.base.query.v1beta1.PageResponse} message PageResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    PageResponse.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            if (options.bytes === String)
                                object.nextKey = "";
                            else {
                                object.nextKey = [];
                                if (options.bytes !== Array)
                                    object.nextKey = $util.newBuffer(object.nextKey);
                            }
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.total = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.total = options.longs === String ? "0" : 0;
                        }
                        if (message.nextKey != null && message.hasOwnProperty("nextKey"))
                            object.nextKey = options.bytes === String ? $util.base64.encode(message.nextKey, 0, message.nextKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.nextKey) : message.nextKey;
                        if (message.total != null && message.hasOwnProperty("total"))
                            if (typeof message.total === "number")
                                object.total = options.longs === String ? String(message.total) : message.total;
                            else
                                object.total = options.longs === String ? $util.Long.prototype.toString.call(message.total) : options.longs === Number ? new $util.LongBits(message.total.low >>> 0, message.total.high >>> 0).toNumber(true) : message.total;
                        return object;
                    };

                    /**
                     * Converts this PageResponse to JSON.
                     * @function toJSON
                     * @memberof cosmos.base.query.v1beta1.PageResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    PageResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return PageResponse;
                })(v1beta1.PageResponse || {});

                return v1beta1;
            })(query.v1beta1 || {});

            return query;
        })(base.query || {});

        return base;
    })(cosmos.base || {});

    return cosmos;
})($root.cosmos || {});

/**
 * Namespace google.
 * @exports google
 * @namespace
 */

export const google = $root.google = ((google) => {

    /**
     * Namespace protobuf.
     * @memberof google
     * @namespace
     */

    google.protobuf = (function(protobuf) {

        protobuf.Any = (function(Any) {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && Object.hasOwnProperty.call(message, "type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type_url = reader.string();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @function verify
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Any)
                    return object;
                let message = new $root.google.protobuf.Any();
                if (object.type_url != null)
                    message.type_url = String(object.type_url);
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.type_url = "";
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    object.type_url = message.type_url;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this Any to JSON.
             * @function toJSON
             * @memberof google.protobuf.Any
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Any.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Any;
        })(protobuf.Any || {});

        return protobuf;
    })(google.protobuf || {});

    return google;
})($root.google || {});

export { $root as default };
