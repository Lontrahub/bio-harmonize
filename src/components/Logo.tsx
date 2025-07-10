
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

  // Using a placeholder image until the final assets are ready.
  // The next.config.ts is already configured for `placehold.co`.
  const logoSrc = 'https://placehold.co/112x112.png';

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* 
        This component now loads a placeholder image. 
        When you're ready, you can add your `logo-light.png` and `logo-dark.png`
        to the `/public` folder and we can switch back to using those.
      */}
      {mounted ? (
        <Image
          src={logoSrc}
          alt="Bio-Harmonize Logo"
          width={112}
          height={112}
          className="h-7 w-7 object-contain"
          priority
          data-ai-hint="logo"
        />
      ) : (
        // Render a placeholder to prevent layout shift while the theme is loading
        <div className="h-7 w-7" />
      )}
      <span className="text-xl font-semibold font-headline text-foreground">Bio-Harmonize</span>
    </div>
  );
}
