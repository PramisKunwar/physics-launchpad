/**
 * SimulationCanvas.tsx - The main 2D visualization of projectile motion
 * 
 * This component draws:
 * - Coordinate axes with labels
 * - The projectile trajectory (parabolic path)
 * - The current position of the projectile
 * - Highlight points (launch, peak, landing)
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { Vector2D, CalculatedResults, TrajectoryData } from '../physics/types';

interface SimulationCanvasProps {
  width: number;
  height: number;
  currentPosition: Vector2D;
  trajectory: TrajectoryData;
  results: CalculatedResults;
  isActive: boolean;
  showEquations?: boolean;
}

/**
 * Padding around the canvas edges (in pixels)
 */
const PADDING = {
  left: 60,
  right: 40,
  top: 40,
  bottom: 50,
};

/**
 * Colors for drawing (using CSS variables from our design system)
 */
const COLORS = {
  axes: '#64748b',        // Slate gray
  grid: '#1e293b',        // Dark slate
  trajectory: '#06b6d4',  // Cyan (trajectory color)
  projectile: '#06b6d4',  // Cyan
  peak: '#10b981',        // Emerald (accent)
  landing: '#f59e0b',     // Amber (prediction)
  text: '#e2e8f0',        // Light gray
  velocityArrow: '#a855f7', // Purple for velocity vectors
};

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  width,
  height,
  currentPosition,
  trajectory,
  results,
  isActive,
  showEquations = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Calculate the scale factors to fit the trajectory on the canvas
   */
  const calculateScale = useCallback(() => {
    const drawWidth = width - PADDING.left - PADDING.right;
    const drawHeight = height - PADDING.top - PADDING.bottom;

    // Add some margin to the max values
    const maxX = Math.max(results.horizontalRange * 1.1, 10);
    const maxY = Math.max(results.maxHeight * 1.3, 10);

    return {
      x: drawWidth / maxX,
      y: drawHeight / maxY,
      maxX,
      maxY,
    };
  }, [width, height, results]);

  /**
   * Convert physics coordinates to canvas coordinates
   * Physics: origin at bottom-left, y increases upward
   * Canvas: origin at top-left, y increases downward
   */
  const toCanvasCoords = useCallback(
    (point: Vector2D): Vector2D => {
      const scale = calculateScale();
      return {
        x: PADDING.left + point.x * scale.x,
        y: height - PADDING.bottom - point.y * scale.y,
      };
    },
    [height, calculateScale]
  );

  /**
   * Draw the coordinate axes and grid
   */
  const drawAxes = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const scale = calculateScale();

      // Draw grid lines
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      // Vertical grid lines
      const xStep = calculateNiceStep(scale.maxX, 5);
      for (let x = xStep; x < scale.maxX; x += xStep) {
        const canvasX = PADDING.left + x * scale.x;
        ctx.beginPath();
        ctx.moveTo(canvasX, PADDING.top);
        ctx.lineTo(canvasX, height - PADDING.bottom);
        ctx.stroke();
      }

      // Horizontal grid lines
      const yStep = calculateNiceStep(scale.maxY, 5);
      for (let y = yStep; y < scale.maxY; y += yStep) {
        const canvasY = height - PADDING.bottom - y * scale.y;
        ctx.beginPath();
        ctx.moveTo(PADDING.left, canvasY);
        ctx.lineTo(width - PADDING.right, canvasY);
        ctx.stroke();
      }

      ctx.setLineDash([]);

      // Draw main axes
      ctx.strokeStyle = COLORS.axes;
      ctx.lineWidth = 2;

      // X-axis
      ctx.beginPath();
      ctx.moveTo(PADDING.left, height - PADDING.bottom);
      ctx.lineTo(width - PADDING.right, height - PADDING.bottom);
      ctx.stroke();

      // Y-axis
      ctx.beginPath();
      ctx.moveTo(PADDING.left, height - PADDING.bottom);
      ctx.lineTo(PADDING.left, PADDING.top);
      ctx.stroke();

      // Draw axis labels
      ctx.fillStyle = COLORS.text;
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';

      // X-axis labels
      for (let x = 0; x <= scale.maxX; x += xStep) {
        const canvasX = PADDING.left + x * scale.x;
        ctx.fillText(`${x.toFixed(0)}`, canvasX, height - PADDING.bottom + 20);
      }

      // Y-axis labels
      ctx.textAlign = 'right';
      for (let y = 0; y <= scale.maxY; y += yStep) {
        const canvasY = height - PADDING.bottom - y * scale.y;
        ctx.fillText(`${y.toFixed(0)}`, PADDING.left - 10, canvasY + 4);
      }

      // Axis titles
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = COLORS.text;
      ctx.textAlign = 'center';
      ctx.fillText('Horizontal Distance (m)', width / 2, height - 10);

      ctx.save();
      ctx.translate(15, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Height (m)', 0, 0);
      ctx.restore();
    },
    [width, height, calculateScale]
  );

  /**
   * Draw the trajectory path
   */
  const drawTrajectory = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (trajectory.positions.length < 2) return;

      ctx.strokeStyle = COLORS.trajectory;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();

      const firstPoint = toCanvasCoords(trajectory.positions[0]);
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < trajectory.positions.length; i++) {
        const point = toCanvasCoords(trajectory.positions[i]);
        ctx.lineTo(point.x, point.y);
      }

      ctx.stroke();

      // Draw a glow effect
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < trajectory.positions.length; i++) {
        const point = toCanvasCoords(trajectory.positions[i]);
        ctx.lineTo(point.x, point.y);
      }

      ctx.stroke();
    },
    [trajectory, toCanvasCoords]
  );

  /**
   * Draw the current projectile position
   */
  const drawProjectile = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const canvasPos = toCanvasCoords(currentPosition);

      // Outer glow
      ctx.beginPath();
      ctx.arc(canvasPos.x, canvasPos.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.fill();

      // Main circle
      ctx.beginPath();
      ctx.arc(canvasPos.x, canvasPos.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.projectile;
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(canvasPos.x - 2, canvasPos.y - 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
    },
    [currentPosition, toCanvasCoords]
  );

  /**
   * Draw highlight points (peak and landing)
   */
  const drawHighlights = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Peak point
      if (results.maxHeight > 0) {
        const peakPos = toCanvasCoords({
          x: results.horizontalRange / 2,
          y: results.maxHeight,
        });

        // Dashed line to peak
        ctx.strokeStyle = COLORS.peak;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(peakPos.x, height - PADDING.bottom);
        ctx.lineTo(peakPos.x, peakPos.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Peak marker
        ctx.beginPath();
        ctx.arc(peakPos.x, peakPos.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.peak;
        ctx.fill();

        // Label
        ctx.fillStyle = COLORS.peak;
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Peak: ${results.maxHeight.toFixed(1)}m`, peakPos.x, peakPos.y - 15);
      }

      // Landing point
      if (results.horizontalRange > 0) {
        const landingPos = toCanvasCoords({
          x: results.horizontalRange,
          y: 0,
        });

        // Landing marker
        ctx.beginPath();
        ctx.arc(landingPos.x, landingPos.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.landing;
        ctx.fill();

        // Label
        ctx.fillStyle = COLORS.landing;
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Range: ${results.horizontalRange.toFixed(1)}m`, landingPos.x, landingPos.y + 20);
      }
    },
    [height, results, toCanvasCoords]
  );

  /**
   * Main render function
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw all elements
    drawAxes(ctx);
    drawTrajectory(ctx);
    drawHighlights(ctx);
    drawProjectile(ctx);
  }, [width, height, currentPosition, trajectory, drawAxes, drawTrajectory, drawProjectile, drawHighlights]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="simulation-canvas rounded-lg"
    />
  );
};

/**
 * Calculate a "nice" step value for axis labels
 * (e.g., 1, 2, 5, 10, 20, 50, etc.)
 */
function calculateNiceStep(maxValue: number, targetSteps: number): number {
  const roughStep = maxValue / targetSteps;
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const residual = roughStep / magnitude;

  let niceStep: number;
  if (residual < 1.5) niceStep = 1;
  else if (residual < 3) niceStep = 2;
  else if (residual < 7) niceStep = 5;
  else niceStep = 10;

  return niceStep * magnitude;
}

export default SimulationCanvas;
