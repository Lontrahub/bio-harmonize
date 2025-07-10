
"use client";

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Logo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Initialize with a default, will be updated by the effect
  const [currentSrc, setCurrentSrc] = useState('/logo-dark.png'); 

  useEffect(() => {
    setMounted(true);
  }, []);

  // This effect will run when the theme is resolved or changes.
  useEffect(() => {
    if (resolvedTheme) {
      setCurrentSrc(resolvedTheme === 'dark' ? '/logo-light.png' : '/logo-dark.png');
    }
  }, [resolvedTheme]);

  // To prevent layout shift, we render a placeholder until the component is mounted.
  if (!mounted) {
     return (
        <div className={cn("flex items-center justify-center gap-2", className)}>
            <div className="h-8 w-[112px]" />
            <span className="text-xl font-semibold font-headline text-foreground">Bio-Harmonize</span>
        </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Image
        key={currentSrc} // Using a key forces a re-render when the src changes
        src={currentSrc}
        alt="Bio-Harmonize Logo"
        width={112} 
        height={32}
        className="h-8 w-auto object-contain"
        priority
        onError={() => {
          // If the image fails to load, update the state to show a placeholder.
          // This confirms the issue is with the image file path or name.
          if (!currentSrc.startsWith('https://placehold.co')) {
            setCurrentSrc(`https://placehold.co/112x32.png`);
          }
        }}
      />
      <span className="text-xl font-semibold font-headline text-foreground">Bio-Harmonize</span>
    </div>
  );
}
