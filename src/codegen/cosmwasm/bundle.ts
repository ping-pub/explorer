import * as _73 from "./wasm/v1/authz";
import * as _74 from "./wasm/v1/genesis";
import * as _75 from "./wasm/v1/ibc";
import * as _76 from "./wasm/v1/proposal";
import * as _77 from "./wasm/v1/query";
import * as _78 from "./wasm/v1/tx";
import * as _79 from "./wasm/v1/types";
import * as _197 from "./wasm/v1/tx.amino";
import * as _198 from "./wasm/v1/tx.registry";
import * as _199 from "./wasm/v1/query.lcd";
import * as _200 from "./wasm/v1/query.rpc.Query";
import * as _201 from "./wasm/v1/tx.rpc.msg";
import * as _234 from "./lcd";
import * as _235 from "./rpc.query";
import * as _236 from "./rpc.tx";
export namespace cosmwasm {
  export namespace wasm {
    export const v1 = {
      ..._73,
      ..._74,
      ..._75,
      ..._76,
      ..._77,
      ..._78,
      ..._79,
      ..._197,
      ..._198,
      ..._199,
      ..._200,
      ..._201
    };
  }
  export const ClientFactory = {
    ..._234,
    ..._235,
    ..._236
  };
}