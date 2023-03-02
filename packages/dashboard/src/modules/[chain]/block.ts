import { defineStore } from "pinia";

export const useBlockModule = defineStore('blockModule', {
    state: () => {
        return {
            latest: {},
            recents: []
        }
    },
    getters: {

    },
    actions: {
    }
})