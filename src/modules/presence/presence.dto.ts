import { z } from 'zod';

export const addSchema = z.object({
    lat: z.string().max(100),
    long: z.string().max(100),
    imageUrl: z.string().max(500),
})