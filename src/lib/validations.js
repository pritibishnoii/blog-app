import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const postSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(180),
  content: z.string().min(1, 'Content cannot be empty'),
  tags: z.array(z.string().trim().toLowerCase()).max(8, 'Max 8 tags').optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).optional(),
});

export const commentSchema = z.object({
  postId: z.string().min(1, 'postId is required'),
  text: z.string().trim().min(1, 'Comment cannot be empty').max(2000),
  parentComment: z.string().nullable().optional(),
});
