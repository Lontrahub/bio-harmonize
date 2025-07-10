
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/Logo";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShoppingList {
  [key: string]: string[];
}

interface PersonalShoppingItem {
    text: string;
    completed: boolean;
}

export function ShoppingListClient() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  
  const [checkedOfficialItems, setCheckedOfficialItems] = useState<Set<string>>(new Set());
  const [personalItems, setPersonalItems] = useState<PersonalShoppingItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchShoppingList = async () => {
      if (!db) {
        setLoadingList(false);
        return;
      }
      try {
        const docRef = doc(db, 'cleanseContent', 'shoppingList');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setShoppingList(docSnap.data() as ShoppingList);
        } else {
          setShoppingList(null);
        }
      } catch (error) {
        console.error("Error fetching shopping list:", error);
      } finally {
        setLoadingList(false);
      }
    };

    if (user) {
      fetchShoppingList();
    }
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      setPersonalItems(userProfile.personalShoppingItems || []);
      setCheckedOfficialItems(new Set(userProfile.officialShoppingItemsChecked || []));
    } else {
      setPersonalItems([]);
      setCheckedOfficialItems(new Set());
    }
  }, [userProfile]);

  const formatCategoryTitle = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleToggleOfficialItem = async (item: string) => {
    if (!user || !db) return;

    const userRef = doc(db, "users", user.uid);
    const isChecked = checkedOfficialItems.has(item);

    try {
      if (isChecked) {
        await updateDoc(userRef, {
          officialShoppingItemsChecked: arrayRemove(item)
        });
      } else {
        await updateDoc(userRef, {
          officialShoppingItemsChecked: arrayUnion(item)
        });
      }
    } catch (error) {
      console.error("Error updating official shopping list:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not update your shopping list." });
    }
  };

  const handleAddItem = async () => {
    if (!newItemText.trim() || !user || !db) return;
    setIsSubmitting(true);
    const newItem: PersonalShoppingItem = { text: newItemText, completed: false };
    const userRef = doc(db, "users", user.uid);
    try {
        await updateDoc(userRef, {
            personalShoppingItems: arrayUnion(newItem)
        });
        setNewItemText("");
    } catch (error) {
        console.error("Error adding item:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not add item." });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleTogglePersonalItem = async (itemIndex: number) => {
    if (!user || !db) return;
    const updatedItems = [...personalItems];
    updatedItems[itemIndex].completed = !updatedItems[itemIndex].completed;
    
    const userRef = doc(db, "users", user.uid);
    try {
        await updateDoc(userRef, {
            personalShoppingItems: updatedItems
        });
    } catch (error) {
        console.error("Error updating item:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not update item." });
    }
  };

  const handleDeleteItem = async (itemToDelete: PersonalShoppingItem) => {
    if (!user || !db) return;
    const userRef = doc(db, "users", user.uid);
    try {
        await updateDoc(userRef, {
            personalShoppingItems: arrayRemove(itemToDelete)
        });
    } catch (error) {
        console.error("Error deleting item:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not delete item." });
    }
  };


  if (authLoading || loadingList) {
    return (
      <div className="flex flex-col flex-1">
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
                <Skeleton className="h-40 w-full" />
                <Separator />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
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
                <CardDescription>Your guide to the essentials for the cleanse, plus your own personal items.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">

                {/* Personal List */}
                <div>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">My Personal List</h3>
                    <div className="flex gap-2 mb-4">
                        <Input 
                            value={newItemText} 
                            onChange={(e) => setNewItemText(e.target.value)}
                            placeholder="Add a personal item..."
                            disabled={isSubmitting}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                        />
                        <Button onClick={handleAddItem} disabled={isSubmitting || !newItemText.trim()}>
                            {isSubmitting ? 'Adding...' : 'Add Item'}
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {personalItems.length > 0 ? (
                            personalItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <Checkbox 
                                            id={`personal-${index}`} 
                                            checked={item.completed}
                                            onCheckedChange={() => handleTogglePersonalItem(index)}
                                        />
                                        <label htmlFor={`personal-${index}`} className={cn("text-sm font-medium leading-none", item.completed && "line-through text-muted-foreground")}>
                                            {item.text}
                                        </label>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteItem(item)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">Your personal shopping list is empty.</p>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Official List */}
                <div>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Official Shopping List</h3>
                    {shoppingList ? (
                        <div className="space-y-8">
                            {Object.entries(shoppingList).map(([category, items]) => (
                                <div key={category}>
                                    <h4 className="text-xl font-semibold mb-4 border-b pb-2">{formatCategoryTitle(category)}</h4>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                                        {items.map((item, index) => (
                                            <div key={`${category}-${index}`} className="flex items-center space-x-3">
                                                <Checkbox 
                                                    id={`${category}-${index}`}
                                                    checked={checkedOfficialItems.has(item)}
                                                    onCheckedChange={() => handleToggleOfficialItem(item)}
                                                />
                                                <label 
                                                    htmlFor={`${category}-${index}`} 
                                                    className={cn("text-sm font-medium leading-none", checkedOfficialItems.has(item) && "line-through text-muted-foreground")}
                                                >
                                                    {item}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-10">Official shopping list is not available.</p>
                    )}
                </div>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
