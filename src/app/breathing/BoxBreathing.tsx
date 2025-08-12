
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw } from "lucide-react";

export function BoxBreathing() {
  const [duration, setDuration] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState<"Inhale" | "Hold" | "Exhale" | "Hold ">("Inhale");
  const [stepIndex, setStepIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const steps = ["Inhale", "Hold", "Exhale", "Hold "];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      // Play sound at the beginning of the first step
      if (audioRef.current && stepIndex === 0) {
        audioRef.current.play().catch(console.error);
      }
      timer = setInterval(() => {
        setStepIndex((prev) => {
            const nextIndex = (prev + 1) % 4;
            if (audioRef.current) {
                audioRef.current.play().catch(console.error);
            }
            return nextIndex;
        });
      }, duration * 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, duration]);

  useEffect(() => {
    setStep(steps[stepIndex] as "Inhale" | "Hold" | "Exhale" | "Hold ");
  }, [stepIndex]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setStepIndex(0);
  };
  
  const getAnimationClass = () => {
    if (!isRunning) return 'scale-50';
    switch(step) {
      case 'Inhale': return 'animate-box-inhale';
      case 'Hold': return 'animate-box-hold';
      case 'Exhale': return 'animate-box-exhale';
      case 'Hold ': return 'animate-box-hold-empty';
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
       <style jsx global>{`
          @keyframes box-inhale {
              0% { transform: scale(0.5); }
              100% { transform: scale(1); }
          }
          @keyframes box-hold {
              0%, 100% { transform: scale(1); }
          }
          @keyframes box-exhale {
              0% { transform: scale(1); }
              100% { transform: scale(0.5); }
          }
          @keyframes box-hold-empty {
              0%, 100% { transform: scale(0.5); }
          }
          .animate-box-inhale { animation: box-inhale ${duration}s linear forwards; }
          .animate-box-hold { animation: box-hold ${duration}s linear forwards; }
          .animate-box-exhale { animation: box-exhale ${duration}s linear forwards; }
          .animate-box-hold-empty { animation: box-hold-empty ${duration}s linear forwards; }
      `}</style>
      <audio ref={audioRef} src="https://cdn.freesound.org/previews/26/26414_32267-lq.mp3" preload="auto" />
      <div className="w-64 h-64 flex items-center justify-center bg-muted rounded-lg">
        <div 
          key={stepIndex}
          className={`w-32 h-32 bg-primary rounded-lg transition-transform duration-500 flex items-center justify-center ${getAnimationClass()}`}
        >
        </div>
      </div>
      <div className="text-center">
        <p className="text-5xl font-bold tracking-wider mb-2">{isRunning ? step : "Ready?"}</p>
        <p className="text-xl text-muted-foreground">{duration} seconds</p>
      </div>
      <div className="w-full max-w-xs space-y-4">
        <div className="grid gap-2">
            <Label htmlFor="duration-slider">Duration: {duration}s</Label>
            <Slider
                id="duration-slider"
                min={3}
                max={8}
                step={1}
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                disabled={isRunning}
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
