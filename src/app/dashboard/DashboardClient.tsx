
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
import { doc, getDoc } from "firebase/firestore";

interface DailyPlan {
  title: string;
  morning_routine?: string[];
  breakfast?: string[];
  mid_morning?: string[];
  lunch?: string[];
  afternoon_snack?: string[];
  dinner?: string[];
  evening?: string[];
  [key: string]: string | string[] | undefined;
}

export function DashboardClient() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [breakdownText, setBreakdownText] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDailyData = async () => {
      if (db === null) {
        setDataLoading(false);
        setDailyPlan(null);
        setBreakdownText(null);
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
  }, [selectedDay, loading, toast]);


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
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Day {selectedDay}: {dailyPlan.title}</CardTitle>
                <CardDescription>Your daily protocol to feel your best.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {protocolKeys.map(key => {
                    const items = dailyPlan[key];
                    if (items && Array.isArray(items) && items.length > 0) {
                        return (
                            <div key={key}>
                                <h3 className="text-xl font-semibold mb-2">{formatKeyToTitle(key)}</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {items.map((item, index) => <li key={`${key}-${index}`}>{item}</li>)}
                                </ul>
                            </div>
                        );
                    }
                    return null;
                })}
            </CardContent>
        </Card>

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
          <div className="mb-8 p-1 bg-muted rounded-lg flex flex-wrap justify-center gap-1">
              {Array.from({ length: 9 }, (_, i) => i + 1).map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "ghost"}
                  onClick={() => setSelectedDay(day)}
                  className="flex-1"
                >
                  Day {day}
                </Button>
              ))}
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
