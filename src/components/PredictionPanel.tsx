/**
 * PredictionPanel.tsx - Student prediction input panel
 * 
 * Students enter their predictions BEFORE running the simulation.
 * This encourages scientific thinking: hypothesis → experiment → analysis.
 */

import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Predictions } from '../physics/types';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface PredictionPanelProps {
  predictions: Predictions;
  onPredictionsChange: (predictions: Predictions) => void;
  disabled?: boolean;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  predictions,
  onPredictionsChange,
  disabled = false,
}) => {
  const handleChange = (field: keyof Predictions, value: string) => {
    const numValue = parseFloat(value) || 0;
    onPredictionsChange({
      ...predictions,
      [field]: Math.max(0, numValue),
    });
  };

  return (
    <div className="lab-section space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Your Predictions</h3>
        <span className="phase-badge phase-predict">Predict</span>
      </div>

      <p className="text-sm text-muted-foreground">
        Before launching, predict the results using the kinematic equations!
      </p>

      {/* Time of Flight */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-foreground">
            Time of Flight
          </Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="tooltip-content">
              <p className="mb-2">Total time from launch to landing.</p>
              <p className="equation text-xs">T = 2v₀sin(θ) / g</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={predictions.timeOfFlight || ''}
            onChange={(e) => handleChange('timeOfFlight', e.target.value)}
            placeholder="Enter your prediction"
            disabled={disabled}
            className="lab-input"
            step={0.1}
            min={0}
          />
          <span className="mono text-sm text-muted-foreground w-8">s</span>
        </div>
      </div>

      {/* Maximum Height */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-foreground">
            Maximum Height
          </Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="tooltip-content">
              <p className="mb-2">Highest point reached by the projectile.</p>
              <p className="equation text-xs">H = (v₀sin(θ))² / 2g</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={predictions.maxHeight || ''}
            onChange={(e) => handleChange('maxHeight', e.target.value)}
            placeholder="Enter your prediction"
            disabled={disabled}
            className="lab-input"
            step={0.1}
            min={0}
          />
          <span className="mono text-sm text-muted-foreground w-8">m</span>
        </div>
      </div>

      {/* Horizontal Range */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-foreground">
            Horizontal Range
          </Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="tooltip-content">
              <p className="mb-2">Total horizontal distance traveled.</p>
              <p className="equation text-xs">R = v₀²sin(2θ) / g</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={predictions.horizontalRange || ''}
            onChange={(e) => handleChange('horizontalRange', e.target.value)}
            placeholder="Enter your prediction"
            disabled={disabled}
            className="lab-input"
            step={0.1}
            min={0}
          />
          <span className="mono text-sm text-muted-foreground w-8">m</span>
        </div>
      </div>
    </div>
  );
};

export default PredictionPanel;
