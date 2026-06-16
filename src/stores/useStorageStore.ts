import { defineStore } from 'pinia';

const PREFERENCE_KEY = 'storage-preference';

export const useStorageStore = defineStore('storageStore', {
  state: () => ({
    preference: (localStorage.getItem(PREFERENCE_KEY) || 'session') as 'session' | 'local',
  }),
  getters: {
    currentStorage(): Storage {
      return this.preference === 'session' ? sessionStorage : localStorage;
    },
    isSession(): boolean {
      return this.preference === 'session';
    },
  },
  actions: {
    toggle() {
      const newPreference = this.preference === 'session' ? 'local' : 'session';
      const oldStorage: Storage = newPreference === 'session' ? localStorage : sessionStorage;
      const newStorage: Storage = newPreference === 'session' ? sessionStorage : localStorage;

      const walletKeys: string[] = [];
      for (let i = 0; i < oldStorage.length; i++) {
        const key = oldStorage.key(i);
        if (key && (key.startsWith('m/44') || key === 'imported-addresses')) {
          walletKeys.push(key);
        }
      }

      walletKeys.forEach((key) => {
        const value = oldStorage.getItem(key);
        if (value) {
          newStorage.setItem(key, value);
          oldStorage.removeItem(key);
        }
      });

      this.preference = newPreference;
      localStorage.setItem(PREFERENCE_KEY, newPreference);
    },
  },
});
