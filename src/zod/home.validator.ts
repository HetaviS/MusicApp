import {z} from 'zod';

export const addBlockSchema = z.object({
    type: z.enum(['artist', 'album', 'song','genre'], {
        required_error: 'Type is required',
        invalid_type_error: 'Type must be either "artist", "album","genre" or "song"',
    }),
    title: z.string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string',
    }).min(1, 'Title must be at least 1 character long'),
    description: z.string(),
    album_ids: z.array(z.string()).optional(),
    song_ids: z.array(z.string()).optional(),
    genre_ids: z.array(z.string()).optional(),
    artist_ids: z.array(z.string()).optional(),
});

export const updateBlockSchema = z.object({
    type: z.enum(['artist', 'album', 'song','genre']).optional(),
    title: z.string().optional(),
    description: z.string().optional()
});

export const updateBlockDataSchema = z.object({
    album_ids: z.array(z.string()).optional(),
    song_ids: z.array(z.string()).optional(),
    genre_ids: z.array(z.string()).optional(),
    artist_ids: z.array(z.string()).optional(),
});