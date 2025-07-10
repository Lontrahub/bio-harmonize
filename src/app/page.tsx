
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InteractiveHero } from "@/components/InteractiveHero";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Sign Up</Link>
          </Button>
          <ThemeToggle />
        </nav>
      </header>
      <main className="flex-grow">
        <InteractiveHero />
      </main>
    </div>
  );
}
