
"use client";

import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.jpg"
        alt="Bio-Harmonize Logo"
        width={35}
        height={35}
        className="h-[35px] w-[35px] rounded-[4px] object-contain"
      />
      <span className="text-xl font-semibold font-headline text-foreground">Bio-Harmonize</span>
    </div>
  );
}
