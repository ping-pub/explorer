import { defineStore } from "pinia";
import type { LCDClient } from '@osmonauts/lcd';

export const useEndpoint = defineStore('pinia.endpoint', {
    state: () => {
        return {
            restClient: {} as LCDClient,
        }
    },
    actions: {
        setRestClient(client: LCDClient) {
            this.restClient = client
        }
    }
})