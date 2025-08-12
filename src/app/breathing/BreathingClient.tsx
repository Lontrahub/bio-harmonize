
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserHeader } from "@/components/UserHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/Logo";

export function BreathingClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  return (
    <div className="flex flex-col flex-1">
      <UserHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl tracking-wide">Breathing Tool</CardTitle>
              <CardDescription>
                This section is under construction. Come back soon for powerful breathing exercises.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Coming Soon...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
