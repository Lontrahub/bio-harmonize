
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/Logo";

interface ShoppingList {
  [key: string]: string[];
}

export function ShoppingListClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchShoppingList = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'cleanseContent', 'shoppingList');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setShoppingList(docSnap.data() as ShoppingList);
        } else {
          console.log("No such document!");
          setShoppingList(null);
        }
      } catch (error) {
        console.error("Error fetching shopping list:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchShoppingList();
    }
  }, [user]);

  const formatKeyToTitle = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo />
          <Skeleton className="h-8 w-32" />
        </header>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-8 mt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-7 w-1/3 mb-4" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-5 w-5/6" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Shopping List</CardTitle>
                <CardDescription>Your guide to the essentials for the cleanse.</CardDescription>
            </CardHeader>
            <CardContent>
                {shoppingList ? (
                    <div className="space-y-8 pt-6">
                        {Object.entries(shoppingList).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-2xl font-semibold mb-4 border-b pb-2 text-primary">{formatKeyToTitle(category)}</h3>
                                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-muted-foreground list-disc list-inside">
                                    {items.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-10">Shopping list is not available at the moment. Please check back later.</p>
                )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
