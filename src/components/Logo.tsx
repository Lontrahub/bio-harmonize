
"use client";

import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* Light version of logo, shown on dark backgrounds */}
      <Image
        src="/logo-light.png"
        alt="Bio-Harmonize Logo"
        width={112}
        height={32}
        className="hidden h-8 w-auto object-contain dark:block"
        priority
      />
      {/* Dark version of logo, shown on light backgrounds */}
      <Image
        src="/logo-dark.png"
        alt="Bio-Harmonize Logo"
        width={112}
        height={32}
        className="block h-8 w-auto object-contain dark:hidden"
        priority
      />
      <span className="text-xl font-semibold font-headline text-foreground">Bio-Harmonize</span>
    </div>
  );
}
