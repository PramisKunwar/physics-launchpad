
export const STANDARD_GRAVITY = 9.8; // m/s²


export const DEFAULT_INITIAL_VELOCITY = 20; // m/s


export const DEFAULT_LAUNCH_ANGLE = 45; // degrees


export const LIMITS = {
  velocity: {
    min: 1,      // At least 1 m/s
    max: 100,    // Maximum 100 m/s (about 360 km/h)
  },
  angle: {
    min: 5,      // At least 5 degrees
    max: 85,     // Maximum 85 degrees (not quite vertical)
  },
  gravity: {
    min: 1,      // Minimum gravity
    max: 20,     // Maximum gravity (about 2x Earth)
  },
};


export const TIME_STEP = 0.016; // seconds (60 FPS)


export const DECIMAL_PLACES = 2;


export const DEG_TO_RAD = Math.PI / 180;


export const RAD_TO_DEG = 180 / Math.PI;