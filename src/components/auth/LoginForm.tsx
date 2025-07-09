"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
 sendPasswordResetEmail,
  UserCredential,
} from "firebase/auth";
import { auth, firebaseEnabled } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "@/lib/firebase"; // Import db

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const resetSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

type AuthAction = "login" | "signup" | "reset";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" {...props}>
        <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.686H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
        <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.122 31.059-2.685.268C26.11 229.221 73.023 261.1 130.55 261.1" />
        <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.435.068c-8.458 18.271-13.055 38.256-13.055 58.761 0 20.505 4.597 40.49 13.055 58.761l42.368-32.771" />
        <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 73.023 0 26.11 31.879 13.826 71.382l42.211 32.771c10.59-31.477 39.891-53.681 74.513-53.681" />
    </svg>
);

export function LoginForm() {
  const [authAction, setAuthAction] = useState<AuthAction>("login");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const currentSchema = authAction === "login" ? loginSchema : authAction === "signup" ? signupSchema : resetSchema;

  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof currentSchema>) => {
    if (!auth) return;
    setLoading(true);
    try {
      if (authAction === "signup") {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          (values as z.infer<typeof signupSchema>).password
        );
        // Create user document in Firestore after successful sign-up
        if (userCredential.user) {
          const userRef = doc(db, "users", userCredential.user.uid);
          await setDoc(userRef, {
            email: userCredential.user.email,
            createdAt: new Date(),
          }); // No merge needed for initial creation
        }
        toast({ title: "Success", description: "Your account has been created." });
        router.push("/dashboard");
      } else if (authAction === "login") {
        const userCredential: UserCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          (values as z.infer<typeof loginSchema>).password
        );
        // Update user document in Firestore after successful login (if needed, optional)
        // You might want to update a "lastLogin" timestamp here.
        toast({ title: "Success", description: "You've been signed in." });
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider(); // Define provider inside the function
      const userCredential: UserCredential = await signInWithPopup(auth, provider);
      // Create user document in Firestore after successful sign-in with Google
      if (userCredential.user) {
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          email: userCredential.user.email,
          createdAt: new Date(),
        }, { merge: true }); // Use merge: true to avoid overwriting if the document already exists
      }
      toast({ title: "Success", description: "You've been signed in with Google." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-In Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getTitle = () => {
    switch (authAction) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Create an Account';
      case 'reset': return 'Reset Your Password';
    }
  }

  const getDescription = () => {
    switch (authAction) {
      case 'login': return 'Enter your credentials to access your account.';
      case 'signup': return 'Enter your email and a password to get started.';
      case 'reset': return 'Enter your email to receive a reset link.';
    }
  }

  const getButtonText = () => {
    switch (authAction) {
      case 'login': return 'Sign In';
      case 'signup': return 'Sign Up';
      case 'reset': return 'Send Reset Link';
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <Link href="/" aria-label="Home" className="mx-auto"><Logo /></Link>
        <CardTitle className="text-2xl font-headline">{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {!firebaseEnabled && (
          <Alert variant="destructive" className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Authentication is Disabled</AlertTitle>
            <AlertDescription>
              To enable, add your Firebase credentials to a `.env.local` file.
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <fieldset disabled={!firebaseEnabled || loading} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {authAction !== "reset" && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        {authAction === "login" && (
                          <Button variant="link" type="button" onClick={() => { setAuthAction("reset"); form.reset(); }} className="p-0 h-auto text-xs">
                            Forgot password?
                          </Button>
                        )}
                      </div>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full" disabled={loading || !firebaseEnabled}>
                {loading ? "Processing..." : getButtonText()}
              </Button>
            </fieldset>
          </form>
        </Form>
        {authAction !== 'reset' && (
            <>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading || !firebaseEnabled}>
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Sign In with Google
                </Button>
            </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <div className="text-muted-foreground">
          {authAction === 'login' && (
            <>
              Don't have an account?{' '}
              <Button variant="link" onClick={() => { setAuthAction('signup'); form.reset(); }} className="p-0 h-auto" disabled={!firebaseEnabled}>Sign Up</Button>
            </>
          )}
          {authAction === 'signup' && (
            <>
              Already have an account?{' '}
              <Button variant="link" onClick={() => { setAuthAction('login'); form.reset(); }} className="p-0 h-auto" disabled={!firebaseEnabled}>Sign In</Button>
            </>
          )}
          {authAction === 'reset' && (
            <>
              Remembered your password?{' '}
              <Button variant="link" onClick={() => { setAuthAction('login'); form.reset(); }} className="p-0 h-auto" disabled={!firebaseEnabled}>Sign In</Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
