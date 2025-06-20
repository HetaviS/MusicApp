import { z } from 'zod';

export const uploadMusicSchema = z.object({
    genre_id: z
        .string({ required_error: 'Genre id is required' }),
    category_id: z
        .string({ required_error: 'Category id is required' }),
    title: z
        .string({ required_error: 'Title is required' })
        .min(1, 'Title is required')
});

export const updateMusicSchema = z.object({
    genre_id: z
        .string({ required_error: 'Genre id is required' })
        .optional(),
    category_id: z
        .string({ required_error: 'Category id is required' })
        .optional(),
    title: z
        .string({ required_error: 'Title is required' })
        .min(1, 'Title is required')
        .optional()
});
