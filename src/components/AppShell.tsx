"use client";

import { useAuth } from "@/hooks/useAuth";
import { Preloader } from "./Preloader";
import { Toaster } from "./ui/toaster";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();

    if (loading) {
        return <Preloader />;
    }

    return (
        <>
            <div className="flex flex-col min-h-screen">
                {children}
                <Footer />
            </div>
            <Toaster />
        </>
    );
}
