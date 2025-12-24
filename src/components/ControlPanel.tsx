/**
 * ControlPanel.tsx - Input controls for the simulation
 * 
 * Handles:
 * - Initial velocity input
 * - Launch angle input
 * - Gravity input
 * - Start/Pause/Reset buttons
 */

import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { LIMITS, DEFAULT_INITIAL_VELOCITY, DEFAULT_LAUNCH_ANGLE, STANDARD_GRAVITY } from '../physics/constants';
import { LaunchParameters } from '../physics/types';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ControlPanelProps {
  params: LaunchParameters;
  onParamsChange: (params: LaunchParameters) => void;
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  onParamsChange,
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onReset,
  disabled = false,
}) => {
  const handleVelocityChange = (value: number) => {
    onParamsChange({
      ...params,
      initialVelocity: Math.max(LIMITS.velocity.min, Math.min(LIMITS.velocity.max, value)),
    });
  };

  const handleAngleChange = (value: number) => {
    onParamsChange({
      ...params,
      launchAngle: Math.max(LIMITS.angle.min, Math.min(LIMITS.angle.max, value)),
    });
  };

  const handleGravityChange = (value: number) => {
    onParamsChange({
      ...params,
      gravity: Math.max(LIMITS.gravity.min, Math.min(LIMITS.gravity.max, value)),
    });
  };

  return (
    <div className="lab-section space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Launch Parameters</h3>
        <span className="phase-badge phase-simulate">Simulate</span>
      </div>

      {/* Initial Velocity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label className="text-sm font-medium text-foreground cursor-help">
                Initial Velocity (v₀)
              </Label>
            </TooltipTrigger>
            <TooltipContent className="tooltip-content">
              <p>The speed at which the projectile is launched. Higher velocity = farther range.</p>
            </TooltipContent>
          </Tooltip>
          <span className="mono text-sm text-primary">{params.initialVelocity.toFixed(1)} m/s</span>
        </div>
        <div className="flex gap-3 items-center">
          <Slider
            value={[params.initialVelocity]}
            onValueChange={([value]) => handleVelocityChange(value)}
            min={LIMITS.velocity.min}
            max={LIMITS.velocity.max}
            step={0.5}
            disabled={disabled || isPlaying}
            className="flex-1"
          />
          <Input
            type="number"
            value={params.initialVelocity}
            onChange={(e) => handleVelocityChange(parseFloat(e.target.value) || DEFAULT_INITIAL_VELOCITY)}
            min={LIMITS.velocity.min}
            max={LIMITS.velocity.max}
            step={0.5}
            disabled={disabled || isPlaying}
            className="w-20 lab-input text-center"
          />
        </div>
      </div>

      {/* Launch Angle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label className="text-sm font-medium text-foreground cursor-help">
                Launch Angle (θ)
              </Label>
            </TooltipTrigger>
            <TooltipContent className="tooltip-content">
              <p>The angle above horizontal at launch. 45° gives maximum range for a given speed.</p>
            </TooltipContent>
          </Tooltip>
          <span className="mono text-sm text-primary">{params.launchAngle.toFixed(1)}°</span>
        </div>
        <div className="flex gap-3 items-center">
          <Slider
            value={[params.launchAngle]}
            onValueChange={([value]) => handleAngleChange(value)}
            min={LIMITS.angle.min}
            max={LIMITS.angle.max}
            step={1}
            disabled={disabled || isPlaying}
            className="flex-1"
          />
          <Input
            type="number"
            value={params.launchAngle}
            onChange={(e) => handleAngleChange(parseFloat(e.target.value) || DEFAULT_LAUNCH_ANGLE)}
            min={LIMITS.angle.min}
            max={LIMITS.angle.max}
            step={1}
            disabled={disabled || isPlaying}
            className="w-20 lab-input text-center"
          />
        </div>
      </div>

      {/* Gravity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label className="text-sm font-medium text-foreground cursor-help">
                Gravity (g)
              </Label>
            </TooltipTrigger>
            <TooltipContent className="tooltip-content">
              <p>Gravitational acceleration. Earth's value is 9.8 m/s². Try other values to simulate different planets!</p>
            </TooltipContent>
          </Tooltip>
          <span className="mono text-sm text-primary">{params.gravity.toFixed(1)} m/s²</span>
        </div>
        <div className="flex gap-3 items-center">
          <Slider
            value={[params.gravity]}
            onValueChange={([value]) => handleGravityChange(value)}
            min={LIMITS.gravity.min}
            max={LIMITS.gravity.max}
            step={0.1}
            disabled={disabled || isPlaying}
            className="flex-1"
          />
          <Input
            type="number"
            value={params.gravity}
            onChange={(e) => handleGravityChange(parseFloat(e.target.value) || STANDARD_GRAVITY)}
            min={LIMITS.gravity.min}
            max={LIMITS.gravity.max}
            step={0.1}
            disabled={disabled || isPlaying}
            className="w-20 lab-input text-center"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        {!isPlaying ? (
          <Button
            onClick={onPlay}
            disabled={disabled}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Play className="w-4 h-4 mr-2" />
            {isPaused ? 'Resume' : 'Launch'}
          </Button>
        ) : (
          <Button
            onClick={onPause}
            variant="secondary"
            className="flex-1"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
