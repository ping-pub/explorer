import type { RPCClient } from '@/libs/client.rpc'
import 'pinia'
import type { Ref } from 'vue'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // by using a setter we can allow both strings and refs
    set rpc(value: RPCClient | Ref<RPCClient>)
    get rpc(): RPCClient
  }
}