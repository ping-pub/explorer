import * as _137 from 'osmojs/dist/codegen/osmosis/accum/v1beta1/accum';
import * as _138 from 'osmojs/dist/codegen/osmosis/concentratedliquidity/params';
import * as _139 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/genesis';
import * as _140 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/gov';
import * as _141 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/model/instantiate_msg';
import * as _142 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/model/module_query_msg';
import * as _143 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/model/module_sudo_msg';
import * as _144 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/model/pool_query_msg';
import * as _145 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/model/pool';
import * as _146 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/model/transmuter_msgs';
import * as _147 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/model/tx';
import * as _148 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/params';
import * as _149 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/query';
import * as _150 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/tx';
import * as _151 from 'osmojs/dist/codegen/osmosis/downtimedetector/v1beta1/downtime_duration';
import * as _152 from 'osmojs/dist/codegen/osmosis/downtimedetector/v1beta1/genesis';
import * as _153 from 'osmojs/dist/codegen/osmosis/downtimedetector/v1beta1/query';
import * as _154 from 'osmojs/dist/codegen/osmosis/epochs/v1beta1/genesis';
import * as _155 from 'osmojs/dist/codegen/osmosis/epochs/v1beta1/query';
import * as _156 from 'osmojs/dist/codegen/osmosis/gamm/poolmodels/balancer/v1beta1/tx';
import * as _157 from 'osmojs/dist/codegen/osmosis/gamm/poolmodels/stableswap/v1beta1/stableswap_pool';
import * as _158 from 'osmojs/dist/codegen/osmosis/gamm/poolmodels/stableswap/v1beta1/tx';
import * as _159 from 'osmojs/dist/codegen/osmosis/gamm/v1beta1/balancerPool';
import * as _160 from 'osmojs/dist/codegen/osmosis/gamm/v1beta1/genesis';
import * as _161 from 'osmojs/dist/codegen/osmosis/gamm/v1beta1/gov';
import * as _162 from 'osmojs/dist/codegen/osmosis/gamm/v1beta1/query';
import * as _163 from 'osmojs/dist/codegen/osmosis/gamm/v1beta1/shared';
import * as _164 from 'osmojs/dist/codegen/osmosis/gamm/v1beta1/tx';
import * as _165 from 'osmojs/dist/codegen/osmosis/gamm/v2/query';
import * as _166 from 'osmojs/dist/codegen/osmosis/ibchooks/genesis';
import * as _167 from 'osmojs/dist/codegen/osmosis/ibchooks/params';
import * as _168 from 'osmojs/dist/codegen/osmosis/ibchooks/tx';
import * as _169 from 'osmojs/dist/codegen/osmosis/ibcratelimit/v1beta1/genesis';
import * as _170 from 'osmojs/dist/codegen/osmosis/ibcratelimit/v1beta1/params';
import * as _171 from 'osmojs/dist/codegen/osmosis/ibcratelimit/v1beta1/query';
import * as _172 from 'osmojs/dist/codegen/osmosis/incentives/gauge';
import * as _173 from 'osmojs/dist/codegen/osmosis/incentives/genesis';
import * as _174 from 'osmojs/dist/codegen/osmosis/incentives/gov';
import * as _175 from 'osmojs/dist/codegen/osmosis/incentives/group';
import * as _176 from 'osmojs/dist/codegen/osmosis/incentives/params';
import * as _177 from 'osmojs/dist/codegen/osmosis/incentives/query';
import * as _178 from 'osmojs/dist/codegen/osmosis/incentives/tx';
import * as _179 from 'osmojs/dist/codegen/osmosis/lockup/genesis';
import * as _180 from 'osmojs/dist/codegen/osmosis/lockup/lock';
import * as _181 from 'osmojs/dist/codegen/osmosis/lockup/params';
import * as _182 from 'osmojs/dist/codegen/osmosis/lockup/query';
import * as _183 from 'osmojs/dist/codegen/osmosis/lockup/tx';
import * as _184 from 'osmojs/dist/codegen/osmosis/mint/v1beta1/genesis';
import * as _185 from 'osmojs/dist/codegen/osmosis/mint/v1beta1/mint';
import * as _186 from 'osmojs/dist/codegen/osmosis/mint/v1beta1/query';
import * as _187 from 'osmojs/dist/codegen/osmosis/poolincentives/v1beta1/genesis';
import * as _188 from 'osmojs/dist/codegen/osmosis/poolincentives/v1beta1/gov';
import * as _189 from 'osmojs/dist/codegen/osmosis/poolincentives/v1beta1/incentives';
import * as _190 from 'osmojs/dist/codegen/osmosis/poolincentives/v1beta1/query';
import * as _191 from 'osmojs/dist/codegen/osmosis/poolincentives/v1beta1/shared';
import * as _192 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/genesis';
import * as _193 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/gov';
import * as _194 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/module_route';
import * as _195 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/query';
import * as _196 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/swap_route';
import * as _197 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/tracked_volume';
import * as _198 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/tx';
import * as _199 from 'osmojs/dist/codegen/osmosis/poolmanager/v2/query';
import * as _200 from 'osmojs/dist/codegen/osmosis/protorev/v1beta1/genesis';
import * as _201 from 'osmojs/dist/codegen/osmosis/protorev/v1beta1/gov';
import * as _202 from 'osmojs/dist/codegen/osmosis/protorev/v1beta1/params';
import * as _203 from 'osmojs/dist/codegen/osmosis/protorev/v1beta1/protorev';
import * as _204 from 'osmojs/dist/codegen/osmosis/protorev/v1beta1/query';
import * as _205 from 'osmojs/dist/codegen/osmosis/protorev/v1beta1/tx';
import * as _206 from 'osmojs/dist/codegen/osmosis/store/v1beta1/tree';
import * as _207 from 'osmojs/dist/codegen/osmosis/superfluid/genesis';
import * as _208 from 'osmojs/dist/codegen/osmosis/superfluid/params';
import * as _209 from 'osmojs/dist/codegen/osmosis/superfluid/query';
import * as _210 from 'osmojs/dist/codegen/osmosis/superfluid/superfluid';
import * as _211 from 'osmojs/dist/codegen/osmosis/superfluid/tx';
import * as _212 from 'osmojs/dist/codegen/osmosis/tokenfactory/v1beta1/authorityMetadata';
import * as _213 from 'osmojs/dist/codegen/osmosis/tokenfactory/v1beta1/genesis';
import * as _214 from 'osmojs/dist/codegen/osmosis/tokenfactory/v1beta1/params';
import * as _215 from 'osmojs/dist/codegen/osmosis/tokenfactory/v1beta1/query';
import * as _216 from 'osmojs/dist/codegen/osmosis/tokenfactory/v1beta1/tx';
import * as _217 from 'osmojs/dist/codegen/osmosis/twap/v1beta1/genesis';
import * as _218 from 'osmojs/dist/codegen/osmosis/twap/v1beta1/query';
import * as _219 from 'osmojs/dist/codegen/osmosis/twap/v1beta1/twap_record';
import * as _220 from 'osmojs/dist/codegen/osmosis/txfees/v1beta1/feetoken';
import * as _221 from 'osmojs/dist/codegen/osmosis/txfees/v1beta1/genesis';
import * as _222 from 'osmojs/dist/codegen/osmosis/txfees/v1beta1/gov';
import * as _223 from 'osmojs/dist/codegen/osmosis/txfees/v1beta1/query';
import * as _224 from 'osmojs/dist/codegen/osmosis/valsetpref/v1beta1/query';
import * as _225 from 'osmojs/dist/codegen/osmosis/valsetpref/v1beta1/state';
import * as _226 from 'osmojs/dist/codegen/osmosis/valsetpref/v1beta1/tx';
import * as _325 from 'osmojs/dist/codegen/osmosis/concentratedliquidity/poolmodel/concentrated/v1beta1/tx.amino';
import * as _326 from 'osmojs/dist/codegen/osmosis/concentratedliquidity/v1beta1/tx.amino';
import * as _327 from 'osmojs/dist/codegen/osmosis/gamm/poolmodels/balancer/v1beta1/tx.amino';
import * as _328 from 'osmojs/dist/codegen/osmosis/gamm/poolmodels/stableswap/v1beta1/tx.amino';
import * as _329 from 'osmojs/dist/codegen/osmosis/gamm/v1beta1/tx.amino';
import * as _330 from 'osmojs/dist/codegen/osmosis/ibchooks/tx.amino';
import * as _331 from 'osmojs/dist/codegen/osmosis/incentives/tx.amino';
import * as _332 from 'osmojs/dist/codegen/osmosis/lockup/tx.amino';
import * as _333 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/tx.amino';
import * as _334 from 'osmojs/dist/codegen/osmosis/protorev/v1beta1/tx.amino';
import * as _335 from 'osmojs/dist/codegen/osmosis/superfluid/tx.amino';
import * as _336 from 'osmojs/dist/codegen/osmosis/tokenfactory/v1beta1/tx.amino';
import * as _337 from 'osmojs/dist/codegen/osmosis/valsetpref/v1beta1/tx.amino';
import * as _338 from 'osmojs/dist/codegen/osmosis/concentratedliquidity/poolmodel/concentrated/v1beta1/tx.registry';
import * as _339 from 'osmojs/dist/codegen/osmosis/concentratedliquidity/v1beta1/tx.registry';
import * as _340 from 'osmojs/dist/codegen/osmosis/gamm/poolmodels/balancer/v1beta1/tx.registry';
import * as _341 from 'osmojs/dist/codegen/osmosis/gamm/poolmodels/stableswap/v1beta1/tx.registry';
import * as _342 from 'osmojs/dist/codegen/osmosis/gamm/v1beta1/tx.registry';
import * as _343 from 'osmojs/dist/codegen/osmosis/ibchooks/tx.registry';
import * as _344 from 'osmojs/dist/codegen/osmosis/incentives/tx.registry';
import * as _345 from 'osmojs/dist/codegen/osmosis/lockup/tx.registry';
import * as _346 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/tx.registry';
import * as _347 from 'osmojs/dist/codegen/osmosis/protorev/v1beta1/tx.registry';
import * as _348 from 'osmojs/dist/codegen/osmosis/superfluid/tx.registry';
import * as _349 from 'osmojs/dist/codegen/osmosis/tokenfactory/v1beta1/tx.registry';
import * as _350 from 'osmojs/dist/codegen/osmosis/valsetpref/v1beta1/tx.registry';
import * as _351 from 'osmojs/dist/codegen/osmosis/concentratedliquidity/v1beta1/query.lcd';
import * as _352 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/query.lcd';
import * as _353 from 'osmojs/dist/codegen/osmosis/downtimedetector/v1beta1/query.lcd';
import * as _354 from 'osmojs/dist/codegen/osmosis/epochs/v1beta1/query.lcd';
import * as _355 from 'osmojs/dist/codegen/osmosis/gamm/v1beta1/query.lcd';
import * as _356 from 'osmojs/dist/codegen/osmosis/gamm/v2/query.lcd';
import * as _357 from 'osmojs/dist/codegen/osmosis/ibcratelimit/v1beta1/query.lcd';
import * as _358 from 'osmojs/dist/codegen/osmosis/incentives/query.lcd';
import * as _359 from 'osmojs/dist/codegen/osmosis/lockup/query.lcd';
import * as _360 from 'osmojs/dist/codegen/osmosis/mint/v1beta1/query.lcd';
import * as _361 from 'osmojs/dist/codegen/osmosis/poolincentives/v1beta1/query.lcd';
import * as _362 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/query.lcd';
import * as _363 from 'osmojs/dist/codegen/osmosis/poolmanager/v2/query.lcd';
import * as _364 from 'osmojs/dist/codegen/osmosis/protorev/v1beta1/query.lcd';
import * as _365 from 'osmojs/dist/codegen/osmosis/superfluid/query.lcd';
import * as _366 from 'osmojs/dist/codegen/osmosis/tokenfactory/v1beta1/query.lcd';
import * as _367 from 'osmojs/dist/codegen/osmosis/twap/v1beta1/query.lcd';
import * as _368 from 'osmojs/dist/codegen/osmosis/txfees/v1beta1/query.lcd';
import * as _369 from 'osmojs/dist/codegen/osmosis/valsetpref/v1beta1/query.lcd';
import * as _370 from 'osmojs/dist/codegen/osmosis/concentratedliquidity/v1beta1/query.rpc.Query';
import * as _371 from 'osmojs/dist/codegen/osmosis/cosmwasmpool/v1beta1/query.rpc.Query';
import * as _372 from 'osmojs/dist/codegen/osmosis/downtimedetector/v1beta1/query.rpc.Query';
import * as _373 from 'osmojs/dist/codegen/osmosis/epochs/v1beta1/query.rpc.Query';
import * as _374 from 'osmojs/dist/codegen/osmosis/gamm/v1beta1/query.rpc.Query';
import * as _375 from 'osmojs/dist/codegen/osmosis/gamm/v2/query.rpc.Query';
import * as _376 from 'osmojs/dist/codegen/osmosis/ibcratelimit/v1beta1/query.rpc.Query';
import * as _377 from 'osmojs/dist/codegen/osmosis/incentives/query.rpc.Query';
import * as _378 from 'osmojs/dist/codegen/osmosis/lockup/query.rpc.Query';
import * as _379 from 'osmojs/dist/codegen/osmosis/mint/v1beta1/query.rpc.Query';
import * as _380 from 'osmojs/dist/codegen/osmosis/poolincentives/v1beta1/query.rpc.Query';
import * as _381 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/query.rpc.Query';
import * as _382 from 'osmojs/dist/codegen/osmosis/poolmanager/v2/query.rpc.Query';
import * as _383 from 'osmojs/dist/codegen/osmosis/protorev/v1beta1/query.rpc.Query';
import * as _384 from 'osmojs/dist/codegen/osmosis/superfluid/query.rpc.Query';
import * as _385 from 'osmojs/dist/codegen/osmosis/tokenfactory/v1beta1/query.rpc.Query';
import * as _386 from 'osmojs/dist/codegen/osmosis/twap/v1beta1/query.rpc.Query';
import * as _387 from 'osmojs/dist/codegen/osmosis/txfees/v1beta1/query.rpc.Query';
import * as _388 from 'osmojs/dist/codegen/osmosis/valsetpref/v1beta1/query.rpc.Query';
import * as _389 from 'osmojs/dist/codegen/osmosis/concentratedliquidity/poolmodel/concentrated/v1beta1/tx.rpc.msg';
import * as _390 from 'osmojs/dist/codegen/osmosis/concentratedliquidity/v1beta1/tx.rpc.msg';
import * as _391 from 'osmojs/dist/codegen/osmosis/gamm/poolmodels/balancer/v1beta1/tx.rpc.msg';
import * as _392 from 'osmojs/dist/codegen/osmosis/gamm/poolmodels/stableswap/v1beta1/tx.rpc.msg';
import * as _393 from 'osmojs/dist/codegen/osmosis/gamm/v1beta1/tx.rpc.msg';
import * as _394 from 'osmojs/dist/codegen/osmosis/ibchooks/tx.rpc.msg';
import * as _395 from 'osmojs/dist/codegen/osmosis/incentives/tx.rpc.msg';
import * as _396 from 'osmojs/dist/codegen/osmosis/lockup/tx.rpc.msg';
import * as _397 from 'osmojs/dist/codegen/osmosis/poolmanager/v1beta1/tx.rpc.msg';
import * as _398 from 'osmojs/dist/codegen/osmosis/protorev/v1beta1/tx.rpc.msg';
import * as _399 from 'osmojs/dist/codegen/osmosis/superfluid/tx.rpc.msg';
import * as _400 from 'osmojs/dist/codegen/osmosis/tokenfactory/v1beta1/tx.rpc.msg';
import * as _401 from 'osmojs/dist/codegen/osmosis/valsetpref/v1beta1/tx.rpc.msg';
import * as _411 from 'osmojs/dist/codegen/osmosis/lcd';
import * as _412 from 'osmojs/dist/codegen/osmosis/rpc.query';
import * as _413 from 'osmojs/dist/codegen/osmosis/rpc.tx';

