/**
 * useSimulation.ts - Custom hook for managing the projectile simulation
 * 
 * This hook handles:
 * - Animation loop (updating position over time)
 * - Trajectory data collection
 * - Simulation state (playing, paused, reset)
 */

import { useCallback, useRef, useState } from 'react';
import {
  calculatePositionAtTime,
  calculateVelocityAtTime,
  calculateAllResults,
} from '../physics/equations';
import { TIME_STEP } from '../physics/constants';
import {
  LaunchParameters,
  ProjectileState,
  Vector2D,
  CalculatedResults,
  TrajectoryData,
} from '../physics/types';

interface UseSimulationProps {
  params: LaunchParameters;
  onUpdate?: (state: ProjectileState) => void;
  onComplete?: () => void;
}

interface UseSimulationReturn {
  state: ProjectileState;
  results: CalculatedResults;
  trajectory: TrajectoryData;
  isPlaying: boolean;
  isPaused: boolean;
  play: () => void;
  pause: () => void;
  reset: () => void;
  progress: number; // 0 to 1, how far through the flight
}

/**
 * Initial state when simulation hasn't started yet
 */
const createInitialState = (): ProjectileState => ({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  time: 0,
  isActive: false,
});

/**
 * Main simulation hook
 */
export function useSimulation({
  params,
  onUpdate,
  onComplete,
}: UseSimulationProps): UseSimulationReturn {
  // Calculate all results from current parameters
  const results = calculateAllResults(params);

  // Current state of the projectile
  const [state, setState] = useState<ProjectileState>(createInitialState());

  // Simulation control flags
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Trajectory history for drawing the path
  const [trajectory, setTrajectory] = useState<TrajectoryData>({
    positions: [],
    velocities: [],
    times: [],
  });

  // Reference to animation frame ID (for cleanup)
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const simulationTimeRef = useRef<number>(0);

  /**
   * Update the simulation by one time step
   */
  const updateSimulation = useCallback(() => {
    const currentTime = simulationTimeRef.current;

    // Check if projectile has landed (y < 0 after going up)
    if (currentTime > results.timeOfFlight) {
      // Simulation complete - set final position
      const finalState: ProjectileState = {
        position: { x: results.horizontalRange, y: 0 },
        velocity: {
          x: results.initialVelocityX,
          y: -results.initialVelocityY, // Same magnitude, opposite direction
        },
        time: results.timeOfFlight,
        isActive: false,
      };

      setState(finalState);
      setIsPlaying(false);

      // Add final point to trajectory
      setTrajectory((prev) => ({
        positions: [...prev.positions, finalState.position],
        velocities: [...prev.velocities, finalState.velocity],
        times: [...prev.times, finalState.time],
      }));

      onComplete?.();
      return;
    }

    // Calculate current position and velocity
    const position = calculatePositionAtTime(
      results.initialVelocityX,
      results.initialVelocityY,
      params.gravity,
      currentTime
    );

    const velocity = calculateVelocityAtTime(
      results.initialVelocityX,
      results.initialVelocityY,
      params.gravity,
      currentTime
    );

    // Create new state
    const newState: ProjectileState = {
      position,
      velocity,
      time: currentTime,
      isActive: true,
    };

    setState(newState);

    // Add to trajectory
    setTrajectory((prev) => ({
      positions: [...prev.positions, position],
      velocities: [...prev.velocities, velocity],
      times: [...prev.times, currentTime],
    }));

    onUpdate?.(newState);

    // Advance time
    simulationTimeRef.current += TIME_STEP;

    // Continue animation
    animationRef.current = requestAnimationFrame(updateSimulation);
  }, [params, results, onUpdate, onComplete]);

  /**
   * Start or resume the simulation
   */
  const play = useCallback(() => {
    if (isPlaying) return;

    setIsPlaying(true);
    setIsPaused(false);

    // If starting fresh, reset trajectory
    if (simulationTimeRef.current === 0) {
      setTrajectory({
        positions: [{ x: 0, y: 0 }],
        velocities: [{ x: results.initialVelocityX, y: results.initialVelocityY }],
        times: [0],
      });
    }

    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(updateSimulation);
  }, [isPlaying, results, updateSimulation]);

  /**
   * Pause the simulation
   */
  const pause = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  /**
   * Reset the simulation to initial state
   */
  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    simulationTimeRef.current = 0;
    lastTimeRef.current = 0;

    setState(createInitialState());
    setTrajectory({ positions: [], velocities: [], times: [] });
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  // Calculate progress (0 to 1)
  const progress = results.timeOfFlight > 0
    ? Math.min(state.time / results.timeOfFlight, 1)
    : 0;

  return {
    state,
    results,
    trajectory,
    isPlaying,
    isPaused,
    play,
    pause,
    reset,
    progress,
  };
}
