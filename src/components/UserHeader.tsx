
'use client';

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, ShoppingCart, Utensils, BookMarked, Shield, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "./ThemeToggle";

export function UserHeader() {
    const { userProfile } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

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

    return (
        <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <nav className="flex items-center gap-2">
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard" aria-label="Dashboard"><LayoutDashboard className="h-5 w-5" /></Link>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Dashboard</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/shopping-list" aria-label="Shopping List"><ShoppingCart className="h-5 w-5" /></Link>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Shopping List</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/recipes" aria-label="Recipes"><Utensils className="h-5 w-5" /></Link>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Recipes</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/resources" aria-label="Resources"><BookMarked className="h-5 w-5" /></Link>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Resources</p></TooltipContent>
                </Tooltip>
                {userProfile?.role === "admin" && (
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" asChild>
                        <Link href="/admin" aria-label="Admin Dashboard"><Shield className="h-5 w-5" /></Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Admin Dashboard</p></TooltipContent>
                    </Tooltip>
                )}
                <ThemeToggle />
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleSignOut} aria-label="Sign Out">
                        <LogOut className="h-5 w-5" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Sign Out</p></TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </nav>
            <Logo />
        </header>
    );
}
