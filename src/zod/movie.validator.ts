import z from 'zod';

export const createMovieSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .min(1, 'Title is required'),
    description: z
        .string({ required_error: 'Description is required' })

});

export const updateMovieSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .min(1, 'Title is required')
        .optional(),
    description: z
        .string({ required_error: 'Description is required' })
        .optional()
});

