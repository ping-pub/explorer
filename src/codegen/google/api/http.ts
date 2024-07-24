import { BinaryReader, BinaryWriter } from "../../binary";
/**
 * Defines the HTTP configuration for an API service. It contains a list of
 * [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
 * to one or more HTTP REST API methods.
 */
export interface Http {
  /**
   * A list of HTTP configuration rules that apply to individual API methods.
   * 
   * **NOTE:** All service configuration rules follow "last one wins" order.
   */
  rules: HttpRule[];
  /**
   * When set to true, URL path parmeters will be fully URI-decoded except in
   * cases of single segment matches in reserved expansion, where "%2F" will be
   * left encoded.
   * 
   * The default behavior is to not decode RFC 6570 reserved characters in multi
   * segment matches.
   */
  fullyDecodeReservedExpansion: boolean;
}
export interface HttpProtoMsg {
  typeUrl: "/google.api.Http";
  value: Uint8Array;
}
/**
 * Defines the HTTP configuration for an API service. It contains a list of
 * [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
 * to one or more HTTP REST API methods.
 */
export interface HttpAmino {
  /**
   * A list of HTTP configuration rules that apply to individual API methods.
   * 
   * **NOTE:** All service configuration rules follow "last one wins" order.
   */
  rules?: HttpRuleAmino[];
  /**
   * When set to true, URL path parmeters will be fully URI-decoded except in
   * cases of single segment matches in reserved expansion, where "%2F" will be
   * left encoded.
   * 
   * The default behavior is to not decode RFC 6570 reserved characters in multi
   * segment matches.
   */
  fully_decode_reserved_expansion?: boolean;
}
export interface HttpAminoMsg {
  type: "/google.api.Http";
  value: HttpAmino;
}
/**
 * Defines the HTTP configuration for an API service. It contains a list of
 * [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
 * to one or more HTTP REST API methods.
 */
