import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters');

// Trading form validation schemas
export const positionSizeSchema = z.number().min(0.01, 'Position size must be greater than 0').max(1000000, 'Position size too large');
export const priceSchema = z.number().min(0.01, 'Price must be greater than 0');
export const percentageSchema = z.number().min(0, 'Percentage cannot be negative').max(100, 'Percentage cannot exceed 100%');

// Symbol/ticker validation
export const symbolSchema = z.string()
  .min(1, 'Symbol is required')
  .max(10, 'Symbol must be 10 characters or less')
  .regex(/^[A-Z0-9.-]+$/, 'Symbol can only contain letters, numbers, dots, and hyphens');

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

export const sanitizeNumber = (input: string): number => {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

// Form validation utilities
export const validateFormField = <T,>(schema: z.ZodSchema<T>, value: T): { isValid: boolean; error?: string } => {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || 'Invalid input' };
    }
    return { isValid: false, error: 'Validation error' };
  }
};