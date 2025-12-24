/**
 * EquationsPanel.tsx - Display kinematic equations used in the simulation
 * 
 * Togglable panel showing the physics formulas for reference.
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Button } from './ui/button';

export const EquationsPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const equations = [
    {
      name: 'Velocity Components',
      formulas: [
        'vₓ = v₀ cos(θ)',
        'vᵧ = v₀ sin(θ)',
      ],
      description: 'Horizontal and vertical components of initial velocity',
    },
    {
      name: 'Position at Time t',
      formulas: [
        'x = vₓ × t',
        'y = vᵧ × t − ½gt²',
      ],
      description: 'Displacement equations',
    },
    {
      name: 'Velocity at Time t',
      formulas: [
        'vₓ(t) = vₓ (constant)',
        'vᵧ(t) = vᵧ − gt',
      ],
      description: 'Velocity changes only in vertical direction',
    },
    {
      name: 'Key Results',
      formulas: [
        'Time of flight: T = 2vᵧ/g',
        'Max height: H = vᵧ²/(2g)',
        'Range: R = vₓ × T',
      ],
      description: 'Important quantities derived from equations',
    },
  ];

  return (
    <div className="lab-section">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
      >
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Kinematic Equations Reference
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </Button>

      {isExpanded && (
        <div className="mt-4 grid sm:grid-cols-2 gap-4 animate-fade-in">
          {equations.map((eq) => (
            <div key={eq.name} className="p-4 bg-secondary/50 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-2">{eq.name}</h4>
              <div className="space-y-1">
                {eq.formulas.map((formula, index) => (
                  <p key={index} className="equation text-sm">{formula}</p>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{eq.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquationsPanel;
