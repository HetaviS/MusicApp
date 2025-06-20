import { z } from 'zod';

export const createAlbumSchema = z.object({
    genre: z
        .string({ required_error: 'Genre is required' })
        .min(1, 'Genre is required').optional(),
    title: z
        .string({ required_error: 'Title is required' })
        .min(1, 'Title is required'),
    songs: z
        .array(z.string())
        .min(1, 'At least one song is required'),
    description: z.string().optional(),
    is_private: z.string({
        required_error: 'is_private is required',
    })
});

export const updateAlbumSchema = z.object({
    genre: z
        .string({ required_error: 'Genre is required' })
        .min(1, 'Genre is required').optional(),
    title: z
        .string({ required_error: 'Title is required' })
        .min(1, 'Title is required').optional(),
    description: z.string().optional(),
    is_private: z.string({
        required_error: 'is_private is required',
    }).optional()
});

export const addOrRemoveSongsFromAlbumSchema = z.object({
    songs: z
        .array(z.string())
        .min(1, 'At least one song is required'),
})