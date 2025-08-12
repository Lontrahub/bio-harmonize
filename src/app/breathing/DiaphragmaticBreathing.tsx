
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function DiaphragmaticBreathing() {
  const [sessionLength, setSessionLength] = useState(300); // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(sessionLength);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && isRunning) {
         if (audioRef.current) audioRef.current.play().catch(console.error);
         setIsRunning(false);
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft]);
  
  useEffect(() => {
    setTimeLeft(sessionLength);
  }, [sessionLength]);

  const handleStartPause = () => {
     if (timeLeft <= 0) {
        setTimeLeft(sessionLength);
     }
     if (!isRunning && audioRef.current) {
        audioRef.current.play().catch(console.error);
     }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(sessionLength);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center gap-8">
       <audio ref={audioRef} src="https://cdn.freesound.org/previews/26/26414_32267-lq.mp3" preload="auto" />
      <div className="w-full h-64 flex flex-col items-center justify-center bg-muted rounded-lg text-center p-4">
        <h3 className="text-xl font-headline tracking-wide mb-2">Instructions</h3>
        <p className="text-muted-foreground mb-4">
            Place one hand on your chest and the other on your belly.
        </p>
        <p className="text-muted-foreground mb-4">
            Inhale slowly through your nose, feeling the belly rise.
        </p>
        <p className="text-muted-foreground">
            Exhale slowly through your mouth, feeling the belly fall.
        </p>
      </div>
      <div className="text-center">
        <p className="text-6xl font-bold tracking-wider mb-2 font-mono">{formatTime(timeLeft)}</p>
        <p className="text-xl text-muted-foreground">{timeLeft <=0 ? "Session Complete" : (isRunning ? 'Breathe...' : 'Session Paused')}</p>
      </div>
      <div className="w-full max-w-xs space-y-6">
        <div className="grid gap-4">
            <Label>Session Length</Label>
            <RadioGroup
                defaultValue="300"
                onValueChange={(value) => setSessionLength(parseInt(value))}
                className="flex justify-around"
                disabled={isRunning}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="300" id="r1" />
                    <Label htmlFor="r1">5 min</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="600" id="r2" />
                    <Label htmlFor="r2">10 min</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="900" id="r3" />
                    <Label htmlFor="r3">15 min</Label>
                </div>
            </RadioGroup>
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={handleStartPause} size="lg">
            {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isRunning ? "Pause" : (timeLeft <= 0 ? "Start Over" : "Resume")}
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
