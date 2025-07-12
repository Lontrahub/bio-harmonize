
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/Logo";
import { collection, doc, getDoc, getDocs, query, where, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { Checkbox } from "@/components/ui/checkbox";
import { UserHeader } from "@/components/UserHeader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DailyPlan {
  title?: string;
  morning_routine?: string | string[];
  breakfast?: string | string[];
  mid_morning?: string | string[];
  lunch?: string | string[];
  afternoon_snack?: string | string[];
  dinner?: string | string[];
  evening?: string | string[];
  [key: string]: string | string[] | undefined;
}

interface DailyTips {
  preparation: string[];
  winterComfort: string[];
}

export function DashboardClient() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [breakdownText, setBreakdownText] = useState<string | null>(null);
  const [dailyTips, setDailyTips] = useState<DailyTips | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDataForDay = async () => {
      if (db === null || !user) {
        setDataLoading(false);
        return;
      }

      setDataLoading(true);
      try {
        const dayKey = `day${selectedDay}`;

        const protocolsRef = doc(db, 'cleanseContent', 'dailyProtocols');
        const protocolsSnap = await getDoc(protocolsRef);
        if (protocolsSnap.exists()) {
          const data = protocolsSnap.data();
          setDailyPlan(data[dayKey] as DailyPlan);
        } else {
          setDailyPlan(null);
        }

        const breakdownRef = doc(db, 'cleanseContent', 'dayByDayBreakdown');
        const breakdownSnap = await getDoc(breakdownRef);
        if (breakdownSnap.exists()) {
          const data = breakdownSnap.data();
          setBreakdownText(data[dayKey]);
        } else {
          setBreakdownText(null);
        }

        const tipsRef = doc(db, 'cleanseContent', 'dailyTips');
        const tipsSnap = await getDoc(tipsRef);
        if (tipsSnap.exists()) {
          setDailyTips(tipsSnap.data() as DailyTips);
        } else {
          setDailyTips(null);
        }
        
        const progressQuery = query(
          collection(db, "userProgress"),
          where("userId", "==", user.uid),
          where("dayNumber", "==", selectedDay)
        );
        const progressSnap = await getDocs(progressQuery);
        const completed = new Set(progressSnap.docs.map(d => d.data().taskName as string));
        setCompletedTasks(completed);

      } catch (error) {
        console.error("Error fetching daily content:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load daily content.",
        });
      } finally {
        setDataLoading(false);
      }
    };

    if (!loading && user) {
       fetchDataForDay();
    }
  }, [selectedDay, user, loading, toast]);

  const handleTaskToggle = async (taskName: string, isChecked: boolean) => {
    if (!user || !db) return;

    if (isChecked) {
      setCompletedTasks(prev => new Set(prev).add(taskName));
      try {
        await addDoc(collection(db, "userProgress"), {
          userId: user.uid,
          dayNumber: selectedDay,
          taskName: taskName,
          completedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error saving progress: ", error);
        toast({ variant: "destructive", title: "Error", description: "Could not save your progress." });
        setCompletedTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskName);
          return newSet;
        });
      }
    } else {
      setCompletedTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskName);
        return newSet;
      });
      try {
        const q = query(
          collection(db, "userProgress"),
          where("userId", "==", user.uid),
          where("dayNumber", "==", selectedDay),
          where("taskName", "==", taskName)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      } catch (error) {
        console.error("Error removing progress: ", error);
        toast({ variant: "destructive", title: "Error", description: "Could not update your progress." });
        setCompletedTasks(prev => new Set(prev).add(taskName));
      }
    }
  };
  
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

  const formatKeyToTitle = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderContent = () => {
    if (dataLoading) {
      return (
         <div className="space-y-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/3 mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </CardContent>
            </Card>
        </div>
      );
    }
    
    if (!dailyPlan) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Content Not Available</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">The content for this day could not be loaded. Please try again later.</p>
                </CardContent>
            </Card>
        )
    }

    const protocolKeys = Object.keys(dailyPlan).filter(key => key !== 'title');

    return (
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Left Column: Main Protocol */}
        <div className="lg:w-1/2 flex-shrink-0">
           <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Day {selectedDay}{dailyPlan.title ? `: ${dailyPlan.title}` : ''}</CardTitle>
                    <CardDescription>Your daily protocol to feel your best.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {protocolKeys.map(key => {
                        const content = dailyPlan[key];
                        let items: string[] = [];

                        if (typeof content === 'string' && content.trim() !== '') {
                            items = content.split(' OR ').map(item => item.trim());
                        } else if (Array.isArray(content)) {
                            items = content;
                        }

                        if (items.length > 0) {
                            return (
                                <div key={key}>
                                    <h3 className="text-xl font-semibold mb-2">{formatKeyToTitle(key)}</h3>
                                    <div className="space-y-2">
                                        {items.map((item, index) => {
                                            const taskId = `${key}-${index}`;
                                            return (
                                                <div key={taskId} className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id={taskId}
                                                        checked={completedTasks.has(item)}
                                                        onCheckedChange={(checked) => handleTaskToggle(item, !!checked)}
                                                        disabled={dataLoading}
                                                        aria-label={item}
                                                    />
                                                    <label
                                                        htmlFor={taskId}
                                                        className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {item}
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Supplementary Info */}
        <div className="lg:w-1/2 space-y-6 mt-6 lg:mt-0">
            {breakdownText && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">What's Happening In Your Body</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground whitespace-pre-wrap">{breakdownText}</p>
                    </CardContent>
                </Card>
            )}

            {dailyTips && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Daily Tips for Success</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {dailyTips.preparation && dailyTips.preparation.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Preparation</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {dailyTips.preparation.map((tip, index) => (
                                        <li key={`prep-${index}`}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {dailyTips.winterComfort && dailyTips.winterComfort.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Winter Comfort</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {dailyTips.winterComfort.map((tip, index) => (
                                        <li key={`comfort-${index}`}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <UserHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-7xl mx-auto">
           <div className="mb-8 flex justify-center">
            <ScrollArea className="whitespace-nowrap">
              <div className="p-1 bg-muted rounded-lg flex w-max gap-1">
                {Array.from({ length: 9 }, (_, i) => i + 1).map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "ghost"}
                    onClick={() => setSelectedDay(day)}
                    className="shrink-0"
                  >
                    Day {day}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
