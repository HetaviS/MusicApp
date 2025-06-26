import z from 'zod';

export const CreateGenreCategoryValidator = z.object({
    name: z.string().min(1, 'Name is required'),
});