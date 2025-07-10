import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Leaf className="h-7 w-7 text-primary" />
      <span className="text-xl font-semibold font-headline text-foreground">Bio-Harmonize</span>
    </div>
  );
}