export interface HttpSDKType {
  rules: HttpRuleSDKType[];
  fully_decode_reserved_expansion: boolean;
}
/**
 * `HttpRule` defines the mapping of an RPC method to one or more HTTP
 * REST API methods. The mapping specifies how different portions of the RPC
 * request message are mapped to URL path, URL query parameters, and
 * HTTP request body. The mapping is typically specified as an
 * `google.api.http` annotation on the RPC method,
 * see "google/api/annotations.proto" for details.
 * 
 * The mapping consists of a field specifying the path template and
 * method kind.  The path template can refer to fields in the request
 * message, as in the example below which describes a REST GET
 * operation on a resource collection of messages:
 * 
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http).get = "/v1/messages/{message_id}/{sub.subfield}";
 *       }
 *     }
 *     message GetMessageRequest {
 *       message SubMessage {
 *         string subfield = 1;
 *       }
 *       string message_id = 1; // mapped to the URL
 *       SubMessage sub = 2;    // `sub.subfield` is url-mapped
 *     }
 *     message Message {
 *       string text = 1; // content of the resource
 *     }
 * 
 * The same http annotation can alternatively be expressed inside the
 * `GRPC API Configuration` YAML file.
 * 
 *     http:
 *       rules:
 *         - selector: <proto_package_name>.Messaging.GetMessage
 *           get: /v1/messages/{message_id}/{sub.subfield}
 * 
 * This definition enables an automatic, bidrectional mapping of HTTP
 * JSON to RPC. Example:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456/foo`  | `GetMessage(message_id: "123456" sub: SubMessage(subfield: "foo"))`
 * 
 * In general, not only fields but also field paths can be referenced
 * from a path pattern. Fields mapped to the path pattern cannot be
 * repeated and must have a primitive (non-message) type.
 * 
 * Any fields in the request message which are not bound by the path
 * pattern automatically become (optional) HTTP query
 * parameters. Assume the following definition of the request message:
 * 
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http).get = "/v1/messages/{message_id}";
 *       }
 *     }
 *     message GetMessageRequest {
 *       message SubMessage {
 *         string subfield = 1;
 *       }
 *       string message_id = 1; // mapped to the URL
 *       int64 revision = 2;    // becomes a parameter
 *       SubMessage sub = 3;    // `sub.subfield` becomes a parameter
 *     }
 * 
 * 
 * This enables a HTTP JSON to RPC mapping as below:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456?revision=2&sub.subfield=foo` | `GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield: "foo"))`
 * 
 * Note that fields which are mapped to HTTP parameters must have a
 * primitive type or a repeated primitive type. Message types are not
 * allowed. In the case of a repeated type, the parameter can be
 * repeated in the URL, as in `...?param=A&param=B`.
 * 
 * For HTTP method kinds which allow a request body, the `body` field
 * specifies the mapping. Consider a REST update method on the
 * message resource collection:
 * 
 * 
 *     service Messaging {
 *       rpc UpdateMessage(UpdateMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           put: "/v1/messages/{message_id}"
 *           body: "message"
 *         };
 *       }
 *     }
 *     message UpdateMessageRequest {
 *       string message_id = 1; // mapped to the URL
 *       Message message = 2;   // mapped to the body
 *     }
 * 
 * 
 * The following HTTP JSON to RPC mapping is enabled, where the
 * representation of the JSON in the request body is determined by
 * protos JSON encoding:
 * 
 * HTTP | RPC
 * -----|-----
 * `PUT /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id: "123456" message { text: "Hi!" })`
 * 
 * The special name `*` can be used in the body mapping to define that
 * every field not bound by the path template should be mapped to the
 * request body.  This enables the following alternative definition of
 * the update method:
 * 
 *     service Messaging {
 *       rpc UpdateMessage(Message) returns (Message) {
 *         option (google.api.http) = {
 *           put: "/v1/messages/{message_id}"
 *           body: "*"
 *         };
 *       }
 *     }
 *     message Message {
 *       string message_id = 1;
 *       string text = 2;
 *     }
 * 
 * 
 * The following HTTP JSON to RPC mapping is enabled:
 * 
 * HTTP | RPC
 * -----|-----
 * `PUT /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id: "123456" text: "Hi!")`
 * 
 * Note that when using `*` in the body mapping, it is not possible to
 * have HTTP parameters, as all fields not bound by the path end in
 * the body. This makes this option more rarely used in practice of
 * defining REST APIs. The common usage of `*` is in custom methods
 * which don't use the URL at all for transferring data.
 * 
 * It is possible to define multiple HTTP methods for one RPC by using
 * the `additional_bindings` option. Example:
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           get: "/v1/messages/{message_id}"
 *           additional_bindings {
 *             get: "/v1/users/{user_id}/messages/{message_id}"
 *           }
 *         };
 *       }
 *     }
 *     message GetMessageRequest {
 *       string message_id = 1;
 *       string user_id = 2;
 *     }
 * 
 * 
 * This enables the following two alternative HTTP JSON to RPC
 * mappings:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456` | `GetMessage(message_id: "123456")`
 * `GET /v1/users/me/messages/123456` | `GetMessage(user_id: "me" message_id: "123456")`
 * 
 * # Rules for HTTP mapping
 * 
 * The rules for mapping HTTP path, query parameters, and body fields
 * to the request message are as follows:
 * 
 * 1. The `body` field specifies either `*` or a field path, or is
 *    omitted. If omitted, it indicates there is no HTTP request body.
 * 2. Leaf fields (recursive expansion of nested messages in the
 *    request) can be classified into three types:
 *     (a) Matched in the URL template.
 *     (b) Covered by body (if body is `*`, everything except (a) fields;
 *         else everything under the body field)
 *     (c) All other fields.
 * 3. URL query parameters found in the HTTP request are mapped to (c) fields.
 * 4. Any body sent with an HTTP request can contain only (b) fields.
 * 
 * The syntax of the path template is as follows:
 * 
 *     Template = "/" Segments [ Verb ] ;
 *     Segments = Segment { "/" Segment } ;
 *     Segment  = "*" | "**" | LITERAL | Variable ;
 *     Variable = "{" FieldPath [ "=" Segments ] "}" ;
 *     FieldPath = IDENT { "." IDENT } ;
 *     Verb     = ":" LITERAL ;
 * 
 * The syntax `*` matches a single path segment. The syntax `**` matches zero
 * or more path segments, which must be the last part of the path except the
 * `Verb`. The syntax `LITERAL` matches literal text in the path.
 * 
 * The syntax `Variable` matches part of the URL path as specified by its
 * template. A variable template must not contain other variables. If a variable
 * matches a single path segment, its template may be omitted, e.g. `{var}`
 * is equivalent to `{var=*}`.
 * 
 * If a variable contains exactly one path segment, such as `"{var}"` or
 * `"{var=*}"`, when such a variable is expanded into a URL path, all characters
 * except `[-_.~0-9a-zA-Z]` are percent-encoded. Such variables show up in the
 * Discovery Document as `{var}`.
 * 
 * If a variable contains one or more path segments, such as `"{var=foo/*}"`
 * or `"{var=**}"`, when such a variable is expanded into a URL path, all
 * characters except `[-_.~/0-9a-zA-Z]` are percent-encoded. Such variables
 * show up in the Discovery Document as `{+var}`.
 * 
 * NOTE: While the single segment variable matches the semantics of
 * [RFC 6570](https://tools.ietf.org/html/rfc6570) Section 3.2.2
 * Simple String Expansion, the multi segment variable **does not** match
 * RFC 6570 Reserved Expansion. The reason is that the Reserved Expansion
 * does not expand special characters like `?` and `#`, which would lead
 * to invalid URLs.
 * 
 * NOTE: the field paths in variables and in the `body` must not refer to
 * repeated fields or map fields.
 */
