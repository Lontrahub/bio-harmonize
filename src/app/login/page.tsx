import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col flex-1 animated-gradient">
       <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
         <Link href="/" aria-label="Home">
            <Logo />
         </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <LoginForm />
      </main>
    </div>
  );
}
