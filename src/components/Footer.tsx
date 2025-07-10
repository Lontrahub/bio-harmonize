import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-background text-muted-foreground border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          {/* Left Side */}
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-2 text-sm">a program of Joe Van Niekerk</p>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex gap-6 text-sm font-medium">
             <Link href="#" className="hover:text-primary transition-colors">Politics</Link>
             <Link href="#" className="hover:text-primary transition-colors">Disclaimer</Link>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-xs space-y-2">
           <p>&copy; {new Date().getFullYear()} Bio-Harmonize. All rights reserved.</p>
           <p>
             Developed by <a href="https://www.digital-alignment.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">digital-alignment.com</a>
           </p>
        </div>
      </div>
    </footer>
  );
}
