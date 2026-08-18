/// <reference types="vite/client" />

declare module '@personaxyz/ad-sdk';
// Vite injects env vars as strings whatever the .env file looks like. Declaring
// them as number/boolean hides bugs such as `"false"` being truthy.
interface ImportMetaEnv {
    readonly VITE_REFRESH_INTERVAL?: string,
    readonly VITE_FETCH_ALL_BLOCKS?: string,
    readonly VITE_RECENT_BLOCK_LIMIT?: string,
    readonly VITE_COINGECKO_URL?: string,
    readonly VITE_GITHUB_API_URL?: string,
    readonly VITE_PINGPUB_API_URL?: string,
    readonly VITE_IBC_USE_GITHUB_API?: string,
    readonly VITE_DEFAULT_THEME?: 'light' | 'dark',
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
