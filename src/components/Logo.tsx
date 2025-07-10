
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

  // This will use /logo-light.png on dark mode, and /logo-dark.png on light mode.
  // Make sure these files are located in your /public folder at the root of the project.
  const logoSrc = resolvedTheme === 'dark' ? '/logo-light.png' : '/logo-dark.png';

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* 
        This component switches between your logo-light.png and logo-dark.png files.
        It waits for the theme to load on the client to prevent a flash of the wrong logo.
      */}
      {mounted ? (
        <Image
          src={logoSrc}
          alt="Bio-Harmonize Logo"
          // IMPORTANT: You may need to adjust the width and height below
          // to match the aspect ratio of your logo files for best results.
          width={112} 
          height={32}
          className="h-8 w-auto object-contain"
          priority
        />
      ) : (
        // Render a placeholder to prevent layout shift while the theme is loading
        <div className="h-8 w-[112px]" />
      )}
      <span className="text-xl font-semibold font-headline text-foreground">Bio-Harmonize</span>
    </div>
  );
}
