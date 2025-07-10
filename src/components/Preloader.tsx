
"use client";

import { Logo } from "./Logo";

export function Preloader() {
  return (
    <div className="fixed inset-0 z-[101] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <Logo />
        <div className="flex items-center justify-center space-x-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-primary [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-primary [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
}
