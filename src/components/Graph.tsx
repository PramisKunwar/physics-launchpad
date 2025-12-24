/**
 * Graph.tsx - Reusable graph component for physics visualization
 * 
 * Used for:
 * - Displacement-time graphs (x vs t, y vs t)
 * - Velocity-time graphs (vx vs t, vy vs t)
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { DataPoint } from '../physics/types';

interface GraphLine {
  data: DataPoint[];
  color: string;
  label: string;
}

interface GraphProps {
  title: string;
  lines: GraphLine[];
  xLabel: string;
  yLabel: string;
  width: number;
  height: number;
  maxX?: number;
  maxY?: number;
  minY?: number;
}

const PADDING = {
  left: 50,
  right: 20,
  top: 30,
  bottom: 40,
};

export const Graph: React.FC<GraphProps> = ({
  title,
  lines,
  xLabel,
  yLabel,
  width,
  height,
  maxX,
  maxY,
  minY = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate data bounds
    let dataMaxX = maxX || 1;
    let dataMaxY = maxY || 1;
    let dataMinY = minY;

    if (!maxX || !maxY) {
      lines.forEach((line) => {
        line.data.forEach((point) => {
          if (!maxX && point.time > dataMaxX) dataMaxX = point.time;
          if (!maxY && point.value > dataMaxY) dataMaxY = point.value;
          if (point.value < dataMinY) dataMinY = point.value;
        });
      });
    }

    // Add margins
    dataMaxX *= 1.1;
    dataMaxY *= 1.2;
    if (dataMinY < 0) dataMinY *= 1.2;

    const drawWidth = width - PADDING.left - PADDING.right;
    const drawHeight = height - PADDING.top - PADDING.bottom;

    const scaleX = drawWidth / dataMaxX;
    const yRange = dataMaxY - dataMinY;
    const scaleY = drawHeight / yRange;

    const toCanvasX = (x: number) => PADDING.left + x * scaleX;
    const toCanvasY = (y: number) => height - PADDING.bottom - (y - dataMinY) * scaleY;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    const xStep = calculateNiceStep(dataMaxX, 5);
    for (let x = xStep; x < dataMaxX; x += xStep) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, PADDING.top);
      ctx.lineTo(cx, height - PADDING.bottom);
      ctx.stroke();
    }

    const yStep = calculateNiceStep(yRange, 4);
    const yStart = Math.ceil(dataMinY / yStep) * yStep;
    for (let y = yStart; y <= dataMaxY; y += yStep) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(PADDING.left, cy);
      ctx.lineTo(width - PADDING.right, cy);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;

    // X-axis (at y = 0 if visible, otherwise at bottom)
    const xAxisY = dataMinY < 0 && dataMaxY > 0 ? toCanvasY(0) : height - PADDING.bottom;
    ctx.beginPath();
    ctx.moveTo(PADDING.left, xAxisY);
    ctx.lineTo(width - PADDING.right, xAxisY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(PADDING.left, PADDING.top);
    ctx.lineTo(PADDING.left, height - PADDING.bottom);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';

    for (let x = 0; x <= dataMaxX; x += xStep) {
      ctx.fillText(x.toFixed(1), toCanvasX(x), height - PADDING.bottom + 15);
    }

    ctx.textAlign = 'right';
    for (let y = yStart; y <= dataMaxY; y += yStep) {
      ctx.fillText(y.toFixed(1), PADDING.left - 8, toCanvasY(y) + 4);
    }

    // Axis titles
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, width / 2, height - 5);

    ctx.save();
    ctx.translate(12, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 18);

    // Draw lines
    lines.forEach((line) => {
      if (line.data.length < 2) return;

      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const firstPoint = line.data[0];
      ctx.moveTo(toCanvasX(firstPoint.time), toCanvasY(firstPoint.value));

      for (let i = 1; i < line.data.length; i++) {
        const point = line.data[i];
        ctx.lineTo(toCanvasX(point.time), toCanvasY(point.value));
      }

      ctx.stroke();
    });

    // Legend
    const legendY = PADDING.top + 10;
    let legendX = width - PADDING.right - 10;
    ctx.textAlign = 'right';
    ctx.font = '10px Inter, sans-serif';

    lines.forEach((line, index) => {
      const textWidth = ctx.measureText(line.label).width;
      ctx.fillStyle = line.color;
      ctx.fillRect(legendX - textWidth - 20, legendY + index * 16 - 8, 12, 12);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(line.label, legendX, legendY + index * 16);
    });
  }, [title, lines, xLabel, yLabel, width, height, maxX, maxY, minY]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg border border-border"
    />
  );
};

function calculateNiceStep(maxValue: number, targetSteps: number): number {
  if (maxValue <= 0) return 1;
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

export default Graph;
