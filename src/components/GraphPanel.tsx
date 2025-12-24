/**
 * GraphPanel.tsx - Container for displacement-time and velocity-time graphs
 * 
 * Displays the motion graphs side by side with educational annotations.
 */

import React, { useMemo } from 'react';
import Graph from './Graph';
import { TrajectoryData, CalculatedResults, DataPoint } from '../physics/types';

interface GraphPanelProps {
  trajectory: TrajectoryData;
  results: CalculatedResults;
}

export const GraphPanel: React.FC<GraphPanelProps> = ({
  trajectory,
  results,
}) => {
  // Convert trajectory data to graph data points
  const displacementData = useMemo(() => {
    const xData: DataPoint[] = trajectory.times.map((time, i) => ({
      time,
      value: trajectory.positions[i]?.x || 0,
    }));

    const yData: DataPoint[] = trajectory.times.map((time, i) => ({
      time,
      value: trajectory.positions[i]?.y || 0,
    }));

    return { xData, yData };
  }, [trajectory]);

  const velocityData = useMemo(() => {
    const vxData: DataPoint[] = trajectory.times.map((time, i) => ({
      time,
      value: trajectory.velocities[i]?.x || 0,
    }));

    const vyData: DataPoint[] = trajectory.times.map((time, i) => ({
      time,
      value: trajectory.velocities[i]?.y || 0,
    }));

    return { vxData, vyData };
  }, [trajectory]);

  const hasData = trajectory.times.length > 0;
  const maxTime = Math.max(results.timeOfFlight * 1.1, 1);

  return (
    <div className="lab-section space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Motion Graphs</h3>
        <span className="phase-badge phase-observe">Observe</span>
      </div>

      <p className="text-sm text-muted-foreground">
        These graphs help visualize how position and velocity change over time.
      </p>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Displacement-Time Graph */}
        <div className="space-y-2">
          <Graph
            title="Displacement vs Time"
            lines={[
              { data: displacementData.xData, color: '#3b82f6', label: 'x (horizontal)' },
              { data: displacementData.yData, color: '#10b981', label: 'y (vertical)' },
            ]}
            xLabel="Time (s)"
            yLabel="Displacement (m)"
            width={380}
            height={220}
            maxX={maxTime}
            maxY={Math.max(results.horizontalRange, results.maxHeight) * 1.2}
          />
          <p className="text-xs text-muted-foreground text-center">
            💡 Slope of displacement graph = velocity
          </p>
        </div>

        {/* Velocity-Time Graph */}
        <div className="space-y-2">
          <Graph
            title="Velocity vs Time"
            lines={[
              { data: velocityData.vxData, color: '#a855f7', label: 'vₓ (horizontal)' },
              { data: velocityData.vyData, color: '#f59e0b', label: 'vᵧ (vertical)' },
            ]}
            xLabel="Time (s)"
            yLabel="Velocity (m/s)"
            width={380}
            height={220}
            maxX={maxTime}
            maxY={Math.max(results.initialVelocityX, results.initialVelocityY) * 1.3}
            minY={-results.initialVelocityY * 1.3}
          />
          <p className="text-xs text-muted-foreground text-center">
            💡 Slope of velocity graph = acceleration • Area under graph = displacement
          </p>
        </div>
      </div>

      {!hasData && (
        <div className="text-center py-8 text-muted-foreground">
          Launch the projectile to see the graphs
        </div>
      )}
    </div>
  );
};

export default GraphPanel;
