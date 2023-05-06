import type { CosmosRestClient } from '@/libs/client';
import 'pinia';
import type { Ref } from 'vue';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // by using a setter we can allow both strings and refs
    set rpc(value: CosmosRestClient | Ref<CosmosRestClient>);
    get rpc(): CosmosRestClient;
  }
}
