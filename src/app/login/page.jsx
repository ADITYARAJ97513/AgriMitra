'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';

const GoogleIcon = (props) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-5.067 2.4-4.354 0-7.893-3.552-7.893-7.933s3.539-7.933 7.893-7.933c2.213 0 3.96.853 4.907 1.773l2.08-2.08c-1.347-1.24-3.16-2.027-5.52-2.027-4.793 0-8.753 3.96-8.753 8.753s3.96 8.753 8.753 8.753c2.787 0 4.987-1.013 6.667-2.68 1.84-1.84 2.467-4.373 2.467-6.813 0-.573-.053-1.107-.16-1.627H12.48z" />
    </svg>
);

const getAuthErrorMessage = (error) => {
    switch (error.code) {
        case 'auth/invalid-api-key':
        case 'auth/api-key-not-valid':
            return 'Firebase configuration is invalid. Please ensure you have set a valid API key in your .env file.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up first.';
        case 'auth/email-already-in-use':
            return 'This email is already in use. Please log in or use a different email.';
        case 'auth/weak-password':
            return 'The password is too weak. Please choose a stronger password.';
        case 'auth/too-many-requests':
            return 'Too many requests from this device. Please try again later.';
        default:
            return error.message || 'An unexpected error occurred. Please try again.';
    }
};


export default function LoginPage() {
  const { user, loading, login, loginWithGoogle, firebaseEnabled } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleGoogleLogin = async () => {
      setGoogleLoading(true);
      try {
          await loginWithGoogle();
          toast({
              title: 'Login Successful',
              description: 'Welcome!',
          });
          router.push('/');
      } catch (error) {
          toast({
              variant: 'destructive',
              title: 'Login Failed',
              description: getAuthErrorMessage(error),
          });
          console.error(error);
      } finally {
          setGoogleLoading(false);
      }
  }

  const onEmailSubmit = async (values) => {
    setEmailLoading(true);
    try {
      await login(values.email, values.password);
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: getAuthErrorMessage(error),
      });
      console.error(error);
    } finally {
      setEmailLoading(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!firebaseEnabled) {
    return (
      <div className="flex items-center justify-center min-h-screen py-12 px-4">
        <Alert className="max-w-md">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Firebase Not Configured</AlertTitle>
            <AlertDescription>
                Authentication is currently disabled. To enable login and signup, please add your Firebase project credentials to your <code>.env</code> file.
            </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 bg-gray-50/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary p-2 rounded-lg inline-block mb-4">
                <Link href="/" aria-label="Home">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary-foreground"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
                </Link>
            </div>
          <CardTitle>Welcome Back to AgriMitraAI</CardTitle>
          <CardDescription>Choose a method to access your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={emailLoading || googleLoading}>
            {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} required/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} required/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={emailLoading || googleLoading}>
                {emailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login with Email
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
