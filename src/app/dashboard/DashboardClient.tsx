
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
import { doc, getDoc } from "firebase/firestore";

interface DailyPlan {
  title: string;
  morning_routine: string[];
  breakfast: string[];
  mid_morning: string[];
  lunch: string[];
  afternoon_snack: string[];
  dinner: string[];
  evening: string[];
}

export function DashboardClient() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [dayNumber, setDayNumber] = useState<number | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [breakdownText, setBreakdownText] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userProfile && userProfile.cleanseStartDate) {
      const cleanseStartDate = userProfile.cleanseStartDate.toDate();
      const today = new Date();
      const day = differenceInDays(today, cleanseStartDate) + 1;
      setDayNumber(day);
    } else if (!loading) {
      setDayNumber(null);
      setDataLoading(false); 
    }
  }, [userProfile, loading]);

  useEffect(() => {
    const fetchDailyData = async () => {
      if (db === null || dayNumber === null || dayNumber < 1 || dayNumber > 9) {
        setDataLoading(false);
        setDailyPlan(null);
        setBreakdownText(null);
        return;
      }

      setDataLoading(true);
      try {
        const dayKey = `day${dayNumber}`;

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

    if (!loading) {
       fetchDailyData();
    }
  }, [dayNumber, loading, toast]);


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
  
  if (loading || !user) {
    return (
        <div className="flex flex-col min-h-screen">
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
        </div>
      );
    }
    
    if (dayNumber === null) {
      return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Welcome!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Your cleanse start date has not been set. Please contact an administrator.</p>
            </CardContent>
        </Card>
      );
    }
    
    if (dayNumber < 1 || dayNumber > 9 || !dailyPlan) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Cleanse Journey</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Your cleanse is either complete or has not yet begun. Congratulations on your progress!</p>
                </CardContent>
            </Card>
        )
    }

    return (
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Day {dayNumber}: {dailyPlan.title}</CardTitle>
                <CardDescription>Your daily protocol to feel your best.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {dailyPlan.morning_routine && dailyPlan.morning_routine.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Morning Routine</h3>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {dailyPlan.morning_routine.map((item, index) => <li key={`morning-${index}`}>{item}</li>)}
                        </ul>
                    </div>
                )}
                {dailyPlan.breakfast && dailyPlan.breakfast.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Breakfast</h3>
                         <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {dailyPlan.breakfast.map((item, index) => <li key={`breakfast-${index}`}>{item}</li>)}
                        </ul>
                    </div>
                )}
                {dailyPlan.mid_morning && dailyPlan.mid_morning.length > 0 && (
                     <div>
                        <h3 className="text-xl font-semibold mb-2">Mid-Morning</h3>
                         <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {dailyPlan.mid_morning.map((item, index) => <li key={`mid_morning-${index}`}>{item}</li>)}
                        </ul>
                    </div>
                )}
                 {dailyPlan.lunch && dailyPlan.lunch.length > 0 && (
                     <div>
                        <h3 className="text-xl font-semibold mb-2">Lunch</h3>
                         <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {dailyPlan.lunch.map((item, index) => <li key={`lunch-${index}`}>{item}</li>)}
                        </ul>
                    </div>
                )}
                 {dailyPlan.afternoon_snack && dailyPlan.afternoon_snack.length > 0 && (
                     <div>
                        <h3 className="text-xl font-semibold mb-2">Afternoon Snack</h3>
                         <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {dailyPlan.afternoon_snack.map((item, index) => <li key={`afternoon_snack-${index}`}>{item}</li>)}
                        </ul>
                    </div>
                )}
                 {dailyPlan.dinner && dailyPlan.dinner.length > 0 && (
                     <div>
                        <h3 className="text-xl font-semibold mb-2">Dinner</h3>
                         <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {dailyPlan.dinner.map((item, index) => <li key={`dinner-${index}`}>{item}</li>)}
                        </ul>
                    </div>
                )}
                 {dailyPlan.evening && dailyPlan.evening.length > 0 && (
                     <div>
                        <h3 className="text-xl font-semibold mb-2">Evening</h3>
                         <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {dailyPlan.evening.map((item, index) => <li key={`evening-${index}`}>{item}</li>)}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>

        {breakdownText && (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">What's Happening In Your Body</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{breakdownText}</p>
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
        <div className="w-full max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
