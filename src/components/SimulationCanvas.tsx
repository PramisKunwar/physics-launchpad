/**
 * SimulationCanvas.tsx - Cute pastel 2D visualization of projectile motion
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

const PADDING = {
  left: 60,
  right: 40,
  top: 40,
  bottom: 70, // extra space for ground
};

const COLORS = {
  axes: '#7c8ba5',
  grid: '#d4dbe8',
  trajectory: '#e88a7a',   // coral pink
  projectile: '#e8735f',   // coral pink
  peak: '#7cc9a0',         // mint green
  landing: '#f0a050',      // soft orange
  text: '#3a4a5e',         // dark text
  textLight: '#6b7d94',
  sky1: '#d4eeff',         // sky gradient top
  sky2: '#e8f4fd',         // sky gradient bottom
  ground: '#b8e6c8',       // mint green ground
  groundDark: '#9dd4b0',
  grass: '#7cc9a0',
  cloud: 'rgba(255,255,255,0.7)',
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

  const groundY = height - PADDING.bottom;

  const calculateScale = useCallback(() => {
    const drawWidth = width - PADDING.left - PADDING.right;
    const drawHeight = height - PADDING.top - PADDING.bottom;
    const maxX = Math.max(results.horizontalRange * 1.1, 10);
    const maxY = Math.max(results.maxHeight * 1.3, 10);
    return { x: drawWidth / maxX, y: drawHeight / maxY, maxX, maxY };
  }, [width, height, results]);

  const toCanvasCoords = useCallback(
    (point: Vector2D): Vector2D => {
      const scale = calculateScale();
      return {
        x: PADDING.left + point.x * scale.x,
        y: groundY - point.y * scale.y,
      };
    },
    [groundY, calculateScale]
  );

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, COLORS.sky1);
    skyGrad.addColorStop(1, COLORS.sky2);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, groundY);

    // Clouds
    const drawCloud = (cx: number, cy: number, size: number) => {
      ctx.fillStyle = COLORS.cloud;
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.8, cy - size * 0.3, size * 0.7, 0, Math.PI * 2);
      ctx.arc(cx + size * 1.5, cy, size * 0.8, 0, Math.PI * 2);
      ctx.arc(cx - size * 0.6, cy + size * 0.1, size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCloud(width * 0.15, 50, 18);
    drawCloud(width * 0.55, 35, 22);
    drawCloud(width * 0.8, 65, 16);

    // Ground
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, groundY, width, height - groundY);

    // Grass tufts
    ctx.fillStyle = COLORS.grass;
    for (let x = 0; x < width; x += 12) {
      const h = 4 + Math.sin(x * 0.3) * 3;
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + 3, groundY - h);
      ctx.lineTo(x + 6, groundY);
      ctx.fill();
    }
  }, [width, height, groundY]);

  const drawAxes = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const scale = calculateScale();

      // Grid lines
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      const xStep = calculateNiceStep(scale.maxX, 5);
      for (let x = xStep; x < scale.maxX; x += xStep) {
        const canvasX = PADDING.left + x * scale.x;
        ctx.beginPath();
        ctx.moveTo(canvasX, PADDING.top);
        ctx.lineTo(canvasX, groundY);
        ctx.stroke();
      }

      const yStep = calculateNiceStep(scale.maxY, 5);
      for (let y = yStep; y < scale.maxY; y += yStep) {
        const canvasY = groundY - y * scale.y;
        ctx.beginPath();
        ctx.moveTo(PADDING.left, canvasY);
        ctx.lineTo(width - PADDING.right, canvasY);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Main axes
      ctx.strokeStyle = COLORS.axes;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(PADDING.left, groundY);
      ctx.lineTo(width - PADDING.right, groundY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(PADDING.left, groundY);
      ctx.lineTo(PADDING.left, PADDING.top);
      ctx.stroke();

      // Labels
      ctx.fillStyle = COLORS.textLight;
      ctx.font = "600 11px 'Nunito', sans-serif";
      ctx.textAlign = 'center';
      for (let x = 0; x <= scale.maxX; x += xStep) {
        ctx.fillText(`${x.toFixed(0)}`, PADDING.left + x * scale.x, groundY + 18);
      }
      ctx.textAlign = 'right';
      for (let y = 0; y <= scale.maxY; y += yStep) {
        ctx.fillText(`${y.toFixed(0)}`, PADDING.left - 10, groundY - y * scale.y + 4);
      }

      // Axis titles
      ctx.font = "700 13px 'Nunito', sans-serif";
      ctx.fillStyle = COLORS.text;
      ctx.textAlign = 'center';
      ctx.fillText('Distance (m)', width / 2, height - 8);
      ctx.save();
      ctx.translate(15, height / 2 - 20);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Height (m)', 0, 0);
      ctx.restore();
    },
    [width, height, groundY, calculateScale]
  );

  const drawTrajectory = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (trajectory.positions.length < 2) return;

      // Trajectory trail with dashes
      ctx.strokeStyle = COLORS.trajectory;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.lineCap = 'round';
      ctx.beginPath();
      const first = toCanvasCoords(trajectory.positions[0]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < trajectory.positions.length; i++) {
        const p = toCanvasCoords(trajectory.positions[i]);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Soft glow
      ctx.strokeStyle = 'rgba(232, 115, 95, 0.2)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < trajectory.positions.length; i++) {
        const p = toCanvasCoords(trajectory.positions[i]);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    },
    [trajectory, toCanvasCoords]
  );

  const drawProjectile = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const pos = toCanvasCoords(currentPosition);

      // Outer glow
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232, 115, 95, 0.2)';
      ctx.fill();

      // Main circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(pos.x - 3, pos.y - 3, 1, pos.x, pos.y, 10);
      grad.addColorStop(0, '#f7a99d');
      grad.addColorStop(1, COLORS.projectile);
      ctx.fillStyle = grad;
      ctx.fill();

      // Highlight
      ctx.beginPath();
      ctx.arc(pos.x - 3, pos.y - 3, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();

      // Dynamic label following projectile
      if (isActive || currentPosition.x > 0 || currentPosition.y > 0) {
        const speed = Math.sqrt(
          (trajectory.velocities.length > 0 ? trajectory.velocities[trajectory.velocities.length - 1]?.x || 0 : 0) ** 2 +
          (trajectory.velocities.length > 0 ? trajectory.velocities[trajectory.velocities.length - 1]?.y || 0 : 0) ** 2
        );

        const labelX = pos.x + 18;
        const labelY = pos.y - 20;

        // Label background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.strokeStyle = 'rgba(200, 200, 220, 0.5)';
        ctx.lineWidth = 1;
        const labelW = 110;
        const labelH = 34;
        const r = 8;
        ctx.beginPath();
        ctx.moveTo(labelX + r, labelY);
        ctx.lineTo(labelX + labelW - r, labelY);
        ctx.arcTo(labelX + labelW, labelY, labelX + labelW, labelY + r, r);
        ctx.lineTo(labelX + labelW, labelY + labelH - r);
        ctx.arcTo(labelX + labelW, labelY + labelH, labelX + labelW - r, labelY + labelH, r);
        ctx.lineTo(labelX + r, labelY + labelH);
        ctx.arcTo(labelX, labelY + labelH, labelX, labelY + labelH - r, r);
        ctx.lineTo(labelX, labelY + r);
        ctx.arcTo(labelX, labelY, labelX + r, labelY, r);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.font = "600 10px 'JetBrains Mono', monospace";
        ctx.fillStyle = COLORS.text;
        ctx.textAlign = 'left';
        ctx.fillText(`h: ${currentPosition.y.toFixed(1)} m`, labelX + 8, labelY + 14);
        ctx.fillText(`v: ${speed.toFixed(1)} m/s`, labelX + 8, labelY + 28);
      }
    },
    [currentPosition, toCanvasCoords, isActive, trajectory]
  );

  const drawHighlights = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Peak point
      if (results.maxHeight > 0) {
        const peakPos = toCanvasCoords({
          x: results.horizontalRange / 2,
          y: results.maxHeight,
        });

        ctx.strokeStyle = COLORS.peak;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(peakPos.x, groundY);
        ctx.lineTo(peakPos.x, peakPos.y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(peakPos.x, peakPos.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.peak;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(peakPos.x, peakPos.y, 7, 0, Math.PI * 2);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = COLORS.peak;
        ctx.font = "700 11px 'Nunito', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText(`Peak: ${results.maxHeight.toFixed(1)}m`, peakPos.x, peakPos.y - 14);
      }

      // Landing point
      if (results.horizontalRange > 0) {
        const landingPos = toCanvasCoords({
          x: results.horizontalRange,
          y: 0,
        });

        ctx.beginPath();
        ctx.arc(landingPos.x, landingPos.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.landing;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(landingPos.x, landingPos.y, 7, 0, Math.PI * 2);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = COLORS.landing;
        ctx.font = "700 11px 'Nunito', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText(`Range: ${results.horizontalRange.toFixed(1)}m`, landingPos.x, landingPos.y + 22);
      }
    },
    [groundY, results, toCanvasCoords]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    drawBackground(ctx);
    drawAxes(ctx);
    drawTrajectory(ctx);
    drawHighlights(ctx);
    drawProjectile(ctx);
  }, [width, height, currentPosition, trajectory, drawBackground, drawAxes, drawTrajectory, drawProjectile, drawHighlights]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="simulation-canvas rounded-xl"
    />
  );
};

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
