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

// Enhanced sanitization functions
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
    .trim()
    .substring(0, 1000); // Limit length to prevent DoS
};

export const sanitizeNumber = (input: string): number => {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

// Enhanced validation schemas for security
export const messageSchema = z.string()
  .min(1, 'Message cannot be empty')
  .max(1000, 'Message too long')
  .refine(val => !/<script|javascript:|on\w+=/i.test(val), 'Invalid content detected');

export const userIdSchema = z.string().uuid('Invalid user ID format');

// Form validation utilities with rate limiting consideration
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

// Rate limiting helper for API calls
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (userId: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(userId);
    
    if (!userRequests || now > userRequests.resetTime) {
      requests.set(userId, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (userRequests.count >= maxRequests) {
      return false;
    }
    
    userRequests.count++;
    return true;
  };
};