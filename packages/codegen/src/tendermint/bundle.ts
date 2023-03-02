import * as _134 from "./abci/types";
import * as _135 from "./crypto/keys";
import * as _136 from "./crypto/proof";
import * as _137 from "./libs/bits/types";
import * as _138 from "./p2p/types";
import * as _139 from "./types/block";
import * as _140 from "./types/evidence";
import * as _141 from "./types/params";
import * as _142 from "./types/types";
import * as _143 from "./types/validator";
import * as _144 from "./version/types";
export namespace tendermint {
  export const abci = { ..._134
  };
  export const crypto = { ..._135,
    ..._136
  };
  export namespace libs {
    export const bits = { ..._137
    };
  }
  export const p2p = { ..._138
  };
  export const types = { ..._139,
    ..._140,
    ..._141,
    ..._142,
    ..._143
  };
  export const version = { ..._144
  };
}