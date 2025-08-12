
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserHeader } from "@/components/UserHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";

import { BoxBreathing } from "./BoxBreathing";
import { FourSevenEightBreathing } from "./FourSevenEightBreathing";
import { DiaphragmaticBreathing } from "./DiaphragmaticBreathing";

type BreathingExercise = 'box' | '4-7-8' | 'diaphragmatic';

const exerciseDetails = {
    'box': { 
        title: 'Box Breathing', 
        description: 'For Focus and Calm',
        component: BoxBreathing,
    },
    '4-7-8': { 
        title: '4-7-8 Breathing', 
        description: 'For Relaxation and Sleep',
        component: FourSevenEightBreathing,
    },
    'diaphragmatic': { 
        title: 'Diaphragmatic Breathing', 
        description: 'For Stress Reduction',
        component: DiaphragmaticBreathing,
    },
};


export function BreathingClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex flex-col flex-1">
            <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
               <Logo />
                <Skeleton className="h-8 w-24" />
            </header>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full max-w-4xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-48 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
  }

  const renderExercise = () => {
    if (!selectedExercise) return null;
    
    const Details = exerciseDetails[selectedExercise];
    const Component = Details.component;

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                     <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSelectedExercise(null)}>
                        <ArrowLeft className="h-4 w-4" />
                     </Button>
                     <div>
                        <CardTitle className="font-headline text-2xl tracking-wide">{Details.title}</CardTitle>
                        <CardDescription>{Details.description}</CardDescription>
                     </div>
                </div>
            </CardHeader>
            <CardContent>
                <Component />
            </CardContent>
        </Card>
    );
  }
  
  const renderSelection = () => (
     <div className="w-full max-w-4xl mx-auto space-y-8">
        <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl tracking-wide">Breathing Exercises</CardTitle>
              <CardDescription>
                Choose an exercise to calm your mind, focus your energy, or relax your body.
              </CardDescription>
            </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
            {(Object.keys(exerciseDetails) as BreathingExercise[]).map(key => {
                const details = exerciseDetails[key];
                return (
                    <Card key={key} className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 cursor-pointer" onClick={() => setSelectedExercise(key)}>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl tracking-wide">{details.title}</CardTitle>
                            <CardDescription>{details.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                                <Button>Start</Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    </div>
  )

  return (
    <div className="flex flex-col flex-1">
      <UserHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedExercise ? renderExercise() : renderSelection()}
      </main>
    </div>
  );
}