export interface HttpRule {
  /**
   * Selects methods to which this rule applies.
   * 
   * Refer to [selector][google.api.DocumentationRule.selector] for syntax details.
   */
  selector: string;
  /** Used for listing and getting information about resources. */
  get?: string;
  /** Used for updating a resource. */
  put?: string;
  /** Used for creating a resource. */
  post?: string;
  /** Used for deleting a resource. */
  delete?: string;
  /** Used for updating a resource. */
  patch?: string;
  /**
   * The custom pattern is used for specifying an HTTP method that is not
   * included in the `pattern` field, such as HEAD, or "*" to leave the
   * HTTP method unspecified for this rule. The wild-card rule is useful
   * for services that provide content to Web (HTML) clients.
   */
  custom?: CustomHttpPattern;
  /**
   * The name of the request field whose value is mapped to the HTTP body, or
   * `*` for mapping all fields not captured by the path pattern to the HTTP
   * body. NOTE: the referred field must not be a repeated field and must be
   * present at the top-level of request message type.
   */
  body: string;
  /**
   * Optional. The name of the response field whose value is mapped to the HTTP
   * body of response. Other response fields are ignored. When
   * not set, the response message will be used as HTTP body of response.
   */
  responseBody: string;
  /**
   * Additional HTTP bindings for the selector. Nested bindings must
   * not contain an `additional_bindings` field themselves (that is,
   * the nesting may only be one level deep).
   */
  additionalBindings: HttpRule[];
}
export interface HttpRuleProtoMsg {
  typeUrl: "/google.api.HttpRule";
  value: Uint8Array;
}
/**
 * `HttpRule` defines the mapping of an RPC method to one or more HTTP
 * REST API methods. The mapping specifies how different portions of the RPC
 * request message are mapped to URL path, URL query parameters, and
 * HTTP request body. The mapping is typically specified as an
 * `google.api.http` annotation on the RPC method,
 * see "google/api/annotations.proto" for details.
 * 
 * The mapping consists of a field specifying the path template and
 * method kind.  The path template can refer to fields in the request
 * message, as in the example below which describes a REST GET
 * operation on a resource collection of messages:
 * 
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http).get = "/v1/messages/{message_id}/{sub.subfield}";
 *       }
 *     }
 *     message GetMessageRequest {
 *       message SubMessage {
 *         string subfield = 1;
 *       }
 *       string message_id = 1; // mapped to the URL
 *       SubMessage sub = 2;    // `sub.subfield` is url-mapped
 *     }
 *     message Message {
 *       string text = 1; // content of the resource
 *     }
 * 
 * The same http annotation can alternatively be expressed inside the
 * `GRPC API Configuration` YAML file.
 * 
 *     http:
 *       rules:
 *         - selector: <proto_package_name>.Messaging.GetMessage
 *           get: /v1/messages/{message_id}/{sub.subfield}
 * 
 * This definition enables an automatic, bidrectional mapping of HTTP
 * JSON to RPC. Example:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456/foo`  | `GetMessage(message_id: "123456" sub: SubMessage(subfield: "foo"))`
 * 
 * In general, not only fields but also field paths can be referenced
 * from a path pattern. Fields mapped to the path pattern cannot be
 * repeated and must have a primitive (non-message) type.
 * 
 * Any fields in the request message which are not bound by the path
 * pattern automatically become (optional) HTTP query
 * parameters. Assume the following definition of the request message:
 * 
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http).get = "/v1/messages/{message_id}";
 *       }
 *     }
 *     message GetMessageRequest {
 *       message SubMessage {
 *         string subfield = 1;
 *       }
 *       string message_id = 1; // mapped to the URL
 *       int64 revision = 2;    // becomes a parameter
 *       SubMessage sub = 3;    // `sub.subfield` becomes a parameter
 *     }
 * 
 * 
 * This enables a HTTP JSON to RPC mapping as below:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456?revision=2&sub.subfield=foo` | `GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield: "foo"))`
 * 
 * Note that fields which are mapped to HTTP parameters must have a
 * primitive type or a repeated primitive type. Message types are not
 * allowed. In the case of a repeated type, the parameter can be
 * repeated in the URL, as in `...?param=A&param=B`.
 * 
 * For HTTP method kinds which allow a request body, the `body` field
 * specifies the mapping. Consider a REST update method on the
 * message resource collection:
 * 
 * 
 *     service Messaging {
 *       rpc UpdateMessage(UpdateMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           put: "/v1/messages/{message_id}"
 *           body: "message"
 *         };
 *       }
 *     }
 *     message UpdateMessageRequest {
 *       string message_id = 1; // mapped to the URL
 *       Message message = 2;   // mapped to the body
 *     }
 * 
 * 
 * The following HTTP JSON to RPC mapping is enabled, where the
 * representation of the JSON in the request body is determined by
 * protos JSON encoding:
 * 
 * HTTP | RPC
 * -----|-----
 * `PUT /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id: "123456" message { text: "Hi!" })`
 * 
 * The special name `*` can be used in the body mapping to define that
 * every field not bound by the path template should be mapped to the
 * request body.  This enables the following alternative definition of
 * the update method:
 * 
 *     service Messaging {
 *       rpc UpdateMessage(Message) returns (Message) {
 *         option (google.api.http) = {
 *           put: "/v1/messages/{message_id}"
 *           body: "*"
 *         };
 *       }
 *     }
 *     message Message {
 *       string message_id = 1;
 *       string text = 2;
 *     }
 * 
 * 
 * The following HTTP JSON to RPC mapping is enabled:
 * 
 * HTTP | RPC
 * -----|-----
 * `PUT /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id: "123456" text: "Hi!")`
 * 
 * Note that when using `*` in the body mapping, it is not possible to
 * have HTTP parameters, as all fields not bound by the path end in
 * the body. This makes this option more rarely used in practice of
 * defining REST APIs. The common usage of `*` is in custom methods
 * which don't use the URL at all for transferring data.
 * 
 * It is possible to define multiple HTTP methods for one RPC by using
 * the `additional_bindings` option. Example:
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           get: "/v1/messages/{message_id}"
 *           additional_bindings {
 *             get: "/v1/users/{user_id}/messages/{message_id}"
 *           }
 *         };
 *       }
 *     }
 *     message GetMessageRequest {
 *       string message_id = 1;
 *       string user_id = 2;
 *     }
 * 
 * 
 * This enables the following two alternative HTTP JSON to RPC
 * mappings:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456` | `GetMessage(message_id: "123456")`
 * `GET /v1/users/me/messages/123456` | `GetMessage(user_id: "me" message_id: "123456")`
 * 
 * # Rules for HTTP mapping
 * 
 * The rules for mapping HTTP path, query parameters, and body fields
 * to the request message are as follows:
 * 
 * 1. The `body` field specifies either `*` or a field path, or is
 *    omitted. If omitted, it indicates there is no HTTP request body.
 * 2. Leaf fields (recursive expansion of nested messages in the
 *    request) can be classified into three types:
 *     (a) Matched in the URL template.
 *     (b) Covered by body (if body is `*`, everything except (a) fields;
 *         else everything under the body field)
 *     (c) All other fields.
 * 3. URL query parameters found in the HTTP request are mapped to (c) fields.
 * 4. Any body sent with an HTTP request can contain only (b) fields.
 * 
 * The syntax of the path template is as follows:
 * 
 *     Template = "/" Segments [ Verb ] ;
 *     Segments = Segment { "/" Segment } ;
 *     Segment  = "*" | "**" | LITERAL | Variable ;
 *     Variable = "{" FieldPath [ "=" Segments ] "}" ;
 *     FieldPath = IDENT { "." IDENT } ;
 *     Verb     = ":" LITERAL ;
 * 
 * The syntax `*` matches a single path segment. The syntax `**` matches zero
 * or more path segments, which must be the last part of the path except the
 * `Verb`. The syntax `LITERAL` matches literal text in the path.
 * 
 * The syntax `Variable` matches part of the URL path as specified by its
 * template. A variable template must not contain other variables. If a variable
 * matches a single path segment, its template may be omitted, e.g. `{var}`
 * is equivalent to `{var=*}`.
 * 
 * If a variable contains exactly one path segment, such as `"{var}"` or
 * `"{var=*}"`, when such a variable is expanded into a URL path, all characters
 * except `[-_.~0-9a-zA-Z]` are percent-encoded. Such variables show up in the
 * Discovery Document as `{var}`.
 * 
 * If a variable contains one or more path segments, such as `"{var=foo/*}"`
 * or `"{var=**}"`, when such a variable is expanded into a URL path, all
 * characters except `[-_.~/0-9a-zA-Z]` are percent-encoded. Such variables
 * show up in the Discovery Document as `{+var}`.
 * 
 * NOTE: While the single segment variable matches the semantics of
 * [RFC 6570](https://tools.ietf.org/html/rfc6570) Section 3.2.2
 * Simple String Expansion, the multi segment variable **does not** match
 * RFC 6570 Reserved Expansion. The reason is that the Reserved Expansion
 * does not expand special characters like `?` and `#`, which would lead
 * to invalid URLs.
 * 
 * NOTE: the field paths in variables and in the `body` must not refer to
 * repeated fields or map fields.
 */
