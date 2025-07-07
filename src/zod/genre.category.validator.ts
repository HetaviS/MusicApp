import z from 'zod';

export const CreateGenreSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

export const updateGenreSchema = z.object({
    genre_id: z.string().min(1, 'Genre ID is required'),
});