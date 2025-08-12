
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw } from "lucide-react";

export function FourSevenEightBreathing() {
  const [cycles, setCycles] = useState(4);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");

  useEffect(() => {
    if (!isRunning || currentCycle >= cycles) {
      setIsRunning(false);
      return;
    }

    const sequence = [
      { step: "Inhale", duration: 4000 },
      { step: "Hold", duration: 7000 },
      { step: "Exhale", duration: 8000 },
    ];
    
    let currentStepIndex = 0;
    
    const runStep = () => {
        const current = sequence[currentStepIndex];
        setStep(current.step as "Inhale" | "Hold" | "Exhale");
        
        setTimeout(() => {
            currentStepIndex++;
            if (currentStepIndex < sequence.length) {
                runStep();
            } else {
                if (currentCycle + 1 < cycles) {
                   setCurrentCycle(c => c + 1);
                   // Restart cycle
                   currentStepIndex = 0;
                   runStep();
                } else {
                    setIsRunning(false); // All cycles complete
                }
            }
        }, current.duration);
    };

    runStep();

  }, [isRunning, cycles, currentCycle]);


  const handleStartPause = () => {
    if (isRunning) {
        setIsRunning(false);
    } else {
        if (currentCycle >= cycles) {
            setCurrentCycle(0);
        }
        setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentCycle(0);
    setStep("Inhale");
  };
  
  const getAnimationClass = () => {
    if (!isRunning) return 'scale-50 opacity-50';
    switch(step) {
      case 'Inhale': return 'animate-circle-inhale';
      case 'Hold': return 'animate-circle-hold';
      case 'Exhale': return 'animate-circle-exhale';
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
       <style jsx global>{`
          @keyframes circle-inhale {
              0% { transform: scale(0.5); opacity: 0.5; }
              100% { transform: scale(1); opacity: 1; }
          }
          @keyframes circle-hold {
              0%, 100% { transform: scale(1); opacity: 1; }
          }
          @keyframes circle-exhale {
              0% { transform: scale(1); opacity: 1; }
              100% { transform: scale(0.25); opacity: 0.25; }
          }
          .animate-circle-inhale { animation: circle-inhale 4s ease-out forwards; }
          .animate-circle-hold { animation: circle-hold 7s linear forwards; }
          .animate-circle-exhale { animation: circle-exhale 8s ease-in forwards; }
      `}</style>
      <div className="w-64 h-64 flex items-center justify-center bg-muted rounded-full">
        <div 
           key={`${currentCycle}-${step}`}
          className={`w-48 h-48 bg-primary rounded-full transition-all duration-500 flex items-center justify-center ${getAnimationClass()}`}
        >
        </div>
      </div>
      <div className="text-center">
        <p className="text-5xl font-bold tracking-wider mb-2">{isRunning ? step : "Ready?"}</p>
        <p className="text-xl text-muted-foreground">Cycle {currentCycle + 1} of {cycles}</p>
      </div>
      <div className="w-full max-w-xs space-y-4">
        <div className="grid gap-2">
            <Label htmlFor="cycles-input">Cycles</Label>
            <Input
                id="cycles-input"
                type="number"
                min={1}
                max={20}
                value={cycles}
                onChange={(e) => setCycles(parseInt(e.target.value))}
                disabled={isRunning}
                className="text-center"
            />
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={handleStartPause} size="lg">
            {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            <RotateCcw className="mr-2"/>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

