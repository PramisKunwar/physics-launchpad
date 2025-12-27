export const STANDARD_GRAVITY = 9.8;
export const DEFAULT_INITIAL_VELOCITY = 20;
export const DEFAULT_LAUNCH_ANGLE=45;
export const LIMITS={
    velocity:{
        min:1,
        max: 100,
    },
    angle:{
        min: 5,
        max: 85,
    },
    gravity: {
        min: 1,
        max: 20,
    },
};

export const TIME_STEP = 0.016;

export const DECIMAL_PLACES = 2;
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;