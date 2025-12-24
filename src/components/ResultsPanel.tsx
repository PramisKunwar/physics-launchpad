/**
 * ResultsPanel.tsx - Compare predictions with actual results
 * 
 * Shows the calculated (actual) values alongside student predictions.
 * Helps students understand how close their predictions were.
 */

import React from 'react';
import { CalculatedResults, Predictions, ComparisonResult } from '../physics/types';
import { CheckCircle2, XCircle, Minus } from 'lucide-react';
import { DECIMAL_PLACES } from '../physics/constants';

interface ResultsPanelProps {
  results: CalculatedResults;
  predictions: Predictions;
  simulationComplete: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  predictions,
  simulationComplete,
}) => {
  // Build comparison data
  const comparisons: ComparisonResult[] = [
    {
      label: 'Time of Flight',
      predicted: predictions.timeOfFlight,
      actual: results.timeOfFlight,
      difference: Math.abs(predictions.timeOfFlight - results.timeOfFlight),
      percentError: results.timeOfFlight > 0
        ? (Math.abs(predictions.timeOfFlight - results.timeOfFlight) / results.timeOfFlight) * 100
        : 0,
      unit: 's',
    },
    {
      label: 'Maximum Height',
      predicted: predictions.maxHeight,
      actual: results.maxHeight,
      difference: Math.abs(predictions.maxHeight - results.maxHeight),
      percentError: results.maxHeight > 0
        ? (Math.abs(predictions.maxHeight - results.maxHeight) / results.maxHeight) * 100
        : 0,
      unit: 'm',
    },
    {
      label: 'Horizontal Range',
      predicted: predictions.horizontalRange,
      actual: results.horizontalRange,
      difference: Math.abs(predictions.horizontalRange - results.horizontalRange),
      percentError: results.horizontalRange > 0
        ? (Math.abs(predictions.horizontalRange - results.horizontalRange) / results.horizontalRange) * 100
        : 0,
      unit: 'm',
    },
  ];

  const getAccuracyIcon = (percentError: number) => {
    if (percentError <= 5) return <CheckCircle2 className="w-5 h-5 text-accent" />;
    if (percentError <= 20) return <Minus className="w-5 h-5 text-prediction" />;
    return <XCircle className="w-5 h-5 text-destructive" />;
  };

  const getAccuracyLabel = (percentError: number) => {
    if (percentError <= 5) return 'Excellent!';
    if (percentError <= 10) return 'Good';
    if (percentError <= 20) return 'Close';
    return 'Try again';
  };

  return (
    <div className="lab-section space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Results Comparison</h3>
        <span className="phase-badge phase-observe">Observe</span>
      </div>

      {!simulationComplete ? (
        <p className="text-sm text-muted-foreground">
          Run the simulation to see results and compare with your predictions.
        </p>
      ) : (
        <div className="space-y-4">
          {/* Velocity Components (always shown) */}
          <div className="p-3 bg-secondary/50 rounded-lg space-y-2">
            <h4 className="text-sm font-medium text-foreground">Initial Velocity Components</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Horizontal (vₓ): </span>
                <span className="mono text-primary">{results.initialVelocityX.toFixed(DECIMAL_PLACES)} m/s</span>
              </div>
              <div>
                <span className="text-muted-foreground">Vertical (vᵧ): </span>
                <span className="mono text-primary">{results.initialVelocityY.toFixed(DECIMAL_PLACES)} m/s</span>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/70">
                <tr>
                  <th className="text-left py-2 px-3 font-medium text-foreground">Quantity</th>
                  <th className="text-right py-2 px-3 font-medium text-prediction">Predicted</th>
                  <th className="text-right py-2 px-3 font-medium text-accent">Actual</th>
                  <th className="text-right py-2 px-3 font-medium text-foreground">Error</th>
                  <th className="text-center py-2 px-3 font-medium text-foreground">Rating</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((comparison, index) => (
                  <tr 
                    key={comparison.label} 
                    className={index % 2 === 0 ? 'bg-card' : 'bg-secondary/30'}
                  >
                    <td className="py-2.5 px-3 text-foreground font-medium">{comparison.label}</td>
                    <td className="py-2.5 px-3 text-right mono text-prediction">
                      {comparison.predicted > 0 
                        ? `${comparison.predicted.toFixed(DECIMAL_PLACES)} ${comparison.unit}`
                        : '—'
                      }
                    </td>
                    <td className="py-2.5 px-3 text-right mono text-accent">
                      {comparison.actual.toFixed(DECIMAL_PLACES)} {comparison.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right mono text-muted-foreground">
                      {comparison.predicted > 0 
                        ? `${comparison.percentError.toFixed(1)}%`
                        : '—'
                      }
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {comparison.predicted > 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          {getAccuracyIcon(comparison.percentError)}
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {getAccuracyLabel(comparison.percentError)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No prediction</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Additional calculated values */}
          <div className="p-3 bg-secondary/50 rounded-lg space-y-2">
            <h4 className="text-sm font-medium text-foreground">Additional Information</h4>
            <div className="text-sm">
              <span className="text-muted-foreground">Time to reach max height: </span>
              <span className="mono text-primary">{results.timeToMaxHeight.toFixed(DECIMAL_PLACES)} s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
