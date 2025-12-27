import { DEG_TO_RAD} from './constants';
import { CalculatedResults, LaunchParameters, Vector2D} from './types';

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
    return initialVelocity * Math.sin(angleInRadians
)
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
    return (initialVelocityY * initialVelocityY) / (2 * gravity
)

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
): Vector2D{
    return{
        x:initialVelocityX,
        y: initialVelocityY - gravity * time,
    };
}

export function cal
)
)
)