export interface HttpRuleAmino {
  /**
   * Selects methods to which this rule applies.
   * 
   * Refer to [selector][google.api.DocumentationRule.selector] for syntax details.
   */
  selector?: string;
  /** Used for listing and getting information about resources. */
  get?: string;
  /** Used for updating a resource. */
  put?: string;
  /** Used for creating a resource. */
  post?: string;
  /** Used for deleting a resource. */
  delete?: string;
  /** Used for updating a resource. */
  patch?: string;
  /**
   * The custom pattern is used for specifying an HTTP method that is not
   * included in the `pattern` field, such as HEAD, or "*" to leave the
   * HTTP method unspecified for this rule. The wild-card rule is useful
   * for services that provide content to Web (HTML) clients.
   */
  custom?: CustomHttpPatternAmino;
  /**
   * The name of the request field whose value is mapped to the HTTP body, or
   * `*` for mapping all fields not captured by the path pattern to the HTTP
   * body. NOTE: the referred field must not be a repeated field and must be
   * present at the top-level of request message type.
   */
  body?: string;
  /**
   * Optional. The name of the response field whose value is mapped to the HTTP
   * body of response. Other response fields are ignored. When
   * not set, the response message will be used as HTTP body of response.
   */
  response_body?: string;
  /**
   * Additional HTTP bindings for the selector. Nested bindings must
   * not contain an `additional_bindings` field themselves (that is,
   * the nesting may only be one level deep).
   */
  additional_bindings?: HttpRuleAmino[];
}
export interface HttpRuleAminoMsg {
  type: "/google.api.HttpRule";
  value: HttpRuleAmino;
}
/**
 * `HttpRule` defines the mapping of an RPC method to one or more HTTP
 * REST API methods. The mapping specifies how different portions of the RPC
 * request message are mapped to URL path, URL query parameters, and
 * HTTP request body. The mapping is typically specified as an
 * `google.api.http` annotation on the RPC method,
 * see "google/api/annotations.proto" for details.
 * 
 * The mapping consists of a field specifying the path template and
 * method kind.  The path template can refer to fields in the request
 * message, as in the example below which describes a REST GET
 * operation on a resource collection of messages:
 * 
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http).get = "/v1/messages/{message_id}/{sub.subfield}";
 *       }
 *     }
 *     message GetMessageRequest {
 *       message SubMessage {
 *         string subfield = 1;
 *       }
 *       string message_id = 1; // mapped to the URL
 *       SubMessage sub = 2;    // `sub.subfield` is url-mapped
 *     }
 *     message Message {
 *       string text = 1; // content of the resource
 *     }
 * 
 * The same http annotation can alternatively be expressed inside the
 * `GRPC API Configuration` YAML file.
 * 
 *     http:
 *       rules:
 *         - selector: <proto_package_name>.Messaging.GetMessage
 *           get: /v1/messages/{message_id}/{sub.subfield}
 * 
 * This definition enables an automatic, bidrectional mapping of HTTP
 * JSON to RPC. Example:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456/foo`  | `GetMessage(message_id: "123456" sub: SubMessage(subfield: "foo"))`
 * 
 * In general, not only fields but also field paths can be referenced
 * from a path pattern. Fields mapped to the path pattern cannot be
 * repeated and must have a primitive (non-message) type.
 * 
 * Any fields in the request message which are not bound by the path
 * pattern automatically become (optional) HTTP query
 * parameters. Assume the following definition of the request message:
 * 
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http).get = "/v1/messages/{message_id}";
 *       }
 *     }
 *     message GetMessageRequest {
 *       message SubMessage {
 *         string subfield = 1;
 *       }
 *       string message_id = 1; // mapped to the URL
 *       int64 revision = 2;    // becomes a parameter
 *       SubMessage sub = 3;    // `sub.subfield` becomes a parameter
 *     }
 * 
 * 
 * This enables a HTTP JSON to RPC mapping as below:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456?revision=2&sub.subfield=foo` | `GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield: "foo"))`
 * 
 * Note that fields which are mapped to HTTP parameters must have a
 * primitive type or a repeated primitive type. Message types are not
 * allowed. In the case of a repeated type, the parameter can be
 * repeated in the URL, as in `...?param=A&param=B`.
 * 
 * For HTTP method kinds which allow a request body, the `body` field
 * specifies the mapping. Consider a REST update method on the
 * message resource collection:
 * 
 * 
 *     service Messaging {
 *       rpc UpdateMessage(UpdateMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           put: "/v1/messages/{message_id}"
 *           body: "message"
 *         };
 *       }
 *     }
 *     message UpdateMessageRequest {
 *       string message_id = 1; // mapped to the URL
 *       Message message = 2;   // mapped to the body
 *     }
 * 
 * 
 * The following HTTP JSON to RPC mapping is enabled, where the
 * representation of the JSON in the request body is determined by
 * protos JSON encoding:
 * 
 * HTTP | RPC
 * -----|-----
 * `PUT /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id: "123456" message { text: "Hi!" })`
 * 
 * The special name `*` can be used in the body mapping to define that
 * every field not bound by the path template should be mapped to the
 * request body.  This enables the following alternative definition of
 * the update method:
 * 
 *     service Messaging {
 *       rpc UpdateMessage(Message) returns (Message) {
 *         option (google.api.http) = {
 *           put: "/v1/messages/{message_id}"
 *           body: "*"
 *         };
 *       }
 *     }
 *     message Message {
 *       string message_id = 1;
 *       string text = 2;
 *     }
 * 
 * 
 * The following HTTP JSON to RPC mapping is enabled:
 * 
 * HTTP | RPC
 * -----|-----
 * `PUT /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id: "123456" text: "Hi!")`
 * 
 * Note that when using `*` in the body mapping, it is not possible to
 * have HTTP parameters, as all fields not bound by the path end in
 * the body. This makes this option more rarely used in practice of
 * defining REST APIs. The common usage of `*` is in custom methods
 * which don't use the URL at all for transferring data.
 * 
 * It is possible to define multiple HTTP methods for one RPC by using
 * the `additional_bindings` option. Example:
 * 
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           get: "/v1/messages/{message_id}"
 *           additional_bindings {
 *             get: "/v1/users/{user_id}/messages/{message_id}"
 *           }
 *         };
 *       }
 *     }
 *     message GetMessageRequest {
 *       string message_id = 1;
 *       string user_id = 2;
 *     }
 * 
 * 
 * This enables the following two alternative HTTP JSON to RPC
 * mappings:
 * 
 * HTTP | RPC
 * -----|-----
 * `GET /v1/messages/123456` | `GetMessage(message_id: "123456")`
 * `GET /v1/users/me/messages/123456` | `GetMessage(user_id: "me" message_id: "123456")`
 * 
 * # Rules for HTTP mapping
 * 
 * The rules for mapping HTTP path, query parameters, and body fields
 * to the request message are as follows:
 * 
 * 1. The `body` field specifies either `*` or a field path, or is
 *    omitted. If omitted, it indicates there is no HTTP request body.
 * 2. Leaf fields (recursive expansion of nested messages in the
 *    request) can be classified into three types:
 *     (a) Matched in the URL template.
 *     (b) Covered by body (if body is `*`, everything except (a) fields;
 *         else everything under the body field)
 *     (c) All other fields.
 * 3. URL query parameters found in the HTTP request are mapped to (c) fields.
 * 4. Any body sent with an HTTP request can contain only (b) fields.
 * 
 * The syntax of the path template is as follows:
 * 
 *     Template = "/" Segments [ Verb ] ;
 *     Segments = Segment { "/" Segment } ;
 *     Segment  = "*" | "**" | LITERAL | Variable ;
 *     Variable = "{" FieldPath [ "=" Segments ] "}" ;
 *     FieldPath = IDENT { "." IDENT } ;
 *     Verb     = ":" LITERAL ;
 * 
 * The syntax `*` matches a single path segment. The syntax `**` matches zero
 * or more path segments, which must be the last part of the path except the
 * `Verb`. The syntax `LITERAL` matches literal text in the path.
 * 
 * The syntax `Variable` matches part of the URL path as specified by its
 * template. A variable template must not contain other variables. If a variable
 * matches a single path segment, its template may be omitted, e.g. `{var}`
 * is equivalent to `{var=*}`.
 * 
 * If a variable contains exactly one path segment, such as `"{var}"` or
 * `"{var=*}"`, when such a variable is expanded into a URL path, all characters
 * except `[-_.~0-9a-zA-Z]` are percent-encoded. Such variables show up in the
 * Discovery Document as `{var}`.
 * 
 * If a variable contains one or more path segments, such as `"{var=foo/*}"`
 * or `"{var=**}"`, when such a variable is expanded into a URL path, all
 * characters except `[-_.~/0-9a-zA-Z]` are percent-encoded. Such variables
 * show up in the Discovery Document as `{+var}`.
 * 
 * NOTE: While the single segment variable matches the semantics of
 * [RFC 6570](https://tools.ietf.org/html/rfc6570) Section 3.2.2
 * Simple String Expansion, the multi segment variable **does not** match
 * RFC 6570 Reserved Expansion. The reason is that the Reserved Expansion
 * does not expand special characters like `?` and `#`, which would lead
 * to invalid URLs.
 * 
 * NOTE: the field paths in variables and in the `body` must not refer to
 * repeated fields or map fields.
 */
