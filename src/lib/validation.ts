import { z } from 'zod';

export const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Tell us your name.').max(80),
  email: z.string().trim().email('That email address looks incomplete.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
});

export const profileSchema = z.object({
  full_name: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(60),
  occupation: z.string().trim().max(80).optional().or(z.literal('')),
  bio: z.string().trim().max(600).optional().or(z.literal('')),
  instagram_handle: z.string().trim().max(40).optional().or(z.literal('')),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD.')
    .optional()
    .or(z.literal('')),
  food_preferences: z.array(z.string()).max(20).default([]),
  dietary_restrictions: z.array(z.string()).max(20).default([]),
  social_preferences: z.array(z.string()).max(20).default([]),
  preferred_categories: z.array(z.string()).max(8).default([]),
  availability: z.array(z.string()).max(10).default([]),
  visibility: z.enum(['table', 'members', 'private']).default('table'),
  adult_confirmed: z.boolean().default(false),
  onboarding_completed: z.boolean().optional(),
  onboarding_step: z.number().int().min(0).max(6).optional(),
});

export const questionnaireSchema = z.object({
  answers: z.record(z.string(), z.unknown()),
  energy: z.number().int().min(1).max(5),
  talkativity: z.number().int().min(1).max(5),
  curiosity: z.number().int().min(1).max(5),
  newness: z.number().int().min(1).max(5),
});

export const reportSchema = z.object({
  reported_user_id: z.string().uuid().optional(),
  experience_id: z.string().uuid().optional(),
  category: z.enum(['safety', 'harassment', 'no_show', 'misrepresentation', 'other']),
  details: z.string().trim().min(20, 'Please give us enough detail to act on this.').max(2000),
});

export const feedbackSchema = z.object({
  experience_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1200).optional(),
  would_repeat: z.boolean().optional(),
});

export function isAdult(dob: string): boolean {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return false;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return d <= cutoff;
}

export function ageFromDob(dob: string): number | null {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}