export default {
  osmosis: {
    accum: {
      v1beta1: {
        ..._137,
      },
    },
    concentratedliquidity: {
      ..._138,
      poolmodel: {
        concentrated: {
          v1beta1: {
            ..._325,
            ..._338,
            ..._389,
          },
        },
      },
      v1beta1: {
        ..._326,
        ..._339,
        ..._351,
        ..._370,
        ..._390,
      },
    },
    cosmwasmpool: {
      v1beta1: {
        ..._139,
        ..._140,
        ..._141,
        ..._142,
        ..._143,
        ..._144,
        ..._145,
        ..._146,
        ..._147,
        ..._148,
        ..._149,
        ..._150,
        ..._352,
        ..._371,
      },
    },
    downtimedetector: {
      v1beta1: {
        ..._151,
        ..._152,
        ..._153,
        ..._353,
        ..._372,
      },
    },
    epochs: {
      v1beta1: {
        ..._154,
        ..._155,
        ..._354,
        ..._373,
      },
    },
    gamm: {
      poolmodels: {
        balancer: {
          v1beta1: {
            ..._156,
            ..._327,
            ..._340,
            ..._391,
          },
        },
        stableswap: {
          v1beta1: {
            ..._157,
            ..._158,
            ..._328,
            ..._341,
            ..._392,
          },
        },
      },
      v1beta1: {
        ..._159,
        ..._160,
        ..._161,
        ..._162,
        ..._163,
        ..._164,
        ..._329,
        ..._342,
        ..._355,
        ..._374,
        ..._393,
      },
      v2: {
        ..._165,
        ..._356,
        ..._375,
      },
    },
    ibchooks: {
      ..._166,
      ..._167,
      ..._168,
      ..._330,
      ..._343,
      ..._394,
    },
    ibcratelimit: {
      v1beta1: {
        ..._169,
        ..._170,
        ..._171,
        ..._357,
        ..._376,
      },
    },
    incentives: {
      ..._172,
      ..._173,
      ..._174,
      ..._175,
      ..._176,
      ..._177,
      ..._178,
      ..._331,
      ..._344,
      ..._358,
      ..._377,
      ..._395,
    },
    lockup: {
      ..._179,
      ..._180,
      ..._181,
      ..._182,
      ..._183,
      ..._332,
      ..._345,
      ..._359,
      ..._378,
      ..._396,
    },
    mint: {
      v1beta1: {
        ..._184,
        ..._185,
        ..._186,
        ..._360,
        ..._379,
      },
    },
    poolincentives: {
      v1beta1: {
        ..._187,
        ..._188,
        ..._189,
        ..._190,
        ..._191,
        ..._361,
        ..._380,
      },
    },
    poolmanager: {
      v1beta1: {
        ..._192,
        ..._193,
        ..._194,
        ..._195,
        ..._196,
        ..._197,
        ..._198,
        ..._333,
        ..._346,
        ..._362,
        ..._381,
        ..._397,
      },
      v2: {
        ..._199,
        ..._363,
        ..._382,
      },
    },
    protorev: {
      v1beta1: {
        ..._200,
        ..._201,
        ..._202,
        ..._203,
        ..._204,
        ..._205,
        ..._334,
        ..._347,
        ..._364,
        ..._383,
        ..._398,
      },
    },
    store: {
      v1beta1: {
        ..._206,
      },
    },
    superfluid: {
      ..._207,
      ..._208,
      ..._209,
      ..._210,
      ..._211,
      ..._335,
      ..._348,
      ..._365,
      ..._384,
      ..._399,
    },
    tokenfactory: {
      v1beta1: {
        ..._212,
        ..._213,
        ..._214,
        ..._215,
        ..._216,
        ..._336,
        ..._349,
        ..._366,
        ..._385,
        ..._400,
      },
    },
    twap: {
      v1beta1: {
        ..._217,
        ..._218,
        ..._219,
        ..._367,
        ..._386,
      },
    },
    txfees: {
      v1beta1: {
        ..._220,
        ..._221,
        ..._222,
        ..._223,
        ..._368,
        ..._387,
      },
    },
    valsetpref: {
      v1beta1: {
        ..._224,
        ..._225,
        ..._226,
        ..._337,
        ..._350,
        ..._369,
        ..._388,
        ..._401,
      },
    },
    ClientFactory: {
      ..._411,
      ..._412,
      ..._413,
    },
  },
};
