
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

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
        <section className="relative w-full py-20 md:py-32 lg:py-48 flex items-center justify-center text-center bg-background">
          <div className="container px-4 md:px-6">
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
      </main>
    </div>
  );
}
