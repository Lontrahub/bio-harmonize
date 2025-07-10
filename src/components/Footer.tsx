import Link from 'next/link';
import { Youtube, Linkedin, Instagram, Globe } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-background text-muted-foreground border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          {/* Left Column: Social Icons. On mobile, this will be second. */}
          <div className="flex justify-center md:justify-start gap-4 order-2 md:order-1">
            <Link href="#" aria-label="YouTube"><Youtube className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
            <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
            <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
            <Link href="#" aria-label="Website"><Globe className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
          </div>

          {/* Center Column: Logo and Tagline. On mobile, this will be first. */}
          <div className="flex flex-col items-center order-1 md:order-2">
            <Logo />
            <p className="mt-2 text-sm">a program of Joe Van Niekerk</p>
          </div>

          {/* Right Column: Links. On mobile, this will be last. */}
          <div className="flex gap-6 text-sm font-medium order-3 md:order-3">
             <Link href="#" className="hover:text-primary transition-colors">Politics</Link>
             <Link href="#" className="hover:text-primary transition-colors">Disclaimer</Link>
          </div>

        </div>
        
        <div className="border-t mt-6 pt-4 text-xs flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
           <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} Bio-Harmonize. All rights reserved.</p>
           <p className="text-center sm:text-right">
             Developed by <a href="https://www.digital-alignment.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">digital-alignment.com</a>
           </p>
        </div>
      </div>
    </footer>
  );
}
