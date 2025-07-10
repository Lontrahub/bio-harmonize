
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import type { UserProfile } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, doc, getDoc, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/Logo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface DailyPlan {
  title?: string;
  [key: string]: string | string[] | undefined;
}

export function AdminDashboardClient() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [dailyProtocols, setDailyProtocols] = useState<{[key: string]: DailyPlan} | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userProfile?.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, userProfile, loading, router]);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (db && userProfile?.role === "admin") {
        setLoadingUsers(true);
        try {
          const usersCollection = collection(db, "users");
          const usersQuery = query(usersCollection);
          const usersSnapshot = await getDocs(usersQuery);
          const usersList = usersSnapshot.docs.map(doc => ({
            ...(doc.data()),
            uid: doc.id
          }) as UserProfile);
          setUsers(usersList);

          const protocolsRef = doc(db, 'cleanseContent', 'dailyProtocols');
          const protocolsSnap = await getDoc(protocolsRef);
          if (protocolsSnap.exists()) {
              setDailyProtocols(protocolsSnap.data() as {[key: string]: DailyPlan});
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
        } finally {
          setLoadingUsers(false);
        }
      }
    };

    if (!loading && userProfile?.role === 'admin') {
      fetchAdminData();
    }
  }, [userProfile, loading]);

  const handleUserSelect = async (selected: UserProfile) => {
    if (!db) return;
    setSelectedUser(selected);
    setLoadingProgress(true);
    setUserProgress([]); 

    try {
        const progressQuery = query(
            collection(db, "userProgress"),
            where("userId", "==", selected.uid)
        );
        const progressSnap = await getDocs(progressQuery);
        const progressList = progressSnap.docs.map(d => d.data());
        setUserProgress(progressList);
    } catch(error) {
        console.error("Error fetching user progress:", error);
    } finally {
        setLoadingProgress(false);
    }
  }

  const getTotalTasksForDay = (dayData: DailyPlan | undefined): number => {
    if (!dayData) return 0;
    let total = 0;
    const protocolKeys = Object.keys(dayData).filter(key => key !== 'title');
    protocolKeys.forEach(key => {
        const content = dayData[key];
        if (typeof content === 'string' && content.trim() !== '') {
            total += content.split(' OR ').map(item => item.trim()).length;
        } else if (Array.isArray(content)) {
            total += content.length;
        }
    });
    return total;
  };

  const renderProgressDetails = () => {
    if (!selectedUser) return null;

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Progress for {selectedUser.displayName}</CardTitle>
                <CardDescription>Review of completed tasks for each day of the cleanse.</CardDescription>
            </CardHeader>
            <CardContent>
                {loadingProgress ? (
                    <div className="space-y-2">
                        {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {Array.from({ length: 9 }, (_, i) => i + 1).map((day) => {
                            const dayKey = `day${day}`;
                            const completedTasks = userProgress.filter(p => p.dayNumber === day);
                            const totalTasks = dailyProtocols ? getTotalTasksForDay(dailyProtocols[dayKey]) : 0;
                            const completionPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

                            return (
                                <AccordionItem value={`day-${day}`} key={day}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between items-center w-full pr-4">
                                            <span>Day {day}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {completedTasks.length} / {totalTasks} tasks completed
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {totalTasks > 0 && (
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Progress value={completionPercentage} className="h-2 flex-1" />
                                                    <span className="text-sm font-medium">{Math.round(completionPercentage)}%</span>
                                                </div>
                                            </div>
                                        )}
                                        {completedTasks.length > 0 ? (
                                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                {completedTasks.map((task, index) => (
                                                    <li key={index}>{task.taskName}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No tasks completed for this day.</p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                )}
            </CardContent>
        </Card>
    )
  }

  if (loading || !userProfile || userProfile.role !== 'admin') {
    return (
      <div className="flex flex-col flex-1">
        <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo />
        </header>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
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
        <nav className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
              <CardDescription>Manage users and view site activity. Click a user to see their progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">Users</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingUsers ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                           <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        </TableRow>
                      ))
                    ) : users.length > 0 ? (
                      users.map((u) => (
                        <TableRow key={u.uid} onClick={() => handleUserSelect(u)} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{u.displayName || "N/A"}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                           <TableCell>{u.role}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">No users found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          {renderProgressDetails()}
        </div>
      </main>
    </div>
  );
}
