import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  signInSchema, 
  signUpSchema,
  type SignInFormData,
  type SignUpFormData
} from '@/lib/validators/auth';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const form = useForm<SignInFormData | SignUpFormData>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(isSignUp && { confirmPassword: '' }),
    },
    mode: "onChange"
  });

  const password = form.watch("password");
  const hasMinLength = password?.length >= 6;

  async function onSubmit(values: SignInFormData | SignUpFormData) {
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        toast({
          title: 'Account created',
          description: 'Please check your email to verify your account',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            form.setError('password', {
              type: 'manual',
              message: 'Invalid email or password'
            });
            throw new Error('Invalid email or password');
          }
          throw error;
        }

        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    form.reset();
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6 rounded-md border bg-card">
      <div className="space-y-2 text-center flex flex-col justify-center items-center">
        <img
          src="/images/fifa.svg"
          alt="FIFA Tracker Logo"
          className="h-10 w-20 dark:hidden"
        />
        <img
          src="/images/fifa-white.svg"
          alt="FIFA Tracker Logo (White)"
          className="h-10 w-20 hidden dark:block"
        />
        <h1 className="text-2xl font-bold">Welcome to FIFA Match Tracker</h1>
        <p className="text-muted-foreground">
          {isSignUp
            ? 'Create an account to start tracking matches'
            : 'Sign in to your account'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="you@example.com" 
                    type="email"
                    autoComplete={isSignUp ? "email" : "username"}
                    className={form.formState.errors.email ? "border-destructive" : ""}
                    {...field} 
                  />
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
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    className={form.formState.errors.password ? "border-destructive" : ""}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {isSignUp && (
                  <FormDescription>
                    Password must be at least 6 characters
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          {isSignUp && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      className={form.formState.errors.confirmPassword ? "border-destructive" : ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || (isSignUp && !hasMinLength)}
          >
            {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={toggleMode}
          className="text-sm"
          type="button"
        >
          {isSignUp
            ? 'Already have an account? Sign in'
            : "Don't have an account? Sign up"}
        </Button>
      </div>
    </div>
  );
}