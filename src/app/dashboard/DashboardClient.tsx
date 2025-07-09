"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { differenceInDays } from 'date-fns';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DailyProtocol {
  title: string;
  morning_routine: string[];
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

export function DashboardClient() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [dayNumber, setDayNumber] = useState<number | null>(null);
  const [dailyProtocol, setDailyProtocol] = useState<DailyProtocol | null>(null);
  const [bodyBreakdown, setBodyBreakdown] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && userProfile) {
      const fetchDashboardData = async () => {
        setDataLoading(true);
        try {
          const cleanseStartDate = userProfile.cleanseStartDate?.toDate();
          if (!cleanseStartDate) {
              setDayNumber(0);
              setDataLoading(false);
              return;
          }

          const today = new Date();
          const day = differenceInDays(today, cleanseStartDate) + 1;
          setDayNumber(day);

          if (day > 0) {
            const dayKey = `day${day}`;
            
            const protocolsDocRef = doc(db, "cleanseContent", "dailyProtocols");
            const breakdownDocRef = doc(db, "cleanseContent", "dayByDayBreakdown");
            
            const [protocolsDocSnap, breakdownDocSnap] = await Promise.all([
              getDoc(protocolsDocRef),
              getDoc(breakdownDocRef)
            ]);

            if (protocolsDocSnap.exists() && protocolsDocSnap.data()[dayKey]) {
              setDailyProtocol(protocolsDocSnap.data()[dayKey] as DailyProtocol);
            } else {
              setDailyProtocol(null);
            }

            if (breakdownDocSnap.exists() && breakdownDocSnap.data()[dayKey]) {
              setBodyBreakdown(breakdownDocSnap.data()[dayKey]);
            } else {
              setBodyBreakdown(null);
            }

            const progressQuery = query(
              collection(db, "userProgress"),
              where("userId", "==", user.uid),
              where("dayNumber", "==", day)
            );
            const querySnapshot = await getDocs(progressQuery);
            const tasks = querySnapshot.docs.map(doc => doc.data().taskName);
            setCompletedTasks(tasks);
          }

        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load dashboard data.",
          });
        } finally {
          setDataLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [user, userProfile, toast]);

  const handleSignOut = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "Firebase is not configured.",
      });
      return;
    }
    try {
      await signOut(auth);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: error.message,
      });
    }
  };

  const handleTaskCompletion = async (taskName: string) => {
    if (!user || !dayNumber || !db) return;
    try {
      await addDoc(collection(db, "userProgress"), {
        userId: user.uid,
        dayNumber: dayNumber,
        taskName: taskName,
        completedAt: serverTimestamp(),
      });
      setCompletedTasks(prev => [...prev, taskName]);
    } catch (error) {
       console.error("Error saving progress:", error);
       toast({
         variant: "destructive",
         title: "Error",
         description: "Could not save your progress. Please try again.",
       });
    }
  };

  const renderTask = (task: string, index: number, section: string) => {
    const taskId = `${section}-${index}`;
    const isCompleted = completedTasks.includes(task);
    return (
      <div key={taskId} className="flex items-center space-x-3 my-3">
        <Checkbox
          id={taskId}
          checked={isCompleted}
          disabled={isCompleted}
          onCheckedChange={() => handleTaskCompletion(task)}
        />
        <Label
          htmlFor={taskId}
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
        >
          {task}
        </Label>
      </div>
    );
  };
  
  if (loading || !user) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
               <Logo />
                <Skeleton className="h-8 w-24" />
            </header>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full max-w-2xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2 mb-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
  }

  const renderContent = () => {
    if (dataLoading) {
      return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <Card>
              <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
              </CardHeader>
          </Card>
          <Card>
              <CardHeader>
                  <Skeleton className="h-6 w-1/2 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <Skeleton className="h-6 w-1/2 mb-2" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
              </CardContent>
          </Card>
        </div>
      );
    }
    
    if (dayNumber === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Welcome!</CardTitle>
                    <CardDescription>Your cleanse journey hasn't started yet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Please check back on your start date to begin the program.</p>
                </CardContent>
            </Card>
        )
    }

    if (!dailyProtocol) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">All Done!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Congratulations on completing the cleanse program!</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Welcome to Day {dayNumber}</CardTitle>
            <CardDescription>{dailyProtocol.title}</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Today's Protocol</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="space-y-6">
                  <div>
                      <h3 className="font-semibold text-lg text-primary mb-2">Morning Routine</h3>
                      {dailyProtocol.morning_routine.map((task, i) => renderTask(task, i, "morning"))}
                  </div>
                  <div>
                      <h3 className="font-semibold text-lg text-primary mb-2">Breakfast</h3>
                      {dailyProtocol.breakfast.map((task, i) => renderTask(task, i, "breakfast"))}
                  </div>
                   <div>
                      <h3 className="font-semibold text-lg text-primary mb-2">Lunch</h3>
                      {dailyProtocol.lunch.map((task, i) => renderTask(task, i, "lunch"))}
                  </div>
                   <div>
                      <h3 className="font-semibold text-lg text-primary mb-2">Dinner</h3>
                      {dailyProtocol.dinner.map((task, i) => renderTask(task, i, "dinner"))}
                  </div>
              </div>
          </CardContent>
        </Card>

        {bodyBreakdown && (
           <Card>
              <CardHeader>
                <CardTitle>What's Happening In Your Body</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{bodyBreakdown}</p>
              </CardContent>
            </Card>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          {userProfile?.role === "admin" && (
            <Button variant="outline" asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          )}
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-2xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
