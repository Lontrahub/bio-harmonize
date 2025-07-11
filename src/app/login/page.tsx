
"use client";

import React from 'react';
import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function LoginPage() {
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
    <div 
      className="relative flex flex-col flex-1 animated-gradient overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple-animation 2s ease-out forwards;
          background-color: hsla(var(--primary) / 0.04);
          pointer-events: none;
        }

        @keyframes ripple-animation {
          from {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          to {
            transform: translate(-50%, -50%) scale(5);
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
      
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-10">
         <Link href="/" aria-label="Home">
            <Logo />
         </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4 z-10">
        <LoginForm />
      </main>
    </div>
  );
}
