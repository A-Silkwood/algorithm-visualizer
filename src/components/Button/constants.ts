export const IconPos = {
    BEFORE: 'BEFORE',
    AFTER: 'AFTER',
    BOTH: 'BOTH',
    NONE: 'NONE',
} as const

export type IconPos = keyof typeof IconPos

export type IconWeight =
    | 'thin'
    | 'light'
    | 'regular'
    | 'bold'
    | 'fill'
    | 'duotone'
