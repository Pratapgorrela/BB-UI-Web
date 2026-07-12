import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button, Card, TextInput } from '../components/ui';
import { loginRequestSchema, useLoginUser } from '../features/auth';
import type { LoginFormValues } from '../features/auth';
import { useAuthStore } from '../store/useAuthStore';
import { getApiErrorMessage } from '../utils/apiError';

export function Component() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();
  const login = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginRequestSchema) });

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = handleSubmit((values) => {
    login.mutate(
      { ...values, email: values.email.toLowerCase() },
      { onSuccess: () => navigate(from, { replace: true }) },
    );
  });

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Sparkles className="mx-auto text-primary-500" size={32} aria-hidden="true" />
          <h1 className="mt-2 font-heading text-h2 font-bold text-neutral-800">Welcome back</h1>
          <p className="text-body-sm text-neutral-500">Log in to book your next service</p>
        </div>
        <Card variant="raised" padding="lg">
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {login.isError && (
              <div
                role="alert"
                className="rounded-md border border-danger-300 bg-danger-100 px-3 py-2 text-body-sm text-danger-700"
              >
                {getApiErrorMessage(login.error, 'Unable to log in. Please try again.')}
              </div>
            )}
            <TextInput
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <TextInput
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" fullWidth loading={login.isPending}>
              Log in
            </Button>
          </form>
        </Card>
        <p className="mt-4 text-center text-body-sm text-neutral-600">
          New to Beauty Bus?{' '}
          <Link
            to="/register"
            className="rounded-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:shadow-focus focus-visible:outline-none"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
