/**
 * AimSection.tsx - Displays the aim of the experiment
 * 
 * This component shows students what they will learn
 * and what the experiment is about.
 */

import React from 'react';
import { Target, BookOpen, Lightbulb } from 'lucide-react';

export const AimSection: React.FC = () => {
  return (
    <div className="lab-section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Aim of the Experiment
        </h2>
        <span className="phase-badge phase-aim">Aim</span>
      </div>

      <div className="space-y-4">
        <p className="text-foreground leading-relaxed">
          To study the motion of a projectile under uniform gravitational acceleration 
          and verify the kinematic equations for projectile motion.
        </p>

        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div className="flex gap-3 p-3 bg-secondary/50 rounded-lg">
            <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Key Concepts</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Uniform acceleration due to gravity</li>
                <li>• Independent horizontal and vertical motion</li>
                <li>• Parabolic trajectory of projectiles</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-secondary/50 rounded-lg">
            <Lightbulb className="w-5 h-5 text-prediction flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Assumptions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• No air resistance</li>
                <li>• Constant gravitational acceleration</li>
                <li>• Motion in 2D plane only</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AimSection;
