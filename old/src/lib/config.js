const DEFAULT_API_BASE_URL = 'http://localhost:3111/v1';

export const API_BASE_URL =
    typeof window === 'undefined'
        ? process.env.API_URL || DEFAULT_API_BASE_URL
        : process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;
