
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
import { Separator } from "@/components/ui/separator";

interface Recipe {
  title: string;
  ingredients: string[];
  instructions?: string;
}

interface RecipesData {
  [key: string]: Recipe;
}

export function RecipesClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [recipes, setRecipes] = useState<RecipesData | null>(null);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!db) {
        setLoadingRecipes(false);
        return;
      }
      try {
        const docRef = doc(db, 'cleanseContent', 'recipes');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRecipes(docSnap.data() as RecipesData);
        } else {
          setRecipes(null);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoadingRecipes(false);
      }
    };

    if (user) {
      fetchRecipes();
    }
  }, [user]);

  if (authLoading || loadingRecipes) {
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
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
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
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Cleanse Recipes</CardTitle>
                    <CardDescription>Delicious and healing recipes to support you through the cleanse.</CardDescription>
                </CardHeader>
            </Card>

            {recipes ? (
                Object.values(recipes).map((recipe, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">{recipe.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                        {recipe.ingredients.map((item, itemIndex) => (
                                            <li key={itemIndex}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {recipe.instructions && (
                                <div>
                                    <Separator className="my-4"/>
                                    <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{recipe.instructions}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center py-10">No recipes found. Please check back later.</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </main>
    </div>
  );
}
