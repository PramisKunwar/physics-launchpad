import { DEG_TO_RAD } from './constants';
import { CalculatedResults, LaunchParameters, Vector2D } from './types';


export function calculateInitialVelocityX(
  initialVelocity: number,
  angleInDegrees: number
): number {
  const angleInRadians = angleInDegrees * DEG_TO_RAD;
  return initialVelocity * Math.cos(angleInRadians);
}


export function calculateInitialVelocityY(
  initialVelocity: number,
  angleInDegrees: number
): number {
  const angleInRadians = angleInDegrees * DEG_TO_RAD;
  return initialVelocity * Math.sin(angleInRadians);
}


export function calculateTimeToMaxHeight(
  initialVelocityY: number,
  gravity: number
): number {
  return initialVelocityY / gravity;
}


export function calculateTimeOfFlight(
  initialVelocityY: number,
  gravity: number
): number {
  return (2 * initialVelocityY) / gravity;
}


export function calculateMaxHeight(
  initialVelocityY: number,
  gravity: number
): number {
  return (initialVelocityY * initialVelocityY) / (2 * gravity);
}


export function calculateHorizontalRange(
  initialVelocityX: number,
  timeOfFlight: number
): number {
  return initialVelocityX * timeOfFlight;
}


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


export function calculateResultantVelocity(velocity: Vector2D): number {
  return Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
}


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