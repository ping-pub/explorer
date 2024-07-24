import { Any, AnyAmino, AnySDKType } from "../protobuf/any";
import { BinaryReader, BinaryWriter } from "../../binary";
import { bytesFromBase64, base64FromBytes } from "../../helpers";
/**
 * Message that represents an arbitrary HTTP body. It should only be used for
 * payload formats that can't be represented as JSON, such as raw binary or
 * an HTML page.
 * 
 * 
 * This message can be used both in streaming and non-streaming API methods in
 * the request as well as the response.
 * 
 * It can be used as a top-level request field, which is convenient if one
 * wants to extract parameters from either the URL or HTTP template into the
 * request fields and also want access to the raw HTTP body.
 * 
 * Example:
 * 
 *     message GetResourceRequest {
 *       // A unique request id.
 *       string request_id = 1;
 * 
 *       // The raw HTTP body is bound to this field.
 *       google.api.HttpBody http_body = 2;
 *     }
 * 
 *     service ResourceService {
 *       rpc GetResource(GetResourceRequest) returns (google.api.HttpBody);
 *       rpc UpdateResource(google.api.HttpBody) returns
 *       (google.protobuf.Empty);
 *     }
 * 
 * Example with streaming methods:
 * 
 *     service CaldavService {
 *       rpc GetCalendar(stream google.api.HttpBody)
 *         returns (stream google.api.HttpBody);
 *       rpc UpdateCalendar(stream google.api.HttpBody)
 *         returns (stream google.api.HttpBody);
 *     }
 * 
 * Use of this type only changes how the request and response bodies are
 * handled, all other features will continue to work unchanged.
 */
export interface HttpBody {
  /** The HTTP Content-Type header value specifying the content type of the body. */
  contentType: string;
  /** The HTTP request/response body as raw binary. */
  data: Uint8Array;
  /**
   * Application specific response metadata. Must be set in the first response
   * for streaming APIs.
   */
  extensions: Any[];
}
export interface HttpBodyProtoMsg {
  typeUrl: "/google.api.HttpBody";
  value: Uint8Array;
}
/**
 * Message that represents an arbitrary HTTP body. It should only be used for
 * payload formats that can't be represented as JSON, such as raw binary or
 * an HTML page.
 * 
 * 
 * This message can be used both in streaming and non-streaming API methods in
 * the request as well as the response.
 * 
 * It can be used as a top-level request field, which is convenient if one
 * wants to extract parameters from either the URL or HTTP template into the
 * request fields and also want access to the raw HTTP body.
 * 
 * Example:
 * 
 *     message GetResourceRequest {
 *       // A unique request id.
 *       string request_id = 1;
 * 
 *       // The raw HTTP body is bound to this field.
 *       google.api.HttpBody http_body = 2;
 *     }
 * 
 *     service ResourceService {
 *       rpc GetResource(GetResourceRequest) returns (google.api.HttpBody);
 *       rpc UpdateResource(google.api.HttpBody) returns
 *       (google.protobuf.Empty);
 *     }
 * 
 * Example with streaming methods:
 * 
 *     service CaldavService {
 *       rpc GetCalendar(stream google.api.HttpBody)
 *         returns (stream google.api.HttpBody);
 *       rpc UpdateCalendar(stream google.api.HttpBody)
 *         returns (stream google.api.HttpBody);
 *     }
 * 
 * Use of this type only changes how the request and response bodies are
 * handled, all other features will continue to work unchanged.
 */
export interface HttpBodyAmino {
  /** The HTTP Content-Type header value specifying the content type of the body. */
  content_type?: string;
  /** The HTTP request/response body as raw binary. */
  data?: string;
  /**
   * Application specific response metadata. Must be set in the first response
   * for streaming APIs.
   */
  extensions?: AnyAmino[];
}
export interface HttpBodyAminoMsg {
  type: "/google.api.HttpBody";
  value: HttpBodyAmino;
}
/**
 * Message that represents an arbitrary HTTP body. It should only be used for
 * payload formats that can't be represented as JSON, such as raw binary or
 * an HTML page.
 * 
 * 
 * This message can be used both in streaming and non-streaming API methods in
 * the request as well as the response.
 * 
 * It can be used as a top-level request field, which is convenient if one
 * wants to extract parameters from either the URL or HTTP template into the
 * request fields and also want access to the raw HTTP body.
 * 
 * Example:
 * 
 *     message GetResourceRequest {
 *       // A unique request id.
 *       string request_id = 1;
 * 
 *       // The raw HTTP body is bound to this field.
 *       google.api.HttpBody http_body = 2;
 *     }
 * 
 *     service ResourceService {
 *       rpc GetResource(GetResourceRequest) returns (google.api.HttpBody);
 *       rpc UpdateResource(google.api.HttpBody) returns
 *       (google.protobuf.Empty);
 *     }
 * 
 * Example with streaming methods:
 * 
 *     service CaldavService {
 *       rpc GetCalendar(stream google.api.HttpBody)
 *         returns (stream google.api.HttpBody);
 *       rpc UpdateCalendar(stream google.api.HttpBody)
 *         returns (stream google.api.HttpBody);
 *     }
 * 
 * Use of this type only changes how the request and response bodies are
 * handled, all other features will continue to work unchanged.
 */
export interface HttpBodySDKType {
  content_type: string;
  data: Uint8Array;
  extensions: AnySDKType[];
}
function createBaseHttpBody(): HttpBody {
  return {
    contentType: "",
    data: new Uint8Array(),
    extensions: []
  };
}
export const HttpBody = {
  typeUrl: "/google.api.HttpBody",
  encode(message: HttpBody, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.contentType !== "") {
      writer.uint32(10).string(message.contentType);
    }
    if (message.data.length !== 0) {
      writer.uint32(18).bytes(message.data);
    }
    for (const v of message.extensions) {
      Any.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): HttpBody {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHttpBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contentType = reader.string();
          break;
        case 2:
          message.data = reader.bytes();
          break;
        case 3:
          message.extensions.push(Any.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<HttpBody>): HttpBody {
    const message = createBaseHttpBody();
    message.contentType = object.contentType ?? "";
    message.data = object.data ?? new Uint8Array();
    message.extensions = object.extensions?.map(e => Any.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: HttpBodyAmino): HttpBody {
    const message = createBaseHttpBody();
    if (object.content_type !== undefined && object.content_type !== null) {
      message.contentType = object.content_type;
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = bytesFromBase64(object.data);
    }
    message.extensions = object.extensions?.map(e => Any.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: HttpBody): HttpBodyAmino {
    const obj: any = {};
    obj.content_type = message.contentType === "" ? undefined : message.contentType;
    obj.data = message.data ? base64FromBytes(message.data) : undefined;
    if (message.extensions) {
      obj.extensions = message.extensions.map(e => e ? Any.toAmino(e) : undefined);
    } else {
      obj.extensions = message.extensions;
    }
    return obj;
  },
  fromAminoMsg(object: HttpBodyAminoMsg): HttpBody {
    return HttpBody.fromAmino(object.value);
  },
  fromProtoMsg(message: HttpBodyProtoMsg): HttpBody {
    return HttpBody.decode(message.value);
  },
  toProto(message: HttpBody): Uint8Array {
    return HttpBody.encode(message).finish();
  },
  toProtoMsg(message: HttpBody): HttpBodyProtoMsg {
    return {
      typeUrl: "/google.api.HttpBody",
      value: HttpBody.encode(message).finish()
    };
  }
};