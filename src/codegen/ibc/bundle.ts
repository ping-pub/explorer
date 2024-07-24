import * as _89 from "./applications/fee/v1/ack";
import * as _90 from "./applications/fee/v1/fee";
import * as _91 from "./applications/fee/v1/genesis";
import * as _92 from "./applications/fee/v1/metadata";
import * as _93 from "./applications/fee/v1/query";
import * as _94 from "./applications/fee/v1/tx";
import * as _95 from "./applications/interchain_accounts/controller/v1/controller";
import * as _96 from "./applications/interchain_accounts/controller/v1/query";
import * as _97 from "./applications/interchain_accounts/host/v1/host";
import * as _98 from "./applications/interchain_accounts/host/v1/query";
import * as _99 from "./applications/interchain_accounts/v1/account";
import * as _100 from "./applications/interchain_accounts/v1/genesis";
import * as _101 from "./applications/interchain_accounts/v1/metadata";
import * as _102 from "./applications/interchain_accounts/v1/packet";
import * as _103 from "./applications/transfer/v1/genesis";
import * as _104 from "./applications/transfer/v1/query";
import * as _105 from "./applications/transfer/v1/transfer";
import * as _106 from "./applications/transfer/v1/tx";
import * as _107 from "./applications/transfer/v2/packet";
import * as _108 from "./core/channel/v1/channel";
import * as _109 from "./core/channel/v1/genesis";
import * as _110 from "./core/channel/v1/query";
import * as _111 from "./core/channel/v1/tx";
import * as _112 from "./core/client/v1/client";
import * as _113 from "./core/client/v1/genesis";
import * as _114 from "./core/client/v1/query";
import * as _115 from "./core/client/v1/tx";
import * as _116 from "./core/commitment/v1/commitment";
import * as _117 from "./core/connection/v1/connection";
import * as _118 from "./core/connection/v1/genesis";
import * as _119 from "./core/connection/v1/query";
import * as _120 from "./core/connection/v1/tx";
import * as _121 from "./core/types/v1/genesis";
import * as _122 from "./lightclients/localhost/v1/localhost";
import * as _123 from "./lightclients/solomachine/v1/solomachine";
import * as _124 from "./lightclients/solomachine/v2/solomachine";
import * as _125 from "./lightclients/tendermint/v1/tendermint";
import * as _202 from "./applications/fee/v1/tx.amino";
import * as _203 from "./applications/transfer/v1/tx.amino";
import * as _204 from "./core/channel/v1/tx.amino";
import * as _205 from "./core/client/v1/tx.amino";
import * as _206 from "./core/connection/v1/tx.amino";
import * as _207 from "./applications/fee/v1/tx.registry";
import * as _208 from "./applications/transfer/v1/tx.registry";
import * as _209 from "./core/channel/v1/tx.registry";
import * as _210 from "./core/client/v1/tx.registry";
import * as _211 from "./core/connection/v1/tx.registry";
import * as _212 from "./applications/fee/v1/query.lcd";
import * as _213 from "./applications/interchain_accounts/controller/v1/query.lcd";
import * as _214 from "./applications/interchain_accounts/host/v1/query.lcd";
import * as _215 from "./applications/transfer/v1/query.lcd";
import * as _216 from "./core/channel/v1/query.lcd";
import * as _217 from "./core/client/v1/query.lcd";
import * as _218 from "./core/connection/v1/query.lcd";
import * as _219 from "./applications/fee/v1/query.rpc.Query";
import * as _220 from "./applications/interchain_accounts/controller/v1/query.rpc.Query";
import * as _221 from "./applications/interchain_accounts/host/v1/query.rpc.Query";
import * as _222 from "./applications/transfer/v1/query.rpc.Query";
import * as _223 from "./core/channel/v1/query.rpc.Query";
import * as _224 from "./core/client/v1/query.rpc.Query";
import * as _225 from "./core/connection/v1/query.rpc.Query";
import * as _226 from "./applications/fee/v1/tx.rpc.msg";
import * as _227 from "./applications/transfer/v1/tx.rpc.msg";
import * as _228 from "./core/channel/v1/tx.rpc.msg";
import * as _229 from "./core/client/v1/tx.rpc.msg";
import * as _230 from "./core/connection/v1/tx.rpc.msg";
import * as _237 from "./lcd";
import * as _238 from "./rpc.query";
import * as _239 from "./rpc.tx";
export namespace ibc {
  export namespace applications {
    export namespace fee {
      export const v1 = {
        ..._89,
        ..._90,
        ..._91,
        ..._92,
        ..._93,
        ..._94,
        ..._202,
        ..._207,
        ..._212,
        ..._219,
        ..._226
      };
    }
    export namespace interchain_accounts {
      export namespace controller {
        export const v1 = {
          ..._95,
          ..._96,
          ..._213,
          ..._220
        };
      }
      export namespace host {
        export const v1 = {
          ..._97,
          ..._98,
          ..._214,
          ..._221
        };
      }
      export const v1 = {
        ..._99,
        ..._100,
        ..._101,
        ..._102
      };
    }
    export namespace transfer {
      export const v1 = {
        ..._103,
        ..._104,
        ..._105,
        ..._106,
        ..._203,
        ..._208,
        ..._215,
        ..._222,
        ..._227
      };
      export const v2 = {
        ..._107
      };
    }
  }
  export namespace core {
    export namespace channel {
      export const v1 = {
        ..._108,
        ..._109,
        ..._110,
        ..._111,
        ..._204,
        ..._209,
        ..._216,
        ..._223,
        ..._228
      };
    }
    export namespace client {
      export const v1 = {
        ..._112,
        ..._113,
        ..._114,
        ..._115,
        ..._205,
        ..._210,
        ..._217,
        ..._224,
        ..._229
      };
    }
    export namespace commitment {
      export const v1 = {
        ..._116
      };
    }
    export namespace connection {
      export const v1 = {
        ..._117,
        ..._118,
        ..._119,
        ..._120,
        ..._206,
        ..._211,
        ..._218,
        ..._225,
        ..._230
      };
    }
    export namespace types {
      export const v1 = {
        ..._121
      };
    }
  }
  export namespace lightclients {
    export namespace localhost {
      export const v1 = {
        ..._122
      };
    }
    export namespace solomachine {
      export const v1 = {
        ..._123
      };
      export const v2 = {
        ..._124
      };
    }
    export namespace tendermint {
      export const v1 = {
        ..._125
      };
    }
  }
  export const ClientFactory = {
    ..._237,
    ..._238,
    ..._239
  };
}