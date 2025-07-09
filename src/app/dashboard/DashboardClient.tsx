
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { differenceInDays } from 'date-fns';

export function DashboardClient() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [dayNumber, setDayNumber] = useState<number | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading) {
      setDataLoading(true);
      if (userProfile && userProfile.cleanseStartDate) {
        const cleanseStartDate = userProfile.cleanseStartDate.toDate();
        const today = new Date();
        const day = differenceInDays(today, cleanseStartDate) + 1;
        setDayNumber(day);
      } else {
        setDayNumber(null);
      }
      setDataLoading(false);
    }
  }, [userProfile, loading]);

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
                <div className="w-full max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4 mb-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-16 w-full" />
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
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-16 w-full" />
            </CardContent>
        </Card>
      );
    }
    
    if (dayNumber !== null) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Your Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <h1 className="text-2xl font-bold">Current Cleanse Day: {dayNumber}</h1>
                </CardContent>
            </Card>
        )
    }

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
