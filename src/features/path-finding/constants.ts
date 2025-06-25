export const STATES = {
    EMPTY: '#f0f0f0',
    START: '#69ff66',
    GOAL: '#ff6675',
    WALL: '#2f303b',
    PATH: '#fabd4c',
    PATH_SEARCHING: '#ffe957',
    SEARCHED: '#64a0c9',
    QUEUED: '#3563ec',
    FOUND: '#68f3fd',
}

export const RUN_STATE = {
    NONE: 'NONE',
    STARTED: 'STARTED',
    PAUSED: 'PAUSED',
    FINISHED: 'FINISHED',
}

export const SPEED_LABELS = ['5x', '3x', '2x', '1x', '1/2x', '1/3x', '1/5x']
export const SPEED_VALUES = [12, 20, 30, 60, 120, 180, 300]
