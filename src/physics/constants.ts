/**
 * constants.ts - Physical constants and default values
 * 
 * This file stores all the fixed values used in the simulation.
 * Having them in one place makes it easy to:
 * 1. Change values consistently across the app
 * 2. Understand what assumptions we're making
 */

// ==========================================
// Physical Constants
// ==========================================

/**
 * Standard gravitational acceleration on Earth's surface.
 * This is the rate at which objects speed up when falling.
 * 
 * Value: 9.8 meters per second squared (m/s²)
 * 
 * Note: We use a simplified value. The actual value varies
 * slightly depending on location on Earth.
 */
export const STANDARD_GRAVITY = 9.8; // m/s²

// ==========================================
// Default Launch Parameters
// ==========================================

/**
 * Default initial velocity for the projectile.
 * A moderate speed that produces a visible trajectory.
 */
export const DEFAULT_INITIAL_VELOCITY = 20; // m/s

/**
 * Default launch angle.
 * 45 degrees gives the maximum range for a given speed.
 */
export const DEFAULT_LAUNCH_ANGLE = 45; // degrees

// ==========================================
// Parameter Limits
// ==========================================

/**
 * Minimum and maximum allowed values for inputs.
 * These prevent unrealistic or problematic simulations.
 */
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

// ==========================================
// Simulation Settings
// ==========================================

/**
 * Time step for the simulation.
 * Smaller values = smoother animation but more computation.
 * 16ms ≈ 60 frames per second.
 */
export const TIME_STEP = 0.016; // seconds (60 FPS)

/**
 * How many decimal places to show in results.
 */
export const DECIMAL_PLACES = 2;

// ==========================================
// Mathematical Constants
// ==========================================

/**
 * Convert degrees to radians.
 * Math.sin() and Math.cos() require radians, not degrees.
 * 
 * Formula: radians = degrees × (π / 180)
 */
export const DEG_TO_RAD = Math.PI / 180;

/**
 * Convert radians to degrees.
 * Formula: degrees = radians × (180 / π)
 */
export const RAD_TO_DEG = 180 / Math.PI;
