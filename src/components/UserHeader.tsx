
'use client';

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, ShoppingCart, Utensils, BookMarked, Shield, LogOut, Menu, Leaf, HeartPulse } from "lucide-react";
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
    const pathname = usePathname();
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

    const cleanseNavItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/shopping-list", label: "Shopping List", icon: ShoppingCart },
        { href: "/recipes", label: "Recipes", icon: Utensils },
        { href: "/resources", label: "Resources", icon: BookMarked },
    ];

    const adminNavItem = { href: "/admin", label: "Admin Dashboard", icon: Shield, adminOnly: true };

    const isCleanseRoute = cleanseNavItems.some(item => pathname.startsWith(item.href)) || pathname.startsWith('/admin');
    const isBreathingRoute = pathname.startsWith('/breathing');

    const renderNavLinks = (isMobile = false) => {
      const Wrapper = isMobile ? SheetClose : React.Fragment;
      const buttonProps = isMobile 
        ? { variant: "ghost", className: "w-full justify-start gap-3 text-base" } 
        : { variant: "outline", size: "icon" };
      
      return (
         <>
          {isCleanseRoute && cleanseNavItems.map(item => (
            <Wrapper key={item.href} {...(isMobile && {asChild: true})}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button {...buttonProps} asChild>
                      <Link href={item.href} aria-label={item.label}>
                        <item.icon className="h-5 w-5" />
                        {isMobile && item.label}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  {!isMobile && <TooltipContent><p>{item.label}</p></TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </Wrapper>
          ))}

          {userProfile?.role === 'admin' && isCleanseRoute && (
            <Wrapper {...(isMobile && {asChild: true})}>
               <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button {...buttonProps} asChild>
                      <Link href={adminNavItem.href} aria-label={adminNavItem.label}>
                        <adminNavItem.icon className="h-5 w-5" />
                        {isMobile && adminNavItem.label}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  {!isMobile && <TooltipContent><p>{adminNavItem.label}</p></TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </Wrapper>
          )}
         </>
      )
    };


    return (
        <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Left Side: Nav */}
            <div className="flex items-center gap-2 w-1/3">
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
                            {renderNavLinks(true)}
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
                 {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2">
                    {renderNavLinks(false)}
                </div>
            </div>
            
            {/* Center: Main Toggle */}
            <div className="flex items-center justify-center w-1/3">
                <Button variant={isCleanseRoute ? 'default' : 'outline'} size="sm" asChild>
                    <Link href="/dashboard"><Leaf className="mr-2 h-4 w-4" /> Cleanse</Link>
                </Button>
                <Button variant={isBreathingRoute ? 'default' : 'outline'} size="sm" asChild>
                    <Link href="/breathing"><HeartPulse className="mr-2 h-4 w-4" /> Breathing</Link>
                </Button>
            </div>
            
            {/* Right Side: Actions & Logo */}
            <div className="flex items-center justify-end gap-2 w-1/3">
              <div className="hidden md:flex">
                <ThemeToggle />
              </div>
              <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleSignOut} aria-label="Sign Out" className="hidden md:inline-flex">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Sign Out</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Logo />
            </div>
        </header>
    );
}
