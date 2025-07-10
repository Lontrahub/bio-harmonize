
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

  const logoSrc = resolvedTheme === 'dark' ? '/logo-light.png' : '/logo-dark.png';
  const [currentSrc, setCurrentSrc] = useState(logoSrc);

  useEffect(() => {
    // When the theme changes, this ensures we try to load the correct logo again.
    setCurrentSrc(logoSrc);
  }, [logoSrc]);


  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {mounted ? (
        <Image
          src={currentSrc}
          alt="Bio-Harmonize Logo"
          width={112} 
          height={32}
          className="h-8 w-auto object-contain"
          priority
          onError={() => {
            // This fallback helps diagnose if the image files are missing or named incorrectly.
            // If you see a placeholder, please check your /public folder.
            setCurrentSrc(`https://placehold.co/112x32.png`);
          }}
        />
      ) : (
        // Render a placeholder to prevent layout shift while the theme is loading
        <div className="h-8 w-[112px]" />
      )}
      <span className="text-xl font-semibold font-headline text-foreground">Bio-Harmonize</span>
    </div>
  );
}
