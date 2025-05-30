export const VALIDATION_RULES = {
    EMAIL: {
        MAX_LENGTH: 100,
    },
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 100,
    },
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50,
    },
} as const;