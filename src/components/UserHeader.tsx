
'use client';

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, ShoppingCart, Utensils, BookMarked, Shield, LogOut, Menu } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
        { href: "/shopping-list", label: "Shopping List", icon: ShoppingCart, adminOnly: false },
        { href: "/recipes", label: "Recipes", icon: Utensils, adminOnly: false },
        { href: "/resources", label: "Resources", icon: BookMarked, adminOnly: false },
        { href: "/admin", label: "Admin Dashboard", icon: Shield, adminOnly: true }
    ];

    return (
        <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
                <TooltipProvider>
                    {navItems.filter(item => !item.adminOnly || userProfile?.role === 'admin').map(item => (
                        <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" asChild>
                                    <Link href={item.href} aria-label={item.label}><item.icon className="h-5 w-5" /></Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>{item.label}</p></TooltipContent>
                        </Tooltip>
                    ))}
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

             {/* Mobile Navigation Trigger */}
            <div className="md:hidden">
                 <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Open Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex w-full max-w-xs flex-col p-0">
                        <SheetHeader className="border-b p-4">
                           <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                           <SheetClose asChild>
                                <Link href="/dashboard"><Logo /></Link>
                           </SheetClose>
                        </SheetHeader>
                        <nav className="flex-1 space-y-1 p-4">
                            {navItems.filter(item => !item.adminOnly || userProfile?.role === 'admin').map(item => (
                                <SheetClose asChild key={item.href}>
                                    <Button variant="ghost" className="w-full justify-start gap-3 text-base" asChild>
                                      <Link href={item.href}>
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                      </Link>
                                    </Button>
                                </SheetClose>
                            ))}
                        </nav>
                        <div className="space-y-4 border-t p-4">
                            <div className="flex items-center justify-between">
                               <span className="text-sm text-muted-foreground">Theme</span>
                               <ThemeToggle />
                            </div>
                            <Button variant="outline" className="w-full justify-center gap-2" onClick={handleSignOut}>
                                <LogOut className="h-5 w-5" />
                                Sign Out
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            
            {/* Logo */}
            <Logo />
        </header>
    );
}
