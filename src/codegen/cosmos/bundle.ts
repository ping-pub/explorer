import * as _3 from "./auth/v1beta1/auth";
import * as _4 from "./auth/v1beta1/genesis";
import * as _5 from "./auth/v1beta1/query";
import * as _6 from "./authz/v1beta1/authz";
import * as _7 from "./authz/v1beta1/event";
import * as _8 from "./authz/v1beta1/genesis";
import * as _9 from "./authz/v1beta1/query";
import * as _10 from "./authz/v1beta1/tx";
import * as _11 from "./bank/v1beta1/authz";
import * as _12 from "./bank/v1beta1/bank";
import * as _13 from "./bank/v1beta1/genesis";
import * as _14 from "./bank/v1beta1/query";
import * as _15 from "./bank/v1beta1/tx";
import * as _16 from "./base/abci/v1beta1/abci";
import * as _17 from "./base/kv/v1beta1/kv";
import * as _18 from "./base/node/v1beta1/query";
import * as _19 from "./base/query/v1beta1/pagination";
import * as _20 from "./base/reflection/v1beta1/reflection";
import * as _21 from "./base/reflection/v2alpha1/reflection";
import * as _22 from "./base/snapshots/v1beta1/snapshot";
import * as _23 from "./base/store/v1beta1/commit_info";
import * as _24 from "./base/store/v1beta1/listening";
import * as _25 from "./base/tendermint/v1beta1/query";
import * as _26 from "./base/v1beta1/coin";
import * as _27 from "./capability/v1beta1/capability";
import * as _28 from "./capability/v1beta1/genesis";
import * as _29 from "./crisis/v1beta1/genesis";
import * as _30 from "./crisis/v1beta1/tx";
import * as _31 from "./crypto/ed25519/keys";
import * as _32 from "./crypto/multisig/keys";
import * as _33 from "./crypto/secp256k1/keys";
import * as _34 from "./crypto/secp256r1/keys";
import * as _35 from "./distribution/v1beta1/distribution";
import * as _36 from "./distribution/v1beta1/genesis";
import * as _37 from "./distribution/v1beta1/query";
import * as _38 from "./distribution/v1beta1/tx";
import * as _39 from "./evidence/v1beta1/evidence";
import * as _40 from "./evidence/v1beta1/genesis";
import * as _41 from "./evidence/v1beta1/query";
import * as _42 from "./evidence/v1beta1/tx";
import * as _43 from "./feegrant/v1beta1/feegrant";
import * as _44 from "./feegrant/v1beta1/genesis";
import * as _45 from "./feegrant/v1beta1/query";
import * as _46 from "./feegrant/v1beta1/tx";
import * as _47 from "./genutil/v1beta1/genesis";
import * as _48 from "./gov/v1beta1/genesis";
import * as _49 from "./gov/v1beta1/gov";
import * as _50 from "./gov/v1beta1/query";
import * as _51 from "./gov/v1beta1/tx";
import * as _52 from "./mint/v1beta1/genesis";
import * as _53 from "./mint/v1beta1/mint";
import * as _54 from "./mint/v1beta1/query";
import * as _55 from "./params/v1beta1/params";
import * as _56 from "./params/v1beta1/query";
import * as _57 from "./slashing/v1beta1/genesis";
import * as _58 from "./slashing/v1beta1/query";
import * as _59 from "./slashing/v1beta1/slashing";
import * as _60 from "./slashing/v1beta1/tx";
import * as _61 from "./staking/v1beta1/authz";
import * as _62 from "./staking/v1beta1/genesis";
import * as _63 from "./staking/v1beta1/query";
import * as _64 from "./staking/v1beta1/staking";
import * as _65 from "./staking/v1beta1/tx";
import * as _66 from "./tx/signing/v1beta1/signing";
import * as _67 from "./tx/v1beta1/service";
import * as _68 from "./tx/v1beta1/tx";
import * as _69 from "./upgrade/v1beta1/query";
import * as _70 from "./upgrade/v1beta1/upgrade";
import * as _71 from "./vesting/v1beta1/tx";
import * as _72 from "./vesting/v1beta1/vesting";
import * as _137 from "./authz/v1beta1/tx.amino";
import * as _138 from "./bank/v1beta1/tx.amino";
import * as _139 from "./crisis/v1beta1/tx.amino";
import * as _140 from "./distribution/v1beta1/tx.amino";
import * as _141 from "./evidence/v1beta1/tx.amino";
import * as _142 from "./feegrant/v1beta1/tx.amino";
import * as _143 from "./gov/v1beta1/tx.amino";
import * as _144 from "./slashing/v1beta1/tx.amino";
import * as _145 from "./staking/v1beta1/tx.amino";
import * as _146 from "./vesting/v1beta1/tx.amino";
import * as _147 from "./authz/v1beta1/tx.registry";
import * as _148 from "./bank/v1beta1/tx.registry";
import * as _149 from "./crisis/v1beta1/tx.registry";
import * as _150 from "./distribution/v1beta1/tx.registry";
import * as _151 from "./evidence/v1beta1/tx.registry";
import * as _152 from "./feegrant/v1beta1/tx.registry";
import * as _153 from "./gov/v1beta1/tx.registry";
import * as _154 from "./slashing/v1beta1/tx.registry";
import * as _155 from "./staking/v1beta1/tx.registry";
import * as _156 from "./vesting/v1beta1/tx.registry";
import * as _157 from "./auth/v1beta1/query.lcd";
import * as _158 from "./authz/v1beta1/query.lcd";
import * as _159 from "./bank/v1beta1/query.lcd";
import * as _160 from "./base/node/v1beta1/query.lcd";
import * as _161 from "./base/tendermint/v1beta1/query.lcd";
import * as _162 from "./distribution/v1beta1/query.lcd";
import * as _163 from "./evidence/v1beta1/query.lcd";
import * as _164 from "./feegrant/v1beta1/query.lcd";
import * as _165 from "./gov/v1beta1/query.lcd";
import * as _166 from "./mint/v1beta1/query.lcd";
import * as _167 from "./params/v1beta1/query.lcd";
import * as _168 from "./slashing/v1beta1/query.lcd";
import * as _169 from "./staking/v1beta1/query.lcd";
import * as _170 from "./tx/v1beta1/service.lcd";
import * as _171 from "./upgrade/v1beta1/query.lcd";
import * as _172 from "./auth/v1beta1/query.rpc.Query";
import * as _173 from "./authz/v1beta1/query.rpc.Query";
import * as _174 from "./bank/v1beta1/query.rpc.Query";
import * as _175 from "./base/node/v1beta1/query.rpc.Service";
import * as _176 from "./base/tendermint/v1beta1/query.rpc.Service";
import * as _177 from "./distribution/v1beta1/query.rpc.Query";
import * as _178 from "./evidence/v1beta1/query.rpc.Query";
import * as _179 from "./feegrant/v1beta1/query.rpc.Query";
import * as _180 from "./gov/v1beta1/query.rpc.Query";
import * as _181 from "./mint/v1beta1/query.rpc.Query";
import * as _182 from "./params/v1beta1/query.rpc.Query";
import * as _183 from "./slashing/v1beta1/query.rpc.Query";
import * as _184 from "./staking/v1beta1/query.rpc.Query";
import * as _185 from "./tx/v1beta1/service.rpc.Service";
import * as _186 from "./upgrade/v1beta1/query.rpc.Query";
import * as _187 from "./authz/v1beta1/tx.rpc.msg";
import * as _188 from "./bank/v1beta1/tx.rpc.msg";
import * as _189 from "./crisis/v1beta1/tx.rpc.msg";
import * as _190 from "./distribution/v1beta1/tx.rpc.msg";
import * as _191 from "./evidence/v1beta1/tx.rpc.msg";
import * as _192 from "./feegrant/v1beta1/tx.rpc.msg";
import * as _193 from "./gov/v1beta1/tx.rpc.msg";
import * as _194 from "./slashing/v1beta1/tx.rpc.msg";
import * as _195 from "./staking/v1beta1/tx.rpc.msg";
import * as _196 from "./vesting/v1beta1/tx.rpc.msg";
import * as _231 from "./lcd";
import * as _232 from "./rpc.query";
import * as _233 from "./rpc.tx";
export namespace cosmos {
  export namespace auth {
    export const v1beta1 = {
      ..._3,
      ..._4,
      ..._5,
      ..._157,
      ..._172
    };
  }
  export namespace authz {
    export const v1beta1 = {
      ..._6,
      ..._7,
      ..._8,
      ..._9,
      ..._10,
      ..._137,
      ..._147,
      ..._158,
      ..._173,
      ..._187
    };
  }
  export namespace bank {
    export const v1beta1 = {
      ..._11,
      ..._12,
      ..._13,
      ..._14,
      ..._15,
      ..._138,
      ..._148,
      ..._159,
      ..._174,
      ..._188
    };
  }
  export namespace base {
    export namespace abci {
      export const v1beta1 = {
        ..._16
      };
    }
    export namespace kv {
      export const v1beta1 = {
        ..._17
      };
    }
    export namespace node {
      export const v1beta1 = {
        ..._18,
        ..._160,
        ..._175
      };
    }
    export namespace query {
      export const v1beta1 = {
        ..._19
      };
    }
    export namespace reflection {
      export const v1beta1 = {
        ..._20
      };
      export const v2alpha1 = {
        ..._21
      };
    }
    export namespace snapshots {
      export const v1beta1 = {
        ..._22
      };
    }
    export namespace store {
      export const v1beta1 = {
        ..._23,
        ..._24
      };
    }
    export namespace tendermint {
      export const v1beta1 = {
        ..._25,
        ..._161,
        ..._176
      };
    }
    export const v1beta1 = {
      ..._26
    };
  }
  export namespace capability {
    export const v1beta1 = {
      ..._27,
      ..._28
    };
  }
  export namespace crisis {
    export const v1beta1 = {
      ..._29,
      ..._30,
      ..._139,
      ..._149,
      ..._189
    };
  }
  export namespace crypto {
    export const ed25519 = {
      ..._31
    };
    export const multisig = {
      ..._32
    };
    export const secp256k1 = {
      ..._33
    };
    export const secp256r1 = {
      ..._34
    };
  }
  export namespace distribution {
    export const v1beta1 = {
      ..._35,
      ..._36,
      ..._37,
      ..._38,
      ..._140,
      ..._150,
      ..._162,
      ..._177,
      ..._190
    };
  }
  export namespace evidence {
    export const v1beta1 = {
      ..._39,
      ..._40,
      ..._41,
      ..._42,
      ..._141,
      ..._151,
      ..._163,
      ..._178,
      ..._191
    };
  }
  export namespace feegrant {
    export const v1beta1 = {
      ..._43,
      ..._44,
      ..._45,
      ..._46,
      ..._142,
      ..._152,
      ..._164,
      ..._179,
      ..._192
    };
  }
  export namespace genutil {
    export const v1beta1 = {
      ..._47
    };
  }
  export namespace gov {
    export const v1beta1 = {
      ..._48,
      ..._49,
      ..._50,
      ..._51,
      ..._143,
      ..._153,
      ..._165,
      ..._180,
      ..._193
    };
  }
  export namespace mint {
    export const v1beta1 = {
      ..._52,
      ..._53,
      ..._54,
      ..._166,
      ..._181
    };
  }
  export namespace params {
    export const v1beta1 = {
      ..._55,
      ..._56,
      ..._167,
      ..._182
    };
  }
  export namespace slashing {
    export const v1beta1 = {
      ..._57,
      ..._58,
      ..._59,
      ..._60,
      ..._144,
      ..._154,
      ..._168,
      ..._183,
      ..._194
    };
  }
  export namespace staking {
    export const v1beta1 = {
      ..._61,
      ..._62,
      ..._63,
      ..._64,
      ..._65,
      ..._145,
      ..._155,
      ..._169,
      ..._184,
      ..._195
    };
  }
  export namespace tx {
    export namespace signing {
      export const v1beta1 = {
        ..._66
      };
    }
    export const v1beta1 = {
      ..._67,
      ..._68,
      ..._170,
      ..._185
    };
  }
  export namespace upgrade {
    export const v1beta1 = {
      ..._69,
      ..._70,
      ..._171,
      ..._186
    };
  }
  export namespace vesting {
    export const v1beta1 = {
      ..._71,
      ..._72,
      ..._146,
      ..._156,
      ..._196
    };
  }
  export const ClientFactory = {
    ..._231,
    ..._232,
    ..._233
  };
}