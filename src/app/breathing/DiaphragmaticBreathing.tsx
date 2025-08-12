
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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

export function DiaphragmaticBreathing() {
  const [sessionLength, setSessionLength] = useState(300); // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(sessionLength);
  const [isRunning, setIsRunning] = useState(false);
  
  const timerAudioRef = useRef<HTMLAudioElement>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

  const [timerSound, setTimerSound] = useState(timerSounds[0].url);
  const [backgroundSound, setBackgroundSound] = useState(backgroundSounds[0].url);
  const [timerVolume, setTimerVolume] = useState(0.5);
  const [backgroundVolume, setBackgroundVolume] = useState(0.2);


  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && isRunning) {
         if (timerAudioRef.current) timerAudioRef.current.play().catch(console.error);
         setIsRunning(false);
      }
       if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
      return;
    }
    
    if (backgroundAudioRef.current && backgroundSound && backgroundSound !== 'none') {
        backgroundAudioRef.current.play().catch(console.error);
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
        clearInterval(intervalId);
        if (backgroundAudioRef.current) {
            backgroundAudioRef.current.pause();
        }
    };
  }, [isRunning, timeLeft, backgroundSound]);
  
  useEffect(() => {
    setTimeLeft(sessionLength);
  }, [sessionLength]);

  useEffect(() => {
    if (timerAudioRef.current) timerAudioRef.current.volume = timerVolume;
  }, [timerVolume]);

  useEffect(() => {
    if (backgroundAudioRef.current) backgroundAudioRef.current.volume = backgroundVolume;
  }, [backgroundVolume]);

  const handleStartPause = () => {
     if (timeLeft <= 0) {
        handleReset();
     }
     if (!isRunning && timerAudioRef.current) {
        timerAudioRef.current.play().catch(console.error);
     }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(sessionLength);
    if (backgroundAudioRef.current) {
        backgroundAudioRef.current.currentTime = 0;
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center gap-8">
       {timerSound && <audio ref={timerAudioRef} src={timerSound} preload="auto" />}
       {backgroundSound && backgroundSound !== 'none' && <audio ref={backgroundAudioRef} src={backgroundSound} preload="auto" loop />}
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
