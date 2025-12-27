export interface Vector2D {
    x: number;
    y: number;
}

export interface LaunchParameters {
    initialVelocity: number;
    launchangle: number;
    gravity: number;
}
export interface Predictions{
    timeOfFlight: number;
    maxHeight: number;
    horizontalRange: number;
}
export interface CalculatedResults {
    initialVelocityX: number;
    initialVelocityY: number;
    timeToMaxHeight: number;
    timeOfFlight: number;
    maxHeight: number;
    horizontalRange: number;
}

export interface ProjectileState{
    position: Vector2D;
    velocity: Vector2D;
    time: number;
    isActive: boolean;
}

export interface ComparisonResult{
    label: string;
    predicted: number;
    actual: number;
    difference: number;
    percentageError: number;
    unit: string;
}

export interface DataPoint{
    time: number;
    value: number;
}

export interface TrajectoryData{
    position:Vector2D[];
    velocities:Vector2D[];
    time:number[];
}

export interface HighlightPoint{
    position:Vector2D;
    label:string;
    type: 'launch' | 'peak' |'landing';
}