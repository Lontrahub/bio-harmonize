
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/Logo";
import { ExternalLink } from "lucide-react";
import { UserHeader } from "@/components/UserHeader";

interface ResourceLink {
  title: string;
  url: string;
}

interface ResourcesDocument {
  [key: string]: ResourceLink[];
}


export function ResourcesClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [allResources, setAllResources] = useState<ResourceLink[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchResources = async () => {
      if (!db) {
        setLoadingResources(false);
        return;
      }
      try {
        const docRef = doc(db, 'cleanseContent', 'resources');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as ResourcesDocument;
          const combinedLinks = Object.values(data).flat();
          setAllResources(combinedLinks);
        } else {
          setAllResources([]);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoadingResources(false);
      }
    };

    if (user) {
      fetchResources();
    }
  }, [user]);

  if (authLoading || loadingResources) {
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
              <CardContent className="space-y-4 mt-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
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
                    <CardTitle className="font-headline text-3xl tracking-wide">Helpful Resources</CardTitle>
                    <CardDescription>A collection of external links to support your journey.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {allResources.length > 0 ? (
                        <ul className="space-y-3">
                            {allResources.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                                    >
                                        <span className="flex-1 font-medium text-primary group-hover:text-accent">{link.title}</span>
                                        <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <p className="text-muted-foreground text-center py-10">No resources found. Please check back later.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
