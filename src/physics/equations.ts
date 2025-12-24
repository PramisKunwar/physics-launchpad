/**
 * equations.ts - Kinematic equations for projectile motion
 * 
 * This file contains all the physics formulas used in the simulation.
 * Each function represents one equation from your physics textbook.
 * 
 * KEY ASSUMPTIONS:
 * - Uniform gravitational acceleration (constant g)
 * - No air resistance
 * - Motion in 2D plane (x-y)
 * - Projectile starts at ground level (y = 0)
 */

import { DEG_TO_RAD } from './constants';
import { CalculatedResults, LaunchParameters, Vector2D } from './types';

// ==========================================
// Velocity Component Calculations
// ==========================================

/**
 * Calculate the horizontal (x) component of initial velocity.
 * 
 * Formula: vₓ = v₀ × cos(θ)
 * 
 * Where:
 * - v₀ is the initial speed (magnitude of velocity)
 * - θ is the launch angle
 * 
 * The horizontal velocity stays CONSTANT throughout the motion
 * because there's no horizontal force (no air resistance).
 */
export function calculateInitialVelocityX(
  initialVelocity: number,
  angleInDegrees: number
): number {
  const angleInRadians = angleInDegrees * DEG_TO_RAD;
  return initialVelocity * Math.cos(angleInRadians);
}

/**
 * Calculate the vertical (y) component of initial velocity.
 * 
 * Formula: vᵧ = v₀ × sin(θ)
 * 
 * The vertical velocity CHANGES over time due to gravity.
 * It starts positive (upward), becomes zero at the peak,
 * then becomes negative (downward).
 */
export function calculateInitialVelocityY(
  initialVelocity: number,
  angleInDegrees: number
): number {
  const angleInRadians = angleInDegrees * DEG_TO_RAD;
  return initialVelocity * Math.sin(angleInRadians);
}

// ==========================================
// Time Calculations
// ==========================================

/**
 * Calculate the time to reach maximum height.
 * 
 * At maximum height, vertical velocity = 0
 * 
 * Using: v = v₀ - gt
 * At max height: 0 = vᵧ - g × t
 * Therefore: t = vᵧ / g
 * 
 * Where:
 * - vᵧ is the initial vertical velocity
 * - g is gravitational acceleration
 */
export function calculateTimeToMaxHeight(
  initialVelocityY: number,
  gravity: number
): number {
  return initialVelocityY / gravity;
}

/**
 * Calculate the total time of flight.
 * 
 * For a projectile that lands at the same height it started:
 * Time of flight = 2 × Time to max height
 * 
 * Formula: T = 2vᵧ / g
 * 
 * This works because the upward journey takes the same time
 * as the downward journey (symmetry of parabolic motion).
 */
export function calculateTimeOfFlight(
  initialVelocityY: number,
  gravity: number
): number {
  return (2 * initialVelocityY) / gravity;
}

// ==========================================
// Height and Range Calculations
// ==========================================

/**
 * Calculate the maximum height reached.
 * 
 * Using: v² = v₀² - 2gh
 * At max height: 0 = vᵧ² - 2gh
 * Therefore: h = vᵧ² / (2g)
 * 
 * Alternatively, using s = v₀t - ½gt²:
 * h = vᵧ × t_max - ½g × t_max²
 * 
 * Where t_max is the time to reach maximum height.
 */
export function calculateMaxHeight(
  initialVelocityY: number,
  gravity: number
): number {
  return (initialVelocityY * initialVelocityY) / (2 * gravity);
}

/**
 * Calculate the horizontal range (how far it travels).
 * 
 * Formula: R = vₓ × T
 * 
 * Where:
 * - vₓ is the horizontal velocity (constant throughout)
 * - T is the total time of flight
 * 
 * This can also be written as:
 * R = (v₀² × sin(2θ)) / g
 * 
 * This formula shows that maximum range occurs at θ = 45°
 * because sin(90°) = 1 is the maximum value.
 */
export function calculateHorizontalRange(
  initialVelocityX: number,
  timeOfFlight: number
): number {
  return initialVelocityX * timeOfFlight;
}

// ==========================================
// Position at Any Time
// ==========================================

/**
 * Calculate the position at any given time t.
 * 
 * Horizontal position: x = vₓ × t
 * (constant velocity, so simple distance = speed × time)
 * 
 * Vertical position: y = vᵧ × t - ½ × g × t²
 * (using the kinematic equation s = ut + ½at²,
 *  where a = -g because gravity acts downward)
 */
export function calculatePositionAtTime(
  initialVelocityX: number,
  initialVelocityY: number,
  gravity: number,
  time: number
): Vector2D {
  return {
    x: initialVelocityX * time,
    y: initialVelocityY * time - 0.5 * gravity * time * time,
  };
}

/**
 * Calculate the velocity at any given time t.
 * 
 * Horizontal velocity: vₓ = constant (no horizontal acceleration)
 * 
 * Vertical velocity: vᵧ = vᵧ₀ - g × t
 * (using v = u + at, where a = -g)
 */
export function calculateVelocityAtTime(
  initialVelocityX: number,
  initialVelocityY: number,
  gravity: number,
  time: number
): Vector2D {
  return {
    x: initialVelocityX, // Constant!
    y: initialVelocityY - gravity * time, // Decreases due to gravity
  };
}

/**
 * Calculate the resultant (total) velocity magnitude.
 * 
 * Formula: |v| = √(vₓ² + vᵧ²)
 * 
 * This is the Pythagorean theorem applied to velocity components.
 */
export function calculateResultantVelocity(velocity: Vector2D): number {
  return Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
}

// ==========================================
// Complete Calculation Function
// ==========================================

/**
 * Calculate all results from the launch parameters.
 * This is the main function that ties everything together.
 */
export function calculateAllResults(params: LaunchParameters): CalculatedResults {
  // Step 1: Calculate velocity components
  const initialVelocityX = calculateInitialVelocityX(
    params.initialVelocity,
    params.launchAngle
  );
  const initialVelocityY = calculateInitialVelocityY(
    params.initialVelocity,
    params.launchAngle
  );

  // Step 2: Calculate time values
  const timeToMaxHeight = calculateTimeToMaxHeight(
    initialVelocityY,
    params.gravity
  );
  const timeOfFlight = calculateTimeOfFlight(
    initialVelocityY,
    params.gravity
  );

  // Step 3: Calculate heights and distances
  const maxHeight = calculateMaxHeight(
    initialVelocityY,
    params.gravity
  );
  const horizontalRange = calculateHorizontalRange(
    initialVelocityX,
    timeOfFlight
  );

  return {
    initialVelocityX,
    initialVelocityY,
    timeToMaxHeight,
    timeOfFlight,
    maxHeight,
    horizontalRange,
  };
}
