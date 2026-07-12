import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button, Card, TextInput } from '../components/ui';
import { registerFormSchema, useRegisterUser } from '../features/auth';
import type { RegisterFormValues } from '../features/auth';
import { useAuthStore } from '../store/useAuthStore';
import { getApiErrorMessage } from '../utils/apiError';

export function Component() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const registerUser = useRegisterUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema) });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = handleSubmit(({ confirmPassword: _confirmPassword, ...values }) => {
    registerUser.mutate(
      { ...values, email: values.email.toLowerCase() },
      { onSuccess: () => navigate('/', { replace: true }) },
    );
  });

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Sparkles className="mx-auto text-primary-500" size={32} aria-hidden="true" />
          <h1 className="mt-2 font-heading text-h2 font-bold text-neutral-800">Create account</h1>
          <p className="text-body-sm text-neutral-500">
            Join Beauty Bus and book services at your doorstep
          </p>
        </div>
        <Card variant="raised" padding="lg">
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {registerUser.isError && (
              <div
                role="alert"
                className="rounded-md border border-danger-300 bg-danger-100 px-3 py-2 text-body-sm text-danger-700"
              >
                {getApiErrorMessage(
                  registerUser.error,
                  'Unable to create your account. Please try again.',
                )}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="First name"
                autoComplete="given-name"
                placeholder="Priya"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <TextInput
                label="Last name"
                autoComplete="family-name"
                placeholder="Sharma"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>
            <TextInput
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <TextInput
              label="Phone"
              type="tel"
              autoComplete="tel"
              placeholder="+919876543210"
              helperText="International format with country code"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <TextInput
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              helperText="Must include a letter and a number"
              error={errors.password?.message}
              {...register('password')}
            />
            <TextInput
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" fullWidth loading={registerUser.isPending}>
              Create account
            </Button>
          </form>
        </Card>
        <p className="mt-4 text-center text-body-sm text-neutral-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="rounded-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:shadow-focus focus-visible:outline-none"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
