import type { GetTxResponse } from 'cosmjs-types/cosmos/tx/v1beta1/service';

declare global {
  declare const TXS_CACHE: Record<string, GetTxResponse> = {};
}
