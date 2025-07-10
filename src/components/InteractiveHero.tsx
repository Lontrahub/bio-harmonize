
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function InteractiveHero() {
  const [ripples, setRipples] = React.useState<React.CSSProperties[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: React.CSSProperties = {
      left: x,
      top: y,
      width: '100px',
      height: '100px',
    };

    setRipples(prev => [...prev, newRipple]);
  };

  const handleAnimationEnd = (index: number) => {
    setRipples(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative w-full py-20 md:py-32 lg:py-48 flex items-center justify-center text-center bg-background animated-gradient overflow-hidden"
    >
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple-animation 1.5s ease-out forwards;
          background-color: hsla(var(--primary) / 0.05);
          pointer-events: none;
        }

        @keyframes ripple-animation {
          from {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `}</style>
      
      {ripples.map((style, index) => (
        <span 
          key={index} 
          className="ripple" 
          style={style} 
          onAnimationEnd={() => handleAnimationEnd(index)}
        />
      ))}

      <div className="container px-4 md:px-6 z-10">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
            Welcome to Bio-Harmonize
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Your 9-Day Winter Cleanse Companion.
          </p>
          <Button size="lg" asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
