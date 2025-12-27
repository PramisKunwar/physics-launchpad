/**
 * Index.tsx - Projectile Motion Virtual Lab
 * 
 * Main page that assembles all components following the learning flow:
 * 1. Aim - What we're studying
 * 2. Predict - Student enters predictions
 * 3. Simulate - Run the animation
 * 4. Observe - Compare results
 */

import React, { useState, useCallback } from 'react';
import { Rocket } from 'lucide-react';
import { AimSection } from '../components/AimSection';
import { ControlPanel } from '../components/ControlPanel';
import { PredictionPanel } from '../components/PredictionPanel';
import { SimulationCanvas } from '../components/SimulationCanvas';
import { ResultsPanel } from '../components/ResultsPanel';
import { GraphPanel } from '../components/GraphPanel';
import { EquationsPanel } from '../components/EquationsPanel';
import { useSimulation } from '../hooks/useSimulation';
import {
  DEFAULT_INITIAL_VELOCITY,
  DEFAULT_LAUNCH_ANGLE,
  STANDARD_GRAVITY,
} from '../physics/constants';
import { LaunchParameters, Predictions } from '../physics/types';

const Index: React.FC = () => {
  // Launch parameters (controlled by sliders/inputs)
  const [params, setParams] = useState<LaunchParameters>({
    initialVelocity: DEFAULT_INITIAL_VELOCITY,
    launchAngle: DEFAULT_LAUNCH_ANGLE,
    gravity: STANDARD_GRAVITY,
  });

  // Student predictions
  const [predictions, setPredictions] = useState<Predictions>({
    timeOfFlight: 0,
    maxHeight: 0,
    horizontalRange: 0,
  });

  // Track if simulation has been completed at least once
  const [simulationComplete, setSimulationComplete] = useState(false);

  // Simulation hook
  const {
    state,
    results,
    trajectory,
    isPlaying,
    isPaused,
    play,
    pause,
    reset,
    progress,
  } = useSimulation({
    params,
    onComplete: () => setSimulationComplete(true),
  });

  // Reset handler - also reset completion state
  const handleReset = useCallback(() => {
    reset();
    setSimulationComplete(false);
  }, [reset]);

  // Canvas dimensions (responsive)
  const canvasWidth = 720;
  const canvasHeight = 380;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Physics LaunchPad</h1>
              <p className="text-sm text-muted-foreground">Projectile Motion Virtual Lab</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Aim Section */}
        <AimSection />

        {/* Equations Reference (Collapsible) */}
        <EquationsPanel />

        {/* Main Lab Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Controls & Predictions */}
          <div className="space-y-6">
            <PredictionPanel
              predictions={predictions}
              onPredictionsChange={setPredictions}
              disabled={isPlaying}
            />
            <ControlPanel
              params={params}
              onParamsChange={setParams}
              isPlaying={isPlaying}
              isPaused={isPaused}
              onPlay={play}
              onPause={pause}
              onReset={handleReset}
            />
          </div>

          {/* Center/Right - Simulation & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Simulation Canvas */}
            <div className="lab-section">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Simulation</h3>
                <div className="flex items-center gap-3">
                  {isPlaying && (
                    <span className="text-sm mono text-trajectory">
                      t = {state.time.toFixed(2)}s
                    </span>
                  )}
                  {/* Progress bar */}
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-trajectory transition-all duration-100"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <SimulationCanvas
                width={canvasWidth}
                height={canvasHeight}
                currentPosition={state.position}
                trajectory={trajectory}
                results={results}
                isActive={state.isActive}
              />

              {/* Current state display */}
              {(isPlaying || isPaused || simulationComplete) && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Position X</p>
                    <p className="mono text-sm text-foreground">{state.position.x.toFixed(2)} m</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Position Y</p>
                    <p className="mono text-sm text-foreground">{state.position.y.toFixed(2)} m</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Velocity X</p>
                    <p className="mono text-sm text-foreground">{state.velocity.x.toFixed(2)} m/s</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Velocity Y</p>
                    <p className="mono text-sm text-foreground">{state.velocity.y.toFixed(2)} m/s</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <ResultsPanel
              results={results}
              predictions={predictions}
              simulationComplete={simulationComplete}
            />
          </div>
        </div>

        {/* Graphs Section */}
        <GraphPanel
          trajectory={trajectory}
          results={results}
        />

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Physics LaunchPad • Designed for Grade 11-12 Kinematics
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            All values in SI units (meters, seconds, m/s, m/s²)
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;