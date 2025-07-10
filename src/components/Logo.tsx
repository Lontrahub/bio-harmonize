
"use client";

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Logo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the correct logo source based on the theme
  const logoSrc = resolvedTheme === 'dark' ? '/logo-light.png' : '/logo-dark.png';

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* 
        This component now loads a PNG logo from your `/public` folder.
        It expects to find `/public/logo-light.png` and `/public/logo-dark.png`.
      */}
      {mounted ? (
        <Image
          src={logoSrc}
          alt="Bio-Harmonize Logo"
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
          priority
        />
      ) : (
        // Render a placeholder to prevent layout shift while the theme is loading
        <div className="h-7 w-7" />
      )}
      <span className="text-xl font-semibold font-headline text-foreground">Bio-Harmonize</span>
    </div>
  );
}
