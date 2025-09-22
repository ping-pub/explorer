/// <reference types="vite/client" />

declare module '@personaxyz/ad-sdk';
interface ImportMetaEnv {
    readonly VITE_REFRESH_INTERVAL?: number,
    readonly VITE_FETCH_ALL_BLOCKS?: boolean,
    readonly VITE_RECENT_BLOCK_LIMIT?: number,
    readonly VITE_COINGECKO_URL?: string,
    readonly VITE_GITHUB_API_URL?: string,
    readonly VITE_PINGPUB_API_URL?: string,
    readonly VITE_IBC_USE_GITHUB_API?: string,
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
