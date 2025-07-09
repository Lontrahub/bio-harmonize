import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MountainSnow, Feather } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-grow">
        <section className="relative w-full py-20 md:py-32 lg:py-48 flex items-center justify-center text-center bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                Welcome to AuthZenith
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Your clean and simple solution for modern authentication. Secure, elegant, and ready to deploy.
              </p>
              <Button size="lg" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Feather className="h-6 w-6 text-primary" />
                    Simple & Elegant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A minimalist interface that is easy to use and beautiful to look at.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <MountainSnow className="h-6 w-6 text-primary" />
                    Robust Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Powered by Firebase for secure, reliable, and scalable authentication.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Feather className="h-6 w-6 text-primary" />
                    Developer Friendly
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Clean, modern code built with Next.js and ShadCN for easy customization.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AuthZenith. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
