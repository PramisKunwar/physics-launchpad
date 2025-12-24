/**
 * types.ts - Type definitions for the physics simulation
 * 
 * This file defines the data structures used throughout the lab.
 * Think of these as templates that describe what information we need.
 */

/**
 * A 2D vector represents a quantity with both magnitude and direction.
 * In projectile motion, we use vectors for:
 * - Position (where the projectile is)
 * - Velocity (how fast and in what direction it's moving)
 * - Acceleration (how the velocity is changing)
 */
export interface Vector2D {
  x: number; // Horizontal component (meters or m/s)
  y: number; // Vertical component (meters or m/s)
}

/**
 * Initial conditions set by the student before launching.
 * These determine the entire trajectory of the projectile.
 */
export interface LaunchParameters {
  initialVelocity: number;    // Speed at launch (m/s)
  launchAngle: number;        // Angle above horizontal (degrees)
  gravity: number;            // Gravitational acceleration (m/s²)
}

/**
 * Student predictions for the projectile motion.
 * Students enter these BEFORE running the simulation.
 */
export interface Predictions {
  timeOfFlight: number;       // How long until it lands (seconds)
  maxHeight: number;          // Highest point reached (meters)
  horizontalRange: number;    // How far it travels horizontally (meters)
}

/**
 * Calculated results from the physics equations.
 * These are the "actual" values computed from the equations of motion.
 */
export interface CalculatedResults {
  // Velocity components at launch
  initialVelocityX: number;   // Horizontal velocity component (m/s)
  initialVelocityY: number;   // Vertical velocity component (m/s)
  
  // Key time values
  timeToMaxHeight: number;    // Time to reach peak (seconds)
  timeOfFlight: number;       // Total flight time (seconds)
  
  // Key distances
  maxHeight: number;          // Maximum height (meters)
  horizontalRange: number;    // Total horizontal distance (meters)
}

/**
 * The current state of the projectile at any instant.
 * Updated every frame during the simulation.
 */
export interface ProjectileState {
  position: Vector2D;         // Current position (meters)
  velocity: Vector2D;         // Current velocity (m/s)
  time: number;               // Time since launch (seconds)
  isActive: boolean;          // Is the simulation running?
}

/**
 * Comparison between predicted and actual values.
 * Shows students how close their predictions were.
 */
export interface ComparisonResult {
  label: string;              // What we're comparing
  predicted: number;          // Student's prediction
  actual: number;             // Calculated value
  difference: number;         // How far off (absolute)
  percentError: number;       // Percentage difference
  unit: string;               // Unit of measurement
}

/**
 * A single data point for graphing.
 * Used to build displacement-time and velocity-time graphs.
 */
export interface DataPoint {
  time: number;               // x-axis value (seconds)
  value: number;              // y-axis value (varies by graph type)
}

/**
 * Complete trajectory data for graphing and replay.
 * Stores the history of the projectile's motion.
 */
export interface TrajectoryData {
  positions: Vector2D[];      // All positions
  velocities: Vector2D[];     // All velocities
  times: number[];            // Time stamps
}

/**
 * Highlight points on the trajectory.
 * Used to mark important moments in the motion.
 */
export interface HighlightPoint {
  position: Vector2D;
  label: string;
  type: 'launch' | 'peak' | 'landing';
}
