'use client';

import { useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Label } from '@/components/ui/label';

const GoogleIcon = (props) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-5.067 2.4-4.354 0-7.893-3.552-7.893-7.933s3.539-7.933 7.893-7.933c2.213 0 3.96.853 4.907 1.773l2.08-2.08c-1.347-1.24-3.16-2.027-5.52-2.027-4.793 0-8.753 3.96-8.753 8.753s3.96 8.753 8.753 8.753c2.787 0 4.987-1.013 6.667-2.68 1.84-1.84 2.467-4.373 2.467-6.813 0-.573-.053-1.107-.16-1.627H12.48z" />
    </svg>
);


export default function LoginPage() {
  const { login, loginWithGoogle, firebaseEnabled } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  // Phone auth state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);


  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setPhoneLoading(true);
    generateRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
        const result = await signInWithPhoneNumber(auth, phone, appVerifier);
        setConfirmationResult(result);
        setOtpSent(true);
        toast({ title: 'OTP Sent!', description: 'Please check your phone for the one-time password.' });
    } catch (error) {
        console.error("Phone Auth Error:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to send OTP. Please check the phone number and try again.' });
    } finally {
        setPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setPhoneLoading(true);
    try {
        await confirmationResult.confirm(otp);
        toast({ title: 'Login Successful', description: 'Welcome back!' });
        router.push('/');
    } catch (error) {
         console.error("OTP Verify Error:", error);
         toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid OTP. Please try again.' });
    } finally {
        setPhoneLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
      setLoading(true);
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
              description: error.message,
          });
          console.error(error);
      } finally {
          setLoading(false);
      }
  }

  const onEmailSubmit = async (values) => {
    setLoading(true);
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
        description: error.message,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!firebaseEnabled) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
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
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Choose a method to access your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading || phoneLoading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
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
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading || phoneLoading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login with Email
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="phone">
               <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4 pt-4">
                {!otpSent ? (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 12345 67890" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <p className="text-sm text-muted-foreground">Include country code.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <Input id="otp" type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={phoneLoading || loading}>
                   {phoneLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {otpSent ? 'Verify OTP' : 'Send OTP'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div id="recaptcha-container"></div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
