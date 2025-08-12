
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const timerSounds = [
    { id: 'bell1', name: 'Bell 1', url: 'https://cdn.freesound.org/previews/26/26414_32267-lq.mp3' },
    { id: 'bell2', name: 'Bell 2', url: 'https://cdn.freesound.org/previews/142/142808_215957-lq.mp3' },
    { id: 'bell3', name: 'Bell 3', url: 'https://cdn.freesound.org/previews/352/352694_5121236-lq.mp3' },
];

const backgroundSounds = [
    { id: 'none', name: 'None', url: 'none' },
    { id: 'rain', name: 'Rain', url: 'https://cdn.freesound.org/previews/34/34372_234433-lq.mp3' },
    { id: 'forest', name: 'Forest', url: 'https://cdn.freesound.org/previews/17/17395_33256-lq.mp3' },
    { id: 'waves', name: 'Waves', url: 'https://cdn.freesound.org/previews/61/61252_44788-lq.mp3' },
];

export function BoxBreathing() {
  const [duration, setDuration] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState<"Inhale" | "Hold" | "Exhale" | "Hold ">("Inhale");
  const [stepIndex, setStepIndex] = useState(0);
  
  const timerAudioRef = useRef<HTMLAudioElement>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

  const [timerSound, setTimerSound] = useState(timerSounds[0].url);
  const [backgroundSound, setBackgroundSound] = useState(backgroundSounds[0].url);
  const [timerVolume, setTimerVolume] = useState(0.5);
  const [backgroundVolume, setBackgroundVolume] = useState(0.2);

  const steps = ["Inhale", "Hold", "Exhale", "Hold "];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      if (backgroundAudioRef.current && backgroundSound && backgroundSound !== 'none') {
        backgroundAudioRef.current.play().catch(console.error);
      }
      timer = setInterval(() => {
        setStepIndex((prev) => {
            const nextIndex = (prev + 1) % 4;
            if (timerAudioRef.current) {
                timerAudioRef.current.currentTime = 0;
                timerAudioRef.current.play().catch(console.error);
            }
            return nextIndex;
        });
      }, duration * 1000);
    } else {
       if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
    }
    return () => {
        clearInterval(timer);
        if (backgroundAudioRef.current) {
            backgroundAudioRef.current.pause();
        }
    };
  }, [isRunning, duration, backgroundSound]);

  useEffect(() => {
    setStep(steps[stepIndex] as "Inhale" | "Hold" | "Exhale" | "Hold ");
  }, [stepIndex]);

  useEffect(() => {
    if (timerAudioRef.current) timerAudioRef.current.volume = timerVolume;
  }, [timerVolume]);

  useEffect(() => {
    if (backgroundAudioRef.current) backgroundAudioRef.current.volume = backgroundVolume;
  }, [backgroundVolume]);

  const handleStartPause = () => {
    if (!isRunning) {
        // Play sound on start to get browser permission
        if (timerAudioRef.current) {
            timerAudioRef.current.play().catch(console.error);
        }
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setStepIndex(0);
    if (backgroundAudioRef.current) {
        backgroundAudioRef.current.currentTime = 0;
    }
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
      {timerSound && <audio ref={timerAudioRef} src={timerSound} preload="auto" />}
      {backgroundSound && backgroundSound !== 'none' && <audio ref={backgroundAudioRef} src={backgroundSound} preload="auto" loop />}
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

       <Card className="w-full max-w-sm mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Sound Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label>Timer Sound</Label>
              <Select onValueChange={setTimerSound} defaultValue={timerSound} disabled={isRunning}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                      {timerSounds.map(sound => (
                          <SelectItem key={sound.id} value={sound.url}>{sound.name}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
               <Slider
                    value={[timerVolume]}
                    onValueChange={(value) => setTimerVolume(value[0])}
                    max={1}
                    step={0.05}
                />
            </div>
             <div className="grid gap-2">
              <Label>Background Sound</Label>
              <Select onValueChange={setBackgroundSound} defaultValue={backgroundSound} disabled={isRunning}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                      {backgroundSounds.map(sound => (
                          <SelectItem key={sound.id} value={sound.url}>{sound.name}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
               <Slider
                    value={[backgroundVolume]}
                    onValueChange={(value) => setBackgroundVolume(value[0])}
                    max={1}
                    step={0.05}
                />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