export interface HttpRuleSDKType {
  selector: string;
  get?: string;
  put?: string;
  post?: string;
  delete?: string;
  patch?: string;
  custom?: CustomHttpPatternSDKType;
  body: string;
  response_body: string;
  additional_bindings: HttpRuleSDKType[];
}
/** A custom pattern is used for defining custom HTTP verb. */
export interface CustomHttpPattern {
  /** The name of this custom HTTP verb. */
  kind: string;
  /** The path matched by this custom verb. */
  path: string;
}
export interface CustomHttpPatternProtoMsg {
  typeUrl: "/google.api.CustomHttpPattern";
  value: Uint8Array;
}
/** A custom pattern is used for defining custom HTTP verb. */
export interface CustomHttpPatternAmino {
  /** The name of this custom HTTP verb. */
  kind?: string;
  /** The path matched by this custom verb. */
  path?: string;
}
export interface CustomHttpPatternAminoMsg {
  type: "/google.api.CustomHttpPattern";
  value: CustomHttpPatternAmino;
}
/** A custom pattern is used for defining custom HTTP verb. */
export interface CustomHttpPatternSDKType {
  kind: string;
  path: string;
}
function createBaseHttp(): Http {
  return {
    rules: [],
    fullyDecodeReservedExpansion: false
  };
}
export const Http = {
  typeUrl: "/google.api.Http",
  encode(message: Http, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.rules) {
      HttpRule.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.fullyDecodeReservedExpansion === true) {
      writer.uint32(16).bool(message.fullyDecodeReservedExpansion);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Http {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHttp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rules.push(HttpRule.decode(reader, reader.uint32()));
          break;
        case 2:
          message.fullyDecodeReservedExpansion = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Http>): Http {
    const message = createBaseHttp();
    message.rules = object.rules?.map(e => HttpRule.fromPartial(e)) || [];
    message.fullyDecodeReservedExpansion = object.fullyDecodeReservedExpansion ?? false;
    return message;
  },
  fromAmino(object: HttpAmino): Http {
    const message = createBaseHttp();
    message.rules = object.rules?.map(e => HttpRule.fromAmino(e)) || [];
    if (object.fully_decode_reserved_expansion !== undefined && object.fully_decode_reserved_expansion !== null) {
      message.fullyDecodeReservedExpansion = object.fully_decode_reserved_expansion;
    }
    return message;
  },
  toAmino(message: Http): HttpAmino {
    const obj: any = {};
    if (message.rules) {
      obj.rules = message.rules.map(e => e ? HttpRule.toAmino(e) : undefined);
    } else {
      obj.rules = message.rules;
    }
    obj.fully_decode_reserved_expansion = message.fullyDecodeReservedExpansion === false ? undefined : message.fullyDecodeReservedExpansion;
    return obj;
  },
  fromAminoMsg(object: HttpAminoMsg): Http {
    return Http.fromAmino(object.value);
  },
  fromProtoMsg(message: HttpProtoMsg): Http {
    return Http.decode(message.value);
  },
  toProto(message: Http): Uint8Array {
    return Http.encode(message).finish();
  },
  toProtoMsg(message: Http): HttpProtoMsg {
    return {
      typeUrl: "/google.api.Http",
      value: Http.encode(message).finish()
    };
  }
};
function createBaseHttpRule(): HttpRule {
  return {
    selector: "",
    get: undefined,
    put: undefined,
    post: undefined,
    delete: undefined,
    patch: undefined,
    custom: undefined,
    body: "",
    responseBody: "",
    additionalBindings: []
  };
}
export const HttpRule = {
  typeUrl: "/google.api.HttpRule",
  encode(message: HttpRule, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.selector !== "") {
      writer.uint32(10).string(message.selector);
    }
    if (message.get !== undefined) {
      writer.uint32(18).string(message.get);
    }
    if (message.put !== undefined) {
      writer.uint32(26).string(message.put);
    }
    if (message.post !== undefined) {
      writer.uint32(34).string(message.post);
    }
    if (message.delete !== undefined) {
      writer.uint32(42).string(message.delete);
    }
    if (message.patch !== undefined) {
      writer.uint32(50).string(message.patch);
    }
    if (message.custom !== undefined) {
      CustomHttpPattern.encode(message.custom, writer.uint32(66).fork()).ldelim();
    }
    if (message.body !== "") {
      writer.uint32(58).string(message.body);
    }
    if (message.responseBody !== "") {
      writer.uint32(98).string(message.responseBody);
    }
    for (const v of message.additionalBindings) {
      HttpRule.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): HttpRule {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHttpRule();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.selector = reader.string();
          break;
        case 2:
          message.get = reader.string();
          break;
        case 3:
          message.put = reader.string();
          break;
        case 4:
          message.post = reader.string();
          break;
        case 5:
          message.delete = reader.string();
          break;
        case 6:
          message.patch = reader.string();
          break;
        case 8:
          message.custom = CustomHttpPattern.decode(reader, reader.uint32());
          break;
        case 7:
          message.body = reader.string();
          break;
        case 12:
          message.responseBody = reader.string();
          break;
        case 11:
          message.additionalBindings.push(HttpRule.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<HttpRule>): HttpRule {
    const message = createBaseHttpRule();
    message.selector = object.selector ?? "";
    message.get = object.get ?? undefined;
    message.put = object.put ?? undefined;
    message.post = object.post ?? undefined;
    message.delete = object.delete ?? undefined;
    message.patch = object.patch ?? undefined;
    message.custom = object.custom !== undefined && object.custom !== null ? CustomHttpPattern.fromPartial(object.custom) : undefined;
    message.body = object.body ?? "";
    message.responseBody = object.responseBody ?? "";
    message.additionalBindings = object.additionalBindings?.map(e => HttpRule.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: HttpRuleAmino): HttpRule {
    const message = createBaseHttpRule();
    if (object.selector !== undefined && object.selector !== null) {
      message.selector = object.selector;
    }
    if (object.get !== undefined && object.get !== null) {
      message.get = object.get;
    }
    if (object.put !== undefined && object.put !== null) {
      message.put = object.put;
    }
    if (object.post !== undefined && object.post !== null) {
      message.post = object.post;
    }
    if (object.delete !== undefined && object.delete !== null) {
      message.delete = object.delete;
    }
    if (object.patch !== undefined && object.patch !== null) {
      message.patch = object.patch;
    }
    if (object.custom !== undefined && object.custom !== null) {
      message.custom = CustomHttpPattern.fromAmino(object.custom);
    }
    if (object.body !== undefined && object.body !== null) {
      message.body = object.body;
    }
    if (object.response_body !== undefined && object.response_body !== null) {
      message.responseBody = object.response_body;
    }
    message.additionalBindings = object.additional_bindings?.map(e => HttpRule.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: HttpRule): HttpRuleAmino {
    const obj: any = {};
    obj.selector = message.selector === "" ? undefined : message.selector;
    obj.get = message.get === null ? undefined : message.get;
    obj.put = message.put === null ? undefined : message.put;
    obj.post = message.post === null ? undefined : message.post;
    obj.delete = message.delete === null ? undefined : message.delete;
    obj.patch = message.patch === null ? undefined : message.patch;
    obj.custom = message.custom ? CustomHttpPattern.toAmino(message.custom) : undefined;
    obj.body = message.body === "" ? undefined : message.body;
    obj.response_body = message.responseBody === "" ? undefined : message.responseBody;
    if (message.additionalBindings) {
      obj.additional_bindings = message.additionalBindings.map(e => e ? HttpRule.toAmino(e) : undefined);
    } else {
      obj.additional_bindings = message.additionalBindings;
    }
    return obj;
  },
  fromAminoMsg(object: HttpRuleAminoMsg): HttpRule {
    return HttpRule.fromAmino(object.value);
  },
  fromProtoMsg(message: HttpRuleProtoMsg): HttpRule {
    return HttpRule.decode(message.value);
  },
  toProto(message: HttpRule): Uint8Array {
    return HttpRule.encode(message).finish();
  },
  toProtoMsg(message: HttpRule): HttpRuleProtoMsg {
    return {
      typeUrl: "/google.api.HttpRule",
      value: HttpRule.encode(message).finish()
    };
  }
};
function createBaseCustomHttpPattern(): CustomHttpPattern {
  return {
    kind: "",
    path: ""
  };
}
export const CustomHttpPattern = {
  typeUrl: "/google.api.CustomHttpPattern",
  encode(message: CustomHttpPattern, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.kind !== "") {
      writer.uint32(10).string(message.kind);
    }
    if (message.path !== "") {
      writer.uint32(18).string(message.path);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): CustomHttpPattern {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCustomHttpPattern();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.kind = reader.string();
          break;
        case 2:
          message.path = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<CustomHttpPattern>): CustomHttpPattern {
    const message = createBaseCustomHttpPattern();
    message.kind = object.kind ?? "";
    message.path = object.path ?? "";
    return message;
  },
  fromAmino(object: CustomHttpPatternAmino): CustomHttpPattern {
    const message = createBaseCustomHttpPattern();
    if (object.kind !== undefined && object.kind !== null) {
      message.kind = object.kind;
    }
    if (object.path !== undefined && object.path !== null) {
      message.path = object.path;
    }
    return message;
  },
  toAmino(message: CustomHttpPattern): CustomHttpPatternAmino {
    const obj: any = {};
    obj.kind = message.kind === "" ? undefined : message.kind;
    obj.path = message.path === "" ? undefined : message.path;
    return obj;
  },
  fromAminoMsg(object: CustomHttpPatternAminoMsg): CustomHttpPattern {
    return CustomHttpPattern.fromAmino(object.value);
  },
  fromProtoMsg(message: CustomHttpPatternProtoMsg): CustomHttpPattern {
    return CustomHttpPattern.decode(message.value);
  },
  toProto(message: CustomHttpPattern): Uint8Array {
    return CustomHttpPattern.encode(message).finish();
  },
  toProtoMsg(message: CustomHttpPattern): CustomHttpPatternProtoMsg {
    return {
      typeUrl: "/google.api.CustomHttpPattern",
      value: CustomHttpPattern.encode(message).finish()
    };
  }
};