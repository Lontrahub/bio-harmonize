
"use client";

import { cn } from '@/lib/utils';

export function Logo({ className, size = 35 }: { className?: string, size?: number }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.jpg"
        alt="Bio-Harmonize Logo"
        width={size}
        height={size}
        style={{ height: `${size}px`, width: `${size}px` }}
        className="rounded-[4px] object-contain"
      />
    </div>
  );
}
