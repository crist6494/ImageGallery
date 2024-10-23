interface ImportMetaEnv {
    VITE_ACCESS_KEY: string;
    VITE_SECRET_KEY: string;
    VITE_UNSPALSH_URL: string;
    VITE_REDIRECT_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}