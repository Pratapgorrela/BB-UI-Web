import { z } from 'zod';

const emailSchema = z.email('Enter a valid email address');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must include at least one letter')
  .regex(/\d/, 'Password must include at least one number');

const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, 'Use international format, e.g. +919876543210');

const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

const registerRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  phone: phoneSchema,
});

const registerFormSchema = registerRequestSchema
  .extend({
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type LoginFormValues = z.infer<typeof loginRequestSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;

export { loginRequestSchema, registerFormSchema, registerRequestSchema };
export type { LoginFormValues, RegisterFormValues };
