// src/app/auth/login/login-form.jsx
'use client'; // Keep this for client-side interactivity

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirecting

import { useAuthStore } from '@/store/authStore';
import { loginSchema as getLoginSchema } from '@/lib/validations/auth'; // Import the schema generator
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a Checkbox component
import { Icons } from '@/components/icons/Icons'; // For loading spinner

export function LoginForm({ className, ...props }) {
  const tAuth = useTranslations('auth');
  const tForms = useTranslations('forms');
  const tCommon = useTranslations('common');
  const { login, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [apiError, setApiError] = useState('');

  // Get the memoized schema by calling the generator function
  const loginSchema = getLoginSchema(tForms); // Pass the translation function for forms

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // isSubmitting from react-hook-form
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setApiError('');
    const result = await login(data);

    if (result.success) {
      router.push('/admin/dashboard'); // Or your desired redirect path
    } else {
      setApiError(result.error || tForms('loginFailed')); // Fallback error message
    }
  };

  const currentLoading = authLoading || isSubmitting;

  return (
      <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn("flex flex-col gap-6", className)}
          {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{tAuth('loginTitle')}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {tAuth('loginDescription')}
          </p>
        </div>

        {apiError && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md text-sm">
              {apiError}
            </div>
        )}

        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">{tAuth('email')}</Label>
            <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email')}
                aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="password">{tAuth('password')}</Label>
            <Input
                id="password"
                type="password"
                {...register('password')}
                aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
                id="rememberMe"
                {...register('rememberMe')}
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal">
              {tAuth('rememberMe')}
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={currentLoading}>
            {currentLoading && <Icons.Spinner className="me-2 h-4 w-4 animate-spin" />} {/* Add your spinner icon */}
            {currentLoading ? tCommon('loading') : tAuth('signIn')}
          </Button>
        </div>
      </form>
  );
}