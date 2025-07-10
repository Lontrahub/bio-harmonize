"use client";

import { Logo } from "./Logo";
import { Loader2 } from "lucide-react";

export function Preloader() {
  return (
    <div className="fixed inset-0 z-[101] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Logo />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );
}
